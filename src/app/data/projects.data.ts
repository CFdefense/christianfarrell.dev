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
