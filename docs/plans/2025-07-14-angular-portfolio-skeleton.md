# Angular Portfolio Skeleton — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a deployable Angular 17+ standalone-component portfolio site with a home page, a profile page, and data-driven project listing.

**Architecture:** Angular 17+ standalone components bootstrapped via `app.config.ts`; `provideRouter` with two routes (`/` and `/profile`); projects sourced from a typed `projects.data.ts` file imported directly by `HomeComponent`. Deployed to GitHub Pages via `angular-cli-ghpages`.

**Tech Stack:** Angular 17+, TypeScript, SCSS, angular-cli-ghpages

## Global Constraints

- Angular 17+ standalone components — no NgModule
- No component library (no Material, no Tailwind) — plain SCSS only
- No HTTP calls / no backend — data lives in checked-in TS files only
- Two routes only: `/` and `/profile`
- Deployable to GitHub Pages via `npm run deploy`
- Base href must be `/christianfarrell.dev/` (repo name)
- Node 18+ required (currently Node 26 — fine)

---

### Task 1: Scaffold Angular project and install dependencies

**Files:**
- Create: `christianfarrell.dev/` (Angular workspace root — all subsequent paths are relative to this)
- Modify: `christianfarrell.dev/package.json` (add deploy script)
- Modify: `christianfarrell.dev/angular.json` (add 404.html to assets)

**Interfaces:**
- Produces: `ng serve` and `ng build` both succeed

- [ ] **Step 1: Install Angular CLI globally**

```bash
npm install -g @angular/cli
```

Expected: `ng version` prints Angular CLI 17+

- [ ] **Step 2: Scaffold the project inside the repo root**

Run from `/Users/cfarrell/Documents/christianfarrell.dev`:

```bash
ng new christianfarrell.dev \
  --routing=true \
  --style=scss \
  --standalone \
  --skip-git \
  --skip-tests=false
```

When prompted for SSR/SSG: **No**.

This creates a `christianfarrell.dev/` subdirectory. All subsequent work is inside that directory.

- [ ] **Step 3: Install angular-cli-ghpages**

```bash
cd christianfarrell.dev
npm install --save-dev angular-cli-ghpages
```

- [ ] **Step 4: Add deploy script to package.json**

In `christianfarrell.dev/package.json`, add to `"scripts"`:

```json
"deploy": "ng build --base-href /christianfarrell.dev/ && npx angular-cli-ghpages --dir=dist/christianfarrell.dev/browser"
```

- [ ] **Step 5: Verify build succeeds**

```bash
cd christianfarrell.dev
ng build
```

Expected: build completes with no errors, `dist/` folder created.

- [ ] **Step 6: Commit**

```bash
cd ..
git add christianfarrell.dev/
git commit -m "chore: scaffold angular project with ghpages deploy"
```

---

### Task 2: Define the Project model and seed data

**Files:**
- Create: `christianfarrell.dev/src/app/models/project.model.ts`
- Create: `christianfarrell.dev/src/app/data/projects.data.ts`

**Interfaces:**
- Produces: `Project` interface exported from `project.model.ts`
- Produces: `PROJECTS: Project[]` exported from `projects.data.ts`
- Consumed by: Task 4 (`HomeComponent`)

- [ ] **Step 1: Create models directory and Project interface**

Create `christianfarrell.dev/src/app/models/project.model.ts`:

```ts
export interface Project {
  title: string;
  description: string;
  tags: string[];
  url?: string;
  year: number;
}
```

- [ ] **Step 2: Create data directory and seed projects**

Create `christianfarrell.dev/src/app/data/projects.data.ts`:

```ts
import { Project } from '../models/project.model';

export const PROJECTS: Project[] = [
  {
    title: 'christianfarrell.dev',
    description: 'Personal portfolio site built with Angular.',
    tags: ['Angular', 'TypeScript', 'SCSS'],
    url: 'https://github.com/cfarrell/christianfarrell.dev',
    year: 2025,
  },
  {
    title: 'Example Project',
    description: 'A placeholder project to demonstrate the data-driven listing.',
    tags: ['TypeScript'],
    year: 2024,
  },
];
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd christianfarrell.dev
ng build
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
cd ..
git add christianfarrell.dev/src/app/models/ christianfarrell.dev/src/app/data/
git commit -m "feat: add Project model and seed data file"
```

---

### Task 3: Set up routing

**Files:**
- Modify: `christianfarrell.dev/src/app/app.routes.ts`
- Modify: `christianfarrell.dev/src/app/app.config.ts`
- Modify: `christianfarrell.dev/src/app/app.component.ts`
- Modify: `christianfarrell.dev/src/app/app.component.html`

