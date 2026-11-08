export const NAV_ITEMS = [
  {
    id: 'discover',
    label: 'Discover',
    path: '/',
    sectionId: 'discover',
  },
  {
    id: 'mood-spectrum',
    label: 'Mood Spectrum',
    path: '/mood-spectrum',
    sectionId: 'mood-spectrum',
  },
  {
    id: 'soundscapes',
    label: 'Soundscapes',
    path: '/soundscapes',
    sectionId: 'soundscapes',
  },
  {
    id: 'postcards',
    label: 'Postcards',
    path: '/postcards',
    sectionId: 'postcards',
    standaloneRoute: true,
  },
  {
    id: 'collections',
    label: 'Collections',
    path: '/collections',
    sectionId: 'collections',
    standaloneRoute: true,
  },
  {
    id: 'search',
    label: 'Search',
    path: '/search',
    sectionId: 'search',
    standaloneRoute: true,
  },
  {
    id: 'about',
    label: 'About',
    path: '/about',
    sectionId: 'about',
  },
];

export function scrollToSection(sectionId) {
  if (typeof document === 'undefined') return;
  const target = document.getElementById(sectionId);
  if (!target) return;

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  target.scrollIntoView({
    behavior: prefersReduced ? 'auto' : 'smooth',
    block: 'start',
  });
}
