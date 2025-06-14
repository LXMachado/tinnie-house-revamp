import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Play, Pause, Users, MapPin, Clock, Mail, Phone, Instagram, Twitter, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReleaseCarousel } from "@/components/release-carousel";
import { ContactForm } from "@/components/contact-form";
import { MusicPlayer } from "@/components/music-player";
import type { Artist, Release } from "@shared/schema";

export default function Home() {
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  
  const { data: artists = [], isLoading: artistsLoading } = useQuery<Artist[]>({
    queryKey: ["/api/artists"],
  });

  const { data: stormdrifterRelease } = useQuery<Release>({
    queryKey: ["/api/releases/latest"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleListenClick = () => {
    if (stormdrifterRelease?.audioFileUrl) {
      setShowMusicPlayer(!showMusicPlayer);
    } else {
      scrollToSection("releases");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 grid-overlay opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-blue-500/20"></div>
        <div className="container relative py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="font-orbitron text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                  PUSHING THE
                  <span className="block">BOUNDARIES OF</span>
                  <span className="block text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">
                    UNDERGROUND
                  </span>
                  <span className="block">ELECTRONIC MUSIC</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Tinnie House Records is an independent label dedicated to showcasing innovative techno, melodic techno, and progressive house from Australia and beyond.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleListenClick}>
                  {stormdrifterRelease?.audioFileUrl ? (
                    <>
                      {showMusicPlayer ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      Listen
                    </>
                  ) : (
                    "Explore Releases"
                  )}
                </Button>
                <Button variant="outline" onClick={() => scrollToSection("releases")}>
                  Explore Releases
                </Button>
              </div>
              
              {/* Inline Music Player */}
              {showMusicPlayer && stormdrifterRelease?.audioFileUrl && (
                <div className="mt-8 max-w-md mx-auto">
                  <div className="blur-card p-6 rounded-2xl">
                    <div className="text-center mb-4">
                      <h3 className="font-orbitron font-bold text-lg">{stormdrifterRelease.title}</h3>
                      <p className="text-blue-400 font-orbitron">{stormdrifterRelease.artist}</p>
                      <p className="text-xs text-muted-foreground">Upcoming Release - June 30, 2025</p>
                    </div>
                    <MusicPlayer 
                      audioUrl={stormdrifterRelease.audioFileUrl}
                      title={stormdrifterRelease.title}
                      artist={stormdrifterRelease.artist}
                      compact={true}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>50+ Active Releases</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>{artists.length || 12} Artists</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Release Section */}
      <section id="releases" className="py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent"></div>
        <div className="container relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              Coming Soon
            </div>
            <h2 className="font-orbitron text-3xl lg:text-4xl font-bold mb-4 tracking-wide">UPCOMING RELEASE</h2>
          </div>

          {/* Featured Release - Rafa Kao - Stormdrifter */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="blur-card overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-square">
                  <img 
                    src="https://i.imgur.com/7HZNuFs_d.jpeg?maxwidth=520&shape=thumb&fidelity=high" 
                    alt="Rafa Kao - Stormdrifter"
                    className="w-full h-full object-cover rounded-lg blue-glow"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-blue-600/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                        TH019
                      </div>
                      <div className="bg-green-600/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                        June 2025
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 p-6 lg:p-8">
                  <div>
                    <h3 className="font-orbitron text-2xl lg:text-3xl font-bold mb-2">STORMDRIFTER</h3>
                    <p className="text-lg text-blue-400 font-medium mb-4">Rafa Kao</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm">Melodic House & Techno</span>
                      <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm">Maxi Single</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    Get ready for an immersive journey through atmospheric soundscapes and driving rhythms. 
                    Rafa Kao's latest masterpiece "Stormdrifter" showcases the evolving sound of Tinnie House Records 
                    with its deep melodic progressions and hypnotic techno elements.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1">
                      <Music className="w-4 h-4 mr-2" />
                      Pre-Order Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Add to Wishlist
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div>
                      <div className="text-sm text-muted-foreground">Release Date</div>
                      <div className="font-medium">June 30, 2025</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Catalog</div>
                      <div className="font-medium">TH019</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Releases Carousel */}
          <div className="text-center mb-12">
            <h3 className="font-orbitron text-2xl lg:text-3xl font-bold mb-4 tracking-wide">CATALOG RELEASES</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our complete catalog of electronic music releases from our talented roster of artists.
            </p>
          </div>

          <ReleaseCarousel />

          <div className="text-center mt-12">
            <Button variant="outline">
              View Complete Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section id="artists" className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl lg:text-4xl font-bold mb-4">Featured Artists</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the talented electronic music producers and artists shaping the sound of Tinnie House Records.
            </p>
          </div>

          {artistsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-32 h-32 rounded-full mx-auto bg-muted mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : artists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No artists available at this time.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {artists.slice(0, 4).map((artist) => (
                <div key={artist.id} className="group text-center">
                  <div className="relative mb-4">
                    <img 
                      src={artist.imageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"} 
                      alt={`${artist.name} artist photo`}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-500/20 group-hover:border-blue-500/50 transition-colors"
                    />
                    <div className="absolute inset-0 w-32 h-32 rounded-full mx-auto bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors"></div>
                  </div>
                  <h3 className="font-orbitron font-semibold text-lg mb-1">{artist.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{artist.genre || "Electronic"}</p>
                  <p className="text-xs text-muted-foreground">{artist.bio || "Innovative electronic music artist"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-orbitron text-3xl lg:text-4xl font-bold mb-6">About Tinnie House Records</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  While we celebrate Australia's rich electronic heritage, we champion artists from every corner of the globe. Our passion spans techno, melodic techno, and progressive house, always seeking groundbreaking sounds that transcend borders and move both body and soul.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t">
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-bold text-blue-500">50+</div>
                  <div className="text-sm text-muted-foreground">Releases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-bold text-blue-500">{artists.length || 15}</div>
                  <div className="text-sm text-muted-foreground">Artists</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-bold text-blue-500">4</div>
                  <div className="text-sm text-muted-foreground">Years</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional electronic music studio"
                className="rounded-2xl release-glow"
              />
              
              <div className="absolute -bottom-6 -left-6 bg-card border rounded-lg p-4 shadow-lg">
                <div className="text-sm font-medium text-blue-500">Latest Achievement</div>
                <div className="text-xs text-muted-foreground mt-1">Top 10 on Beatport Charts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent"></div>
        <div className="container max-w-6xl relative">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl lg:text-4xl font-bold mb-4 tracking-wide">BECOME PART OF OUR LABEL FAMILY</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're always on the lookout for fresh talent and innovative sounds that push the boundaries of electronic music.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm />

            <div className="space-y-8">
              <div className="blur-card p-8">
                <h3 className="font-orbitron font-semibold text-lg mb-6 tracking-wide">JOIN OUR COMMUNITY</h3>
                
                <div className="space-y-4 mb-8">
                  <p className="text-sm text-muted-foreground">
                    Sign up for exclusive updates on releases, events, and special announcements.
                  </p>
                  <div className="flex gap-3">
                    <input 
                      type="email" 
                      placeholder="Your Email"
                      className="flex-1 px-4 py-3 rounded-md bg-background/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors backdrop-blur-sm"
                    />
                    <Button variant="default">Subscribe</Button>
                  </div>
                </div>
              </div>

              <div className="blur-card p-8">
                <h3 className="font-orbitron font-semibold text-lg mb-6 tracking-wide">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">contact@tinniehouserecords.com</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">Berlin, Germany</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Response Time</div>
                      <div className="text-sm text-muted-foreground">24-48 hours</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="blur-card p-8">
                <h3 className="font-orbitron font-semibold text-lg mb-4 tracking-wide">Demo Submissions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to share your electronic music with us? Please include:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>2-3 of your best unreleased tracks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Brief artist bio and social media links</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>High-quality WAV or FLAC files</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
