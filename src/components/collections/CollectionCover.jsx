import React from 'react';
import { getCollectionTheme } from '../../data/collectionThemes';
import { ResonanceSymbol } from '../branding/ResonanceSymbol';
import { BaybayinMark } from '../branding/BaybayinMark';

export function CollectionCover({
  themeId = 'sky-blue',
  name = 'Collection',
  itemCount = 0,
  className = '',
}) {
  const theme = getCollectionTheme(themeId);

  return (
    <div
      style={{
        backgroundColor: theme.color,
        borderColor: theme.border,
        color: theme.text,
      }}
      className={`relative aspect-[16/10] w-full overflow-hidden border p-5 flex flex-col justify-between select-none shadow-sm transition-transform duration-300 group-hover:scale-[1.01] ${className}`}
    >
      {/* Background Decorative SVG Geometry */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {theme.iconStyle === 'arcs' && (
          <svg
            className="absolute -right-8 -top-8 w-48 h-48 opacity-30"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="50" cy="50" r="42" stroke={theme.accent} strokeWidth="2" />
            <circle cx="50" cy="50" r="24" stroke={theme.accent} strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        )}

        {theme.iconStyle === 'sunburst' && (
          <svg
            className="absolute -right-6 -bottom-6 w-48 h-48 opacity-35"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle cx="50" cy="50" r="38" stroke={theme.accent} strokeWidth="2" />
            <path
              d="M50 12 L50 88 M12 50 L88 50"
              stroke={theme.accent}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>
        )}

        {theme.iconStyle === 'waves' && (
          <svg
            className="absolute right-0 bottom-0 w-56 h-36 opacity-30"
            viewBox="0 0 160 100"
            fill="none"
          >
            <path d="M0 40 Q40 10 80 40 T160 40" stroke={theme.accent} strokeWidth="2" />
            <path d="M0 70 Q40 40 80 70 T160 70" stroke={theme.accent} strokeWidth="1.5" />
          </svg>
        )}

        {theme.iconStyle === 'petals' && (
          <svg
            className="absolute -right-8 -bottom-8 w-44 h-44 opacity-30"
            viewBox="0 0 100 100"
            fill="none"
          >
            <ellipse cx="50" cy="50" rx="36" ry="18" stroke={theme.accent} strokeWidth="2" />
            <ellipse cx="50" cy="50" rx="18" ry="36" stroke={theme.accent} strokeWidth="1.5" />
          </svg>
        )}

        {theme.iconStyle === 'orbits' && (
          <svg
            className="absolute -right-10 -bottom-10 w-52 h-52 opacity-30"
            viewBox="0 0 120 120"
            fill="none"
          >
            <circle cx="60" cy="60" r="48" stroke={theme.accent} strokeWidth="1.5" strokeDasharray="5 5" />
            <circle cx="60" cy="60" r="26" fill={theme.accent} fillOpacity="0.25" />
          </svg>
        )}

        {theme.iconStyle === 'resonance' && (
          <svg
            className="absolute -right-6 -bottom-6 w-48 h-48 opacity-25"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path d="M20 50 C20 33 33 20 50 20 C67 20 80 33 80 50" stroke={theme.accent} strokeWidth="2" />
            <line x1="16" y1="58" x2="84" y2="58" stroke={theme.accent} strokeWidth="2" />
          </svg>
        )}
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ResonanceSymbol size={18} color={theme.text} />
          <span className="font-display text-[10px] uppercase font-bold tracking-wider opacity-85">
            Archive
          </span>
          <span aria-hidden="true" className="text-xs opacity-40">
            &middot;
          </span>
          <BaybayinMark theme="light" size="sm" className="opacity-70 text-[11px] text-inherit" />
        </div>

        <span
          style={{ borderColor: theme.border, backgroundColor: 'rgba(255,255,255,0.7)' }}
          className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border rounded-sm"
        >
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Bottom Name Title */}
      <div className="relative z-10 pt-4">
        <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-editorial leading-tight line-clamp-2">
          {name}
        </h3>
      </div>
    </div>
  );
}
