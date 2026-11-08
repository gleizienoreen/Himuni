/**
 * Curated themes and layouts for HIMUNI Sound Postcards.
 * Designed with original abstract shapes, brand palette, and editorial typography.
 * Avoids relying on remote artwork for export.
 */

export const POSTCARD_THEMES = [
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    description: 'Soft lavender, violet haze, and airy floating geometric arcs.',
    palette: {
      bg: '#FAF8FE',
      cardBg: '#ECE7FB',
      surface: '#DFD8F7',
      primary: '#8067E8',
      secondary: '#E8B8C8',
      text: '#24232B',
      textMuted: '#5A5766',
      textSubtle: '#787486',
      accent: '#8067E8',
      border: 'rgba(36, 35, 43, 0.16)',
    },
    moodHint: 'dreamy',
    visualStyle: 'arcs',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Warm luminous yellow, tangerine horizon, and expressive sunburst geometries.',
    palette: {
      bg: '#FFFDF5',
      cardBg: '#FAF3D6',
      surface: '#FCE6DC',
      primary: '#E8D98E',
      secondary: '#F18B63',
      text: '#24232B',
      textMuted: '#5A5766',
      textSubtle: '#8F7B20',
      accent: '#F18B63',
      border: 'rgba(36, 35, 43, 0.16)',
    },
    moodHint: 'joyful',
    visualStyle: 'sunburst',
  },
  {
    id: 'blue-reverie',
    name: 'Blue Reverie',
    description: 'Sky blue and deep midnight indigo with atmospheric coastal contours.',
    palette: {
      bg: '#F5F9FA',
      cardBg: '#E4EFF3',
      surface: '#BBD5DF',
      primary: '#477282',
      secondary: '#8067E8',
      text: '#24232B',
      textMuted: '#475C66',
      textSubtle: '#6A808C',
      accent: '#477282',
      border: 'rgba(36, 35, 43, 0.16)',
    },
    moodHint: 'calm',
    visualStyle: 'waves',
  },
  {
    id: 'blush-moments',
    name: 'Blush Moments',
    description: 'Dusty rose and warm coral with tender, overlapping petal-inspired silhouettes.',
    palette: {
      bg: '#FCF7F9',
      cardBg: '#F8EAEF',
      surface: '#F5D8E3',
      primary: '#9E4D69',
      secondary: '#F18B63',
      text: '#24232B',
      textMuted: '#6B4C56',
      textSubtle: '#8A6874',
      accent: '#E8B8C8',
      border: 'rgba(36, 35, 43, 0.16)',
    },
    moodHint: 'romantic',
    visualStyle: 'petals',
  },
  {
    id: 'quiet-notes',
    name: 'Quiet Notes',
    description: 'Warm cream and deep ink with minimal, typography-driven clarity.',
    palette: {
      bg: '#FAF7F2',
      cardBg: '#F5F1EA',
      surface: '#EBE4D8',
      primary: '#24232B',
      secondary: '#BBD5DF',
      text: '#24232B',
      textMuted: '#5A5766',
      textSubtle: '#787486',
      accent: '#24232B',
      border: 'rgba(36, 35, 43, 0.22)',
    },
    moodHint: 'focused',
    visualStyle: 'minimal',
  },
];

export const POSTCARD_LAYOUTS = [
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Large heading, asymmetric track anchor, and prominent brand resonance.',
    tag: 'Asymmetric',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Pure typography, generous white space, and restrained architectural lines.',
    tag: 'Spacious',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Prominent decorative geometric shapes and expressive layout flow.',
    tag: 'Graphic',
  },
  {
    id: 'memory',
    name: 'Memory',
    description: 'Prominent personal note quotation, date stamp, and reflection framing.',
    tag: 'Keepsake',
  },
];

export const TYPOGRAPHY_STYLES = [
  { id: 'editorial', name: 'Editorial (Space Grotesk + Italic)' },
  { id: 'sans', name: 'Contemporary Sans (DM Sans)' },
  { id: 'display', name: 'Bold Display (Space Grotesk)' },
];

export const TYPOGRAPHY_ALIGNMENTS = [
  { id: 'left', name: 'Left' },
  { id: 'center', name: 'Centered' },
  { id: 'right', name: 'Right' },
];

export function getPostcardTheme(themeId) {
  return (
    POSTCARD_THEMES.find((t) => t.id === themeId) || POSTCARD_THEMES[0]
  );
}

export function getPostcardLayout(layoutId) {
  return (
    POSTCARD_LAYOUTS.find((l) => l.id === layoutId) || POSTCARD_LAYOUTS[0]
  );
}
