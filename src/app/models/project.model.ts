export interface Project {
  title: string;
  description: string;
  longDescription?: string; // Optional detailed description for popups
  tags: string[];
  url?: string;
  year: number;
  image?: string;
}
