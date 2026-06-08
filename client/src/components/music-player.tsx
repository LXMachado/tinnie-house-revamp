import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { audioManager } from "@/lib/audioManager";

const audioBase = import.meta.env.VITE_AUDIO_BASE || "";
const waveBars = [1, 1.2, 1.45, 1.7, 1.9, 1.8, 1.65, 1.5, 1.35, 1.2, 1.05, 0.9];

const buildAudioSource = (audioPath: string): string => {
  if (!audioPath) {
    return "";
  }

  if (/^https?:\/\//i.test(audioPath)) {
    return audioPath;
  }

  const trimmedPath = audioPath.replace(/^\/+/, "");
  const hasAudioPrefix = trimmedPath.startsWith("audio/");
  const relativePath = hasAudioPrefix ? trimmedPath.replace(/^audio\//, "") : trimmedPath;

  if (audioBase) {
    return `${audioBase.replace(/\/$/, "")}/${relativePath}`;
  }

  return `/audio/${relativePath}`;
};

interface MusicPlayerProps {
  audioPath: string;
  title: string;
  artist: string;
  artworkUrl?: string;
  compact?: boolean;
  autoplayToken?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onClose?: () => void;
  onPlaybackChange?: (isPlaying: boolean) => void;
}

export function MusicPlayer({
  audioPath,
  title,
  artist,
  artworkUrl,
  compact = false,
  autoplayToken = 0,
  onPrevious,
  onNext,
  onClose,
  onPlaybackChange,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioError, setAudioError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastVolumeRef = useRef(1);
  const autoplayHandledRef = useRef(0);
  const audioUrl = buildAudioSource(audioPath);
  const playerId = `${title}-${artist}-${audioPath}`.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  const isMuted = volume === 0;
  const progress = duration > 0 ? currentTime / duration : 0;

  const waveformBars = useMemo(() => {
    const totalBars = compact ? 24 : 72;
    return Array.from({ length: totalBars }, (_, index) => {
      const base = waveBars[index % waveBars.length];
      const phase = 0.8 + ((index % 7) * 0.08);
      return Number((base * phase).toFixed(2));
    });
  }, [compact]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const handlePlay = () => {
      setIsPlaying(true);
      setAudioLoading(false);
      setAudioError(false);
      onPlaybackChange?.(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
      onPlaybackChange?.(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onPlaybackChange?.(false);
    };
    const handleLoadStart = () => {
      setAudioLoading(true);
      setAudioError(false);
    };
    const handleCanPlay = () => {
      setAudioLoading(false);
      setAudioError(false);
      updateDuration();
    };
    const handleVolumeChange = () => {
      setVolume(audio.muted ? 0 : audio.volume);
    };
    const handleError = () => {
      setAudioError(true);
      setAudioLoading(false);
      setIsPlaying(false);
      onPlaybackChange?.(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("volumechange", handleVolumeChange);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("volumechange", handleVolumeChange);
      audio.removeEventListener("error", handleError);
    };
  }, [onPlaybackChange]);

  useEffect(() => {
    const unsubscribe = audioManager.onCurrentAudioChange((currentAudio) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (audio === currentAudio) {
        setIsPlaying(!audio.paused);
        return;
      }

      setIsPlaying(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio && audioManager.isCurrentAudio(audio)) {
        audioManager.stopCurrentAudio();
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = audioUrl;
    setAudioError(false);
    setAudioLoading(Boolean(audioUrl));
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVolume(audio.volume || lastVolumeRef.current || 1);
    onPlaybackChange?.(false);

    if (audioManager.isCurrentAudio(audio)) {
      audioManager.stopCurrentAudio();
    }

    audio.load();
  }, [audioUrl, onPlaybackChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl || autoplayToken === 0 || autoplayHandledRef.current === autoplayToken) {
      return;
    }

    autoplayHandledRef.current = autoplayToken;

    const startPlayback = async () => {
      try {
        await audioManager.playAudio(audio, playerId);
      } catch (error) {
        console.error("Failed to autoplay audio:", error);
        setAudioError(true);
      }
    };

    void startPlayback();
  }, [audioUrl, autoplayToken, playerId]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    try {
      setAudioError(false);
      await audioManager.playAudio(audio, playerId);
    } catch (error) {
      console.error("Failed to toggle audio playback:", error);
      setAudioError(true);
    }
  };

  const handleSeek = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const nextTime = Math.max(0, Math.min(duration, duration * ratio));

    if (audioManager.isCurrentAudio(audio)) {
      audioManager.seekCurrentAudio(nextTime);
    } else {
      audio.currentTime = nextTime;
    }

    setCurrentTime(nextTime);
  };

  const setVolumeLevel = (nextVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedVolume = Math.max(0, Math.min(1, nextVolume));

    if (clampedVolume > 0) {
      lastVolumeRef.current = clampedVolume;
    }

    if (audioManager.isCurrentAudio(audio)) {
      audioManager.setCurrentAudioVolume(clampedVolume);
    } else {
      audio.volume = clampedVolume;
      audio.muted = clampedVolume === 0;
    }

    setVolume(clampedVolume);
  };

  const toggleMute = () => {
    setVolumeLevel(isMuted ? lastVolumeRef.current || 1 : 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <audio ref={audioRef} preload="metadata" src={audioUrl || undefined} />
        <Button size="sm" onClick={togglePlay} className="h-8 w-8 p-0" disabled={audioError || audioLoading}>
          {audioLoading ? (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : isPlaying ? (
            <Pause className="h-3 w-3" />
          ) : audioError ? (
            <VolumeX className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3" />
          )}
        </Button>
        <span className="font-orbitron text-xs text-muted-foreground">
          {audioError ? "Audio unavailable" : audioLoading ? "Loading..." : `${formatTime(currentTime)} / ${formatTime(duration)}`}
        </span>
      </div>
    );
  }

  return (
    <div className="player__in">
      <audio ref={audioRef} preload="metadata" src={audioUrl || undefined} />

      <div className="player__art">
        <img src={artworkUrl || "/images/artwork/placeholder.webp"} alt={title} loading="lazy" />
      </div>

      <div className="player__meta">
        <b>{title}</b>
        <span>{artist}</span>
      </div>

      <div className="player__ctrls">
        <button className="player__btn" type="button" onClick={onPrevious} title="Previous track" disabled={!onPrevious}>
          <SkipBack size={20} />
        </button>
        <button
          className="player__btn player__play"
          type="button"
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
          disabled={audioError || audioLoading}
        >
          {audioLoading ? (
            <span className="player__spinner" aria-hidden="true" />
          ) : isPlaying ? (
            <Pause size={22} />
          ) : (
            <Play size={22} fill="currentColor" />
          )}
        </button>
        <button className="player__btn" type="button" onClick={onNext} title="Next track" disabled={!onNext}>
          <SkipForward size={20} />
        </button>
      </div>

      <span className="player__time">{audioError ? "--:--" : formatTime(currentTime)}</span>

      <div
        className={`player__wave${isPlaying ? " is-playing" : ""}${audioError ? " is-disabled" : ""}`}
        role="slider"
        aria-label={`Playback position for ${title}`}
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={Math.floor(currentTime)}
      >
        {waveformBars.map((height, index) => {
          const ratio = waveformBars.length > 1 ? index / (waveformBars.length - 1) : 0;
          const active = ratio <= progress;
          return (
            <button
              key={`${playerId}-${index}`}
              className={`player__wavebar${active ? " is-active" : ""}`}
              type="button"
              onClick={() => handleSeek(ratio)}
              disabled={audioError || !duration}
              aria-label={`Seek to ${formatTime(duration * ratio)}`}
              style={{ ["--bar-height" as string]: `${height}rem` }}
            />
          );
        })}
      </div>

      <span className="player__time">{audioError ? "--:--" : formatTime(duration)}</span>

      <button className="player__btn" type="button" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      <button className="player__btn player__close" type="button" onClick={onClose} title="Close player">
        <X size={22} />
      </button>
    </div>
  );
}
