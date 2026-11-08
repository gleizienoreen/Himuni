import React from 'react';
import { getMoodById } from '../../data/moods';
import { getPostcardLayout, getPostcardTheme } from '../../data/postcardThemes';
import { ResonanceSymbol } from '../branding/ResonanceSymbol';
import { BaybayinMark } from '../branding/BaybayinMark';

/**
 * Live Postcard Canvas rendering the exact composition across themes and layouts.
 * Uses original abstract geometric shapes and editorial typography.
 * Avoids third-party remote images to guarantee safe, cross-origin-free PNG export.
 */
export function PostcardCanvas({
  postcard,
  containerRef = null,
  isExporting = false,
  className = '',
}) {
  const theme = getPostcardTheme(postcard?.themeId);
  const layout = getPostcardLayout(postcard?.layoutId);
  const mood = getMoodById(postcard?.moodId || 'dreamy');

  const title = postcard?.title?.trim() || 'Untitled Postcard';
  const subtitle = postcard?.subtitle?.trim() || '';
  const note = postcard?.note?.trim() || '';
  const track = postcard?.featuredTrack || null;
  const energy = typeof postcard?.energy === 'number' ? postcard.energy : 50;

  const typography = postcard?.typography || { alignment: 'left', style: 'editorial' };
  const alignmentClass =
    typography.alignment === 'center'
      ? 'text-center items-center'
      : typography.alignment === 'right'
      ? 'text-right items-end'
      : 'text-left items-start';

  const fontClass =
    typography.style === 'sans'
      ? 'font-sans'
      : typography.style === 'display'
      ? 'font-display font-bold'
      : 'font-display font-semibold';

  // Format date stamp cleanly
  const dateStamp = postcard?.createdAt
    ? new Date(postcard.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  const { palette } = theme;

  return (
    <div
      ref={containerRef}
      data-postcard-canvas="true"
      style={{
        backgroundColor: palette.cardBg,
        borderColor: palette.border,
        color: palette.text,
      }}
      className={`relative w-full aspect-[4/5] overflow-hidden border flex flex-col justify-between p-6 sm:p-8 md:p-10 select-none shadow-sm transition-colors duration-300 ${className}`}
    >
      {/* Abstract Geometric Background Graphics based on Theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {theme.visualStyle === 'arcs' && (
          <svg
            className="absolute -right-16 -top-16 w-72 h-72 sm:w-88 sm:h-88 opacity-35"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="100" cy="100" r="85" stroke={palette.primary} strokeWidth="2.5" />
            <circle cx="100" cy="100" r="55" stroke={palette.secondary} strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="25" fill={palette.primary} fillOpacity="0.25" />
          </svg>
        )}

        {theme.visualStyle === 'sunburst' && (
          <svg
            className="absolute -left-12 -bottom-12 w-80 h-80 opacity-30"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="100" cy="100" r="80" stroke={palette.secondary} strokeWidth="2" />
            <path
              d="M100 20 L100 180 M20 100 L180 100 M43 43 L157 157 M43 157 L157 43"
              stroke={palette.primary}
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <circle cx="100" cy="100" r="32" fill={palette.secondary} fillOpacity="0.35" />
          </svg>
        )}

        {theme.visualStyle === 'waves' && (
          <svg
            className="absolute -right-8 bottom-0 w-84 h-64 opacity-30"
            viewBox="0 0 240 180"
            fill="none"
          >
            <path
              d="M0 60 Q60 20 120 60 T240 60"
              stroke={palette.primary}
              strokeWidth="2.5"
            />
            <path
              d="M0 100 Q60 60 120 100 T240 100"
              stroke={palette.secondary}
              strokeWidth="2"
            />
            <path
              d="M0 140 Q60 100 120 140 T240 140"
              stroke={palette.primary}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>
        )}

        {theme.visualStyle === 'petals' && (
          <svg
            className="absolute -right-10 -bottom-10 w-72 h-72 opacity-30"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M100 10 C140 50 140 150 100 190 C60 150 60 50 100 10 Z"
              fill={palette.secondary}
              fillOpacity="0.3"
            />
            <path
              d="M10 100 C50 60 150 60 190 100 C150 140 50 140 10 100 Z"
              fill={palette.primary}
              fillOpacity="0.25"
            />
          </svg>
        )}

        {theme.visualStyle === 'minimal' && (
          <svg
            className="absolute inset-0 w-full h-full opacity-15"
            viewBox="0 0 400 500"
            fill="none"
          >
            <line x1="32" y1="32" x2="368" y2="32" stroke={palette.primary} strokeWidth="1" />
            <line x1="32" y1="468" x2="368" y2="468" stroke={palette.primary} strokeWidth="1" />
            <circle cx="200" cy="250" r="4" fill={palette.primary} />
          </svg>
        )}
      </div>

      {/* TOP BAR: Brand Lockup + Date + Mood Badge */}
      <header className="relative z-10 flex items-center justify-between gap-3 border-b pb-3.5" style={{ borderColor: palette.border }}>
        <div className="flex items-center gap-2.5">
          <ResonanceSymbol size={22} color={palette.text} />
          <span className="font-display text-xs font-bold tracking-tight uppercase">
            HIMUNI
          </span>
          <span aria-hidden="true" className="text-xs opacity-40">
            &middot;
          </span>
          <BaybayinMark
            theme="light"
            size="sm"
            className="opacity-75 text-xs text-inherit"
          />
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium tracking-wide">
          <span
            style={{
              backgroundColor: mood?.accent || palette.primary,
              borderColor: palette.border,
            }}
            className="inline-block h-2 w-2 rounded-full border shrink-0"
          />
          <span className="uppercase tracking-wider font-semibold">
            {mood?.name || 'Dreamy'}
          </span>
          <span aria-hidden="true" className="opacity-40">
            &middot;
          </span>
          <span className="tabular-nums opacity-75">{energy}%</span>
        </div>
      </header>

      {/* CENTER: Composition according to layout variant */}
      <div className={`relative z-10 my-auto py-4 flex flex-col ${alignmentClass} space-y-3.5`}>
        {layout.id === 'editorial' && (
          <>
            <p
              style={{ color: palette.textSubtle }}
              className="text-[11px] uppercase tracking-wideLabel font-semibold"
            >
              Sound Postcard &middot; {dateStamp}
            </p>
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl tracking-tight leading-[1.1] max-w-full break-words ${fontClass}`}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{ color: palette.textMuted }}
                className="text-xs sm:text-sm italic font-sans max-w-prose leading-relaxed line-clamp-2"
              >
                {subtitle}
              </p>
            )}
            {note && (
              <blockquote
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  color: palette.text,
                }}
                className="mt-2 border-l-2 p-3 sm:p-4 text-xs sm:text-sm font-sans leading-relaxed line-clamp-4 italic max-w-md"
              >
                &ldquo;{note}&rdquo;
              </blockquote>
            )}
          </>
        )}

        {layout.id === 'minimal' && (
          <div className="w-full space-y-4">
            <div className="space-y-1.5">
              <span
                style={{ color: palette.textSubtle }}
                className="text-[10px] uppercase tracking-widest font-mono"
              >
                NO. {dateStamp}
              </span>
              <h2
                className={`text-2xl sm:text-3xl tracking-editorial leading-tight max-w-full break-words ${fontClass}`}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  style={{ color: palette.textMuted }}
                  className="text-xs font-sans tracking-wide uppercase text-[11px]"
                >
                  {subtitle}
                </p>
              )}
            </div>

            {note && (
              <p
                style={{ color: palette.textMuted }}
                className="text-xs sm:text-sm font-sans leading-relaxed line-clamp-3 pt-2"
              >
                {note}
              </p>
            )}
          </div>
        )}

        {layout.id === 'abstract' && (
          <>
            {/* Expressive geometric badge */}
            <div
              style={{ borderColor: palette.border, backgroundColor: palette.surface }}
              className="inline-flex items-center gap-2 border px-3 py-1 text-[11px] font-semibold uppercase tracking-wideLabel"
            >
              <span>{mood?.name || 'Feeling'}</span>
              <span>&middot;</span>
              <span>{energy}% Resonance</span>
            </div>

            <h2
              className={`text-3xl sm:text-4xl md:text-5xl tracking-editorial leading-none max-w-full break-words ${fontClass}`}
            >
              {title}
            </h2>

            {subtitle && (
              <p
                style={{ color: palette.textMuted }}
                className="text-xs sm:text-sm font-sans italic line-clamp-2"
              >
                {subtitle}
              </p>
            )}

            {note && (
              <div
                style={{ backgroundColor: palette.surface }}
                className="p-3 text-xs sm:text-sm font-sans leading-relaxed line-clamp-3 border border-ink/10"
              >
                {note}
              </div>
            )}
          </>
        )}

        {layout.id === 'memory' && (
          <div className="w-full space-y-4">
            <span
              style={{ color: palette.textSubtle }}
              className="text-[11px] uppercase tracking-wideLabel font-semibold"
            >
              A Personal Moment &middot; {dateStamp}
            </span>

            <h2 className={`text-xl sm:text-2xl tracking-tight leading-snug ${fontClass}`}>
              {title}
            </h2>

            {note ? (
              <div
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                }}
                className="border p-4 sm:p-5 text-sm sm:text-base font-sans leading-relaxed italic line-clamp-5"
              >
                &ldquo;{note}&rdquo;
              </div>
            ) : (
              subtitle && (
                <p style={{ color: palette.textMuted }} className="text-sm font-sans italic">
                  {subtitle}
                </p>
              )
            )}
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER: Featured Audius Track & Attribution */}
      <footer
        className="relative z-10 pt-3 border-t flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 text-xs"
        style={{ borderColor: palette.border }}
      >
        <div className="min-w-0 flex-1 space-y-0.5">
          <p
            style={{ color: palette.textSubtle }}
            className="text-[10px] uppercase tracking-wideLabel font-semibold"
          >
            Featured Sound
          </p>
          {track ? (
            <p className="truncate font-display font-medium text-xs sm:text-sm">
              <span className="font-semibold">{track.titleSnapshot || track.title}</span>
              <span style={{ color: palette.textMuted }}>
                {' '}
                &middot; {track.artistSnapshot || track.artistName}
              </span>
            </p>
          ) : (
            <p style={{ color: palette.textMuted }} className="text-xs italic">
              No track attached
            </p>
          )}
        </div>

        <div className="shrink-0 flex items-center justify-between sm:justify-end gap-2 text-[10px] text-ink-subtle">
          <span style={{ color: palette.textSubtle }}>via Audius</span>
          <span aria-hidden="true">&middot;</span>
          <span style={{ color: palette.textSubtle }}>HIMUNI</span>
        </div>
      </footer>
    </div>
  );
}
