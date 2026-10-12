# Angular Portfolio — Design Spec

**Date:** 2025-07-14  
**Project:** christianfarrell.dev  
**Status:** Approved

---

## Overview

An Angular 17+ standalone-component portfolio site for `christianfarrell.dev`, deployable to GitHub Pages. Two routes: a home page and a profile page. Projects are data-driven via a checked-in TypeScript data file — no backend, no CMS, no hardcoding in templates.

---

## Architecture

- **Framework:** Angular 17+ with standalone components (no NgModule)
- **Routing:** `provideRouter` with two routes
- **Data:** `projects.data.ts` — a typed array exported directly, imported by `HomeComponent`
- **Styling:** Plain SCSS, no component library
- **Deployment:** `angular-cli-ghpages` pushing `dist/` to the `gh-pages` branch

---

## Routes

| Path       | Component          | Purpose                          |
|------------|--------------------|----------------------------------|
| `/`        | `HomeComponent`    | Landing page: header + projects  |
| `/profile` | `ProfileComponent` | In-depth profile (skeleton now)  |

---

## File Structure

```
src/
  app/
    data/
      projects.data.ts        ← source of truth for all projects
    models/
      project.model.ts        ← Project interface
    pages/
      home/
        home.component.ts
        home.component.html
        home.component.scss
      profile/
        profile.component.ts
        profile.component.html
        profile.component.scss
    app.component.ts          ← shell with <router-outlet>
    app.routes.ts             ← route definitions
    app.config.ts             ← standalone bootstrap config
  index.html
  main.ts
```

---

## Data Model

```ts
// src/app/models/project.model.ts
export interface Project {
  title: string;
  description: string;
  tags: string[];
  url?: string;
  year: number;
}
```

To add a new project: append one object to the array in `projects.data.ts`. No other files change.

---

## Pages

### HomeComponent (`/`)

- Minimal header: name + short tagline
- Profile picture (placeholder image) that navigates to `/profile`
- Project list rendered via `@for` over the `projects` array imported from `projects.data.ts`
- Each project card shows: title, year, tags, description, optional link
- No hardcoded project content in the template

### ProfileComponent (`/profile`)

- Skeleton placeholder content for now
- Back link/button to `/`
- Will be fleshed out in a later iteration

---

## Styling

- Background: off-white (`~#f5f5f0`)
- Font: system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`)
- No animations in skeleton phase
- Plain SCSS — no Tailwind, no component library
- Skeleton styles are intentionally minimal; visual polish is a separate task

---

## Deployment

### Package

`angular-cli-ghpages` added as a dev dependency.

### npm script

```json
"deploy": "ng build --base-href /christianfarrell.dev/ && npx angular-cli-ghpages --dir=dist/christianfarrell.dev/browser"
```

### SPA fallback

A `404.html` file (copy of `index.html` with a redirect script) is added to `src/` and listed in `assets` in `angular.json`. This enables GitHub Pages to handle deep-link refreshes without 404ing.

### Base href

The `--base-href` must match the GitHub repository name exactly (e.g. `/christianfarrell.dev/` if the repo is named `christianfarrell.dev`). If the site is served from a custom domain at the apex, base href becomes `/`.

---

## Out of Scope (this iteration)

- Visual design / animations
- Real profile page content
- Social links / connect page
- Work experience section
- SEO / meta tags
