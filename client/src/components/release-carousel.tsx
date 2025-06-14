import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MusicPlayer } from "@/components/music-player";
import type { Release } from "@shared/schema";

export function ReleaseCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: releases = [], isLoading } = useQuery<Release[]>({
    queryKey: ["/api/releases/catalog"],
  });

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
                <Button
                  variant="default"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Listen
                </Button>
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
                >
                  <Star className="h-3 w-3 mr-1" />
                  Save
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
