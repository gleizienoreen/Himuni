import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Edit3, ExternalLink, X } from 'lucide-react';
import { PostcardCanvas } from './PostcardCanvas';
import { AudiusAttributionNotice } from '../discovery/AudiusAttributionNotice';

export function PostcardPreviewModal({
  postcard,
  onClose,
  onExport = null,
}) {
  if (!postcard) return null;

  const track = postcard.featuredTrack;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl bg-cream border border-ink p-6 sm:p-8 space-y-6 shadow-xl my-8">
        <div className="flex items-center justify-between border-b border-ink/15 pb-4">
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-wideLabel text-ink-muted">
              Sound Postcard Preview
            </span>
            <h2 id="preview-modal-title" className="font-display text-xl sm:text-2xl font-semibold text-ink">
              {postcard.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="inline-flex h-9 w-9 items-center justify-center border border-ink/20 hover:border-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Postcard Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 mx-auto w-full max-w-sm">
            <PostcardCanvas postcard={postcard} />
          </div>

          <div className="md:col-span-5 space-y-5 text-xs text-ink">
            {postcard.subtitle && (
              <div>
                <span className="text-[11px] uppercase tracking-wideLabel text-ink-muted block">
                  Subtitle
                </span>
                <p className="text-sm italic font-sans">{postcard.subtitle}</p>
              </div>
            )}

            {postcard.note && (
              <div>
                <span className="text-[11px] uppercase tracking-wideLabel text-ink-muted block">
                  Personal Reflection
                </span>
                <p className="text-sm font-sans italic bg-cream-soft p-3 border border-ink/10 leading-relaxed">
                  &ldquo;{postcard.note}&rdquo;
                </p>
              </div>
            )}

            {track && (
              <div className="space-y-1.5 pt-2 border-t border-ink/15">
                <span className="text-[11px] uppercase tracking-wideLabel text-ink-muted block">
                  Featured Track
                </span>
                <p className="font-display font-semibold text-sm">
                  {track.titleSnapshot || track.title}
                </p>
                <p className="text-ink-muted">
                  by {track.artistSnapshot || track.artistName} &middot; via Audius
                </p>

                {track.trackUrl && (
                  <a
                    href={track.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium underline text-ink hover:text-violet-deep pt-1"
                  >
                    <span>View track on Audius</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-ink/15 flex flex-wrap gap-2.5">
              <Link
                to={`/postcards/edit/${postcard.id}`}
                onClick={onClose}
                className="inline-flex min-h-[40px] items-center gap-2 bg-ink text-cream px-4 py-2 font-semibold uppercase tracking-wideLabel hover:bg-ink-soft transition-colors text-xs"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Edit Postcard</span>
              </Link>

              {onExport && (
                <button
                  type="button"
                  onClick={() => onExport(postcard)}
                  className="inline-flex min-h-[40px] items-center gap-2 border border-ink bg-cream-soft px-4 py-2 font-semibold uppercase tracking-wideLabel text-ink hover:border-ink transition-colors text-xs"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Export PNG</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <AudiusAttributionNotice className="pt-4 border-t border-ink/10" />
      </div>
    </div>
  );
}
