import { Component, ElementRef, ViewChild } from '@angular/core';
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
export class HomeComponent {
  readonly projects: Project[] = PROJECTS;
  readonly experiences: Experience[] = EXPERIENCES;

  activeItem: Project | Experience | null = null;

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
}
