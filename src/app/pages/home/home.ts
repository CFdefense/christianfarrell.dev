import { Component, ElementRef, ViewChild, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from '../../data/projects.data';
import { EXPERIENCES } from '../../data/experiences.data';
import { Project } from '../../models/project.model';
import { Experience } from '../../models/experience.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnDestroy {
  readonly projects: Project[] = PROJECTS;
  readonly experiences: Experience[] = EXPERIENCES;

  activeItem: Project | Experience | null = null;
  avatarHovered = signal(false);
  crabActive = signal(false);
  private hoverTimer: any;
  private crabTimer: any;

  @ViewChild('detailDialog') dialogElement?: ElementRef<HTMLDialogElement>;

  setActiveItem(item: Project | Experience | null): void {
    this.activeItem = item;
    if (item) {
      // Open native dialog modal asynchronously after template rendering
      setTimeout(() => {
        this.dialogElement?.nativeElement.showModal();
      }, 0);
    } else {
      this.dialogElement?.nativeElement.close();
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
    }, 1500); // 1.5 seconds trigger
  }

  onAvatarLeave(): void {
    clearTimeout(this.hoverTimer);
    this.avatarHovered.set(false);
  }

  triggerCrab(): void {
    if (this.crabActive()) return;
    this.crabActive.set(true);
    this.crabTimer = setTimeout(() => {
      this.crabActive.set(false);
    }, 12000); // Duration matches scuttle animation (12s)
  }

  ngOnDestroy(): void {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
    if (this.crabTimer) clearTimeout(this.crabTimer);
  }
}
