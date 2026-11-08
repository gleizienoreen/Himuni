import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Disc3,
  Download,
  ExternalLink,
  Layers,
  Music,
  Palette,
  Save,
  Sliders,
  Type,
} from 'lucide-react';
import { MOODS } from '../../data/moods';
import {
  POSTCARD_LAYOUTS,
  POSTCARD_THEMES,
  TYPOGRAPHY_ALIGNMENTS,
  TYPOGRAPHY_STYLES,
} from '../../data/postcardThemes';
import { PostcardCanvas } from './PostcardCanvas';
import { PostcardTrackPickerModal } from './PostcardTrackPickerModal';
import { TrackArtwork } from '../discovery/TrackArtwork';
import { exportPostcardAsPng } from '../../services/postcards/postcardExport';

export function PostcardEditor({
  initialPostcard = null,
  onSave,
}) {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [draft, setDraft] = useState(() => ({
    id: initialPostcard?.id || undefined,
    title: initialPostcard?.title || '',
    subtitle: initialPostcard?.subtitle || '',
    note: initialPostcard?.note || '',
    moodId: initialPostcard?.moodId || 'dreamy',
    energy: typeof initialPostcard?.energy === 'number' ? initialPostcard.energy : 50,
    featuredTrack: initialPostcard?.featuredTrack || null,
    themeId: initialPostcard?.themeId || 'lavender-dream',
    layoutId: initialPostcard?.layoutId || 'editorial',
    typography: {
      alignment: initialPostcard?.typography?.alignment || 'left',
      style: initialPostcard?.typography?.style || 'editorial',
    },
    createdAt: initialPostcard?.createdAt || undefined,
  }));

  const [activeTab, setActiveTab] = useState('design'); // For mobile: 'design' | 'canvas' | 'summary'
  const [trackPickerOpen, setTrackPickerOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [exportNotice, setExportNotice] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleFieldChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleTypographyChange = (key, val) => {
    setDraft((prev) => ({
      ...prev,
      typography: { ...prev.typography, [key]: val },
    }));
  };

  const handleTrackSelected = (audiusTrack) => {
    const trackSnapshot = {
      provider: 'audius',
      trackId: audiusTrack.id,
      title: audiusTrack.title,
      titleSnapshot: audiusTrack.title,
      artistName: audiusTrack.artistName,
      artistSnapshot: audiusTrack.artistName,
      artistUrl: audiusTrack.artistUrl,
      trackUrl: audiusTrack.trackUrl,
      artworkUrl: audiusTrack.artworkUrl,
      duration: audiusTrack.duration,
      genre: audiusTrack.genre,
    };
    handleFieldChange('featuredTrack', trackSnapshot);
  };

  const validate = () => {
    const errs = {};
    if (!draft.title.trim()) {
      errs.title = 'Postcard title is required.';
    }
    if (!draft.featuredTrack) {
      errs.featuredTrack = 'A featured Audius track is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setActiveTab('design');
      return;
    }
    const saved = onSave(draft);
    if (saved) {
      navigate('/postcards');
    }
  };

  const handleExport = async () => {
    if (!validate()) {
      setActiveTab('design');
      return;
    }
    setIsExporting(true);
    setExportNotice({ message: 'Rendering high-resolution PNG...', type: 'info' });
    try {
      const res = await exportPostcardAsPng(draft, canvasRef.current);
      if (res.success) {
        setExportNotice({
          message: `Saved ${res.filename} to downloads.`,
          type: 'success',
        });
        setTimeout(() => setExportNotice(null), 4000);
      } else {
        setExportNotice({ message: res.error || 'Export failed.', type: 'error' });
      }
    } catch (err) {
      setExportNotice({ message: err?.message || 'Export error.', type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  const selectedMood = MOODS.find((m) => m.id === draft.moodId) || MOODS[0];

  return (
    <div className="bg-cream min-h-screen flex flex-col">
      {/* Top action bar */}
      <header className="border-b border-ink/15 bg-cream-soft sticky top-20 z-30 px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/postcards')}
            className="inline-flex min-h-[38px] items-center gap-1.5 text-xs uppercase tracking-wideLabel font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Postcards Gallery</span>
          </button>
          <span className="text-ink-subtle">|</span>
          <span className="font-display font-semibold text-sm text-ink truncate max-w-[12rem] sm:max-w-md">
            {draft.title || 'New Sound Postcard'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex min-h-[38px] items-center gap-1.5 border border-ink/25 bg-cream px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wideLabel text-ink hover:border-ink transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export PNG</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex min-h-[38px] items-center gap-1.5 bg-ink text-cream px-4 py-1.5 text-xs font-semibold uppercase tracking-wideLabel hover:bg-ink-soft transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Save Postcard</span>
          </button>
        </div>
      </header>

      {/* Export notification status */}
      {exportNotice && (
        <div
          role="status"
          className={`px-5 py-2.5 text-xs flex items-center justify-between border-b ${
            exportNotice.type === 'error'
              ? 'bg-red-50 border-red-300 text-red-900'
              : exportNotice.type === 'success'
              ? 'bg-green-50 border-green-300 text-green-900'
              : 'bg-cream-deep border-ink/20 text-ink'
          }`}
        >
          <span>{exportNotice.message}</span>
          <button
            type="button"
            onClick={() => setExportNotice(null)}
            className="underline font-semibold text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-ink/15 bg-cream-soft text-xs font-semibold uppercase tracking-wideLabel">
        <button
          type="button"
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'design'
              ? 'border-ink text-ink bg-cream font-bold'
              : 'border-transparent text-ink-muted'
          }`}
        >
          Controls
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('canvas')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'canvas'
              ? 'border-ink text-ink bg-cream font-bold'
              : 'border-transparent text-ink-muted'
          }`}
        >
          Live Canvas
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeTab === 'summary'
              ? 'border-ink text-ink bg-cream font-bold'
              : 'border-transparent text-ink-muted'
          }`}
        >
          Properties
        </button>
      </div>

      {/* Three-Panel Creative Workspace */}
      <div className="flex-1 max-w-editorial mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================== */}
        {/* LEFT PANEL: Design and Content Controls                         */}
        {/* ============================================================== */}
        <aside
          aria-label="Design controls"
          className={`lg:col-span-4 space-y-6 ${
            activeTab === 'design' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="border border-ink/20 bg-cream-soft p-5 sm:p-6 space-y-5">
            <h2 className="font-display text-lg font-semibold tracking-tight text-ink flex items-center gap-2">
              <Palette className="w-4 h-4" aria-hidden="true" />
              <span>Design &amp; Words</span>
            </h2>

            {/* Postcard Title (Required) */}
            <div className="space-y-1.5">
              <label
                htmlFor="postcard-title"
                className="block text-xs font-semibold uppercase tracking-wideLabel text-ink"
              >
                Postcard Title <span className="text-red-700">*</span>
              </label>
              <input
                id="postcard-title"
                type="text"
                value={draft.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. Somewhere Between Dreams"
                className={`w-full border bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none ${
                  errors.title ? 'border-red-600 ring-1 ring-red-600' : 'border-ink/25'
                }`}
              />
              {errors.title && (
                <p role="alert" className="text-xs text-red-700 font-medium">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Subtitle / Moment (Optional) */}
            <div className="space-y-1.5">
              <label
                htmlFor="postcard-subtitle"
                className="block text-xs font-semibold uppercase tracking-wideLabel text-ink-muted"
              >
                Subtitle or Moment <span className="text-ink-subtle">(Optional)</span>
              </label>
              <input
                id="postcard-subtitle"
                type="text"
                value={draft.subtitle}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                placeholder="e.g. Late night thoughts after the rain"
                className="w-full border border-ink/25 bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
              />
            </div>

            {/* Personal Note (Optional) */}
            <div className="space-y-1.5">
              <label
                htmlFor="postcard-note"
                className="block text-xs font-semibold uppercase tracking-wideLabel text-ink-muted"
              >
                Personal Reflection <span className="text-ink-subtle">(Optional)</span>
              </label>
              <textarea
                id="postcard-note"
                rows={3}
                value={draft.note}
                onChange={(e) => handleFieldChange('note', e.target.value)}
                placeholder="Write a sentence or quotation that captures how this melody felt..."
                className="w-full border border-ink/25 bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
              />
            </div>

            {/* Featured Track Selection (Required) */}
            <div className="space-y-2 pt-2 border-t border-ink/15">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wideLabel text-ink flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Featured Sound</span>
                  <span className="text-red-700">*</span>
                </span>
                {draft.featuredTrack && (
                  <button
                    type="button"
                    onClick={() => setTrackPickerOpen(true)}
                    className="text-xs text-ink underline font-medium hover:text-violet-deep"
                  >
                    Change track
                  </button>
                )}
              </div>

              {draft.featuredTrack ? (
                <div className="border border-ink/20 bg-cream p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-display font-semibold text-sm text-ink truncate">
                      {draft.featuredTrack.titleSnapshot || draft.featuredTrack.title}
                    </p>
                    <p className="text-xs text-ink-muted truncate">
                      {draft.featuredTrack.artistSnapshot || draft.featuredTrack.artistName}{' '}
                      &middot; via Audius
                    </p>
                  </div>
                  <TrackArtwork
                    artworkUrl={draft.featuredTrack.artworkUrl}
                    title={draft.featuredTrack.title}
                    sizeClass="w-10 h-10"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setTrackPickerOpen(true)}
                  className={`w-full border-2 border-dashed p-4 text-center text-xs font-semibold uppercase tracking-wideLabel transition-colors ${
                    errors.featuredTrack
                      ? 'border-red-600 text-red-700 bg-red-50/50'
                      : 'border-ink/30 text-ink hover:border-ink hover:bg-cream'
                  }`}
                >
                  <Music className="w-5 h-5 mx-auto mb-1 text-ink-muted" aria-hidden="true" />
                  <span>+ Attach an Audius Track</span>
                </button>
              )}

              {errors.featuredTrack && (
                <p role="alert" className="text-xs text-red-700 font-medium">
                  {errors.featuredTrack}
                </p>
              )}
            </div>

            {/* Mood Selection */}
            <div className="space-y-2 pt-2 border-t border-ink/15">
              <label
                htmlFor="postcard-mood-select"
                className="block text-xs font-semibold uppercase tracking-wideLabel text-ink"
              >
                Associated Mood
              </label>
              <select
                id="postcard-mood-select"
                value={draft.moodId}
                onChange={(e) => handleFieldChange('moodId', e.target.value)}
                className="w-full border border-ink/25 bg-cream px-3 py-2 text-sm text-ink font-medium focus:outline-none"
              >
                {MOODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.description})
                  </option>
                ))}
              </select>
            </div>

            {/* Themes Palette Selection */}
            <div className="space-y-2 pt-2 border-t border-ink/15">
              <label className="block text-xs font-semibold uppercase tracking-wideLabel text-ink">
                Color Theme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {POSTCARD_THEMES.map((theme) => {
                  const isSelected = draft.themeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleFieldChange('themeId', theme.id)}
                      className={`p-2.5 border text-left flex items-center justify-between gap-2 transition-colors ${
                        isSelected
                          ? 'border-ink bg-cream ring-1 ring-ink'
                          : 'border-ink/20 bg-cream/70 hover:border-ink'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          aria-hidden="true"
                          className="h-3 w-3 rounded-full border border-ink/25 shrink-0"
                          style={{ backgroundColor: theme.palette.primary }}
                        />
                        <span className="text-xs font-medium truncate">
                          {theme.name}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layouts Selection */}
            <div className="space-y-2 pt-2 border-t border-ink/15">
              <label className="block text-xs font-semibold uppercase tracking-wideLabel text-ink flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Composition Layout</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {POSTCARD_LAYOUTS.map((ly) => {
                  const isSelected = draft.layoutId === ly.id;
                  return (
                    <button
                      key={ly.id}
                      type="button"
                      onClick={() => handleFieldChange('layoutId', ly.id)}
                      className={`p-2.5 border text-left transition-colors ${
                        isSelected
                          ? 'border-ink bg-cream ring-1 ring-ink font-semibold'
                          : 'border-ink/20 bg-cream/70 hover:border-ink'
                      }`}
                    >
                      <span className="block text-xs text-ink">{ly.name}</span>
                      <span className="block text-[10px] text-ink-muted line-clamp-1">
                        {ly.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Options */}
            <div className="space-y-2 pt-2 border-t border-ink/15">
              <label className="block text-xs font-semibold uppercase tracking-wideLabel text-ink flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Typography</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={draft.typography?.style || 'editorial'}
                  onChange={(e) => handleTypographyChange('style', e.target.value)}
                  aria-label="Typography style"
                  className="border border-ink/25 bg-cream px-2.5 py-1.5 text-xs text-ink focus:outline-none"
                >
                  {TYPOGRAPHY_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  value={draft.typography?.alignment || 'left'}
                  onChange={(e) => handleTypographyChange('alignment', e.target.value)}
                  aria-label="Typography alignment"
                  className="border border-ink/25 bg-cream px-2.5 py-1.5 text-xs text-ink focus:outline-none"
                >
                  {TYPOGRAPHY_ALIGNMENTS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* CENTER PANEL: Live Postcard Canvas Preview                     */}
        {/* ============================================================== */}
        <main
          aria-label="Live canvas workspace"
          className={`lg:col-span-5 flex flex-col items-center justify-center ${
            activeTab === 'canvas' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <div className="w-full max-w-md sticky top-36 space-y-3">
            <div className="flex items-center justify-between text-xs text-ink-muted pb-1 px-1">
              <span className="uppercase tracking-wideLabel text-[11px] font-semibold">
                Live Canvas &middot; 4:5 Export Ratio
              </span>
              <span>1200 &times; 1500 px</span>
            </div>

            {/* Live responsive canvas */}
            <div className="border border-ink/30 p-2 sm:p-3 bg-cream-deep/40 shadow-sm">
              <PostcardCanvas
                containerRef={canvasRef}
                postcard={draft}
              />
            </div>

            <p className="text-[11px] text-ink-subtle text-center pt-1 leading-relaxed">
              Designed with original abstract geometry and typography. Safely exports as PNG
              without remote CORS restrictions.
            </p>
          </div>
        </main>

        {/* ============================================================== */}
        {/* RIGHT PANEL: Properties, Track Metadata, Export Actions        */}
        {/* ============================================================== */}
        <aside
          aria-label="Postcard properties"
          className={`lg:col-span-3 space-y-6 ${
            activeTab === 'summary' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="border border-ink/20 bg-cream-soft p-5 space-y-5 text-xs">
            <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
              <Sliders className="w-4 h-4" aria-hidden="true" />
              <span>Card Properties</span>
            </h3>

            {/* Mood Summary */}
            <div className="space-y-1.5 pb-3 border-b border-ink/15">
              <span className="text-[11px] uppercase tracking-wideLabel text-ink-muted">
                Emotional Resonance
              </span>
              <div className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-full border border-ink/25"
                  style={{ backgroundColor: selectedMood.accent }}
                />
                <span>{selectedMood.name}</span>
              </div>
              <p className="text-ink-muted text-[11px] leading-relaxed">
                {selectedMood.atmosphere}
              </p>
            </div>

            {/* Energy Slider */}
            <div className="space-y-2 pb-3 border-b border-ink/15">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wideLabel text-ink-muted">
                  Energy Level
                </span>
                <span className="tabular-nums font-semibold">{draft.energy}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={draft.energy}
                onChange={(e) => handleFieldChange('energy', Number(e.target.value))}
                aria-label="Adjust energy level"
                className="himuni-range w-full"
              />
            </div>

            {/* Track Info */}
            <div className="space-y-1.5 pb-3 border-b border-ink/15">
              <span className="text-[11px] uppercase tracking-wideLabel text-ink-muted">
                Audius Source
              </span>
              {draft.featuredTrack ? (
                <div className="space-y-1">
                  <p className="font-semibold text-ink">
                    {draft.featuredTrack.titleSnapshot || draft.featuredTrack.title}
                  </p>
                  <p className="text-ink-muted">
                    {draft.featuredTrack.artistSnapshot || draft.featuredTrack.artistName}
                  </p>
                  {draft.featuredTrack.trackUrl && (
                    <a
                      href={draft.featuredTrack.trackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium underline text-ink hover:text-violet-deep pt-1"
                    >
                      <span>Original track</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-ink-subtle italic">No sound attached yet</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="w-full inline-flex min-h-[44px] items-center justify-center gap-2 bg-ink text-cream py-2.5 font-semibold uppercase tracking-wideLabel hover:bg-ink-soft transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Gallery</span>
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="w-full inline-flex min-h-[44px] items-center justify-center gap-2 border border-ink bg-cream py-2.5 font-semibold uppercase tracking-wideLabel text-ink hover:border-ink hover:bg-cream-soft transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/postcards')}
                className="w-full text-center text-ink-muted hover:text-ink text-[11px] py-1 underline"
              >
                Cancel and return
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Track Picker Modal */}
      <PostcardTrackPickerModal
        isOpen={trackPickerOpen}
        onClose={() => setTrackPickerOpen(false)}
        onSelectTrack={handleTrackSelected}
        currentMoodId={draft.moodId}
      />
    </div>
  );
}
