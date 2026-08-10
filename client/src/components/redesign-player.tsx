import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
import { audioManager } from "@/lib/audioManager";
import { usePlayback } from "@/lib/playback-context";
import type { Release } from "@/types/content";

const audioBase = import.meta.env.VITE_AUDIO_BASE || "";

function buildAudioSource(audioPath: string): string {
  if (!audioPath) return "";
  if (/^https?:\/\//i.test(audioPath)) return audioPath;

  const trimmedPath = audioPath.replace(/^\/+/, "");
  const hasAudioPrefix = trimmedPath.startsWith("audio/");
  const relativePath = hasAudioPrefix ? trimmedPath.replace(/^audio\//, "") : trimmedPath;

  if (audioBase) {
    return `${audioBase.replace(/\/$/, "")}/${relativePath}`;
  }

  return `/audio/${relativePath}`;
}

function formatTime(time: number) {
  if (!Number.isFinite(time) || time < 0) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function PlayerWaveform({
  currentTime,
  duration,
  isPlaying,
}: {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let alive = true;

    const render = () => {
      if (!alive) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      const width = parent.clientWidth;
      const height = parent.clientHeight || 40;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const bars = Math.max(24, Math.floor(width / 10));
      const progress = duration > 0 ? currentTime / duration : 0;
      const timeSeed = currentTime * (isPlaying ? 5.5 : 0.2);

      for (let index = 0; index < bars; index += 1) {
        const t = index / Math.max(bars - 1, 1);
        const base = 0.22 + 0.5 * Math.abs(Math.sin(index * 0.45 + timeSeed));
        const lift = isPlaying ? 0.25 * Math.abs(Math.sin(index * 0.18 + timeSeed * 1.7)) : 0.05;
        const barHeight = Math.max(4, (base + lift) * height * (0.45 + 0.55 * (1 - Math.abs(t - 0.5))));
        const x = index * (width / bars);
        const y = height - barHeight;
        const active = t <= progress;
        ctx.fillStyle = active ? "rgba(56,214,255,0.92)" : "rgba(103,115,140,0.35)";
        ctx.shadowBlur = active ? 10 : 0;
        ctx.shadowColor = "rgba(56,214,255,0.55)";
        ctx.fillRect(x, y, 4, barHeight);
      }

      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(render);
    };

    render();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [currentTime, duration, isPlaying]);

  return <canvas ref={ref} />;
}

interface RedesignPlayerProps {
  autoplayNonce: number;
  onClose: () => void;
  onTrackChange: (release: Release) => void;
  playlist: Release[];
  track: Release | null;
}

export function RedesignPlayer({
  autoplayNonce,
  onClose,
  onTrackChange,
  playlist,
  track,
}: RedesignPlayerProps) {
  const { setPlaybackState } = usePlayback();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [audioError, setAudioError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const audioUrl = track?.audioFilePath ? buildAudioSource(track.audioFilePath) : "";
  const playerId = useMemo(
    () => (track ? `redesign-player-${track.id}-${track.slug}` : "redesign-player"),
    [track]
  );

  const playlistIndex = useMemo(
    () => (track ? playlist.findIndex((release) => release.id === track.id) : -1),
    [playlist, track]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handlePlay = () => {
      setIsPlaying(true);
      setPlaybackState({ currentTrack: track, isPlaying: true });
    };
    const handlePause = () => {
      setIsPlaying(false);
      setPlaybackState({ isPlaying: false });
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setPlaybackState({ isPlaying: false });
      if (playlistIndex >= 0 && playlist.length > 1) {
        const nextTrack = playlist[(playlistIndex + 1) % playlist.length];
        onTrackChange(nextTrack);
      }
    };
    const handleLoadStart = () => setAudioLoading(true);
    const handleCanPlay = () => setAudioLoading(false);
    const handleError = () => {
      setAudioError(true);
      setAudioLoading(false);
      setIsPlaying(false);
      setPlaybackState({ isPlaying: false });
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [onTrackChange, playlist, playlistIndex, setPlaybackState, track]);

  useEffect(() => {
    const unsubscribe = audioManager.onCurrentAudioChange((currentAudio) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (currentAudio !== audio) {
        setIsPlaying(false);
        setPlaybackState({ isPlaying: false });
      }
    });

    return unsubscribe;
  }, [setPlaybackState]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioError(false);
    setAudioLoading(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setPlaybackState({ currentTrack: track, isPlaying: false });
    audio.pause();
    audio.currentTime = 0;
    audio.src = audioUrl;
    audio.load();

    if (!audioUrl) return;

    const timer = window.setTimeout(async () => {
      try {
        await audioManager.playAudio(audio, playerId);
      } catch (error) {
        console.warn("Autoplay was blocked or interrupted:", error);
        setAudioLoading(false);
      }
    }, 10);

    return () => window.clearTimeout(timer);
  }, [audioUrl, autoplayNonce, playerId, setPlaybackState, track]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio && audioManager.isCurrentAudio(audio)) {
        audioManager.stopCurrentAudio();
      }
      setPlaybackState({ isPlaying: false });
    };
  }, [setPlaybackState]);

  if (!track) return null;

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    try {
      await audioManager.playAudio(audio, playerId);
    } catch (error) {
      console.error("Failed to toggle playback:", error);
      setAudioLoading(false);
    }
  };

  const goToOffset = (offset: number) => {
    if (playlistIndex < 0 || playlist.length === 0) return;
    const nextIndex = (playlistIndex + offset + playlist.length) % playlist.length;
    onTrackChange(playlist[nextIndex]);
  };

  const handleVolumeToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextVolume = volume > 0 ? 0 : 1;
    audio.volume = nextVolume;
    setVolume(nextVolume);
  };

  const handleClose = () => {
    const audio = audioRef.current;
    if (audio && audioManager.isCurrentAudio(audio)) {
      audioManager.stopCurrentAudio();
    }
    setPlaybackState({ isPlaying: false, currentTrack: null });
    onClose();
  };

  return (
    <div className={`player${track ? " on" : ""}`}>
      <audio ref={audioRef} preload="metadata" />
      <div className="player__in">
        <div className="player__art">
          <img
            src={track.coverImageUrl || track.imgUrl || "/images/artwork/placeholder.webp"}
            alt={track.title}
            loading="lazy"
          />
        </div>
        <div className="player__meta">
          <b>{track.title}</b>
          <span>{track.artist}</span>
        </div>
        <div className="player__ctrls">
          <button className="player__btn" onClick={() => goToOffset(-1)} title="Previous">
            <SkipBack size={18} />
          </button>
          <button
            className="player__btn player__play"
            onClick={() => void togglePlayback()}
            title={isPlaying ? "Pause" : "Play"}
            disabled={audioLoading || audioError}
          >
            {audioLoading ? (
              <div className="player__spinner" />
            ) : isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} fill="currentColor" />
            )}
          </button>
          <button className="player__btn" onClick={() => goToOffset(1)} title="Next">
            <SkipForward size={18} />
          </button>
        </div>
        <span className="player__time">{formatTime(currentTime)}</span>
        <div className="player__wave">
          <PlayerWaveform currentTime={currentTime} duration={duration} isPlaying={isPlaying} />
        </div>
        <span className="player__time">{formatTime(duration)}</span>
        <button
          className="player__btn player__volume"
          title={volume > 0 ? "Mute" : "Unmute"}
          onClick={handleVolumeToggle}
        >
          {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button className="player__btn player__close" title="Close" onClick={handleClose}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
