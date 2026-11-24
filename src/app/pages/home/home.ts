import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from '../../data/projects.data';
import { EXPERIENCES } from '../../data/experiences.data';
import { TIMELINE } from '../../data/timeline.data';
import { Project } from '../../models/project.model';
import { Experience } from '../../models/experience.model';
import { GraphPanel } from '../../shared/graph-panel';
import { RevealDirective } from '../../shared/reveal.directive';
import { TerminalPanel } from '../../shared/terminal-panel';

/** Landing page: hero, experience and project cards, detail popups, contact form and footer mascots. */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GraphPanel, RevealDirective, TerminalPanel],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  readonly projects: Project[] = PROJECTS;
  readonly experiences: Experience[] = EXPERIENCES;
  readonly timeline = TIMELINE;

  readonly summaryWords =
    'Backend engineer at IBM Storage Scale in New York, working on test automation, AI agents and enterprise storage.'.split(' ');
  /** Rendered line number of each summary word, used to fade the text in line by line. */
  lineIndex = signal<number[]>([]);
  /** Footer mascots mount (so their GIFs start from frame 1) when the footer scrolls into view: the crab first, then the gopher. */
  crabVisible = signal(false);
  gopherVisible = signal(false);
  private mascotObserver?: IntersectionObserver;
  private gopherTimer: any;
  private host = inject(ElementRef<HTMLElement>);

  /** The project or experience shown in the detail popup, or null when it is closed. */
  activeItem = signal<Project | Experience | null>(null);
  /** State of the contact form submission. */
  contactStatus = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');

  @ViewChild('detailDialog') dialogElement?: ElementRef<HTMLDialogElement>;
  @ViewChild('footerStage') footerStage?: ElementRef<HTMLElement>;

  /** Measures the summary once web fonts load (so line breaks are final) and starts watching the footer. */
  ngAfterViewInit(): void {
    const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
    (fonts ? fonts.ready : Promise.resolve()).then(() => this.measureSummaryLines());
    this.watchFooterStage();
  }

  /** Starts the mascots when the footer scrolls into view, or immediately without IntersectionObserver. */
  private watchFooterStage(): void {
    const stage = this.footerStage?.nativeElement;
    if (!stage) return;
    if (typeof IntersectionObserver === 'undefined') {
      this.startMascots();
      return;
    }
    this.mascotObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) this.startMascots();
      },
      { threshold: 0.6 },
    );
    this.mascotObserver.observe(stage);
  }

  /** Shows the crab, then the gopher 1s later while the ~2.24s crab GIF is still walking in. */
  private startMascots(): void {
    this.mascotObserver?.disconnect();
    this.crabVisible.set(true);
    this.gopherTimer = setTimeout(() => this.gopherVisible.set(true), 1000);
  }

  /** Records which rendered line each summary word landed on. */
  private measureSummaryLines(): void {
    const words: HTMLElement[] = Array.from(this.host.nativeElement.querySelectorAll('.summary-paragraph .word'));
    let line = -1;
    let lastTop = Number.NaN;
    this.lineIndex.set(
      words.map((el) => {
        if (el.offsetTop !== lastTop) {
          line++;
          lastTop = el.offsetTop;
        }
        return line;
      }),
    );
  }

  /** Opens the detail popup for `item`, or closes it when `item` is null. */
  setActiveItem(item: Project | Experience | null): void {
    if (this.activeItem() === item) return;
    this.activeItem.set(item);
    if (item) {
      setTimeout(() => {
        if (this.dialogElement && typeof this.dialogElement.nativeElement.showModal === 'function') {
          this.dialogElement.nativeElement.showModal();
        }
      }, 0);
    } else {
      if (this.dialogElement && typeof this.dialogElement.nativeElement.close === 'function') {
        this.dialogElement.nativeElement.close();
      }
    }
  }

  /** Posts the contact form (name, email, message) to Formspree and closes the dialog shortly after success. */
  async sendContact(event: Event, dialog: HTMLDialogElement): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    this.contactStatus.set('sending');
    try {
      const response = await fetch('https://formspree.io/f/mldrywqe', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Formspree responded ${response.status}`);
      this.contactStatus.set('sent');
      form.reset();
      setTimeout(() => {
        dialog.close();
        this.contactStatus.set('idle');
      }, 2000);
    } catch {
      this.contactStatus.set('error');
    }
  }

  /** Type guard: experiences have a `role`, projects do not. */
  isExperience(item: any): item is Experience {
    return item && 'role' in item;
  }

  /** Template helper that narrows the active item to an Experience. */
  asExperience(item: any): Experience {
    return item as Experience;
  }

  /** Template helper that narrows the active item to a Project. */
  asProject(item: any): Project {
    return item as Project;
  }

  /** Clears the pending gopher timer and the footer observer. */
  ngOnDestroy(): void {
    if (this.gopherTimer) clearTimeout(this.gopherTimer);
    this.mascotObserver?.disconnect();
  }
}
