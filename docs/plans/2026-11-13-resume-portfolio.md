# Minimalist Portfolio Resume Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an elite, custom, minimalist single-page portfolio resume with native HTML dialog overlays and responsive animated developer easter eggs (such as a scuttling SVG Rust crab and an avatar-hover SVG Python snake).

**Architecture:** A lightweight data-driven single-page Angular application. Experiences and projects are modeled in TypeScript, and a unified `HomeComponent` manages interactive states for detail popups. Animations are handled directly via hardware-accelerated CSS keyframes on vector SVGs for speed and scalability.

**Tech Stack:** Angular (v22), TypeScript, SCSS, HTML5 Dialog, Vitest (for unit testing).

## Global Constraints
*   **Colors:** Soft warm-white backdrop `#FAF9F6`, body text zinc-900 `#18181B`, muted text zinc-500 `#71717A`.
*   **Performance:** 100% self-contained SVG vectors — no external image network requests for critters.
*   **Routing:** Unified single-page experience; `/profile` route redirects cleanly to `/`.
*   **Aesthetic:** Extremely minimalist, generous whitespace, elegant hair-line elements, high contrast yet readable.

---

### Task 1: Data Models and Unified Routing

**Files:**
- Create: `src/app/models/experience.model.ts`
- Create: `src/app/data/experiences.data.ts`
- Modify: `src/app/app.routes.ts`

**Interfaces:**
- Produces: `Experience` interface and `EXPERIENCES` constant.
- Produces: Redirect rule in `app.routes.ts` forwarding `/profile` to `/`.

- [ ] **Step 1: Create the Experience Interface**
Create `src/app/models/experience.model.ts`:
```typescript
export interface Experience {
  role: string;
  company: string;
  location?: string;
  period: string;
  shortDescription: string;
  fullDescription: string; // Bullet points separated by newlines or HTML
  tags: string[];
}
```

- [ ] **Step 2: Define Template Resume Data**
Create `src/app/data/experiences.data.ts` with template roles:
```typescript
import { Experience } from '../models/experience.model';

export const EXPERIENCES: Experience[] = [
  {
    role: 'Senior Software Engineer',
    company: 'InnovateTech Solutions',
    location: 'Vancouver, BC',
    period: '2023 - Present',
    shortDescription: 'Lead engineer building responsive frontend platforms and design systems.',
    fullDescription: '<ul><li>Architected core design token system reducing layout code overhead by 30%.</li><li>Supervised a team of 4 frontend engineers on a critical client delivery.</li><li>Implemented native performance enhancements, improving PageSpeed score to 98.</li></ul>',
    tags: ['Angular', 'TypeScript', 'SCSS', 'WASM'],
  },
  {
    role: 'Software Engineer',
    company: 'StellarWeb Corp',
    location: 'Remote',
    period: '2021 - 2023',
    shortDescription: 'Designed high-fidelity interactive interfaces and developer tools.',
    fullDescription: '<ul><li>Built custom canvas dashboard for database schema visualizer.</li><li>Developed and maintained core UI toolkit using web components.</li><li>Decreased application bundle sizes by 15% through lazy-loading tree shaking.</li></ul>',
    tags: ['TypeScript', 'Node.js', 'RxJS', 'CSS Grid'],
  }
];
```

- [ ] **Step 3: Update Routing**
Modify `src/app/app.routes.ts` to redirect `/profile` directly to `/` since it is a single-page app now:
```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'profile',
    redirectTo: '',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
```

- [ ] **Step 4: Verify Compilation & Commit**
Run build to verify everything compiling without issues:
```bash
npm run build
git add src/app/models/experience.model.ts src/app/data/experiences.data.ts src/app/app.routes.ts
git commit -m "feat: add experience models, template data and configure single page redirects"
```

---

### Task 2: Main Layout, Responsive Grid and State Management

**Files:**
- Modify: `src/app/pages/home/home.ts`
- Modify: `src/app/pages/home/home.html`
- Modify: `src/app/pages/home/home.scss`
- Modify: `src/styles.scss`

**Interfaces:**
- Consumes: `Project` and `Experience` interfaces/data.
- Produces: `activeItem` state property and `setActiveItem(item)` controller methods.

- [ ] **Step 1: Write Unit Test for Card Selection State**
Create or update tests to ensure clicking items correctly registers selection state in `src/app/pages/home/home.spec.ts` (if it exists, or verify in standard unit test suite):
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { Project } from '../../models/project.model';

