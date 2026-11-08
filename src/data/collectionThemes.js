/**
 * Curated cover themes and styling for HIMUNI Personal Collections.
 * Built using the canonical HIMUNI editorial color system.
 */

export const COLLECTION_THEMES = [
  {
    id: 'warm-cream',
    name: 'Warm Cream',
    color: '#F5F1EA',
    accent: '#24232B',
    border: 'rgba(36, 35, 43, 0.2)',
    text: '#24232B',
    iconStyle: 'resonance',
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    color: '#ECE8FB',
    accent: '#8067E8',
    border: 'rgba(128, 103, 232, 0.35)',
    text: '#24232B',
    iconStyle: 'arcs',
  },
  {
    id: 'tangerine',
    name: 'Tangerine Sun',
    color: '#FCE6DC',
    accent: '#F18B63',
    border: 'rgba(241, 139, 99, 0.35)',
    text: '#24232B',
    iconStyle: 'sunburst',
  },
  {
    id: 'butter-yellow',
    name: 'Butter Yellow',
    color: '#FAF3D6',
    accent: '#E8D98E',
    border: 'rgba(143, 123, 32, 0.35)',
    text: '#24232B',
    iconStyle: 'orbits',
  },
  {
    id: 'sky-blue',
    name: 'Sky Horizon',
    color: '#E4EFF3',
    accent: '#477282',
    border: 'rgba(71, 114, 130, 0.35)',
    text: '#24232B',
    iconStyle: 'waves',
  },
  {
    id: 'blush',
    name: 'Soft Blush',
    color: '#F8EAEF',
    accent: '#9E4D69',
    border: 'rgba(158, 77, 105, 0.35)',
    text: '#24232B',
    iconStyle: 'petals',
  },
  {
    id: 'deep-ink',
    name: 'Midnight Ink',
    color: '#24232B',
    accent: '#F5F1EA',
    border: 'rgba(245, 241, 234, 0.2)',
    text: '#F5F1EA',
    iconStyle: 'resonance',
  },
];

export function getCollectionTheme(themeId) {
  return (
    COLLECTION_THEMES.find((t) => t.id === themeId) || COLLECTION_THEMES[0]
  );
}
