import React, { useEffect, useMemo, useState } from 'react';
import { Disc3 } from 'lucide-react';

/**
 * Displays official Audius track artwork directly from provider URLs (never rehosted),
 * falling back across Audius mirror nodes and finally an editorial HIMUNI placeholder.
 */
export function TrackArtwork({
  artworkUrl = '',
  artworkFallbacks = [],
  title = 'Track',
  accentColor = '#8067E8',
  sizeClass = 'w-14 h-14 sm:w-16 sm:h-16',
  className = '',
}) {
  const candidates = useMemo(() => {
    const list = [];
    if (artworkUrl) list.push(artworkUrl);
    if (Array.isArray(artworkFallbacks)) {
      for (const item of artworkFallbacks) {
        if (item && !list.includes(item)) list.push(item);
      }
    }
    return list;
  }, [artworkUrl, artworkFallbacks]);

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setLoaded(false);
  }, [artworkUrl]);

  const activeSrc = candidates[candidateIndex] || '';

  // Advance to the next Audius mirror (or geometric fallback) if a validator node stalls
  useEffect(() => {
    if (!activeSrc || loaded) return undefined;
    const stallTimer = setTimeout(() => {
      setCandidateIndex((prev) => prev + 1);
    }, 3500);
    return () => clearTimeout(stallTimer);
  }, [activeSrc, loaded]);

  return (
    <div
      className={`relative shrink-0 overflow-hidden border border-ink/20 bg-cream-deep ${sizeClass} ${className}`}
    >
      {activeSrc ? (
        <>
          {!loaded && (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cream-deep animate-pulse"
            />
          )}
          <img
            src={activeSrc}
            alt={`Artwork for ${title}`}
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(false);
              setCandidateIndex((prev) => prev + 1);
            }}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="w-full h-full flex flex-col items-center justify-center bg-cream-soft text-ink/70 p-2"
          style={{ backgroundColor: `${accentColor}22` }}
        >
          <Disc3 className="w-5 h-5 text-ink/65" />
        </div>
      )}
    </div>
  );
}