describe('HomeComponent State Management', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start with no active item selected', () => {
    expect(component.activeItem).toBeNull();
  });

  it('should set activeItem when a project is selected', () => {
    const dummyProject: Project = {
      title: 'Dummy',
      description: 'Desc',
      longDescription: 'Long Desc',
      tags: ['A'],
      year: 2026
    };
    component.setActiveItem(dummyProject);
    expect(component.activeItem).toBe(dummyProject);
  });
});
```

- [ ] **Step 2: Update HomeComponent Controller**
Modify `src/app/pages/home/home.ts` to import `EXPERIENCES`, handle `activeItem` state, and inject helper methods:
```typescript
import { Component } from '@angular/core';
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

  setActiveItem(item: Project | Experience | null): void {
    this.activeItem = item;
  }
}
```

- [ ] **Step 3: Update Template Structural Layout**
Update `src/app/pages/home/home.html` to establish the premium visual structure:
```html
<main class="home-canvas">
  <div class="content-container">
    <header class="profile-header">
      <div class="avatar-wrapper">
        <img src="avatar.jpg" alt="Christian Farrell" class="avatar-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <div class="avatar-fallback" style="display:none">CF</div>
      </div>
      <div class="profile-intro">
        <h1>Christian Farrell</h1>
        <p class="tagline">Software Engineer</p>
        <div class="social-badges">
          <a href="mailto:hello@christianfarrell.dev" class="badge">Email</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="badge">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="badge">LinkedIn</a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="badge">X</a>
        </div>
      </div>
    </header>

    <section class="section-block">
      <h2>Work Experience</h2>
      <div class="list-container">
        @for (job of experiences; track job.role) {
          <div class="card-item clickable" (click)="setActiveItem(job)">
            <div class="card-header">
              <span class="card-title">{{ job.role }} <span class="muted">@ {{ job.company }}</span></span>
              <span class="card-meta">{{ job.period }}</span>
            </div>
            <p class="card-description">{{ job.shortDescription }}</p>
            <div class="card-tags">
              @for (tag of job.tags; track tag) {
                <span class="tag-label">{{ tag }}</span>
              }
            </div>
          </div>
        }
      </div>
    </section>

    <section class="section-block">
      <h2>Projects & Explorations</h2>
      <div class="list-container">
        @for (project of projects; track project.title) {
          <div class="card-item clickable" (click)="setActiveItem(project)">
            <div class="card-header">
              <span class="card-title">{{ project.title }}</span>
              <span class="card-meta">{{ project.year }}</span>
            </div>
            <p class="card-description">{{ project.description }}</p>
            <div class="card-tags">
              @for (tag of project.tags; track tag) {
                <span class="tag-label">{{ tag }}</span>
              }
            </div>
          </div>
        }
      </div>
    </section>
  </div>
</main>
```

- [ ] **Step 4: Update Global Base Style Variables**
Modify `src/styles.scss` to ensure the warm-white page canvas is set:
```scss
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: #faf9f6; // Soft warm white background
  color: #18181b; // Premium zinc-900 primary text
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 5: Stylize HomeComponent Canvas**
Write responsive layout and card styles in `src/app/pages/home/home.scss`:
```scss
.home-canvas {
  padding: 6rem 2rem;
  display: flex;
  justify-content: center;
  position: relative;
  overflow-x: hidden;
}

.content-container {
  width: 100%;
  max-width: 720px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 6rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
}

.avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: scale(1.05);
  }
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #71717a;
  font-size: 1.25rem;
}

.profile-intro {
  h1 {
    font-size: 2.25rem;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.025em;
  }

  .tagline {
    font-size: 1.1rem;
    color: #71717a;
    margin: 0.25rem 0 1rem 0;
  }
}

.social-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  .badge {
    padding: 0.35rem 0.85rem;
    border-radius: 9999px;
    background-color: #ffffff;
    border: 1px solid #e4e4e7;
    font-size: 0.85rem;
    color: #18181b;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background-color: #18181b;
      color: #faf9f6;
      border-color: #18181b;
      transform: translateY(-1px);
    }
  }
}

.section-block {
  margin-bottom: 5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.75rem;
    letter-spacing: -0.01em;
    color: #71717a;
  }
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card-item {
  padding-bottom: 1.75rem;
  border-bottom: 1px solid #e4e4e7;
  transition: opacity 0.2s ease;

  &.clickable {
    cursor: pointer;

    &:hover {
      .card-title {
        color: #71717a;
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.5rem;

    @media (max-width: 500px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }
  }

  .card-title {
    font-size: 1.15rem;
    font-weight: 600;
    transition: color 0.2s ease;

    .muted {
      font-weight: 400;
      color: #71717a;
    }
  }

  .card-meta {
    font-size: 0.9rem;
    color: #71717a;
    white-space: nowrap;
  }

  .card-description {
    font-size: 0.95rem;
    color: #18181b;
    margin: 0 0 1rem 0;
  }
}

.card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  .tag-label {
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    background-color: #ffffff;
    border: 1px solid #e4e4e7;
    color: #71717a;
  }
}
```

