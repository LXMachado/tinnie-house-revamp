import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MusicPlayer } from "@/components/music-player";
import type { Release } from "@/types/content";
import { STATIC_RELEASES } from "@/static-content";

export function ReleaseCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const releases = useMemo<Release[]>(() => {
    return [...STATIC_RELEASES].sort((a, b) => {
      const dateA = new Date(a.digitalReleaseDate ?? 0).getTime();
      const dateB = new Date(b.digitalReleaseDate ?? 0).getTime();
      return dateB - dateA;
    });
  }, []);

  const handleShare = async (release: Release) => {
    const shareData = {
      title: `${release.title} by ${release.artist}`,
      text: `Check out this release from Tinnie House Records`,
      url: release.beatportSaleUrl || window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        // Could add a toast notification here
      }
    } catch (error) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
      } catch (clipboardError) {
        console.error('Failed to share or copy to clipboard');
      }
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, releases.length));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + releases.length) % Math.max(1, releases.length));
  };

  // Auto-advance disabled

  if (releases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured releases available at this time.</p>
      </div>
    );
  }

  const totalVisible = Math.min(3, releases.length);
  const visibleReleases = Array.from({ length: totalVisible }, (_, idx) => releases[(currentSlide + idx) % releases.length]);

  return (
    <div className="relative">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {visibleReleases.map((release, index) => (
          <div key={`${release.id}-${index}`} className="group blur-card overflow-hidden transition-all duration-300">
            <div className="relative">
              <img 
                src={release.imgUrl || release.coverImageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
                alt={`${release.title} by ${release.artist}`}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                {release.audioFilePath && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <MusicPlayer 
                      audioPath={release.audioFilePath}
                      title={release.title}
                      artist={release.artist}
                      compact={true}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-orbitron font-semibold text-blue-400 uppercase tracking-wider">
                  {release.musicStyle || "Electronic"}
                </span>
                <span className="text-xs text-muted-foreground font-orbitron">
                  {release.digitalReleaseDate ? new Date(release.digitalReleaseDate).getFullYear() : "2024"}
                </span>
              </div>
              <h3 className="font-orbitron font-bold text-lg mb-2">{release.title}</h3>
              <p className="text-sm text-blue-400 mb-3 font-orbitron">by {release.artist}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="font-orbitron">{release.internalReference}</span>
                <span>{release.trackCount} track{release.trackCount !== 1 ? 's' : ''}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {release.beatportSaleUrl ? (
                  <Button 
                    variant="default" 
                    size="sm"
                    className="flex-1"
                    onClick={() => release.beatportSaleUrl && window.open(release.beatportSaleUrl!, '_blank')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Buy
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    disabled
                  >
                    Coming Soon
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleShare(release)}
                >
                  <Share className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {releases.length > 3 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}


    </div>
  );
}
