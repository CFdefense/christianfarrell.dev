import { Experience } from '../models/experience.model';

// Popups with more than one position use a heading + meta line + bullet list per position
// (see the .modal-rich-text h4 / .role-meta styles in home.scss).
export const EXPERIENCES: Experience[] = [
  {
    role: 'Backend Developer',
    company: 'IBM Storage Scale',
    location: 'Poughkeepsie, NY',
    period: 'Jan 2025 - Present',
    shortDescription: 'Started as a software engineering co-op and now a full-time backend developer on IBM Storage Scale.',
    fullDescription:
      '<h4>Backend Developer</h4>' +
      '<p class="role-meta">May 2026 - Present · Full-time · Hybrid</p>' +
      '<ul><li>Joined IBM Storage Scale full-time as a backend developer after my co-op, continuing to work on test automation, AI agents and enterprise storage.</li></ul>' +
      '<h4>Software Engineering Co-op</h4>' +
      '<p class="role-meta">Jan 2025 - May 2026 · Co-op · On-site</p>' +
      '<ul>' +
      '<li>Worked alongside IBM-MIT AI Lab researchers to research and develop an AI algorithm based on Student-t Stochastic Triplet Embedding, enabling clustering of complex data using localized LLMs, and published it as a reusable ML library.</li>' +
      '<li>Built and deployed an x86 AI server for research workloads hosting multiple NVIDIA GPUs, and implemented vLLM code that selects an execution strategy, running models in parallel or splitting parameters to maximize VRAM usage.</li>' +
      '<li>Deployed enterprise-level cluster storage solutions on Red Hat Enterprise Linux using Docker containers, managed and automated with Ansible, for scalable, isolated test environments of Spectrum Scale storage systems and software.</li>' +
      '<li>Led functional and regression testing of the PEMS subsystem, an NVMe SCSI emulator for system power and environmental performance, cutting manual testing time by 90% with a custom Pytest framework and Jenkins automation.</li>' +
      '</ul>',
    tags: ['IBM Storage Scale', 'AI Research', 'Pytest', 'Jenkins', 'Ansible', 'Docker', 'RHEL', 'vLLM'],
    image: 'experience/IBM.png',
    initials: 'IBM',
  },
  {
    role: 'Telecommunications Technician and Programming Lab Tutor',
    company: 'Marist IT',
    location: 'Poughkeepsie, NY',
    period: 'Feb 2024 - Dec 2024',
    shortDescription: 'Maintained campus telecommunications and tutored introductory programming courses.',
    fullDescription:
      '<h4>Telecommunications Technician</h4>' +
      '<p class="role-meta">Feb 2024 - Dec 2024 · Poughkeepsie, NY</p>' +
      '<ul>' +
      '<li>Maintained, inspected and ran diagnostics on over 50 LAN rooms across Marist\'s 240-acre campus, supporting connectivity for faculty, staff and students.</li>' +
      '<li>Resolved issues reported through the ticketing system, including phone setups, cable re-terminations and network troubleshooting with specialized tools.</li>' +
      '<li>Built and configured telecommunications devices such as VoIP phones, Cisco Jabber phones and ATA routers, with Cisco Unified Communications Manager, keeping connectivity secure and confidential data protected.</li>' +
      '<li>Installed over 80 phones and the telecommunications infrastructure in the new Dyson building, on time for faculty and students, and trained and mentored new technicians.</li>' +
      '</ul>' +
      '<h4>Programming Lab Tutor</h4>' +
      '<p class="role-meta">Aug 2024 - Dec 2024 · Part-time · On-site</p>' +
      '<ul>' +
      '<li>Explained software development concepts and helped students build problem-solving skills in Intro to Computer Science, Software Development I and Discrete Mathematics, using Python and Java.</li>' +
      '<li>Gave one-on-one and group support, helping students debug and optimize their projects.</li>' +
      '</ul>',
    tags: ['Cisco CUCM', 'Networking', 'VoIP', 'Python', 'Java', 'Tutoring'],
    image: 'experience/marist.png',
    initials: 'MC',
  },
  {
    role: 'Mobile Application Management and Virtual Desktop Infrastructure Intern',
    company: 'Avangrid',
    location: 'Connecticut',
    period: 'Jun 2024 - Aug 2024',
    shortDescription: 'Mobile application management and virtual desktop infrastructure at a leading U.S. energy company.',
    fullDescription:
      '<ul>' +
      '<li>Collaborated with an international team to develop a unique compliance profile for a Microsoft HoloLens proof of concept in Microsoft Intune, ensuring secure use by fieldworkers at Avangrid Renewables.</li>' +
      '<li>Identified application testers using the CMDB for the migration of 12 Citrix application servers hosting 118 applications, supporting a smooth server infrastructure upgrade.</li>' +
      '<li>Managed L2 and L3 mobile application management ticket queues covering device compliance, VPN access and proxy certifications in Microsoft Intune.</li>' +
      '<li>Worked with Avangrid Renewables management and fieldworkers to restore VPN access for 400 affected devices and launched a new corporate Wi-Fi network for secure access to internal applications and data.</li>' +
      '<li>Worked on a Bring Your Own Device (BYOD) proof of concept in Microsoft Intune, developing strategies to manage personal devices within the company\'s security framework.</li>' +
      '</ul>',
    tags: ['Microsoft Intune', 'Citrix Virtual Apps', 'HoloLens', 'BYOD', 'VPN'],
    image: 'experience/Avangrid.png',
    initials: 'AV',
  },
];