- [ ] **Step 6: Execute Tests & Commit**
```bash
vitest run src/app/pages/home/home.spec.ts --passWithNoTests
git add src/app/pages/home/home.ts src/app/pages/home/home.html src/app/pages/home/home.scss src/styles.scss
git commit -m "feat: design layout canvas, work list, project cards and selection controller"
```

---

### Task 3: Interactive Detail Modals (Native `<dialog>`)

**Files:**
- Modify: `src/app/pages/home/home.ts`
- Modify: `src/app/pages/home/home.html`
- Modify: `src/app/pages/home/home.scss`

**Interfaces:**
- Consumes: `activeItem` state.
- Produces: Modal view toggle, keyboard/click-away close listeners.

- [ ] **Step 1: Code HTML `<dialog>` Backdrop Overlay**
Append the native `<dialog>` structure inside `src/app/pages/home/home.html` underneath the main container:
```html
<!-- Dialog Modal Overlay -->
@if (activeItem) {
  <div class="modal-overlay" (click)="setActiveItem(null)">
    <div class="modal-card" (click)="$event.stopPropagation()">
      <button class="modal-close-btn" (click)="setActiveItem(null)" aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      
      <div class="modal-body">
        <span class="modal-period">{{ activeItem.hasOwnProperty('period') ? $any(activeItem).period : $any(activeItem).year }}</span>
        
        @if (activeItem.hasOwnProperty('role')) {
          <h2 class="modal-title">{{ $any(activeItem).role }}</h2>
          <p class="modal-subtitle">{{ $any(activeItem).company }}</p>
          <div class="modal-rich-text" [innerHTML]="$any(activeItem).fullDescription"></div>
        } @else {
          <h2 class="modal-title">
            @if ($any(activeItem).url) {
              <a [href]="$any(activeItem).url" target="_blank" rel="noopener noreferrer">{{ activeItem.title }}</a>
            } @else {
              {{ activeItem.title }}
            }
          </h2>
          <p class="modal-rich-text">{{ $any(activeItem).longDescription || activeItem.description }}</p>
        }

        <div class="modal-tags">
          @for (tag of activeItem.tags; track tag) {
            <span class="tag-label">{{ tag }}</span>
          }
        </div>
      </div>
    </div>
  </div>
}
```

- [ ] **Step 2: Style Dialog and Slide-Up Animation**
Add these styles to the bottom of `src/app/pages/home/home.scss`:
```scss
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(250, 249, 246, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
  animation: fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-card {
  width: 100%;
  max-width: 580px;
  background-color: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 2.5rem;
  position: relative;
  box-shadow: 0 10px 30px -10px rgba(24, 24, 27, 0.08);
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #faf9f6;
    color: #18181b;
  }
}

.modal-body {
  .modal-period {
    font-size: 0.85rem;
    color: #71717a;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .modal-title {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0.5rem 0 0.25rem 0;
    letter-spacing: -0.02em;

    a {
      text-decoration: underline;
      text-underline-offset: 4px;
      &:hover {
        color: #71717a;
      }
    }
  }

  .modal-subtitle {
    font-size: 1.1rem;
    color: #71717a;
    margin: 0 0 1.5rem 0;
  }

  .modal-rich-text {
    font-size: 1rem;
    color: #18181b;
    line-height: 1.7;
    margin-bottom: 2rem;

    ul {
      margin: 0;
      padding-left: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    li {
      margin-bottom: 0.25rem;
    }
  }
}

.modal-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  .tag-label {
    font-size: 0.75rem;
    padding: 0.25rem 0.65rem;
    border-radius: 4px;
    background-color: #faf9f6;
    border: 1px solid #e4e4e7;
    color: #71717a;
    font-weight: 500;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

- [ ] **Step 3: Update Mock Project Data with pop-up descriptions**
Update `src/app/data/projects.data.ts` to supply detailed descriptions:
```typescript
import { Project } from '../models/project.model';

