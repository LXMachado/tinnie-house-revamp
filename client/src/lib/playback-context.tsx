import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Release } from "@/types/content";

interface PlaybackContextValue {
  currentTrack: Release | null;
  isPlaying: boolean;
  setPlaybackState: (state: { currentTrack?: Release | null; isPlaying?: boolean }) => void;
}

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Release | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const setPlaybackState = useCallback(
    ({ currentTrack: nextTrack, isPlaying: nextPlaying }: { currentTrack?: Release | null; isPlaying?: boolean }) => {
      if (nextTrack !== undefined) {
        setCurrentTrack(nextTrack);
      }
      if (nextPlaying !== undefined) {
        setIsPlaying(nextPlaying);
      }
    },
    []
  );

  const value = useMemo<PlaybackContextValue>(
    () => ({
      currentTrack,
      isPlaying,
      setPlaybackState,
    }),
    [currentTrack, isPlaying, setPlaybackState]
  );

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error("usePlayback must be used within a PlaybackProvider");
  }
  return context;
}
