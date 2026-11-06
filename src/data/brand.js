/**
 * Canonical HIMUNI brand identity constants.
 * Baybayin sequence:
 *   ᜑ (U+1711 HA) + ᜒ (U+1712 kudlit-i) = hi
 *   ᜋ (U+170B MA) + ᜓ (U+1713 kudlit-u) = mu
 *   ᜈ (U+1708 NA) + ᜒ (U+1712 kudlit-i) = ni
 */
export const BRAND = {
  name: 'HIMUNI',
  baybayin: 'ᜑᜒᜋᜓᜈᜒ',
  baybayinLabel: 'Himuni written in Baybayin script (hi-mu-ni)',
  tagline: 'Every feeling has a sound.',
  statement: 'Not every feeling needs words. Sometimes, it just needs a sound.',
  category: 'Mood-led Music Discovery Experience',
  syllables: [
    { script: 'ᜑᜒ', syllable: 'hi', note: 'from Himig' },
    { script: 'ᜋᜓ', syllable: 'mu', note: 'from Muni-muni' },
    { script: 'ᜈᜒ', syllable: 'ni', note: 'quiet resonance' },
  ],
  roots: [
    {
      word: 'Himig',
      pronunciation: 'hee-mig',
      origin: 'Filipino',
      meaning: 'Melody, tune, or the gentle cadence of a sound carried through a room.',
    },
    {
      word: 'Muni-muni',
      pronunciation: 'moo-nee moo-nee',
      origin: 'Filipino',
      meaning: 'Quiet reflection, lingering contemplation, and sitting honestly with how you feel.',
    },
  ],
  palette: [
    { name: 'Warm Cream', hex: '#F5F1EA', role: 'Primary editorial canvas' },
    { name: 'Ink', hex: '#24232B', role: 'Primary typography & dark ground' },
    { name: 'Electric Violet', hex: '#8067E8', role: 'Dreamy & twilight resonance' },
    { name: 'Tangerine', hex: '#F18B63', role: 'Kinetic warmth & momentum' },
    { name: 'Butter Yellow', hex: '#E8D98E', role: 'Luminous celebration' },
    { name: 'Sky Blue', hex: '#BBD5DF', role: 'Clarity & open horizon' },
    { name: 'Blush', hex: '#E8B8C8', role: 'Tenderness & soft intimacy' },
  ],
};