export const PROJECTS: Project[] = [
  {
    title: 'christianfarrell.dev',
    description: 'Personal portfolio site built with Angular.',
    longDescription: 'This personal portfolio site was architected utilizing Angular v22 as a blazing fast Single Page Application (SPA). Styled entirely from scratch with responsive SCSS and modern grid architecture, it integrates state-driven accessibility layers like CSS animated SVG vector overlays.',
    tags: ['Angular', 'TypeScript', 'SCSS'],
    url: 'https://github.com/CFdefense/christianfarrell.dev',
    year: 2025,
  },
  {
    title: 'Example Project',
    description: 'A placeholder project to demonstrate the data-driven listing.',
    longDescription: 'This interactive project acts as a blueprint demonstration for modern API systems. It uses high-performance TypeScript structures and local storage persistence layers for immediate state synchronization across browser tabs.',
    tags: ['TypeScript'],
    year: 2024,
  },
];
```

- [ ] **Step 4: Verify Compilation & Commit**
```bash
npm run build
git add src/app/pages/home/home.html src/app/pages/home/home.scss src/app/data/projects.data.ts
git commit -m "feat: implement modal popups with blurred backdrop overlays and slide up transitions"
```

---

### Task 4: Charming Developer Easter Eggs (Ferris Crab & Python)

**Files:**
- Modify: `src/app/pages/home/home.ts`
- Modify: `src/app/pages/home/home.html`
- Modify: `src/app/pages/home/home.scss`

**Interfaces:**
- Produces: CSS animation and SVG elements in the HTML page structure.
- Produces: Event listeners and trigger logic inside `HomeComponent`.

- [ ] **Step 1: Write Controller Hover Trigger Logic**
Modify `src/app/pages/home/home.ts` to trace avatar hover timing:
```typescript
import { Component, OnDestroy } from '@angular/core';
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
  avatarHovered = false;
  crabActive = false;
  private hoverTimer: any;

  setActiveItem(item: Project | Experience | null): void {
    this.activeItem = item;
  }

  onAvatarEnter(): void {
    this.hoverTimer = setTimeout(() => {
      this.avatarHovered = true;
    }, 1500); // 1.5 seconds trigger
  }

  onAvatarLeave(): void {
    clearTimeout(this.hoverTimer);
    this.avatarHovered = false;
  }

  triggerCrab(): void {
    if (this.crabActive) return;
    this.crabActive = true;
    setTimeout(() => {
      this.crabActive = false;
    }, 12000); // Duration matches scuttle animation (12s)
  }

  ngOnDestroy(): void {
    if (this.hoverTimer) clearTimeout(this.hoverTimer);
  }
}
```

- [ ] **Step 2: Add SVG Assets into HTML Template**
Append SVG assets and hover bindings into `src/app/pages/home/home.html`:
```html
<main class="home-canvas">
  <!-- Python Snake Easter Egg (appears on avatar hover) -->
  <div class="python-egg" [class.active]="avatarHovered">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" class="python-svg">
      <!-- Minimal segment snake -->
      <path d="M 10 10 Q 25 2, 40 10 T 70 10 T 90 10" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" class="snake-body" />
      <!-- Tongue flick -->
      <path d="M 90 10 L 95 8 M 90 10 L 95 12" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" class="snake-tongue" />
      <!-- Tiny eyes -->
      <circle cx="85" cy="8" r="1.2" fill="#ffffff" />
    </svg>
  </div>

  <div class="content-container">
    <header class="profile-header">
      <!-- Listen to avatar hover elements -->
      <div class="avatar-wrapper" (mouseenter)="onAvatarEnter()" (mouseleave)="onAvatarLeave()">
        <img src="avatar.jpg" alt="Christian Farrell" class="avatar-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <div class="avatar-fallback" style="display:none">CF</div>
      </div>
      ...
    </header>
    ...
    
    <!-- Footer Section with Crab trigger -->
    <footer class="footer-block" (mouseenter)="triggerCrab()">
      <p class="muted">Made with Bob • © 2026 Christian Farrell</p>
    </footer>
  </div>

  <!-- Ferris the Crab Easter Egg -->
  <div class="crab-egg" [class.scuttle]="crabActive">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40" class="crab-svg">
      <!-- Body -->
      <ellipse cx="30" cy="22" rx="14" ry="10" fill="#f97316" />
      <!-- Eyes -->
      <circle cx="23" cy="11" r="2.5" fill="#ffffff" />
      <circle cx="23" cy="11" r="1" fill="#000000" />
      <circle cx="37" cy="11" r="2.5" fill="#ffffff" />
      <circle cx="37" cy="11" r="1" fill="#000000" />
      <!-- Eye Stalks -->
      <line x1="23" y1="12" x2="23" y2="15" stroke="#f97316" stroke-width="2" />
      <line x1="37" y1="12" x2="37" y2="15" stroke="#f97316" stroke-width="2" />
      <!-- Left Claws -->
      <path d="M 12 18 C 6 12, 10 6, 16 10 C 14 12, 14 16, 16 18 Z" fill="#f97316" class="left-claw" />
      <path d="M 16 20 L 12 18" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
      <!-- Right Claws -->
      <path d="M 48 18 C 54 12, 50 6, 44 10 C 46 12, 46 16, 44 18 Z" fill="#f97316" class="right-claw" />
      <path d="M 44 20 L 48 18" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
      <!-- Legs (Leg Animation Groups) -->
      <g class="crab-legs-left">
        <path d="M 20 28 Q 12 30, 8 36" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 22 30 Q 14 34, 11 40" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 24 32 Q 18 36, 15 42" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" />
      </g>
      <g class="crab-legs-right">
        <path d="M 40 28 Q 48 30, 52 36" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 38 30 Q 46 34, 49 40" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 36 32 Q 42 36, 45 42" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" />
      </g>
    </svg>
  </div>
