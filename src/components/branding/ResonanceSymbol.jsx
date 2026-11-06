import React from 'react';

/**
 * Abstract resonance-inspired symbol for HIMUNI.
 * Combines radiating upper arcs ("Himig" — melody) with a calm horizon
 * and mirrored lower arc ("Muni-muni" — inner reflection).
 */
export function ResonanceSymbol({
  theme = 'light',
  accentColor = '#8067E8',
  size = 36,
  className = '',
}) {
  const isDarkSurface = theme === 'dark';
  const primaryStroke = isDarkSurface ? '#F5F1EA' : '#24232B';
  const innerUpperStroke = isDarkSurface ? '#E8D98E' : '#24232B';
  const lowerMirrorStroke = isDarkSurface ? '#BBD5DF' : '#24232B';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      {/* Outer sound resonance arc (Himig) */}
      <path
        d="M7.5 19.5C7.5 12.5964 13.0964 7 20 7C26.9036 7 32.5 12.5964 32.5 19.5"
        stroke={primaryStroke}
        strokeWidth="2.35"
        strokeLinecap="round"
      />
      {/* Inner harmonic arc */}
      <path
        d="M13 19.5C13 15.634 16.134 12.5 20 12.5C23.866 12.5 27 15.634 27 19.5"
        stroke={innerUpperStroke}
        strokeWidth="2.05"
        strokeLinecap="round"
        opacity={isDarkSurface ? 0.9 : 0.65}
      />
      {/* Quiet horizon line */}
      <line
        x1="5"
        y1="24"
        x2="35"
        y2="24"
        stroke={primaryStroke}
        strokeWidth="2.15"
        strokeLinecap="round"
      />
      {/* Mirrored reflection arc (Muni-muni) */}
      <path
        d="M12.5 28.2C14.35 31.1 16.95 32.6 20 32.6C23.05 32.6 25.65 31.1 27.5 28.2"
        stroke={lowerMirrorStroke}
        strokeWidth="2.05"
        strokeLinecap="round"
        opacity={isDarkSurface ? 0.82 : 0.52}
      />
      {/* Living mood focal point */}
      <circle
        cx="20"
        cy="19.5"
        r="3.25"
        fill={accentColor}
        style={{ transition: 'fill 320ms ease' }}
      />
    </svg>
  );
}
