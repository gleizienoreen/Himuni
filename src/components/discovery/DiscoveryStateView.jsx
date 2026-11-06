import React from 'react';
import { AlertCircle, Clock, Music2, RotateCw } from 'lucide-react';

export function TrackListSkeleton({ count = 5 }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading tracks from Audius"
      className="divide-y divide-ink/15 border-y border-ink/15"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="py-4 sm:py-5 flex items-center gap-4">
          <span className="w-6 text-xs text-ink-subtle font-display">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-cream-deep border border-ink/15 animate-pulse shrink-0" />
          <div className="flex-1 min-w-0 space-y-2.5">
            <div className="h-4 w-2/3 sm:w-1/2 bg-cream-deep animate-pulse" />
            <div className="h-3 w-1/3 bg-cream-deep/80 animate-pulse" />
          </div>
          <div className="hidden sm:block h-8 w-24 bg-cream-deep animate-pulse" />
        </div>
      ))}
      <span className="sr-only">Loading music discoveries from Audius...</span>
    </div>
  );
}

export function DiscoveryErrorState({
  error,
  onRetry,
  title = 'Could not load discoveries right now',
}) {
  const isRateLimited = error?.code === 'RATE_LIMITED' || error?.status === 429;
  const Icon = isRateLimited ? Clock : AlertCircle;

  return (
    <div
      role="alert"
      className="border border-ink/25 bg-cream-soft p-6 sm:p-8 space-y-4"
    >
      <div className="flex items-start gap-3.5">
        <Icon className="w-5 h-5 text-ink shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1.5">
          <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
            {isRateLimited ? 'Pausing briefly for Audius rate limits' : title}
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed max-w-xl">
            {error?.message ||
              'The Audius discovery network did not respond in time. Please try again in a moment.'}
          </p>
          {isRateLimited && error?.retryAfterSeconds && (
            <p className="text-xs text-ink-subtle">
              Suggested wait: ~{error.retryAfterSeconds} seconds before retrying.
            </p>
          )}
        </div>
      </div>

      {onRetry && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-ink text-cream px-4 py-2.5 text-xs uppercase tracking-wideLabel font-semibold hover:bg-ink-soft transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Try again</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function DiscoveryEmptyState({
  heading = 'No matching tracks found',
  description = 'Try exploring an adjacent mood, adjusting your energy preference, or broadening your search terms.',
  actionLabel = '',
  onAction = null,
}) {
  return (
    <div className="border border-ink/20 bg-cream-soft/75 p-6 sm:p-8 space-y-4">
      <div className="flex items-start gap-3.5">
        <Music2 className="w-5 h-5 text-ink-muted shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1.5">
          <h3 className="font-display text-lg sm:text-xl font-semibold text-ink">
            {heading}
          </h3>
          <p className="text-sm text-ink-muted leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </div>

      {actionLabel && onAction && (
        <div>
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 border border-ink/30 bg-cream px-4 py-2 text-xs uppercase tracking-wideLabel font-semibold text-ink hover:border-ink transition-colors"
          >
            <span>{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}
