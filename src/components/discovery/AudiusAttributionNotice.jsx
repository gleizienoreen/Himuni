import React from 'react';
import { ExternalLink } from 'lucide-react';
import { AUDIUS_CONFIG } from '../../services/audius/audiusConfig';

export function AudiusAttributionNotice({ className = '' }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-5 text-xs text-ink-muted ${className}`}
    >
      <p className="leading-relaxed">
        Music discovery and streaming powered by{' '}
        <a
          href={AUDIUS_CONFIG.webOrigin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-ink underline hover:text-violet-deep inline-flex items-center gap-1"
        >
          <span>Audius</span>
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
        . All tracks and artwork belong to their respective creators; rights and streaming
        availability vary by artist and track.
      </p>
      <span className="uppercase tracking-wideLabel text-[11px] text-ink-subtle">
        Source &middot; Audius API
      </span>
    </div>
  );
}
