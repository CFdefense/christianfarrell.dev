# Inspiration-Style Layout Refactor (Phase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage layout to match the centered, high-contrast, visual-centric, and interlaced grid aesthetic of the inspiration site (Attiq R.) while maintaining native overlays, zoneless signal reactivity, and SVG easter eggs.

**Architecture:** Mapped single-page Angular template layout. Work Experiences are rendered under an "Explorations" section as wide, card blocks with local card graphics and initials fallbacks. Projects are rendered under a "Work" section using a 3-column grid container with column-based staggered translates (`translateY`) for an interlaced feel.

**Tech Stack:** Angular (v22), TypeScript, SCSS, HTML5 Dialog.

## Global Constraints
*   **Colors:** Soft warm-white page backdrop `#FAF9F6`, body text zinc-900 `#18181B`, muted labels zinc-500 `#71717A`, dark card backgrounds `#121214`.
*   **Grid:** 3-column project staggered translates on screens `>= 768px` (Col 2 translated `40px` down, Col 3 translated `20px` down), collapsed to flat `0px` single column on smaller mobile viewports.
*   **Reactivity:** Fully retains Signal-driven native dialog states, Python hover triggers, and scuttling Ferris the Crab.

---

### Task 1: Update Models and Data Fields

**Files:**
- Modify: `src/app/models/experience.model.ts`
- Modify: `src/app/data/experiences.data.ts`
- Modify: `src/app/data/projects.data.ts`

**Interfaces:**
- Produces: Optional `image?: string` and `initials?: string` in `Experience`.
- Produces: Optional `image?: string` in `Project`.

- [ ] **Step 1: Add Fields to Experience Model**
Modify `src/app/models/experience.model.ts` to support card-graphics:
```typescript
export interface Experience {
  role: string;
  company: string;
  location?: string;
  period: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  image?: string; // Optional local background image asset
  initials?: string; // Optional 2-letter placeholder fallback initials (e.g. "IT")
}
```

- [ ] **Step 2: Add Fields to Project Model**
Modify `src/app/models/project.model.ts` to support card-graphics:
```typescript
export interface Project {
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  url?: string;
  year: number;
  image?: string; // Optional local project backdrop image asset
}
```

- [ ] **Step 3: Add Card Graphic Slates in Experience Data**
Modify `src/app/data/experiences.data.ts` to supply placeholder initials and image assets:
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
    image: 'assets/explorations/innovate-tech.jpg',
    initials: 'IT'
  },
  {
    role: 'Software Engineer',
    company: 'StellarWeb Corp',
    location: 'Remote',
    period: '2021 - 2023',
    shortDescription: 'Designed high-fidelity interactive interfaces and developer tools.',
    fullDescription: '<ul><li>Built custom canvas dashboard for database schema visualizer.</li><li>Developed and maintained core UI toolkit using web components.</li><li>Decreased application bundle sizes by 15% through lazy-loading tree shaking.</li></ul>',
    tags: ['TypeScript', 'Node.js', 'RxJS', 'CSS Grid'],
    image: 'assets/explorations/stellarweb.jpg',
    initials: 'SW'
  }
];
```

- [ ] **Step 4: Add Image Slates in Projects Data**
Modify `src/app/data/projects.data.ts` to supply placeholder image assets:
```typescript
import { Project } from '../models/project.model';

