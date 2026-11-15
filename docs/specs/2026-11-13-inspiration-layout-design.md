# Design Specification: Inspiration-Style Layout Refactor (Phase 2)

**Date:** 2026-11-13  
**Status:** Under Review  
**Target File Structure Changes:**
*   `src/app/pages/home/home.html` (Complete refactor of the template structure)
*   `src/app/pages/home/home.scss` (Redesign grid spacing, offsets, card backgrounds, and typography)
*   `src/app/pages/home/home.ts` (Keep signals and methods, make sure imports/selectors are tidy)
*   `src/app/data/experiences.data.ts` (Optionally add an `image` placeholder property to experience items)
*   `src/app/data/projects.data.ts` (Optionally add an `image` placeholder property to project items)

---

## 1. Aesthetic Restructure

We are refactoring the main portfolio resume to mimic the premium centered layout of the inspiration website (Attiq R.) while maintaining our soft warm paper background (`#FAF9F6`) and hardware-accelerated SVG easter eggs.

### 1.1 Header & Introduction Block
*   **Alignment:** 100% centered.
*   **Avatar Picture:** Centered at the very top. Inside a perfect circular wrapper (`width: 80px`, `height: 80px`). On hover, it zooms slightly and triggers our animated SVG Python snake.
*   **Social Badges Row:** Placed centered directly below your name. Small, elegant capsule pills with mail, X, LinkedIn, and GitHub tags.
*   **Summary Text:** A larger, beautiful, spacious paragraph placed below the badges row. Fully centered:
    > "Software engineer based in Vancouver, Canada. Currently building high-fidelity web experiences, robust backend services, and scalable agentic toolkits."

---

## 2. "Explorations" Section (Experiences as Cards)

Your **Work Experiences** are mapped under a centered section titled **"Explorations"**.

### Layout & Card Structure
*   **Grid:** A responsive 3-column row (flex or grid) displaying your career history as cards.
*   **Card Background/Visuals:**
    *   Each card features a rounded, visual top container (`height: 180px`, `border-radius: 12px 12px 0 0`) that acts as a showcase slot for a local image (e.g. `public/assets/explorations/innovate-tech.jpg`).
    *   **Fallback:** If the image is not found, it falls back gracefully to a solid muted color background (`#E4E4E7` or a soft gradient) with your company's initials centered inside in large bold letters.
*   **Text Layout:** Underneath the visual container, the role title and company name are placed neatly with spacious padding.
    *   Title: `Senior Software Engineer` (Bold, zinc-900 `#18181B`).
    *   Subtitle/Metadata: `InnovateTech Solutions • 2023 - Present` (Muted gray `#71717A`).

---

## 3. "Work" Section (Projects as 3-Column Interlaced Cards)

Your **Projects** are mapped under a centered section titled **"Work"**.

### Grid Structure (The 3-Column Interlaced Offset)
To create the custom, high-end "interlaced" feel, the 3 columns of our project grid are vertically offset relative to each other on desktop screens (`min-width: 768px`):
*   **Column 1 (Left):** Stays at default alignment (`transform: translateY(0)`).
*   **Column 2 (Center):** Offset downwards (`transform: translateY(40px)`).
*   **Column 3 (Right):** Offset intermediate (`transform: translateY(20px)`).
*   **Mobile Behavior:** On screens `< 768px`, the grid collapses cleanly to a single stacked column, and we strip the `translateY` offset to ensure a perfectly flat, highly readable layout.

### Card Structure
*   **Contrast:** To match the contrast in Image 2, project cards feature a dark charcoal background (`#121214`), giving them a strong, premium weight.
*   **Card Visuals:**
    *   A rounded visual top container (`height: 220px`, `border-radius: 12px 12px 0 0`) with a placeholder image slot (e.g. `public/assets/work/portfolio.jpg`).
    *   **Fallback:** Falls back gracefully to a deep dark gradient with clean, minimal layout shapes.
*   **Text Layout:**
    *   Title: `christianfarrell.dev` (White `#FFFFFF` or very light gray `#F4F4F5` for contrast).
    *   Tags/Labels: Clean pill tags aligned at the bottom of the card.

---

## 4. Integration with Interactive Popups & Easter Eggs

This visual restructure is 100% compatible with our existing functional states:
*   **State-driven Dialog:** Clicking any card (Work Exploration or Project Card) still opens the native `<dialog>` detail modal smoothly.
*   **Signals & Timers:**
    *   Hovering the centered avatar still wiggles our Python snake.
    *   Hovering the minimal footer still triggers Ferris the Crab to scuttle across the footer.
