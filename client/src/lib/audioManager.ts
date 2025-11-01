/**
 * Global Audio Manager for managing audio playback across the application
 * Ensures only one audio stream plays at a time by automatically stopping
 * any currently playing audio before starting a new one
 */

class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement | null = null;
  private currentPlayerId: string | null = null;
  private listeners: Set<(audio: HTMLAudioElement | null) => void> = new Set();

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * Register a callback to be notified when the current audio changes
   */
  onCurrentAudioChange(callback: (audio: HTMLAudioElement | null) => void): () => void {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Start playing an audio file, automatically stopping any currently playing audio
   */
  async playAudio(audio: HTMLAudioElement, playerId: string): Promise<void> {
    // If this audio is already playing, pause it
    if (this.currentAudio === audio && this.currentPlayerId === playerId) {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
      return;
    }

    // Stop any currently playing audio
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    // Set the new audio as current
    this.currentAudio = audio;
    this.currentPlayerId = playerId;

    // Notify listeners
    this.notifyListeners(audio);

    try {
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      // Reset current audio if playback fails
      this.currentAudio = null;
      this.currentPlayerId = null;
      this.notifyListeners(null);
    }
  }

  /**
   * Stop the currently playing audio
   */
  stopCurrentAudio(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
  }

  /**
   * Pause the currently playing audio
   */
  pauseCurrentAudio(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
    }
  }

  /**
   * Check if the given audio is currently playing
   */
  isCurrentAudio(audio: HTMLAudioElement): boolean {
    return this.currentAudio === audio;
  }

  /**
   * Get the currently playing audio element
   */
  getCurrentAudio(): HTMLAudioElement | null {
    return this.currentAudio;
  }

  /**
   * Get the ID of the player that owns the current audio
   */
  getCurrentPlayerId(): string | null {
    return this.currentPlayerId;
  }

  /**
   * Set volume for the current audio
   */
  setCurrentAudioVolume(volume: number): void {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Seek to a specific time in the current audio
   */
  seekCurrentAudio(time: number): void {
    if (this.currentAudio) {
      this.currentAudio.currentTime = Math.max(0, Math.min(this.currentAudio.duration || 0, time));
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopCurrentAudio();
    this.currentAudio = null;
    this.currentPlayerId = null;
    this.listeners.clear();
  }

  private notifyListeners(audio: HTMLAudioElement | null): void {
    this.listeners.forEach(callback => {
      try {
        callback(audio);
      } catch (error) {
        console.error('Error in audio change listener:', error);
      }
    });
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();
export default audioManager;