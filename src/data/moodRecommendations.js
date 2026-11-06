import { getEnergyBand } from '../utils/spectrum.js';

/**
 * Curated mood-to-music discovery mappings and deterministic energy refinements.
 * Note: These are editorial discovery associations curated by HIMUNI,
 * not scientific claims or AI-predicted emotional classifications.
 */
export const MOOD_RECOMMENDATIONS = {
  dreamy: {
    moodId: 'dreamy',
    directions: [
      'Ambient',
      'Chillout',
      'Downtempo',
      'Atmospheric electronic',
      'Instrumental',
    ],
    energyRefinements: {
      low: {
        summary: 'Favoring spacious ambient textures and slower instrumental drift.',
        primaryQueries: ['ambient instrumental', 'ambient chillout', 'slow downtempo'],
        additionalQueries: ['dreamy ambient', 'ethereal instrumental'],
        preferredMaxBpm: 105,
      },
      balanced: {
        summary: 'Balancing floating chillout atmospheres with gentle downtempo motion.',
        primaryQueries: ['chillout downtempo', 'atmospheric ambient', 'dreamy electronic'],
        additionalQueries: ['chill instrumental', 'lush downtempo'],
        preferredMinBpm: 85,
        preferredMaxBpm: 122,
      },
      high: {
        summary: 'Introducing rhythmic atmospheric electronic and buoyant synth textures.',
        primaryQueries: ['atmospheric electronic', 'melodic chillwave', 'dreamy synth'],
        additionalQueries: ['melodic electronic', 'chill house atmospheric'],
        preferredMinBpm: 112,
      },
    },
    contrastingMoodId: 'energetic',
  },

  focused: {
    moodId: 'focused',
    directions: [
      'Instrumental',
      'Ambient',
      'Classical',
      'Minimal electronic',
      'Jazz',
    ],
    energyRefinements: {
      low: {
        summary: 'Favoring quiet ambient space, solo classical textures, and calm instrumentals.',
        primaryQueries: ['ambient study instrumental', 'solo piano classical', 'minimal ambient'],
        additionalQueries: ['quiet classical', 'calm instrumental'],
        preferredMaxBpm: 104,
      },
      balanced: {
        summary: 'Blending uncluttered instrumentals, minimal electronic pulse, and cool jazz.',
        primaryQueries: ['minimal electronic instrumental', 'jazz instrumental', 'focus beats'],
        additionalQueries: ['modern classical', 'lofi instrumental'],
        preferredMinBpm: 88,
        preferredMaxBpm: 125,
      },
      high: {
        summary: 'Leaning into steady minimal electronic momentum and crisp rhythmic instrumentals.',
        primaryQueries: ['minimal techno electronic', 'upbeat instrumental', 'progressive electronic'],
        additionalQueries: ['jazz fusion instrumental', 'electronic rhythm'],
        preferredMinBpm: 116,
      },
    },
    contrastingMoodId: 'joyful',
  },

  melancholic: {
    moodId: 'melancholic',
    directions: ['Piano', 'Acoustic', 'Ambient', 'Downtempo', 'Indie'],
    energyRefinements: {
      low: {
        summary: 'Favoring intimate piano, hushed ambient tones, and spare acoustic reflection.',
        primaryQueries: ['melancholic piano', 'sad acoustic', 'dark ambient'],
        additionalQueries: ['solo piano reflective', 'ambient downtempo'],
        preferredMaxBpm: 102,
      },
      balanced: {
        summary: 'Exploring bittersweet indie songwriting, downtempo warmth, and acoustic grain.',
        primaryQueries: ['indie acoustic', 'downtempo melancholic', 'piano ambient'],
        additionalQueries: ['indie folk', 'emotional electronic'],
        preferredMinBpm: 84,
        preferredMaxBpm: 122,
      },
      high: {
        summary: 'Opening into cathartic indie rock and swelling atmospheric arrangements.',
        primaryQueries: ['indie rock atmospheric', 'emotional electronic', 'post rock'],
        additionalQueries: ['alternative indie', 'melodic downtempo'],
        preferredMinBpm: 112,
      },
    },
    contrastingMoodId: 'joyful',
  },

  energetic: {
    moodId: 'energetic',
    directions: ['Electronic', 'Dance', 'House', 'Rock', 'Hip-hop'],
    energyRefinements: {
      low: {
        summary: 'Favoring moderate-tempo indie grooves, warm hip-hop beats, and melodic house.',
        primaryQueries: ['indie pop groove', 'chill hip hop', 'deep house'],
        additionalQueries: ['funk electronic', 'melodic house'],
        preferredMaxBpm: 118,
      },
      balanced: {
        summary: 'Combining bright house rhythms, crisp hip-hop cadence, and driving electronic.',
        primaryQueries: ['house dance', 'hip hop beats', 'electronic groove'],
        additionalQueries: ['indie rock', 'dance electronic'],
        preferredMinBpm: 108,
        preferredMaxBpm: 132,
      },
      high: {
        summary: 'Favoring upbeat electronic, high-spirited dance, and driving rock momentum.',
        primaryQueries: ['upbeat dance electronic', 'electro house', 'energetic rock'],
        additionalQueries: ['drum and bass', 'upbeat hip hop'],
        preferredMinBpm: 122,
      },
    },
    contrastingMoodId: 'calm',
  },

  romantic: {
    moodId: 'romantic',
    directions: ['Acoustic', 'Soul', 'Jazz', 'Piano', 'Soft pop'],
    energyRefinements: {
      low: {
        summary: 'Favoring close-mic acoustic ballads, tender piano, and late-night jazz.',
        primaryQueries: ['romantic piano', 'acoustic ballad', 'slow jazz'],
        additionalQueries: ['warm soul', 'soft acoustic'],
        preferredMaxBpm: 104,
      },
      balanced: {
        summary: 'Weaving warm soul vocals, gentle jazz phrasing, and soft pop melodies.',
        primaryQueries: ['soul rnb', 'soft pop acoustic', 'smooth jazz'],
        additionalQueries: ['neo soul', 'piano soul'],
        preferredMinBpm: 86,
        preferredMaxBpm: 122,
      },
      high: {
        summary: 'Lifting into radiant soul grooves, bright soft pop, and lively jazz warmth.',
        primaryQueries: ['upbeat soul', 'indie pop love', 'nu disco soul'],
        additionalQueries: ['funk soul', 'bright pop'],
        preferredMinBpm: 110,
      },
    },
    contrastingMoodId: 'focused',
  },

  nostalgic: {
    moodId: 'nostalgic',
    directions: [
      'Indie',
      'Folk',
      'Retro-inspired sounds',
      'Acoustic',
      'Alternative',
    ],
    energyRefinements: {
      low: {
        summary: 'Favoring warm acoustic folk, analog tape textures, and unhurried indie.',
        primaryQueries: ['indie folk acoustic', 'warm acoustic', 'lo-fi retro'],
        additionalQueries: ['folk singer', 'vintage chill'],
        preferredMaxBpm: 106,
      },
      balanced: {
        summary: 'Blending golden-hour indie, folk storytelling, and retro-inspired synth tones.',
        primaryQueries: ['retro synthwave', 'indie alternative', 'folk acoustic'],
        additionalQueries: ['dream pop indie', 'vintage soul'],
        preferredMinBpm: 90,
        preferredMaxBpm: 126,
      },
      high: {
        summary: 'Stepping into upbeat retro synth, driving alternative, and bright indie.',
        primaryQueries: ['outrun synthwave', 'upbeat indie rock', 'alternative pop'],
        additionalQueries: ['80s retro electronic', 'indie dance'],
        preferredMinBpm: 114,
      },
    },
    contrastingMoodId: 'energetic',
  },

  joyful: {
    moodId: 'joyful',
    directions: ['Pop', 'Funk', 'Upbeat electronic', 'Dance', 'Reggae'],
    energyRefinements: {
      low: {
        summary: 'Favoring sunlit reggae sway, laid-back funk, and easygoing pop.',
        primaryQueries: ['reggae chill', 'sunny acoustic pop', 'warm funk'],
        additionalQueries: ['tropical chill', 'soulful pop'],
        preferredMaxBpm: 110,
      },
      balanced: {
        summary: 'Bringing together playful funk grooves, bright pop hooks, and warm dance.',
        primaryQueries: ['funk disco', 'upbeat pop', 'reggae groove'],
        additionalQueries: [' tropical house', 'feel good electronic'],
        preferredMinBpm: 98,
        preferredMaxBpm: 128,
      },
      high: {
        summary: 'Celebrating with effervescent dance, upbeat electronic sparkle, and high-energy funk.',
        primaryQueries: ['happy dance pop', 'upbeat electronic', 'disco funk'],
        additionalQueries: ['house party', 'future funk'],
        preferredMinBpm: 118,
      },
    },
    contrastingMoodId: 'melancholic',
  },

  calm: {
    moodId: 'calm',
    directions: [
      'Ambient',
      'Relaxation',
      'Acoustic',
      'Classical',
      'Soft instrumental',
    ],
    energyRefinements: {
      low: {
        summary: 'Favoring deep ambient stillness, relaxation soundscapes, and minimal hush.',
        primaryQueries: ['ambient relaxation', 'peaceful meditation', 'calm classical'],
        additionalQueries: ['minimal piano', 'quiet ambient'],
        preferredMaxBpm: 98,
      },
      balanced: {
        summary: 'Settling into gentle acoustic guitar, classical warmth, and soft instrumentals.',
        primaryQueries: ['calm acoustic', 'soft instrumental', 'peaceful piano'],
        additionalQueries: ['classical guitar', 'ambient nature'],
        preferredMinBpm: 76,
        preferredMaxBpm: 116,
      },
      high: {
        summary: 'Introducing breezy acoustic fingerstyle and soft rhythmic instrumentals.',
        primaryQueries: ['acoustic instrumental rhythm', 'chillhop instrumental', 'breezy chill'],
        additionalQueries: ['folk instrumental', 'light jazz'],
        preferredMinBpm: 102,
      },
    },
    contrastingMoodId: 'energetic',
  },
};

