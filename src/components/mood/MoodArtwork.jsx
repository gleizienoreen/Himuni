import React from 'react';

/**
 * Unique geometric artwork signature for each of the 8 HIMUNI moods.
 */
export function MoodArtwork({ moodId, isSelected = false, className = '' }) {
  switch (moodId) {
    case 'dreamy':
      return (
        <svg viewBox="0 0 140 96" fill="none" aria-hidden="true" className={className}>
          <ellipse
            cx="56"
            cy="48"
            rx="38"
            ry="24"
            fill="#8067E8"
            opacity={isSelected ? '0.9' : '0.68'}
          />
          <ellipse
            cx="88"
            cy="48"
            rx="34"
            ry="22"
            fill="#E8B8C8"
            opacity="0.82"
          />
          <ellipse
            cx="72"
            cy="48"
            rx="44"
            ry="28"
            stroke="#24232B"
            strokeWidth="1.4"
          />
          <circle cx="72" cy="48" r="4.5" fill="#24232B" />
        </svg>
      );

    case 'focused':
      return (
        <svg viewBox="0 0 140 96" fill="none" aria-hidden="true" className={className}>
          <circle cx="70" cy="48" r="34" fill="#BBD5DF" opacity={isSelected ? '0.95' : '0.72'} />
          <circle cx="70" cy="48" r="23" fill="#F5F1EA" stroke="#24232B" strokeWidth="1.4" />
          <circle cx="70" cy="48" r="12" fill="#6FA6BA" />
          <line x1="22" y1="48" x2="42" y2="48" stroke="#24232B" strokeWidth="1.4" />
          <line x1="98" y1="48" x2="118" y2="48" stroke="#24232B" strokeWidth="1.4" />
          <circle cx="70" cy="48" r="3.5" fill="#24232B" />
        </svg>
      );

    case 'melancholic':
      return (
        <svg viewBox="0 0 140 96" fill="none" aria-hidden="true" className={className}>
          <path d="M36 74C36 48.5949 56.5949 28 82 28V74H36Z" fill="#6878A6" opacity="0.88" />
          <line x1="42" y1="18" x2="26" y2="74" stroke="#24232B" strokeWidth="1.4" />
          <line x1="60" y1="18" x2="44" y2="74" stroke="#24232B" strokeWidth="1.4" opacity="0.65" />
          <line x1="102" y1="22" x2="86" y2="78" stroke="#8067E8" strokeWidth="2.2" />
          <line x1="20" y1="74" x2="120" y2="74" stroke="#24232B" strokeWidth="1.4" />
        </svg>
      );

    case 'energetic':
      return (
        <svg viewBox="0 0 140 96" fill="none" aria-hidden="true" className={className}>
          <polygon points="24,72 56,22 76,22 44,72" fill="#F18B63" />
          <polygon points="58,72 90,22 108,22 76,72" fill="#E8D98E" stroke="#24232B" strokeWidth="1.3" />
          <circle cx="108" cy="34" r="11" fill="#24232B" />
          <circle cx="108" cy="34" r="4" fill="#F18B63" />
        </svg>
      );

    case 'romantic':
      return (
        <svg viewBox="0 0 140 96" fill="none" aria-hidden="true" className={className}>
          <circle cx="54" cy="48" r="28" fill="#E8B8C8" />
          <circle cx="86" cy="48" r="28" fill="#F5F1EA" stroke="#24232B" strokeWidth="1.4" />
          <path
            d="M70 25.2C77.7 30.2 82 38.6 82 48C82 57.4 77.7 65.8 70 70.8C62.3 65.8 58 57.4 58 48C58 38.6 62.3 30.2 70 25.2Z"
            fill="#D98EA6"
          />
          <circle cx="70" cy="48" r="3.5" fill="#24232B" />
        </svg>
      );

    case 'nostalgic':
      return (
        <svg viewBox="0 0 140 96" fill="none" aria-hidden="true" className={className}>
          <rect x="28" y="20" width="68" height="52" fill="#E8D98E" stroke="#24232B" strokeWidth="1.3" />
          <rect x="44" y="28" width="68" height="50" fill="#F5F1EA" stroke="#24232B" strokeWidth="1.3" />
          <path d="M54 64C54 50.7452 64.7452 40 78 40C91.2548 40 102 50.7452 102 64H54Z" fill="#D59658" />
          <line x1="48" y1="64" x2="108" y2="64" stroke="#24232B" strokeWidth="1.4" />
        </svg>
      );

    case 'joyful':
      return (
        <svg viewBox="0 0 140 96" fill="none" aria-hidden="true" className={className}>
          <circle cx="70" cy="52" r="24" fill="#E8D98E" />
          <path d="M70 12V22" stroke="#24232B" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M36 24L44 31" stroke="#F18B63" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M104 24L96 31" stroke="#F18B63" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M24 52H36" stroke="#24232B" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M104 52H116" stroke="#24232B" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M46 52A24 24 0 0 1 94 52" stroke="#24232B" strokeWidth="1.5" />
          <circle cx="70" cy="52" r="6" fill="#F18B63" />
        </svg>
      );

    case 'calm':
    default:
      return (
        <svg viewBox="0 0 140 96" fill="none" aria-hidden="true" className={className}>
          <ellipse cx="70" cy="38" rx="22" ry="14" fill="#82B3A0" opacity="0.88" />
          <line x1="22" y1="54" x2="118" y2="54" stroke="#24232B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="34" y1="64" x2="106" y2="64" stroke="#24232B" strokeWidth="1.3" opacity="0.6" strokeLinecap="round" />
          <line x1="48" y1="74" x2="92" y2="74" stroke="#6FA6BA" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}
