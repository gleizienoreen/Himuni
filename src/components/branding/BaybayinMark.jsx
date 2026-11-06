import React from 'react';
import { BRAND } from '../../data/brand';

/**
 * Renders the Baybayin companion inscription (ᜑᜒᜋᜓᜈᜒ) using Noto Sans Tagalog
 * with accessible labeling so assistive technologies announce its meaning clearly.
 */
export function BaybayinMark({
  className = '',
  decorative = false,
  label = BRAND.baybayinLabel,
}) {
  if (decorative) {
    return (
      <span
        lang="tl-Tglg"
        aria-hidden="true"
        className={`font-baybayin select-none tracking-[0.08em] ${className}`}
      >
        {BRAND.baybayin}
      </span>
    );
  }

  return (
    <span
      lang="tl-Tglg"
      role="img"
      aria-label={label}
      title={label}
      className={`font-baybayin tracking-[0.08em] ${className}`}
    >
      {BRAND.baybayin}
    </span>
  );
}
