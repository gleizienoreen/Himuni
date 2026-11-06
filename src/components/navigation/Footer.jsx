import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUp, ExternalLink } from 'lucide-react';
import { BRAND } from '../../data/brand';
import { AUDIUS_CONFIG } from '../../services/audius/audiusConfig';
import { HimuniLogo } from '../branding/HimuniLogo';
import { NAV_ITEMS, scrollToSection } from '../../utils/navigation';

export function Footer({ activeMood = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const accentColor = activeMood?.accent || '#8067E8';

  const handleLinkClick = (item, e) => {
    e.preventDefault();
    if (item.standaloneRoute) {
      if (location.pathname !== item.path) {
        navigate(item.path);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const comingFromSubpage =
      location.pathname === '/search' || location.pathname.startsWith('/soundscapes/');

    if (location.pathname !== item.path) {
      navigate(item.path);
    }

    if (!comingFromSubpage) {
      if (item.id === 'discover') {
        const prefersReduced =
          window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
      } else {
        scrollToSection(item.sectionId);
      }
    }
  };

  const scrollToTop = () => {
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  return (
    <footer className="bg-ink text-cream border-t border-cream/15">
      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-cream/15">
          <div className="md:col-span-6 space-y-4">
            <HimuniLogo
              theme="dark"
              size="lg"
              layout="stacked-wordmark"
              accentColor={accentColor}
            />
            <p className="text-sm sm:text-base text-cream/80 max-w-md leading-relaxed pt-2">
              {BRAND.statement}
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="text-xs uppercase tracking-wideLabel text-cream/55">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.path}
                    onClick={(e) => handleLinkClick(item, e)}
                    className="text-cream/80 hover:text-cream transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wideLabel text-cream/55">
                Etymology
              </p>
              <p className="text-sm text-cream/80 leading-relaxed">
                <em className="italic text-butter">Himig</em> (melody) &amp;{' '}
                <em className="italic text-sky">Muni-muni</em> (reflection)
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 border border-cream/25 px-4 py-2 text-xs uppercase tracking-wideLabel text-cream hover:bg-cream hover:text-ink transition-colors"
              >
                <span>Back to top</span>
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-cream/55">
          <p>
            {BRAND.name} &middot; {BRAND.tagline}
          </p>
          <p className="inline-flex flex-wrap items-center gap-1.5">
            <span>Mood-led Music Discovery &middot; Music powered by</span>
            <a
              href={AUDIUS_CONFIG.webOrigin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/85 underline hover:text-cream inline-flex items-center gap-1"
            >
              <span>Audius</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
