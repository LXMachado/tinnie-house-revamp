import { useQuery } from "@tanstack/react-query";
import { Play, Users, MapPin, Clock, Mail, Phone, Instagram, Twitter, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReleaseCarousel } from "@/components/release-carousel";
import { ContactForm } from "@/components/contact-form";
import type { Artist } from "@shared/schema";

export default function Home() {
  const { data: artists = [], isLoading: artistsLoading } = useQuery<Artist[]>({
    queryKey: ["/api/artists"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-blue-50 dark:to-blue-950/20">
        <div className="absolute inset-0 grid-overlay opacity-30"></div>
        <div className="container relative py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="font-orbitron text-4xl lg:text-6xl font-bold tracking-tight">
                  Electronic Music
                  <span className="block text-blue-500">Redefined</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-md">
                  Discover cutting-edge electronic music from emerging and established artists in the Tinnie House Records collective.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => scrollToSection("releases")}>
                  Explore Releases
                </Button>
                <Button variant="outline" onClick={() => scrollToSection("artists")}>
                  View Artists
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
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

            <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                  alt="Featured electronic music album artwork" 
                  className="w-full max-w-md mx-auto rounded-2xl release-glow"
                />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/20 rounded-full blur-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Releases Section */}
      <section id="releases" className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl lg:text-4xl font-bold mb-4">Latest Releases</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our newest electronic music releases from talented artists around the globe.
            </p>
          </div>

          <ReleaseCarousel />

          <div className="text-center mt-12">
            <Button variant="outline">
              View All Releases
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
                  Founded in 2020, Tinnie House Records emerged from the underground electronic music scene with a mission to champion innovative sound design and cutting-edge production techniques.
                </p>
                <p>
                  Our roster features both emerging talent and established artists who push the boundaries of electronic music across genres including synthwave, techno, ambient, and experimental electronic.
                </p>
                <p>
                  We believe in providing artists with complete creative freedom while offering professional support in production, distribution, and promotion through digital platforms worldwide.
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
      <section id="contact" className="py-16 lg:py-24">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl lg:text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interested in working with us? Send us your demo or get in touch for collaboration opportunities.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <ContactForm />

            <div className="space-y-8">
              <div className="bg-card border rounded-2xl p-8">
                <h3 className="font-orbitron font-semibold text-lg mb-6">Contact Information</h3>
                
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

              <div className="bg-card border rounded-2xl p-8">
                <h3 className="font-orbitron font-semibold text-lg mb-4">Demo Submissions</h3>
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
