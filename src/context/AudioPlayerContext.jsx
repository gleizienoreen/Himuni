import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTrackStreamUrl } from '../services/audius/audiusApi';

export const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const playRequestIdRef = useRef(0);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'playing' | 'paused' | 'error'
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState('');

  // Ensure a single managed HTMLAudioElement instance and clean up on unmount
  useEffect(() => {
    if (typeof Audio === 'undefined') return undefined;

    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    const onLoadStart = () => {
      setStatus((prev) => (prev === 'error' ? prev : 'loading'));
    };

    const onPlaying = () => {
      setStatus('playing');
      setPlaybackError('');
    };

    const onPause = () => {
      setStatus((prev) => (prev === 'playing' ? 'paused' : prev));
    };

    const onWaiting = () => {
      setStatus((prev) => (prev === 'idle' || prev === 'error' ? prev : 'loading'));
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      setStatus('idle');
      setCurrentTime(0);
      setCurrentTrack(null);
    };

    const onError = () => {
      // Ignore intentional src reset when stopping playback
      if (!audio.getAttribute('src')) return;
      setStatus('error');
      setPlaybackError(
        'Audius could not stream this track right now. You can retry or open the track directly on Audius.'
      );
    };

    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const stopPlayback = useCallback(() => {
    playRequestIdRef.current += 1;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
    setCurrentTrack(null);
    setStatus('idle');
    setCurrentTime(0);
    setDuration(0);
    setPlaybackError('');
  }, []);

  const toggleTrack = useCallback(async (track) => {
    if (!track) return;

    // Never attempt unauthorized playback for gated or unavailable tracks
    if (!track.isAvailable || track.isStreamGated || !track.isStreamable) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    const isSameTrack = currentTrack?.id === track.id;

    if (isSameTrack && status === 'playing') {
      audio.pause();
      setStatus('paused');
      return;
    }

    if (isSameTrack && status === 'paused') {
      const resumeRequestId = ++playRequestIdRef.current;
      try {
        setPlaybackError('');
        await audio.play();
        if (playRequestIdRef.current === resumeRequestId) {
          setStatus('playing');
        }
      } catch (err) {
        if (playRequestIdRef.current !== resumeRequestId || err?.name === 'AbortError') {
          return;
        }
        setStatus('error');
        setPlaybackError(
          'Playback could not resume. Please retry or open the track on Audius.'
        );
      }
      return;
    }

    // Stop any previous stream before starting a new track
    const requestId = ++playRequestIdRef.current;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();

    const officialStreamUrl = getTrackStreamUrl(track);
    if (!officialStreamUrl) {
      setCurrentTrack(track);
      setStatus('error');
      setPlaybackError('No official Audius stream URL is available for this track.');
      return;
    }

    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.duration > 0 ? track.duration : 0);
    setPlaybackError('');
    setStatus('loading');

    try {
      audio.src = officialStreamUrl;
      await audio.play();
      if (playRequestIdRef.current === requestId) {
        setStatus('playing');
      }
    } catch (err) {
      // Ignore superseded play attempts or AbortError caused by switching tracks
      if (playRequestIdRef.current !== requestId || err?.name === 'AbortError') return;
      setStatus('error');
      setPlaybackError(
        'Audius could not stream this track right now. You can retry or listen on Audius.'
      );
    }
  }, [currentTrack, status]);

  const seekTo = useCallback((nextSeconds) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(nextSeconds)) return;
    const maxDur =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : duration;
    if (maxDur <= 0) return;

    const clamped = Math.min(maxDur, Math.max(0, nextSeconds));
    try {
      audio.currentTime = clamped;
      setCurrentTime(clamped);
    } catch {
      // Ignore seek before metadata ready
    }
  }, [duration]);

  const value = useMemo(
    () => ({
      currentTrack,
      status,
      currentTime,
      duration,
      playbackError,
      toggleTrack,
      stopPlayback,
      seekTo,
    }),
    [
      currentTrack,
      status,
      currentTime,
      duration,
      playbackError,
      toggleTrack,
      stopPlayback,
      seekTo,
    ]
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}