**Interfaces:**
- Produces: `routes` array with lazy-loaded `/` and `/profile` routes
- Consumed by: Task 4 and Task 5 (page components registered here)

Note: At this step the page components don't exist yet. Define the routes pointing to them so the files are in sync once Tasks 4 and 5 create them. Alternatively, create stub components first — follow the order: create stub HomeComponent, stub ProfileComponent, then wire routes.

- [ ] **Step 1: Create stub HomeComponent**

Create `christianfarrell.dev/src/app/pages/home/home.component.ts`:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
```

Create `christianfarrell.dev/src/app/pages/home/home.component.html`:

```html
<p>Home stub</p>
```

Create `christianfarrell.dev/src/app/pages/home/home.component.scss`:

```scss
// home styles
```

- [ ] **Step 2: Create stub ProfileComponent**

Create `christianfarrell.dev/src/app/pages/profile/profile.component.ts`:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}
```

Create `christianfarrell.dev/src/app/pages/profile/profile.component.html`:

```html
<p>Profile stub</p>
```

Create `christianfarrell.dev/src/app/pages/profile/profile.component.scss`:

```scss
// profile styles
```

- [ ] **Step 3: Define routes in app.routes.ts**

Replace the contents of `christianfarrell.dev/src/app/app.routes.ts`:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
```

- [ ] **Step 4: Verify app.config.ts uses provideRouter**

Open `christianfarrell.dev/src/app/app.config.ts`. It should already contain `provideRouter(routes)` from the scaffold. If not, ensure it reads:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

- [ ] **Step 5: Set app.component.html to just the router outlet**

Replace `christianfarrell.dev/src/app/app.component.html` with:

```html
<router-outlet />
```

Ensure `RouterOutlet` is imported in `app.component.ts`:

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
```

- [ ] **Step 6: Verify build and routing work**

```bash
cd christianfarrell.dev
ng serve
```

Visit `http://localhost:4200` — should show "Home stub".  
Visit `http://localhost:4200/profile` — should show "Profile stub".

- [ ] **Step 7: Commit**

```bash
cd ..
git add christianfarrell.dev/src/
git commit -m "feat: add routing and stub page components"
```

---

### Task 4: Implement HomeComponent

**Files:**
- Modify: `christianfarrell.dev/src/app/pages/home/home.component.ts`
- Modify: `christianfarrell.dev/src/app/pages/home/home.component.html`
- Modify: `christianfarrell.dev/src/app/pages/home/home.component.scss`

**Interfaces:**
- Consumes: `PROJECTS: Project[]` from `../../data/projects.data`
- Consumes: `Project` from `../../models/project.model`
- Produces: rendered home page with header, profile pic link, and project list

- [ ] **Step 1: Update HomeComponent class**

Replace `christianfarrell.dev/src/app/pages/home/home.component.ts`:

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../../data/projects.data';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly projects: Project[] = PROJECTS;
}
```

- [ ] **Step 2: Update HomeComponent template**

Replace `christianfarrell.dev/src/app/pages/home/home.component.html`:

```html
<main class="home">
  <header class="home__header">
    <a routerLink="/profile" class="home__avatar-link" aria-label="View profile">
      <div class="home__avatar-placeholder">CF</div>
    </a>
    <div class="home__intro">
      <h1>Christian Farrell</h1>
      <p class="home__tagline">Software Engineer</p>
    </div>
  </header>

  <section class="home__projects">
    <h2>Work</h2>
    <ul class="project-list">
      @for (project of projects; track project.title) {
        <li class="project-card">
          <div class="project-card__header">
            <span class="project-card__title">
              @if (project.url) {
                <a [href]="project.url" target="_blank" rel="noopener noreferrer">
                  {{ project.title }}
                </a>
              } @else {
                {{ project.title }}
              }
            </span>
            <span class="project-card__year">{{ project.year }}</span>
          </div>
          <p class="project-card__description">{{ project.description }}</p>
          <ul class="project-card__tags">
            @for (tag of project.tags; track tag) {
              <li class="project-card__tag">{{ tag }}</li>
            }
          </ul>
        </li>
      }
    </ul>
  </section>
</main>
```

- [ ] **Step 3: Add minimal SCSS**

Replace `christianfarrell.dev/src/app/pages/home/home.component.scss`:

```scss
.home {
  max-width: 760px;
  margin: 0 auto;
  padding: 4rem 1.5rem;

  &__header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 4rem;
  }

  &__avatar-link {
    text-decoration: none;
  }

  &__avatar-placeholder {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #e0e0d8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 600;
    color: #444;
    cursor: pointer;

    &:hover {
      background: #d0d0c8;
    }
  }

  &__intro h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  &__tagline {
    margin: 0.25rem 0 0;
    color: #666;
    font-size: 0.95rem;
  }

  &__projects h2 {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #999;
    margin-bottom: 1.5rem;
  }
}