export const PROJECTS: Project[] = [
  {
    title: 'christianfarrell.dev',
    description: 'Personal portfolio website built with Angular to showcase professional experience and projects. Designed with responsive SCSS and clean layout spacing.',
    longDescription: 'This personal portfolio site was architected utilizing Angular v22 as a blazing fast Single Page Application (SPA). Styled entirely from scratch with responsive SCSS and modern grid architecture, it integrates state-driven accessibility layers like CSS animated SVG vector overlays.',
    tags: ['Angular', 'TypeScript', 'SCSS'],
    url: 'https://github.com/CFdefense/christianfarrell.dev',
    year: 2025,
    image: 'assets/work/portfolio.jpg'
  },
  {
    title: 'Example Project',
    description: 'A data-driven web application template utilizing TypeScript and structured models to demonstrate modular component layouts.',
    longDescription: 'This interactive project acts as a blueprint demonstration for modern API systems. It uses high-performance TypeScript structures and local storage persistence layers for immediate state synchronization across browser tabs.',
    tags: ['TypeScript'],
    year: 2024,
    image: 'assets/work/example.jpg'
  },
];
```

- [ ] **Step 5: Verify Compilation & Commit**
```bash
npm run build
git add src/app/models/experience.model.ts src/app/models/project.model.ts src/app/data/experiences.data.ts src/app/data/projects.data.ts
git commit -m "feat: add image and initials assets fields to project and experience models"
```

---

### Task 2: Redesign the Home HTML Template Layout

**Files:**
- Modify: `src/app/pages/home/home.html`

**Interfaces:**
- Consumes: Mapped model properties (`experiences`, `projects`).
- Produces: Structured, centered single-page layout matching the design drawings.

- [ ] **Step 1: Implement Centered Header with Circular Avatar & Badges Row**
Update the top portion of `src/app/pages/home/home.html`:
```html
<main class="home-canvas">
  <div class="content-container">
    
    <!-- Centered Profile Header Block -->
    <header class="profile-header-centered">
      <div class="avatar-wrapper-centered" (mouseenter)="onAvatarEnter()" (mouseleave)="onAvatarLeave()">
        <img src="avatar.jpg" alt="Christian Farrell" class="avatar-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <div class="avatar-fallback" style="display:none">CF</div>
      </div>
      
      <!-- Python Snake Easter Egg (appears on avatar hover) -->
      <div class="python-egg" [class.active]="avatarHovered()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" class="python-svg" aria-hidden="true">
          <path d="M 10 10 Q 25 2, 40 10 T 70 10 T 90 10" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" class="snake-body" />
          <path d="M 90 10 L 95 8 M 90 10 L 95 12" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" class="snake-tongue" />
          <circle cx="85" cy="8" r="1.2" fill="#ffffff" />
        </svg>
      </div>

      <div class="profile-intro-centered">
        <h1>Christian Farrell</h1>
        <div class="social-badges-centered">
          <a href="mailto:hello@christianfarrell.dev" class="badge">Get in touch</a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="badge">X</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="badge">LinkedIn</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="badge">GitHub</a>
        </div>
        <p class="summary-paragraph">
          Software engineer based in Vancouver, Canada. Currently building high-fidelity web experiences, robust backend services, and scalable agentic toolkits.
        </p>
      </div>
    </header>
```

- [ ] **Step 2: Implement "Explorations" (Experiences) Cards Section**
Append the Explorations grid layout below the header in `src/app/pages/home/home.html`:
```html
    <!-- Centered Explorations (Experiences) Section -->
    <section class="section-block-centered">
      <h2>Explorations</h2>
      <div class="explorations-row">
        @for (job of experiences; track job.role) {
          <div class="exploration-card" (click)="setActiveItem(job)">
            <div class="card-visual-header">
              @if (job.image) {
                <img [src]="job.image" [alt]="job.company" class="card-visual-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
              }
              <div class="card-visual-fallback">{{ job.initials || 'EX' }}</div>
            </div>
            <div class="card-text-body">
              <h3>{{ job.role }}</h3>
              <p class="card-meta-muted">{{ job.company }} • {{ job.period }}</p>
            </div>
          </div>
        }
      </div>
    </section>
