import { Experience } from '../models/experience.model';

export const EXPERIENCES: Experience[] = [
  {
    role: 'Lorem Ipsum',
    company: 'Dolor Sit Amet',
    location: 'Consectetur, BC',
    period: '2023 - Present',
    shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    fullDescription: '<ul><li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li><li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</li><li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</li></ul>',
    tags: ['Lorem', 'Ipsum', 'Dolor', 'Sit'],
    image: 'assets/explorations/innovate-tech.jpg',
    initials: 'LI',
  },
  {
    role: 'Adipiscing Elit',
    company: 'Sed Do Eiusmod',
    location: 'Remote',
    period: '2021 - 2023',
    shortDescription: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
    fullDescription: '<ul><li>Aliquam purus ac purus dictum, nec accumsan sem hendrerit.</li><li>Sed non mauris vel elit facilisis gravida vel eget ex.</li><li>Vestibulum sodales tortor quis nunc luctus, nec aliquet elit tincidunt.</li></ul>',
    tags: ['Amet', 'Consectetur', 'Adipiscing', 'Elit'],
    image: 'assets/explorations/stellarweb.jpg',
    initials: 'AE',
  },
  {
    role: 'Tempor Incididunt',
    company: 'Ut Labore',
    location: 'Consectetur, BC',
    period: '2019 - 2021',
    shortDescription: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    fullDescription: '<ul><li>Donec mollis congue lacinia. Cras sit amet felis eget augue pretium.</li><li>Aenean a sollicitudin nibh, eget aliquet sem.</li><li>Proin gravida, erat vel facilisis interdum, elit dolor congue lorem.</li></ul>',
    tags: ['Sed', 'Do', 'Eiusmod', 'Tempor'],
    image: 'assets/explorations/webflow.jpg',
    initials: 'TI',
  }
];
