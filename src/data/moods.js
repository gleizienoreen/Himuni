/**
 * Centralized mood definitions for HIMUNI.
 * Normalized spectrum coordinates:
 *   x: 0.0 (Calm) -> 1.0 (Energetic)
 *   y: 0.0 (Introspective) -> 1.0 (Bright)
 */
export const MOODS = [
  {
    id: 'dreamy',
    index: '01',
    name: 'Dreamy',
    description: 'For slow, floating moments.',
    accent: '#8067E8',
    secondary: '#E8B8C8',
    surface: '#ECE8FB',
    badgeText: '#FFFFFF',
    coordinates: { x: 0.27, y: 0.72 },
    spectrumRegion: 'Low energy · Moderately bright',
    atmosphere:
      'Weightless harmonic layers, unhurried reverbs, and soft-focus melodies that let time loosen its grip.',
    textures: ['Floating chords', 'Soft haze', 'Open air'],
    energyProfiles: {
      low: 'Suspended and cloud-soft—barely-there melodies drifting at the edge of sleep.',
      balanced: 'Gently buoyant—warm, shimmering phrases with an easy forward drift.',
      high: 'Luminous and weightless—shimmering rhythms carrying daydreams into motion.',
    },
    gridSpan: 'md:col-span-2 lg:col-span-5',
    layoutVariant: 'split',
  },
  {
    id: 'focused',
    index: '02',
    name: 'Focused',
    description: 'For when everything else fades away.',
    accent: '#6FA6BA',
    secondary: '#BBD5DF',
    surface: '#E4EFF3',
    badgeText: '#24232B',
    coordinates: { x: 0.54, y: 0.50 },
    spectrumRegion: 'Moderate energy · Balanced',
    atmosphere:
      'Clear pulse, uncluttered space, and steady tonal architecture that clears room for deep thought.',
    textures: ['Steady pulse', 'Clean lines', 'Quiet clarity'],
    energyProfiles: {
      low: 'Minimal and unhurried—spacious patterns that hold attention without asking for it.',
      balanced: 'Centered and steady—a measured cadence that keeps distractions outside the frame.',
      high: 'Crisp and propulsive—locked-in momentum for clear, decisive flow.',
    },
    gridSpan: 'md:col-span-1 lg:col-span-4',
    layoutVariant: 'stacked',
  },
  {
    id: 'melancholic',
    index: '03',
    name: 'Melancholic',
    description: 'For feelings you cannot quite explain.',
    accent: '#6878A6',
    secondary: '#8067E8',
    surface: '#E3E7F2',
    badgeText: '#FFFFFF',
    coordinates: { x: 0.18, y: 0.22 },
    spectrumRegion: 'Low energy · Introspective',
    atmosphere:
      'Minor-key intimacy, rain-washed resonance, and honest quiet for emotions that resist neat labels.',
    textures: ['Muted piano grain', 'Twilight tone', 'Deep space'],
    energyProfiles: {
      low: 'Hushed and inward—intimate notes lingering in the silence between phrases.',
      balanced: 'Bittersweet and moving—gentle motion carrying unspoken reflection.',
      high: 'Swelling and cathartic—urgent, aching crescendos that release held tension.',
    },
    gridSpan: 'md:col-span-1 lg:col-span-3',
    layoutVariant: 'tall',
  },
  {
    id: 'energetic',
    index: '04',
    name: 'Energetic',
    description: 'For when you need a little momentum.',
    accent: '#F18B63',
    secondary: '#E8D98E',
    surface: '#FCE6DC',
    badgeText: '#24232B',
    coordinates: { x: 0.86, y: 0.70 },
    spectrumRegion: 'High energy · Bright',
    atmosphere:
      'Crisp kinetic drive, warm percussive lift, and forward-leaning brightness that wakes up the room.',
    textures: ['Kinetic lift', 'Warm rhythm', 'Forward stride'],
    energyProfiles: {
      low: 'A coiled spark—light, nimble groove warming up without rushing.',
      balanced: 'Steady stride—bright, confident pacing that turns intention into movement.',
      high: 'Full kinetic bloom—vivid, high-spirited drive firing on every beat.',
    },
    gridSpan: 'md:col-span-1 lg:col-span-3',
    layoutVariant: 'tall',
  },
  {
    id: 'romantic',
    index: '05',
    name: 'Romantic',
    description: 'For moments that feel a little softer.',
    accent: '#D98EA6',
    secondary: '#E8B8C8',
    surface: '#F9EAF0',
    badgeText: '#24232B',
    coordinates: { x: 0.50, y: 0.70 },
    spectrumRegion: 'Moderate energy · Moderately bright',
    atmosphere:
      'Velvet warmth, close-mic tenderness, and unguarded melodies made for golden hour and lingering glances.',
    textures: ['Warm strings', 'Close intimacy', 'Soft glow'],
    energyProfiles: {
      low: 'Candlelit and close—whispered warmth moving at the pace of a slow breath.',
      balanced: 'Graceful and tender—swaying harmonies wrapped in rosy afternoon light.',
      high: 'Heart-open and radiant—sweeping, fluttering warmth that feels larger than the room.',
    },
    gridSpan: 'md:col-span-1 lg:col-span-5',
    layoutVariant: 'split',
  },
  {
    id: 'nostalgic',
    index: '06',
    name: 'Nostalgic',
    description: 'For memories that feel like yesterday.',
    accent: '#D59658',
    secondary: '#E8D98E',
    surface: '#F7EAD8',
    badgeText: '#24232B',
    coordinates: { x: 0.38, y: 0.28 },
    spectrumRegion: 'Low to moderate energy · Introspective',
    atmosphere:
      'Sun-faded tape warmth, familiar chord turns, and the bittersweet comfort of places you still carry with you.',
    textures: ['Analog grain', 'Amber dusk', 'Familiar echo'],
    energyProfiles: {
      low: 'Sepia stillness—quiet acoustic fragments like turning pages of an old letter.',
      balanced: 'Warm hindsight—gentle, rolling grooves from a late-afternoon drive home.',
      high: 'Young-at-heart rush—vivid, bittersweet anthems for windows-down memories.',
    },
    gridSpan: 'md:col-span-2 lg:col-span-4',
    layoutVariant: 'stacked',
  },
  {
    id: 'joyful',
    index: '07',
    name: 'Joyful',
    description: 'For moments worth celebrating.',
    accent: '#DFC455',
    secondary: '#F18B63',
    surface: '#FAF4D6',
    badgeText: '#24232B',
    coordinates: { x: 0.80, y: 0.88 },
    spectrumRegion: 'High energy · Very bright',
    atmosphere:
      'Sunlit brassy sparkle, effortless bounce, and wide-open harmonies that feel like laughter in a bright room.',
    textures: ['Sunlit sparkle', 'Open chorus', 'Playful bounce'],
    energyProfiles: {
      low: 'Easy morning smile—lighthearted warmth without needing to raise its voice.',
      balanced: 'Golden buoyancy—uplifting, sunlit grooves made for shared company.',
      high: 'Pure celebration—effervescent, radiant momentum in full bloom.',
    },
    gridSpan: 'md:col-span-1 lg:col-span-6',
    layoutVariant: 'banner',
  },
  {
    id: 'calm',
    index: '08',
    name: 'Calm',
    description: 'For finding a little quiet.',
    accent: '#82B3A0',
    secondary: '#BBD5DF',
    surface: '#E5F1EC',
    badgeText: '#24232B',
    coordinates: { x: 0.14, y: 0.58 },
    spectrumRegion: 'Low energy · Moderately bright',
    atmosphere:
      'Unhurried breathing room, grounded organic tones, and still horizons where your shoulders can finally drop.',
    textures: ['Still water', 'Soft breath', 'Grounded hush'],
    energyProfiles: {
      low: 'Deep hush—spacious, unhurried stillness like morning mist over quiet water.',
      balanced: 'Gentle equilibrium—easy, grounded flow that steadies the room.',
      high: 'Fresh breeze—light, airy movement that feels awake yet completely unforced.',
    },
    gridSpan: 'md:col-span-1 lg:col-span-6',
    layoutVariant: 'banner',
  },
];

export const DEFAULT_MOOD_ID = 'dreamy';

export function getMoodById(moodId) {
  return MOODS.find((mood) => mood.id === moodId) || MOODS[0];
}