.project-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.project-card {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.4rem;
  }

  &__title {
    font-weight: 500;

    a {
      color: inherit;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__year {
    font-size: 0.85rem;
    color: #999;
  }

  &__description {
    margin: 0 0 0.75rem;
    color: #555;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  &__tags {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  &__tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
    background: #eeede8;
    border-radius: 999px;
    color: #555;
  }
}
```

- [ ] **Step 4: Verify in browser**

```bash
cd christianfarrell.dev
ng serve
```

Visit `http://localhost:4200`. Should show name, avatar placeholder, and two project cards from seed data.

- [ ] **Step 5: Commit**

```bash
cd ..
git add christianfarrell.dev/src/app/pages/home/
git commit -m "feat: implement HomeComponent with data-driven project list"
```

---

### Task 5: Implement ProfileComponent skeleton

**Files:**
- Modify: `christianfarrell.dev/src/app/pages/profile/profile.component.ts`
- Modify: `christianfarrell.dev/src/app/pages/profile/profile.component.html`
- Modify: `christianfarrell.dev/src/app/pages/profile/profile.component.scss`

**Interfaces:**
- Consumes: `RouterLink` from `@angular/router`
- Produces: profile page skeleton with back-link to `/`

- [ ] **Step 1: Update ProfileComponent class**

Replace `christianfarrell.dev/src/app/pages/profile/profile.component.ts`:

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}
```

- [ ] **Step 2: Update ProfileComponent template**

Replace `christianfarrell.dev/src/app/pages/profile/profile.component.html`:

```html
<main class="profile">
  <nav class="profile__nav">
    <a routerLink="/" class="profile__back">← Back</a>
  </nav>

  <header class="profile__header">
    <div class="profile__avatar-placeholder">CF</div>
    <h1>Christian Farrell</h1>
    <p class="profile__tagline">Software Engineer</p>
  </header>

  <section class="profile__bio">
    <p>Profile content coming soon.</p>
  </section>
</main>
```

- [ ] **Step 3: Add minimal SCSS**

Replace `christianfarrell.dev/src/app/pages/profile/profile.component.scss`:

```scss
.profile {
  max-width: 760px;
  margin: 0 auto;
  padding: 4rem 1.5rem;

  &__nav {
    margin-bottom: 3rem;
  }

  &__back {
    font-size: 0.9rem;
    color: #666;
    text-decoration: none;

    &:hover {
      color: #111;
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 3rem;
  }

  &__avatar-placeholder {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: #e0e0d8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: #444;
  }

  &__header h1 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 600;
  }

  &__tagline {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }

  &__bio {
    color: #555;
    line-height: 1.7;
  }
}
```

- [ ] **Step 4: Verify in browser**

```bash
cd christianfarrell.dev
ng serve
```

Visit `http://localhost:4200/profile`. Should show avatar, name, tagline, placeholder bio, and a back link.  
Click back link — should navigate to `/`.  
Click avatar on home page — should navigate to `/profile`.

- [ ] **Step 5: Commit**

```bash
cd ..
git add christianfarrell.dev/src/app/pages/profile/
git commit -m "feat: implement ProfileComponent skeleton"
```

---

### Task 6: Global styles and base href

**Files:**
- Modify: `christianfarrell.dev/src/styles.scss`
- Modify: `christianfarrell.dev/src/index.html`

**Interfaces:**
- Produces: off-white background, system font, box-sizing reset applied globally

- [ ] **Step 1: Set global styles**

