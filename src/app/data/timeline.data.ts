export interface TimelineEntry {
  date: string;
  title: string;
}

// Every date is "Mon YYYY". Oldest first. Shown in the About me popup.
const ENTRIES: TimelineEntry[] = [
  { date: 'Sep 2023', title: 'Started my B.S. in Computer Science (Software Development) at Marist University' },
  { date: 'Dec 2023', title: 'Joined the Marist Computer Science Society board' },
  { date: 'Feb 2024', title: 'Joined Marist IT as a telecommunications technician' },
  { date: 'Jun 2024', title: 'Interned at Avangrid on mobile application management and virtual desktop infrastructure' },
  { date: 'Nov 2024', title: 'Won my first Marist Hackathon with TypeDash' },
  { date: 'Dec 2024', title: 'Elected President of Marist Computer Science Society' },
  { date: 'Jan 2025', title: 'Started as a software engineering co-op on IBM Storage Scale' },
  { date: 'Jun 2025', title: 'Mentored two IBM summer interns' },
  { date: 'Sep 2025', title: 'Co-authored the paper "Verbalized Algorithms", accepted to the NeurIPS 2025 Workshop on Efficient Reasoning' },
  { date: 'Dec 2025', title: 'RetrOS earned Hall of Fame' },
  { date: 'Apr 2026', title: 'Won Best Overall Project at the Marist Hackathon with MaristMaps' },
  { date: 'May 2026', title: 'Graduated summa cum laude and started full-time as a backend developer at IBM Storage Scale' },
  { date: 'Jun 2026', title: 'Mentored two more IBM summer interns' },
  { date: 'Sep 2026', title: 'Started my M.S. in Computer Science (Artificial Intelligence) at Marist' },
  { date: 'Sep 2026', title: 'Presented at the IBM Storage Scale User Group in New York City' },
];

export interface TimelineItem extends TimelineEntry {
  year: string;
  startsYear: boolean; // first entry of a new year: the popup shows the year above it
}

export const TIMELINE: TimelineItem[] = ENTRIES.map((entry, i) => {
  const year = entry.date.slice(-4);
  return { ...entry, year, startsYear: i === 0 || year !== ENTRIES[i - 1].date.slice(-4) };
});
