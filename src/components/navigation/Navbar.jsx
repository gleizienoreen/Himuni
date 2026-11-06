import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { HimuniLogo } from '../branding/HimuniLogo';
import { NAV_ITEMS, scrollToSection } from '../../utils/navigation';

export function Navbar({ activeMood = null, headerAudioControl = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [activeNavId, setActiveNavId] = useState('discover');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const accentColor = activeMood?.accent || '#8067E8';

  const isStandaloneSubpage =
    location.pathname === '/search' || location.pathname.startsWith('/soundscapes/');

  // Synchronize route pathname changes with active state and smooth section scroll
  useEffect(() => {
    if (location.pathname === '/search') {
      setActiveNavId('search');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return undefined;
    }

    if (location.pathname.startsWith('/soundscapes/')) {
      setActiveNavId('soundscapes');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return undefined;
    }

    const matched = NAV_ITEMS.find((item) => item.path === location.pathname);
    if (matched) {
      setActiveNavId(matched.id);
      if (matched.id !== 'discover') {
        const timer = setTimeout(() => {
          scrollToSection(matched.sectionId);
        }, 60);
        return () => clearTimeout(timer);
      }
    }
    return undefined;
  }, [location.pathname]);

  // Track subtle header border elevation on scroll
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Observe major editorial sections on Discover to keep active navigation state accurate
  useEffect(() => {
    if (isStandaloneSubpage || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const sectionIds = ['discover', 'mood-spectrum', 'soundscapes', 'search', 'about'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveNavId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-22% 0px -52% 0px',
        threshold: [0.05, 0.2, 0.45],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isStandaloneSubpage, location.pathname]);

  // Close mobile menu on Escape or desktop resize
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleNavSelect = (item, event) => {
    event.preventDefault();
    setActiveNavId(item.id);
    setMobileMenuOpen(false);

    if (item.standaloneRoute) {
      if (location.pathname !== item.path) {
        navigate(item.path);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const comingFromSubpage = isStandaloneSubpage;
    if (location.pathname !== item.path) {
      navigate(item.path, { replace: false });
    }

    if (!comingFromSubpage) {
      requestAnimationFrame(() => {
        if (item.id === 'discover') {
          const prefersReduced =
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          window.scrollTo({
            top: 0,
            behavior: prefersReduced ? 'auto' : 'smooth',
          });
        } else {
          scrollToSection(item.sectionId);
        }
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        isScrolled || mobileMenuOpen
          ? 'bg-cream/95 backdrop-blur-md border-b border-ink/15'
          : 'bg-cream border-b border-ink/10'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:text-cream focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to main content
      </a>

      <div className="mx-auto max-w-editorial px-5 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
        {/* Brand Identity Lockup */}
        <a
          href="/"
          onClick={(e) => handleNavSelect(NAV_ITEMS[0], e)}
          aria-label="HIMUNI — Return to Discover"
          className="group inline-flex items-center py-1 shrink-0"
        >
          <HimuniLogo
            theme="light"
            size="md"
            layout="inline"
            accentColor={accentColor}
          />
        </a>

        {/* Desktop Editorial Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-5 lg:gap-9"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNavId === item.id;
            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => handleNavSelect(item, e)}
                aria-current={isActive ? 'location' : undefined}
                className={`relative py-2 text-sm font-medium tracking-wide whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-ink'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundColor: accentColor }}
                  />
                  <span>{item.label}</span>
                </span>

                {isActive && (
                  <motion.span
                    layoutId={shouldReduceMotion ? undefined : 'active-nav-underline'}
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-ink"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Active Feeling Indicator & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {activeMood && (
            <button
              type="button"
              onClick={() => {
                if (isStandaloneSubpage) {
                  navigate('/');
                  setTimeout(() => scrollToSection('mood-explorer'), 80);
                } else {
                  scrollToSection('mood-explorer');
                }
              }}
              className="hidden xl:inline-flex items-center gap-2 border border-ink/20 bg-cream-soft px-3 py-1.5 text-xs font-medium text-ink hover:border-ink transition-colors"
              aria-label={`Current mood: ${activeMood.name}. Jump to mood selection`}
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full border border-ink/25"
                style={{ backgroundColor: activeMood.accent }}
              />
              <span className="text-ink-muted">Feeling:</span>
              <span className="font-display font-semibold">{activeMood.name}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-primary-nav"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center h-11 w-11 border border-ink/20 bg-cream-soft text-ink hover:border-ink transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Contextual Active Stream Ribbon (only rendered while a track is streaming/paused) */}
      {headerAudioControl}

      {/* Responsive Mobile Navigation Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-primary-nav"
            aria-label="Mobile navigation"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden border-t border-ink/15 bg-cream px-5 py-6 shadow-sm"
          >
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeNavId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.path}
                      onClick={(e) => handleNavSelect(item, e)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`flex items-center justify-between py-3.5 text-lg font-display transition-colors ${
                        isActive ? 'font-semibold text-ink' : 'font-medium text-ink-muted'
                      }`}
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="text-xs font-sans tracking-wideLabel text-ink-subtle">
                          0{idx + 1}
                        </span>
                        <span>{item.label}</span>
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: accentColor }}
                          />
                        )}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-ink-muted" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>

            {activeMood && (
              <div className="mt-5 flex items-center justify-between bg-cream-soft border border-ink/15 px-4 py-3 text-xs">
                <span className="inline-flex items-center gap-2 text-ink">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full border border-ink/25"
                    style={{ backgroundColor: activeMood.accent }}
                  />
                  <span>
                    Selected mood: <strong className="font-display">{activeMood.name}</strong>
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isStandaloneSubpage) {
                      navigate('/');
                      setTimeout(() => scrollToSection('mood-explorer'), 80);
                    } else {
                      scrollToSection('mood-explorer');
                    }
                  }}
                  className="underline font-medium text-ink"
                >
                  Change
                </button>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
