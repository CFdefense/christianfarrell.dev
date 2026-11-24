export interface Project {
  title: string;
  description: string;
  longDescription?: string; // Optional detailed description for popups
  highlights?: string[]; // Feature bullets shown in the detail popup
  sections?: { title: string; points: string[] }[]; // Extra titled bullet lists in the detail popup
  contribution?: string; // My part in the project, shown in the detail popup (not named `role`: isExperience() keys on that)
  award?: string; // Shown on its own line above the description in the detail popup
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  year: number;
  image?: string; // Demo GIF, path relative to public/
}
