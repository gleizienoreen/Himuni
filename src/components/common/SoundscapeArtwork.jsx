import React from 'react';

/**
 * Bespoke editorial geometric artwork for each HIMUNI Soundscape concept preview.
 */
export function SoundscapeArtwork({ id, className = '' }) {
  switch (id) {
    case 'a-little-sunshine':
      return (
        <svg
          viewBox="0 0 320 180"
          fill="none"
          aria-hidden="true"
          className={`w-full h-full ${className}`}
        >
          <rect width="320" height="180" fill="#FAF3D6" />
          {/* Rising warm solar disc */}
          <circle cx="218" cy="96" r="58" fill="#E8D98E" />
          <path d="M160 96A58 58 0 0 1 276 96H160Z" fill="#F18B63" opacity="0.82" />
          {/* Window blind / horizon lines */}
          <line x1="28" y1="96" x2="292" y2="96" stroke="#24232B" strokeWidth="1.5" />
          <line x1="28" y1="118" x2="248" y2="118" stroke="#24232B" strokeWidth="1.2" opacity="0.45" />
          <line x1="28" y1="138" x2="196" y2="138" stroke="#24232B" strokeWidth="1.2" opacity="0.28" />
          {/* Corner geometric arch */}
          <path d="M36 96C36 62 64 36 98 36V96H36Z" fill="#F5F1EA" stroke="#24232B" strokeWidth="1.4" />
          <circle cx="98" cy="64" r="7" fill="#24232B" />
        </svg>
      );

    case 'midnight-and-morning':
      return (
        <svg
          viewBox="0 0 320 180"
          fill="none"
          aria-hidden="true"
          className={`w-full h-full ${className}`}
        >
          <rect width="320" height="180" fill="#24232B" />
          {/* Overlapping twilight moons */}
          <circle cx="136" cy="90" r="52" fill="#8067E8" opacity="0.88" />
          <circle cx="182" cy="90" r="52" stroke="#BBD5DF" strokeWidth="1.6" />
          <path
            d="M159 44.5C174.5 53.5 185 70.5 185 90C185 109.5 174.5 126.5 159 135.5C143.5 126.5 133 109.5 133 90C133 70.5 143.5 53.5 159 44.5Z"
            fill="#F5F1EA"
            opacity="0.92"
          />
          <line x1="24" y1="148" x2="296" y2="148" stroke="#F5F1EA" strokeWidth="1" opacity="0.3" />
          <circle cx="62" cy="46" r="4" fill="#E8D98E" />
        </svg>
      );

    case 'soft-afternoons':
      return (
        <svg
          viewBox="0 0 320 180"
          fill="none"
          aria-hidden="true"
          className={`w-full h-full ${className}`}
        >
          <rect width="320" height="180" fill="#F8EAEF" />
          {/* Soft botanical / architectural arches */}
          <path d="M54 156V84C54 53.0721 79.0721 28 110 28C140.928 28 166 53.0721 166 84V156H54Z" fill="#E8B8C8" />
          <path
            d="M142 156V96C142 69.4903 163.49 48 190 48C216.51 48 238 69.4903 238 96V156H142Z"
            fill="#F5F1EA"
            stroke="#24232B"
            strokeWidth="1.4"
          />
          <circle cx="242" cy="58" r="24" fill="#E8D98E" opacity="0.9" />
          <line x1="32" y1="156" x2="288" y2="156" stroke="#24232B" strokeWidth="1.5" />
        </svg>
      );

    case 'beautifully-overwhelmed':
      return (
        <svg
          viewBox="0 0 320 180"
          fill="none"
          aria-hidden="true"
          className={`w-full h-full ${className}`}
        >
          <rect width="320" height="180" fill="#FCE5DB" />
          {/* Layered kinetic wave ribbons */}
          <path
            d="M20 132C68 62 114 148 164 78C214 8 252 118 300 44"
            stroke="#8067E8"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.82"
          />
          <path
            d="M20 104C76 150 128 38 184 96C226 140 264 68 300 92"
            stroke="#F18B63"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <circle cx="164" cy="86" r="22" fill="#24232B" />
          <circle cx="164" cy="86" r="6" fill="#F5F1EA" />
        </svg>
      );

    case 'starting-over':
    default:
      return (
        <svg
          viewBox="0 0 320 180"
          fill="none"
          aria-hidden="true"
          className={`w-full h-full ${className}`}
        >
          <rect width="320" height="180" fill="#E4EFF3" />
          {/* Stepped horizon & clear opening doorway */}
          <rect x="44" y="34" width="112" height="112" fill="#BBD5DF" />
          <path d="M156 34L268 90L156 146V34Z" fill="#F5F1EA" stroke="#24232B" strokeWidth="1.4" />
          <circle cx="156" cy="90" r="28" fill="#E8D98E" />
          <line x1="28" y1="90" x2="292" y2="90" stroke="#24232B" strokeWidth="1.4" />
          <circle cx="156" cy="90" r="5" fill="#8067E8" />
        </svg>
      );
  }
}
