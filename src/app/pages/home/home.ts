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
  // Rendered line number of each word in the summary, used to fade the text in line by line
  lineIndex = signal<number[]>([]);
  // Footer mascots are mounted (so their GIFs start from frame 1) when the footer scrolls into view:
  // the crab first, then the gopher once the crab has finished walking in.
  crabVisible = signal(false);
  gopherVisible = signal(false);
  private mascotObserver?: IntersectionObserver;
  private gopherTimer: any;
  private host = inject(ElementRef<HTMLElement>);

  activeItem = signal<Project | Experience | null>(null);
  avatarHovered = signal(false);
  contactStatus = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  private hoverTimer: any;

  @ViewChild('detailDialog') dialogElement?: ElementRef<HTMLDialogElement>;
  @ViewChild('footerStage') footerStage?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    // Wait for web fonts so line breaks are measured with the final font
    const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
    (fonts ? fonts.ready : Promise.resolve()).then(() => this.measureSummaryLines());
    this.watchFooterStage();
  }

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

  private startMascots(): void {
    this.mascotObserver?.disconnect();
    this.crabVisible.set(true);
    // The crab GIF runs ~2.24s; the gopher pops up while it is still walking in
    this.gopherTimer = setTimeout(() => this.gopherVisible.set(true), 1000);
  }

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

  setActiveItem(item: Project | Experience | null): void {
    if (this.activeItem() === item) return;
    this.activeItem.set(item);
    if (item) {
      // Open native dialog modal asynchronously after template rendering
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

  // Same Formspree endpoint and fields (name, email, message) as the previous portfolio's contact form
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

  isExperience(item: any): item is Experience {
    return item && 'role' in item;
  }

  asExperience(item: any): Experience {
    return item as Experience;
  }

  asProject(item: any): Project {
    return item as Project;
  }

  onAvatarEnter(): void {
    this.hoverTimer = setTimeout(() => {
      this.avatarHovered.set(true);
    }, 2000); // 2 seconds trigger (strictly per spec)
  }

  onAvatarLeave(): void {
    clearTimeout(this.hoverTimer);
    this.avatarHovered.set(false);
  }

  ngOnDestroy(): void {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    if (this.gopherTimer) clearTimeout(this.gopherTimer);
    this.mascotObserver?.disconnect();
  }
}
