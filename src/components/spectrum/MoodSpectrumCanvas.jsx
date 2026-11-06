import React, { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { clamp01, describeSpectrumPosition } from '../../utils/spectrum';

const LABEL_PLACEMENT_ABOVE = new Set(['dreamy', 'romantic', 'joyful', 'calm', 'melancholic']);

/**
 * Interactive 2D Emotional Map for HIMUNI.
 * Horizontal axis: Calm (0) -> Energetic (1)
 * Vertical axis: Introspective (0, bottom) -> Bright (1, top)
 */
export function MoodSpectrumCanvas({
  moods,
  selectedMood,
  coordinates,
  isCustomCoordinates,
  onSelectMood,
  onChangeCoordinates,
}) {
  const stageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const resolvePointerCoordinates = useCallback((clientX, clientY) => {
    const el = stageRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    const padX = rect.width * 0.08;
    const padY = rect.height * 0.1;
    const usableW = rect.width - padX * 2;
    const usableH = rect.height - padY * 2;

    const rawX = (clientX - (rect.left + padX)) / usableW;
    const rawY = 1 - (clientY - (rect.top + padY)) / usableH;

    return {
      x: clamp01(rawX),
      y: clamp01(rawY),
    };
  }, []);

  const handlePointerDown = (e) => {
    if (e.target.closest('[data-mood-node="true"]')) return;

    const next = resolvePointerCoordinates(e.clientX, e.clientY);
    if (!next) return;

    setIsDragging(true);
    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignore capture errors on synthetic events
      }
    }
    onChangeCoordinates(next);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const next = resolvePointerCoordinates(e.clientX, e.clientY);
    if (next) {
      onChangeCoordinates(next);
    }
  };

  const handlePointerEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore release errors
      }
    }
  };

  // Keyboard navigation directly on the 2D emotional pad
  const handleCanvasKeyDown = (e) => {
    const step = e.shiftKey ? 0.1 : 0.03;
    let nextX = coordinates.x;
    let nextY = coordinates.y;
    let handled = true;

    switch (e.key) {
      case 'ArrowRight':
        nextX = clamp01(coordinates.x + step);
        break;
      case 'ArrowLeft':
        nextX = clamp01(coordinates.x - step);
        break;
      case 'ArrowUp':
        nextY = clamp01(coordinates.y + step);
        break;
      case 'ArrowDown':
        nextY = clamp01(coordinates.y - step);
        break;
      case 'Home':
        nextX = selectedMood.coordinates.x;
        nextY = selectedMood.coordinates.y;
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      onChangeCoordinates({ x: nextX, y: nextY });
    }
  };

  // Map normalized [0..1] into the 8%..92% horizontal & 10%..90% vertical stage
  const toStageLeft = (x) => `${8 + x * 84}%`;
  const toStageTop = (y) => `${10 + (1 - y) * 80}%`;

  const cursorLeft = toStageLeft(coordinates.x);
  const cursorTop = toStageTop(coordinates.y);
  const anchorLeft = toStageLeft(selectedMood.coordinates.x);
  const anchorTop = toStageTop(selectedMood.coordinates.y);

  return (
    <div className="space-y-3">
      {/* Top Axis Strip: BRIGHT */}
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wideLabel text-ink-muted px-0.5">
        <span>&larr; Calm</span>
        <span className="font-display font-semibold text-ink">Bright &uarr;</span>
        <span>Energetic &rarr;</span>
      </div>

      {/* Interactive Cartographic Emotional Field */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label={`Mood Spectrum interactive emotional map. Currently ${selectedMood.name}, ${describeSpectrumPosition(
          coordinates
        )}. Use arrow keys to move across Calm to Energetic and Introspective to Bright, or Tab to select a mood landmark.`}
        onKeyDown={handleCanvasKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{ touchAction: 'none' }}
        className={`relative w-full aspect-[10/9] sm:aspect-[16/11] border border-ink bg-cream select-none overflow-hidden ${
          isDragging ? 'cursor-grabbing' : 'cursor-crosshair'
        }`}
      >
        {/* Atmospheric Pigment Washes & Organic Topographic Contours */}
        <svg
          viewBox="0 0 800 550"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <radialGradient id="zone-bright-calm" cx="18%" cy="22%" r="55%">
              <stop offset="0%" stopColor="#8067E8" stopOpacity="0.20" />
              <stop offset="60%" stopColor="#BBD5DF" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#F5F1EA" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="zone-bright-energetic" cx="84%" cy="18%" r="58%">
              <stop offset="0%" stopColor="#E8D98E" stopOpacity="0.46" />
              <stop offset="55%" stopColor="#F18B63" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#F5F1EA" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="zone-introspective-calm" cx="18%" cy="84%" r="54%">
              <stop offset="0%" stopColor="#6878A6" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#F5F1EA" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="zone-introspective-energetic" cx="82%" cy="82%" r="50%">
              <stop offset="0%" stopColor="#D59658" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#E8B8C8" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#F5F1EA" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="550" fill="#F5F1EA" />
          <rect width="800" height="550" fill="url(#zone-bright-calm)" />
          <rect width="800" height="550" fill="url(#zone-bright-energetic)" />
          <rect width="800" height="550" fill="url(#zone-introspective-calm)" />
          <rect width="800" height="550" fill="url(#zone-introspective-energetic)" />

          {/* Organic cartographic contour rings */}
          <path
            d="M 90 275 C 140 110, 340 65, 470 120 C 620 180, 725 140, 740 285 C 755 420, 580 485, 410 455 C 230 425, 45 430, 90 275 Z"
            fill="none"
            stroke="#24232B"
            strokeOpacity="0.09"
            strokeWidth="1.2"
          />
          <path
            d="M 175 280 C 215 165, 360 135, 465 175 C 575 215, 650 200, 655 290 C 660 385, 535 420, 405 398 C 275 376, 140 385, 175 280 Z"
            fill="none"
            stroke="#24232B"
            strokeOpacity="0.09"
            strokeWidth="1.2"
          />
          <ellipse
            cx="415"
            cy="278"
            rx="130"
            ry="82"
            fill="none"
            stroke="#24232B"
            strokeOpacity="0.08"
            strokeWidth="1.1"
          />

          {/* Subtle center compass hairlines */}
          <line
            x1="40"
            y1="275"
            x2="760"
            y2="275"
            stroke="#24232B"
            strokeOpacity="0.13"
            strokeDasharray="4 6"
            strokeWidth="1.1"
          />
          <line
            x1="400"
            y1="32"
            x2="400"
            y2="518"
            stroke="#24232B"
            strokeOpacity="0.13"
            strokeDasharray="4 6"
            strokeWidth="1.1"
          />
        </svg>

        {/* Subtle tether line when exploring custom coordinates away from mood anchor */}
        {isCustomCoordinates && (
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <line
              x1={anchorLeft}
              y1={anchorTop}
              x2={cursorLeft}
              y2={cursorTop}
              stroke="#24232B"
              strokeOpacity="0.35"
              strokeWidth="1.25"
              strokeDasharray="3 4"
            />
          </svg>
        )}

        {/* Predefined Mood Landmarks */}
        {moods.map((mood) => {
          const isCurrentMood = mood.id === selectedMood.id;
          const placeAbove = LABEL_PLACEMENT_ABOVE.has(mood.id);

          return (
            <button
              key={mood.id}
              type="button"
              data-mood-node="true"
              onClick={(e) => {
                e.stopPropagation();
                onSelectMood(mood.id);
              }}
              aria-label={`Select ${mood.name} mood (${mood.spectrumRegion})`}
              aria-pressed={isCurrentMood && !isCustomCoordinates}
              style={{
                left: toStageLeft(mood.coordinates.x),
                top: toStageTop(mood.coordinates.y),
              }}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                isCurrentMood ? 'z-30' : 'z-10'
              }`}
            >
              {/* Node dot */}
              <span
                className={`relative flex items-center justify-center rounded-full border transition-transform duration-200 ${
                  isCurrentMood
                    ? 'h-4 w-4 border-ink scale-110 shadow-sm'
                    : 'h-3.5 w-3.5 border-ink/75 group-hover:scale-125'
                }`}
                style={{ backgroundColor: mood.accent }}
              />

              {/* Collision-free Editorial Landmark Label */}
              <span
                className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-display tracking-tight transition-colors ${
                  placeAbove ? 'bottom-[calc(50%+10px)]' : 'top-[calc(50%+10px)]'
                } ${
                  isCurrentMood
                    ? 'bg-ink text-cream font-semibold'
                    : 'bg-cream/95 text-ink border border-ink/20 font-medium group-hover:border-ink'
                }`}
              >
                {mood.name}
              </span>
            </button>
          );
        })}

        {/* Interactive Selection Resonance Indicator */}
        <motion.div
          aria-hidden="true"
          animate={{
            left: cursorLeft,
            top: cursorTop,
          }}
          transition={
            shouldReduceMotion || isDragging
              ? { duration: 0 }
              : { type: 'spring', stiffness: 320, damping: 30 }
          }
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
        >
          <span
            className="h-11 w-11 sm:h-14 sm:w-14 rounded-full border border-ink/50 flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: `${selectedMood.accent}33` }}
          >
            <span className="h-5 w-5 rounded-full border-2 border-ink bg-cream flex items-center justify-center shadow-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: selectedMood.accent }}
              />
            </span>
          </span>
        </motion.div>
      </div>

      {/* Bottom Axis Strip: INTROSPECTIVE */}
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wideLabel text-ink-muted px-0.5">
        <span>Stillness</span>
        <span className="font-display font-semibold text-ink">Introspective &darr;</span>
        <span>Momentum</span>
      </div>
    </div>
  );
}