Replace `christianfarrell.dev/src/styles.scss`:

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
  background-color: #f5f5f0;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
}
```

- [ ] **Step 2: Verify styles apply**

```bash
cd christianfarrell.dev
ng serve
```

Background should be off-white on both pages.

- [ ] **Step 3: Commit**

```bash
cd ..
git add christianfarrell.dev/src/styles.scss
git commit -m "style: add global reset and off-white base styles"
```

---

### Task 7: GitHub Pages SPA fallback (404.html)

**Files:**
- Create: `christianfarrell.dev/src/404.html`
- Modify: `christianfarrell.dev/angular.json` (add 404.html to assets)

**Interfaces:**
- Produces: deep-link refreshes on GitHub Pages redirect to `index.html` instead of 404ing

- [ ] **Step 1: Create 404.html**

Create `christianfarrell.dev/src/404.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>christianfarrell.dev</title>
    <script>
      // GitHub Pages SPA redirect trick
      // Encodes the path into the query string so index.html can decode it
      var l = window.location;
      l.replace(
        l.protocol +
          '//' +
          l.hostname +
          (l.port ? ':' + l.port : '') +
          l.pathname
            .split('/')
            .slice(0, 1 + 1)
            .join('/') +
          '/?p=/' +
          l.pathname
            .slice(1)
            .split('/')
            .slice(1)
            .join('/')
            .replace(/&/g, '~and~') +
          (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
          l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

- [ ] **Step 2: Add redirect decode script to index.html**

In `christianfarrell.dev/src/index.html`, add the following script inside `<head>` (before the closing `</head>`):

```html
<script>
  // Companion to 404.html — decodes the redirect path back to the real URL
  (function (l) {
    if (l.search[1] === '/') {
      var decoded = l.search
        .slice(1)
        .split('&')
        .map(function (s) {
          return s.replace(/~and~/g, '&');
        });
      window.history.replaceState(
        null,
        null,
        l.pathname.slice(0, -1) +
          decoded[0] +
          (decoded[1] ? '&' + decoded[1].slice(1) : '') +
          l.hash
      );
    }
  })(window.location);
</script>
```

- [ ] **Step 3: Add 404.html to angular.json assets**

In `christianfarrell.dev/angular.json`, find the `"assets"` array under `projects > christianfarrell.dev > architect > build > options`. Add `"src/404.html"` to it:

```json
"assets": [
  {
    "glob": "**/*",
    "input": "public"
  },
  "src/404.html"
]
```

- [ ] **Step 4: Verify build includes 404.html**

```bash
cd christianfarrell.dev
ng build
ls dist/christianfarrell.dev/browser/
```

Expected: `404.html` is present in the output.

- [ ] **Step 5: Commit**

```bash
cd ..
git add christianfarrell.dev/src/404.html christianfarrell.dev/src/index.html christianfarrell.dev/angular.json
git commit -m "feat: add GitHub Pages SPA 404 fallback"
```

---

### Task 8: Verify full build and deploy script

**Files:** none new

**Interfaces:**
- Produces: `npm run deploy` successfully builds and would push to `gh-pages` branch

- [ ] **Step 1: Run a production build with correct base href**

```bash
cd christianfarrell.dev
ng build --base-href /christianfarrell.dev/
```

Expected: build succeeds, no errors.

- [ ] **Step 2: Inspect built index.html for correct base href**

```bash
grep 'base href' dist/christianfarrell.dev/browser/index.html
```

Expected output:
```
<base href="/christianfarrell.dev/">
```

- [ ] **Step 3: Dry-run deploy (optional)**

If you want to verify the ghpages push without actually pushing:

```bash
npx angular-cli-ghpages --dir=dist/christianfarrell.dev/browser --no-silent --dry-run
```

Expected: no errors, reports what would be pushed.

- [ ] **Step 4: Final commit if any loose files remain**

```bash
cd ..
git status
# commit anything uncommitted
```

- [ ] **Step 5: To actually deploy**

Ensure the GitHub repo remote is set, then:

```bash
cd christianfarrell.dev
npm run deploy
```

This builds with the correct base href and pushes `dist/christianfarrell.dev/browser/` to the `gh-pages` branch.  
Enable GitHub Pages in the repo settings: **Source → Deploy from branch → gh-pages → / (root)**.

---

## Self-Review

### Spec coverage check

| Spec requirement | Task |
|---|---|
| Angular 17+ standalone, no NgModule | Task 1 (scaffold flags) |
| `Project` interface | Task 2 |
| `projects.data.ts` typed array | Task 2 |
| `/` route → HomeComponent | Task 3 |
| `/profile` route → ProfileComponent | Task 3 |
| `provideRouter` bootstrap | Task 3 |
| HomeComponent with header + project list | Task 4 |
| Profile pic link to `/profile` | Task 4 |
| Data-driven `@for` over PROJECTS | Task 4 |
| ProfileComponent skeleton + back link | Task 5 |
| Off-white background + system font | Task 6 |
| `angular-cli-ghpages` + deploy script | Task 1 + Task 8 |
| `404.html` SPA fallback | Task 7 |
| base href `/christianfarrell.dev/` | Task 7 + Task 8 |

All spec requirements covered. ✅

### Placeholder scan

No TBDs, TODOs, or vague steps. All steps include exact commands and code. ✅

### Type consistency

`Project` defined in Task 2, imported by `HomeComponent` in Task 4. `PROJECTS: Project[]` defined in Task 2, used in Task 4. `RouterLink` used in Tasks 4 and 5. All consistent. ✅