```

- [ ] **Step 3: Implement "Work" (Projects - 3-Column Interlaced) Section**
Append the Work staggered grid layout below the Explorations in `src/app/pages/home/home.html`:
```html
    <!-- Centered Work (Projects 3-Column Interlaced) Section -->
    <section class="section-block-centered">
      <h2>Work</h2>
      <div class="work-interlaced-grid">
        
        <!-- Column 1 (Left): Standard translateY(0) -->
        <div class="grid-column col-left">
          @for (project of projects; track project.title; let idx = $index) {
            @if (idx % 3 === 0) {
              <div class="work-card" (click)="setActiveItem(project)">
                <div class="card-visual-header-dark">
                  @if (project.image) {
                    <img [src]="project.image" [alt]="project.title" class="card-visual-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                  }
                  <div class="card-visual-fallback-dark">PROJ</div>
                </div>
                <div class="card-text-body-dark">
                  <h3>{{ project.title }}</h3>
                  <div class="card-pill-tags">
                    @for (tag of project.tags; track tag) {
                      <span class="pill-tag">{{ tag }}</span>
                    }
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Column 2 (Center): Staggered translateY(40px) -->
        <div class="grid-column col-center">
          @for (project of projects; track project.title; let idx = $index) {
            @if (idx % 3 === 1) {
              <div class="work-card" (click)="setActiveItem(project)">
                <div class="card-visual-header-dark">
                  @if (project.image) {
                    <img [src]="project.image" [alt]="project.title" class="card-visual-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                  }
                  <div class="card-visual-fallback-dark">PROJ</div>
                </div>
                <div class="card-text-body-dark">
                  <h3>{{ project.title }}</h3>
                  <div class="card-pill-tags">
                    @for (tag of project.tags; track tag) {
                      <span class="pill-tag">{{ tag }}</span>
                    }
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Column 3 (Right): Staggered translateY(20px) -->
        <div class="grid-column col-right">
          @for (project of projects; track project.title; let idx = $index) {
            @if (idx % 3 === 2) {
              <div class="work-card" (click)="setActiveItem(project)">
                <div class="card-visual-header-dark">
                  @if (project.image) {
                    <img [src]="project.image" [alt]="project.title" class="card-visual-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                  }
                  <div class="card-visual-fallback-dark">PROJ</div>
                </div>
                <div class="card-text-body-dark">
                  <h3>{{ project.title }}</h3>
                  <div class="card-pill-tags">
                    @for (tag of project.tags; track tag) {
                      <span class="pill-tag">{{ tag }}</span>
                    }
                  </div>
                </div>
              </div>
            }
          }
        </div>

      </div>
    </section>
```

- [ ] **Step 4: Verify Compilation & Commit**
```bash
npm run build
git add src/app/pages/home/home.html
git commit -m "feat: restructure home html template to display centered profile, explorations, and 3-column work blocks"
```

---

### Task 3: Premium Centered & Staggered SCSS Styling

**Files:**
- Modify: `src/app/pages/home/home.scss`

**Interfaces:**
- Produces: 3-column staggered translate grid rules with `@media (min-width: 768px)` offsets.
- Produces: White and dark card layouts with image placeholder assets.

- [ ] **Step 1: Implement Centered Header, Intro, and Social Pill Styles**
Modify the top portion of `src/app/pages/home/home.scss`:
```scss
.profile-header-centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 7rem;
  position: relative;
}

.avatar-wrapper-centered {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid $b;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 1.5rem;

  &:hover {
    transform: scale(1.05);
  }
}

.profile-intro-centered {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 2.25rem;
    font-weight: 600;
    margin: 0 0 1.25rem;
    letter-spacing: -0.025em;
  }
}

.social-badges-centered {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.summary-paragraph {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.5;
  color: #18181b;
  max-width: 600px;
  margin: 0;
  letter-spacing: -0.015em;
}
```

- [ ] **Step 2: Implement "Explorations" Row Styles**
Append these styles inside `src/app/pages/home/home.scss`:
```scss
.section-block-centered {
  margin-bottom: 7rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: $m;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 3rem;
  }
}

.explorations-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.exploration-card {
  background-color: #ffffff;
  border: 1px solid $b;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

.card-visual-header {
  height: 140px;
  width: 100%;
  background-color: #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid $b;
}

.card-visual-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-visual-fallback {
  font-size: 1.5rem;
  font-weight: 700;
  color: $m;
}

.card-text-body {
  padding: 1.25rem 1.5rem;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
    color: #18181b;
  }

  .card-meta-muted {
    font-size: 0.85rem;
    color: $m;
    margin: 0;
  }
}
```

- [ ] **Step 3: Implement "Work" Interlaced 3-Column Grid Styles**
Append these staggered translates inside `src/app/pages/home/home.scss`:
```scss
.work-interlaced-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
  padding-bottom: 4rem; // Give room for Center column offset

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-bottom: 0;
  }
}

.grid-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    &.col-center {
      transform: translateY(40px);
    }
    &.col-right {
      transform: translateY(20px);
    }
  }
}

.work-card {
  background-color: #121214; // High-contrast dark background
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}

.card-visual-header-dark {
  height: 160px;
  width: 100%;
  background-color: #1c1c1f;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.card-visual-fallback-dark {
  font-size: 1.25rem;
  font-weight: 600;
  color: #3f3f46;
  letter-spacing: 0.1em;
}

.card-text-body-dark {
  padding: 1.25rem 1.5rem;

  h3 {
    font-size: 1.15rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
    color: #ffffff; // High contrast white text
  }
}

.card-pill-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;

  .pill-tag {
    font-size: 0.7rem;
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
    background-color: #1c1c1f;
    border: 1px solid #27272a;
    color: #a1a1aa;
  }
}
```

- [ ] **Step 4: Verify Compilation & SCSS Budget warning-free**
Ensure `home.scss` compiles strictly under the raised `6kB` budget warning threshold!
```bash
npm run build
git add src/app/pages/home/home.scss
git commit -m "style: configure premium centered layouts and staggered column translations"
```

---

### Task 4: Verify Tests & Clean Up

**Files:**
- Modify: `src/app/pages/home/home.ts`

- [ ] **Step 1: Clean up unused styling selectors**
Since we moved to centralized headers, let's remove any dead or unreferenced selectors inside `src/app/pages/home/home.ts` (e.g., ensure no dead references or imports) and make sure our unit test suites pass perfectly.

- [ ] **Step 2: Run Full Suite Verification**
```bash
npx ng test --watch=false --include src/app/pages/home/home.spec.ts
npm run build
```
Verify that the build completes warning-free and with 100% test success!
