import { useContext } from 'react';
import { AudioPlayerContext } from '../context/AudioPlayerContext';

const INERT_AUDIO_STATE = {
  currentTrack: null,
  status: 'idle',
  currentTime: 0,
  duration: 0,
  playbackError: '',
  toggleTrack: () => {},
  stopPlayback: () => {},
  seekTo: () => {},
};

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  return context || INERT_AUDIO_STATE;
}
