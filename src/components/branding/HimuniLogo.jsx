import React from 'react';
import { BRAND } from '../../data/brand';
import { ResonanceSymbol } from './ResonanceSymbol';
import { BaybayinMark } from './BaybayinMark';

const SIZE_MAP = {
  sm: {
    symbol: 30,
    wordmark: 'text-lg',
    baybayin: 'text-[11px]',
    gap: 'gap-2.5',
  },
  md: {
    symbol: 36,
    wordmark: 'text-xl sm:text-[22px]',
    baybayin: 'text-xs',
    gap: 'gap-3',
  },
  lg: {
    symbol: 48,
    wordmark: 'text-2xl sm:text-3xl',
    baybayin: 'text-sm sm:text-[15px]',
    gap: 'gap-3.5',
  },
};

/**
 * Primary HIMUNI brand lockup featuring the abstract Resonance Symbol,
 * primary Latin-script wordmark (HIMUNI), and Baybayin companion mark (ᜑᜒᜋᜓᜈᜒ).
 * Supports both 'light' (Warm Cream surface) and 'dark' (Ink surface) treatments.
 */
export function HimuniLogo({
  theme = 'light',
  size = 'md',
  layout = 'stacked-wordmark',
  accentColor = '#8067E8',
  className = '',
}) {
  const isDarkSurface = theme === 'dark';
  const metrics = SIZE_MAP[size] || SIZE_MAP.md;

  const wordmarkColor = isDarkSurface ? 'text-cream' : 'text-ink';
  const baybayinColor = isDarkSurface ? 'text-butter' : 'text-ink-muted';
  const dividerColor = isDarkSurface ? 'bg-cream/25' : 'bg-ink/20';

  return (
    <span className={`inline-flex items-center ${metrics.gap} ${className}`}>
      <ResonanceSymbol
        theme={theme}
        accentColor={accentColor}
        size={metrics.symbol}
      />

      {layout === 'inline' ? (
        <span className="inline-flex items-baseline gap-2.5">
          <span
            className={`font-display font-bold tracking-editorial leading-none ${metrics.wordmark} ${wordmarkColor}`}
          >
            {BRAND.name}
          </span>
          <span aria-hidden="true" className={`h-3.5 w-px self-center ${dividerColor}`} />
          <BaybayinMark
            className={`leading-none ${metrics.baybayin} ${baybayinColor}`}
          />
        </span>
      ) : (
        <span className="flex flex-col leading-none">
          <span
            className={`font-display font-bold tracking-editorial ${metrics.wordmark} ${wordmarkColor}`}
          >
            {BRAND.name}
          </span>
          <BaybayinMark
            className={`mt-1 ${metrics.baybayin} ${baybayinColor}`}
          />
        </span>
      )}
    </span>
  );
}
