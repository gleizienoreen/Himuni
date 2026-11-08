import React, { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { usePostcards } from '../hooks/usePostcards';
import { useMood } from '../hooks/useMood';
import { MainLayout } from '../layouts/MainLayout';
import { PostcardEditor } from '../components/postcards/PostcardEditor';

export function PostcardEditorPage() {
  const { postcardId } = useParams();
  const location = useLocation();
  const { postcards, save } = usePostcards();
  const { selectedMood, energy } = useMood();

  const existingPostcard = useMemo(() => {
    if (!postcardId) return null;
    return postcards.find((p) => p.id === postcardId) || null;
  }, [postcardId, postcards]);

  const initialDraft = useMemo(() => {
    if (existingPostcard) return existingPostcard;

    // Check if initial track was passed via route state
    const passedTrack = location.state?.track || null;
    const passedMoodId = location.state?.moodId || selectedMood?.id || 'dreamy';

    return {
      title: passedTrack ? `${passedTrack.title} — Reflection` : '',
      subtitle: '',
      note: '',
      moodId: passedMoodId,
      energy: typeof energy === 'number' ? energy : 50,
      featuredTrack: passedTrack
        ? {
            provider: 'audius',
            trackId: passedTrack.id,
            title: passedTrack.title,
            titleSnapshot: passedTrack.title,
            artistName: passedTrack.artistName,
            artistSnapshot: passedTrack.artistName,
            artistUrl: passedTrack.artistUrl,
            trackUrl: passedTrack.trackUrl,
            artworkUrl: passedTrack.artworkUrl,
            duration: passedTrack.duration,
            genre: passedTrack.genre,
          }
        : null,
      themeId: 'lavender-dream',
      layoutId: 'editorial',
      typography: {
        alignment: 'left',
        style: 'editorial',
      },
    };
  }, [existingPostcard, location.state, selectedMood, energy]);

  return (
    <MainLayout activeMood={selectedMood}>
      <PostcardEditor
        initialPostcard={initialDraft}
        onSave={(draft) => save(draft)}
      />
    </MainLayout>
  );
}