/**
 * Resolves the deterministic query plan for a given mood, energy (0..100), and refresh cycle.
 */
export function resolveMoodDiscoveryPlan(moodId, energy = 50, refreshIndex = 0) {
  const config = MOOD_RECOMMENDATIONS[moodId] || MOOD_RECOMMENDATIONS.dreamy;
  const band = getEnergyBand(energy);
  const refinement = config.energyRefinements[band.key] || config.energyRefinements.balanced;

  const primaryList = refinement.primaryQueries;
  const additionalList = refinement.additionalQueries;

  const primaryQuery = primaryList[refreshIndex % primaryList.length].trim();
  const additionalQuery = additionalList[refreshIndex % additionalList.length].trim();
  const pageTurn = Math.floor(refreshIndex / primaryList.length);

  return {
    moodId: config.moodId,
    directions: config.directions,
    energyBand: band,
    refinementSummary: refinement.summary,
    primaryQuery,
    additionalQuery,
    offset: (pageTurn % 3) * 8,
    preferredMinBpm: refinement.preferredMinBpm ?? null,
    preferredMaxBpm: refinement.preferredMaxBpm ?? null,
    contrastingMoodId: config.contrastingMoodId,
  };
}

/**
 * Deterministically orders returned Audius tracks using real BPM metadata only when provided.
 * Tracks without BPM metadata preserve their original relevance position.
 */
export function rankTracksByEnergyMetadata(tracks, { preferredMinBpm, preferredMaxBpm } = {}) {
  if (!Array.isArray(tracks) || tracks.length <= 1) return tracks || [];

  return tracks
    .map((track, originalIndex) => {
      const availabilityRank = track.isStreamable ? 2 : track.isAvailable ? 1 : 0;
      let bpmScore = 1; // Neutral score when API does not report BPM
      if (
        (preferredMinBpm || preferredMaxBpm) &&
        typeof track.bpm === 'number' &&
        track.bpm > 0
      ) {
        const matchesMin = !preferredMinBpm || track.bpm >= preferredMinBpm;
        const matchesMax = !preferredMaxBpm || track.bpm <= preferredMaxBpm;
        bpmScore = matchesMin && matchesMax ? 2 : 0;
      }
      return { track, availabilityRank, bpmScore, originalIndex };
    })
    .sort((a, b) => {
      if (b.availabilityRank !== a.availabilityRank) {
        return b.availabilityRank - a.availabilityRank;
      }
      if (b.bpmScore !== a.bpmScore) {
        return b.bpmScore - a.bpmScore;
      }
      return a.originalIndex - b.originalIndex;
    })
    .map((entry) => entry.track);
}