</main>
```

- [ ] **Step 3: Stylize Easter Egg CSS Keyframes**
Append egg styling rules inside `src/app/pages/home/home.scss`:
```scss
.footer-block {
  margin-top: 8rem;
  padding-top: 2rem;
  border-top: 1px solid #e4e4e7;
  text-align: center;
  font-size: 0.85rem;
  color: #71717a;
}

/* --- Python Snake Easter Egg --- */
.python-egg {
  position: absolute;
  top: 6rem;
  left: 50%;
  transform: translateX(-240px);
  width: 100px;
  height: 25px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 5;

  &.active {
    opacity: 1;
    transform: translateX(-180px);
    .snake-body {
      animation: snake-wiggle 1s ease-in-out infinite alternate;
    }
    .snake-tongue {
      animation: tongue-flick 0.3s ease-in-out infinite;
    }
  }
}

.python-svg {
  width: 100%;
  height: 100%;
}

@keyframes snake-wiggle {
  0% { transform: translateY(-1px); }
  100% { transform: translateY(1px); }
}

@keyframes tongue-flick {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2) translateX(1px); }
}

/* --- Ferris the Crab Easter Egg --- */
.crab-egg {
  position: fixed;
  bottom: 0.5rem;
  right: -80px;
  width: 60px;
  height: 40px;
  pointer-events: none;
  z-index: 10;
  display: none;

  &.scuttle {
    display: block;
    animation: crab-scuttle 12s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    
    .crab-legs-left {
      animation: leg-walk-left 0.15s linear infinite alternate;
    }
    .crab-legs-right {
      animation: leg-walk-right 0.15s linear infinite alternate;
    }
    .left-claw, .right-claw {
      animation: claw-snap 0.8s ease-in-out infinite alternate;
    }
  }
}

.crab-svg {
  width: 100%;
  height: 100%;
}

@keyframes leg-walk-left {
  0% { transform: rotate(-4deg) translateY(-1px); }
  100% { transform: rotate(4deg) translateY(1px); }
}

@keyframes leg-walk-right {
  0% { transform: rotate(4deg) translateY(1px); }
  100% { transform: rotate(-4deg) translateY(-1px); }
}

@keyframes claw-snap {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-8deg); }
}

@keyframes crab-scuttle {
  0% {
    right: -80px;
  }
  20% {
    right: 2rem;
  }
  45% {
    right: 2rem;
    transform: scaleX(1);
  }
  55% {
    right: 2rem;
    transform: scaleX(-1); // Turn around
  }
  75% {
    right: 2rem;
    transform: scaleX(-1);
  }
  100% {
    right: 110vw; // Scuttle off-screen left
    transform: scaleX(-1);
  }
}
```

- [ ] **Step 4: Verify Entire Compilation & Run Dev Server to Confirm**
```bash
npm run build
git add src/app/pages/home/home.ts src/app/pages/home/home.html src/app/pages/home/home.scss
git commit -m "feat: integrate animated SVG Ferris the Crab and Python Snake easter eggs"
```
