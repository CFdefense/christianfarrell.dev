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
