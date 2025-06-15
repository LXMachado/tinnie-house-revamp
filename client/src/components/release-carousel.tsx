import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Play, Share, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MusicPlayer } from "@/components/music-player";
import type { Release } from "@shared/schema";

export function ReleaseCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  const { data: releases = [], isLoading } = useQuery<Release[]>({
    queryKey: ["/api/releases/catalog"],
  });

  const isReleaseAvailable = (release: Release) => {
    const releaseDate = release.releaseDate || release.digitalReleaseDate;
    if (!releaseDate) return true; // If no date specified, assume available
    return new Date(releaseDate) <= new Date();
  };

  const formatReleaseDate = (release: Release) => {
    const releaseDate = release.releaseDate || release.digitalReleaseDate;
    if (!releaseDate) return "soon";
    return new Date(releaseDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleBuyClick = (release: Release) => {
    if (!isReleaseAvailable(release)) {
      setSelectedRelease(release);
      setShowUpcomingModal(true);
      return;
    }
    
    if (release.beatportSaleUrl) {
      window.open(release.beatportSaleUrl, '_blank');
    }
  };

  const handleShare = async (release: Release) => {
    if (!isReleaseAvailable(release)) {
      setSelectedRelease(release);
      setShowUpcomingModal(true);
      return;
    }

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

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-2xl h-64 mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No featured releases available at this time.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {releases.slice(currentSlide, currentSlide + 3).map((release) => (
          <div key={release.id} className="group blur-card overflow-hidden transition-all duration-300">
            <div className="relative">
              <img 
                src={release.imgUrl || release.coverImageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
                alt={`${release.title} by ${release.artist}`}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                {release.audioFileUrl && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <MusicPlayer 
                      audioUrl={release.audioFileUrl}
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
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleBuyClick(release)}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Buy
                </Button>
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

      {/* Upcoming Release Modal */}
      <Dialog open={showUpcomingModal} onOpenChange={setShowUpcomingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Coming Soon
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRelease && (
              <>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{selectedRelease.title}</h3>
                  <p className="text-sm text-muted-foreground">by {selectedRelease.artist}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    This release will be available on{" "}
                    <span className="font-semibold text-blue-500">
                      {formatReleaseDate(selectedRelease)}
                    </span>
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button onClick={() => setShowUpcomingModal(false)}>
                    Got it
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
