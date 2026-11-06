export const SOUNDSCAPES = [
  {
    id: 'a-little-sunshine',
    index: '01',
    title: 'A Little Sunshine',
    description:
      'Open windows, unhurried mornings, and warm tonal textures for moments when light spills gently into the room.',
    moodIds: ['joyful', 'calm'],
    moodLabel: 'Joyful · Upbeat',
    moodTags: ['Joyful', 'Upbeat'],
    soundFocus: 'Bright acoustic and pop',
    queries: ['bright acoustic pop', 'upbeat indie pop', 'sunny acoustic'],
    coordinates: { x: 0.68, y: 0.84 },
    palette: {
      bg: '#FAF3D6',
      primary: '#E8D98E',
      secondary: '#F18B63',
      accent: '#24232B',
    },
    span: 'md:col-span-2 lg:col-span-7',
  },
  {
    id: 'midnight-and-morning',
    index: '02',
    title: 'Somewhere Between Midnight and Morning',
    description:
      'Weightless, suspended harmonies for quiet late hours when the world slows down and thoughts drift without urgency.',
    moodIds: ['dreamy', 'melancholic'],
    moodLabel: 'Dreamy · Atmospheric',
    moodTags: ['Dreamy', 'Atmospheric'],
    soundFocus: 'Ambient and downtempo',
    queries: ['ambient downtempo', 'atmospheric chillout', 'midnight ambient'],
    coordinates: { x: 0.24, y: 0.48 },
    palette: {
      bg: '#24232B',
      primary: '#8067E8',
      secondary: '#BBD5DF',
      accent: '#F5F1EA',
      isDark: true,
    },
    span: 'lg:col-span-5',
  },
  {
    id: 'soft-afternoons',
    index: '03',
    title: 'Soft Afternoons',
    description:
      'Tender pacing and unguarded warmth for lingering conversations, quiet reading, and light moving across the floor.',
    moodIds: ['calm', 'romantic'],
    moodLabel: 'Calm · Relaxation',
    moodTags: ['Calm', 'Relaxation'],
    soundFocus: 'Acoustic and instrumental',
    queries: ['calm acoustic instrumental', 'soft guitar instrumental', 'relaxation acoustic'],
    coordinates: { x: 0.36, y: 0.66 },
    palette: {
      bg: '#F8EAEF',
      primary: '#E8B8C8',
      secondary: '#E8D98E',
      accent: '#24232B',
    },
    span: 'lg:col-span-4',
  },
  {
    id: 'beautifully-overwhelmed',
    index: '04',
    title: 'Beautifully Overwhelmed',
    description:
      'Swelling, expressive layers for moments that hold too much feeling at once—cathartic, vivid, and deeply human.',
    moodIds: ['melancholic', 'energetic'],
    moodLabel: 'Melancholic · Reflective',
    moodTags: ['Melancholic', 'Reflective'],
    soundFocus: 'Piano and atmospheric indie',
    queries: ['piano indie', 'atmospheric indie', 'melancholic piano'],
    coordinates: { x: 0.72, y: 0.56 },
    palette: {
      bg: '#FCE5DB',
      primary: '#F18B63',
      secondary: '#8067E8',
      accent: '#24232B',
    },
    span: 'lg:col-span-4',
  },
  {
    id: 'starting-over',
    index: '05',
    title: 'The Feeling of Starting Over',
    description:
      'Clear horizons after rain: grounded, forward-looking resonance for turning the page with quiet conviction.',
    moodIds: ['focused', 'nostalgic'],
    moodLabel: 'Focused · Nostalgic',
    moodTags: ['Focused', 'Nostalgic'],
    soundFocus: 'Reflective electronic and indie',
    queries: ['melodic electronic indie', 'reflective electronic', 'indie instrumental'],
    coordinates: { x: 0.52, y: 0.60 },
    palette: {
      bg: '#E4EFF3',
      primary: '#BBD5DF',
      secondary: '#8067E8',
      accent: '#24232B',
    },
    span: 'lg:col-span-4',
  },
];

export function getSoundscapeById(soundscapeId) {
  return SOUNDSCAPES.find((item) => item.id === soundscapeId) || null;
}
