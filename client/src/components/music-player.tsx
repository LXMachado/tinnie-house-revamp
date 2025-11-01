import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { audioManager } from "@/lib/audioManager";

const audioBase = import.meta.env.VITE_AUDIO_BASE || "";

const buildAudioSource = (audioPath: string): string => {
  if (!audioPath) {
    return "";
  }

  if (/^https?:\/\//i.test(audioPath)) {
    return audioPath;
  }

  // Check for local audio files first (for development)
  const localPath = `/audio/${audioPath}`;
  return localPath;
};

interface MusicPlayerProps {
  audioPath: string;
  title: string;
  artist: string;
  compact?: boolean;
}

export function MusicPlayer({ audioPath, title, artist, compact = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrl = buildAudioSource(audioPath);
  // Create a unique player ID based on title, artist and audioPath
  const playerId = `${title}-${artist}-${audioPath}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Track current audio state from global manager
  useEffect(() => {
    const unsubscribe = audioManager.onCurrentAudioChange((currentAudio) => {
      const audio = audioRef.current;
      if (audio === currentAudio && audio) {
        setIsPlaying(!audio.paused);
      } else {
        // If this audio is not the current one, pause it
        setIsPlaying(false);
      }
    });

    return unsubscribe;
  }, []);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio && audioManager.isCurrentAudio(audio)) {
        // If this was the current audio, stop it
        audioManager.stopCurrentAudio();
      }
    };
  }, []);

  // Handle audio source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset state when audio URL changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    // Stop any currently playing audio when source changes
    audioManager.stopCurrentAudio();
    
    audio.load(); // Reload the audio element with new source
  }, [audioUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audioManager.playAudio(audio, playerId);
    } catch (error) {
      console.error('Failed to toggle audio playback:', error);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = value[0];
    
    // If this audio is the current one, use global manager
    if (audioManager.isCurrentAudio(audio)) {
      audioManager.seekCurrentAudio(newTime);
    } else {
      // Otherwise, update directly
      audio.currentTime = newTime;
    }
    
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0];
    
    // If this audio is the current one, use global manager
    if (audioManager.isCurrentAudio(audio)) {
      audioManager.setCurrentAudioVolume(newVolume);
    } else {
      // Otherwise, update directly
      audio.volume = newVolume;
    }
    
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      // Restore volume
      const targetVolume = audio.volume > 0 ? audio.volume : 1;
      
      if (audioManager.isCurrentAudio(audio)) {
        audioManager.setCurrentAudioVolume(targetVolume);
      } else {
        audio.volume = targetVolume;
      }
      
      setIsMuted(false);
    } else {
      // Mute
      if (audioManager.isCurrentAudio(audio)) {
        audioManager.setCurrentAudioVolume(0);
      } else {
        audio.volume = 0;
      }
      
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <audio ref={audioRef} preload="metadata">
          {audioUrl && <source src={audioUrl} type="audio/mpeg" />}
        </audio>
        <Button
          size="sm"
          onClick={togglePlay}
          className="w-8 h-8 p-0"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </Button>
        <span className="text-xs text-muted-foreground font-orbitron">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    );
  }

  return (
    <div className="blur-card p-4 space-y-4">
      <audio ref={audioRef} preload="metadata">
        {audioUrl && <source src={audioUrl} type="audio/mpeg" />}
      </audio>
      
      <div className="text-center">
        <h4 className="font-orbitron font-bold">{title}</h4>
        <p className="text-sm text-blue-400">{artist}</p>
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Button
          size="lg"
          onClick={togglePlay}
          className="w-12 h-12 rounded-full"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
      </div>

      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-orbitron">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMute}
          className="p-2"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.1}
          onValueChange={handleVolumeChange}
          className="flex-1"
        />
      </div>
    </div>
  );
}
