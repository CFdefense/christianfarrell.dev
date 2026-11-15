# Design Specification: Minimalist Portfolio Resume (Approach 1: Micro-Interactions Canvas)

**Date:** 2026-11-13  
**Status:** Under Review  
**Target File Structure Changes:**
*   `src/app/pages/home/home.ts` (Update layout, manage dialog state)
*   `src/app/pages/home/home.html` (Unified template for portfolio + experience + easter eggs + dialog)
*   `src/app/pages/home/home.scss` (Premium typography, animations, layout structure)
*   `src/app/data/experiences.data.ts` (New file for structured resume roles data)
*   `src/app/data/projects.data.ts` (Provide clean, beautiful template project items)
*   `src/app/models/experience.model.ts` (New file defining work experience structure)
*   `public/avatar.jpg` (Place a premium image placeholder or guide for user replacement)

---

## 1. Aesthetic & Branding (The "Vibe")

The website must feel exceptionally clean, fast, and light. It utilizes generous margin spaces, premium typography, and subtle off-black colors instead of stark default black.

### Color Palette
*   **Main Background:** Warm paper off-white (`#FAF9F6`) — configured in `src/styles.scss` or locally.
*   **Text (Primary):** Premium charcoal (`#18181B`) for body text and headers.
*   **Text (Secondary/Muted):** Muted gray (`#71717A`) for taglines, dates, and secondary labels.
*   **Borders / Dividers:** Soft, hairline gray (`#E4E4E7`).
*   **Crab Accent (Ferris):** Warm rust-orange (`#F97316`).
*   **Snake Accent (Python):** Deep forest-green (`#10B981`).

---

## 2. Layout Structure & Routing

This project will move to a **Single-Page Portfolio Resume**. The router config (`src/app/app.routes.ts`) will keep the home route `/` as the core page. The profile page `/profile` will be unused or safely redirected to the home route `/` (or kept as a fallback, but the home page will contain everything). We will redirect `/profile` to `/` or merge its content seamlessly so everything is unified on the home page.

### Layout Elements (Centered Column, Max-Width `720px`)
1.  **Avatar & Introduction Header:**
    *   Circular avatar container (`width: 80px`, `height: 80px`). It displays a premium black-and-white face photograph (linked to a placeholder `public/avatar.jpg` that the user can replace).
    *   Full name: `Christian Farrell` in heavy, semibold sans-serif (`font-weight: 600`, `letter-spacing: -0.025em`).
    *   Tagline: `Software Engineer` in muted gray.
    *   Action Row: Small, rounded capsules/pills for social connections (Email, GitHub, LinkedIn, X) with hover-expand micro-animations.
2.  **Work Experience Section:**
    *   A timeline/list of professional history with clean metadata (Role, Company, Dates).
    *   Clicking an experience item triggers the dialog popup.
3.  **Projects / Explorations Section:**
    *   A modern list of project cards (Title, Year, Description, Tech Tags).
    *   Clicking a project card triggers the dialog popup.

---

## 3. Detail Popup System (State-Based Modals)

Rather than navigating pages, clicking a Project or Job opens an interactive state-based popup modal on top of the current screen.

### Technical Mechanics
*   **Implementation:** Using the native HTML `<dialog>` element within `HomeComponent`.
*   **State Management:**
    *   `activeItem: Project | Experience | null = null;`
    *   When an item is clicked, `activeItem` is set, and the dialog is shown using the native `.showModal()` element API or a reactive template bindings overlay.
*   **Aesthetic Styling:**
    *   **Backdrop Overlay:** Translucent warm white (`rgba(250, 249, 246, 0.6)`) with a high-end blur (`backdrop-filter: blur(12px)`).
    *   **Dialog Card:** Rounded corners (`border-radius: 12px`), solid background (`#FFFFFF`), subtle hairline border (`1px solid #E4E4E7`).
    *   **Animation:** Standard CSS slide-up-and-fade transition:
        *   Open state: `opacity: 1; transform: translateY(0);`
        *   Closed state: `opacity: 0; transform: translateY(20px);`
        *   Transition duration: `250ms cubic-bezier(0.16, 1, 0.3, 1)`.

---

## 4. Interactive Easter Eggs (Inline Animated SVGs)

To maintain absolute performance, the easter egg creatures are encoded entirely as lightweight inline SVGs inside `home.html` and animated using hardware-accelerated CSS.

### 4.1 Ferris the Rust Crab (🦀)
*   **Drawing:** Vector crab body, two primary pinchers/claws, and 6 tiny jointed legs.
*   **Walk Cycle:** Rapid CSS leg rotation (`@keyframes crab-walk { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }`) applied separately to left/right leg groups.
*   **Scuttle Animation:** A horizontal translation across the bottom margin (`0vw` to `100vw` or peeking from the bottom right).
*   **Trigger:** Randomized background timer (e.g., crawls across once every 60 seconds) or hovering over a hidden trigger in the page footer.

### 4.2 The Python Snake (🐍)
*   **Drawing:** A jointed green snake body with a small tongue element.
*   **Wiggle Cycle:** A wave/wiggle transformation using a CSS sin/cos transform.
*   **Trigger:** Hovering over the avatar picture for > 2 seconds triggers the snake to peek out from behind the photo, wiggle around the frame, flick its tongue, and retreat.

---

## 5. Data Modeling

To make it incredibly easy for the user to update their real information, all projects and professional history are separated into strict TypeScript data files.

### `src/app/models/experience.model.ts`
```typescript
export interface Experience {
  role: string;
  company: string;
  location?: string;
  period: string; // e.g., "2023 - Present"
  shortDescription: string;
  fullDescription: string; // Detailed HTML or markdown-like bullets for popup
  tags: string[];
}
```

### `src/app/models/project.model.ts`
```typescript
export interface Project {
  title: string;
  description: string;
  longDescription: string; // Detailed text for popup
  tags: string[];
  url?: string;
  year: number;
}
```
