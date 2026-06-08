import { Switch, Route, Link } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlaybackProvider, usePlayback } from "@/lib/playback-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import CookiePolicy from "@/pages/cookie-policy";

function Header() {
  const { currentTrack, isPlaying } = usePlayback();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav__brand">
        <div className="nav__logo">
          <img
            src="/logo-dark.webp"
            alt="Tinnie House Records"
            style={{ width: 30, height: 30, objectFit: "contain" }}
            loading="lazy"
          />
        </div>
        <span className="nav__name">
          Tinnie&nbsp;<b>House</b>&nbsp;<span className="nav__name-rec">Records</span>
        </span>
      </div>

      <nav className="nav__links">
        <button onClick={() => scrollToSection("releases")}>Releases</button>
        <button onClick={() => scrollToSection("artists")}>Artists</button>
        <button onClick={() => scrollToSection("about")}>About</button>
        <button onClick={() => scrollToSection("contact")}>Contact</button>
      </nav>

      <div className="nav__right">
        <div className={`np${currentTrack ? " on" : ""}`}>
          <div className="np__eq" aria-hidden="true">
            <i style={{ animationPlayState: isPlaying ? "running" : "paused" }} />
            <i style={{ animationPlayState: isPlaying ? "running" : "paused" }} />
            <i style={{ animationPlayState: isPlaying ? "running" : "paused" }} />
            <i style={{ animationPlayState: isPlaying ? "running" : "paused" }} />
          </div>
          <span>Now Playing</span>
          <b>{currentTrack?.title ?? ""}</b>
        </div>

        <button className="nav-mute" type="button">
          <span className="nav-mute__icon">⇆</span>
          MUTED
        </button>

        <button
          className="hud hud--ghost hud--sm"
          onClick={() => scrollToSection("contact")}
          style={{ display: "none" } as React.CSSProperties}
        >
          <span className="hud__in">Demo Submission</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            color: "var(--ink-2)",
            padding: "8px",
          }}
          className="md-menu-btn"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: "var(--ink-2)", padding: "8px" }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="nav__mobile-menu">
          <button onClick={() => scrollToSection("releases")}>Releases</button>
          <button onClick={() => scrollToSection("artists")}>Artists</button>
          <button onClick={() => scrollToSection("about")}>About</button>
          <button onClick={() => scrollToSection("contact")}>Contact</button>
        </div>
      )}

      <style>{`
        @media (min-width: 821px) {
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 820px) {
          .mobile-toggle { display: grid !important; place-items: center; }
        }
      `}</style>
    </header>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__brand">
            <div className="nav__brand" style={{ marginBottom: 16 }}>
              <img
                src="/logo-dark.webp"
                alt="THR"
                style={{ width: 28, height: 28, objectFit: "contain" }}
                loading="lazy"
              />
              <span className="nav__name" style={{ fontSize: 18 }}>
                Tinnie&nbsp;<b>House</b>&nbsp;<span className="nav__name-rec">Records</span>
              </span>
            </div>
            <p>
              Pushing the boundaries of underground electronic music from the Gold Coast, Australia.
            </p>
          </div>

          <div className="foot__col">
            <h5>Label</h5>
            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); }}>About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>Contact</a>
            <a href="#releases" onClick={(e) => { e.preventDefault(); document.getElementById("releases")?.scrollIntoView({ behavior: "smooth" }); }}>Releases</a>
            <a href="#artists" onClick={(e) => { e.preventDefault(); document.getElementById("artists")?.scrollIntoView({ behavior: "smooth" }); }}>Artists</a>
          </div>

          <div className="foot__col">
            <h5>Listen</h5>
            <a href="https://www.beatport.com/label/tinnie-house-records/50650" target="_blank" rel="noopener noreferrer">Beatport</a>
            <a href="https://soundcloud.com/tinniehouserecords" target="_blank" rel="noopener noreferrer">SoundCloud</a>
            <a href="https://www.junodownload.com/labels/Tinnie+House/" target="_blank" rel="noopener noreferrer">Juno Download</a>
            <a href="https://www.youtube.com/@tinniehouserecords3141" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>

          <div className="foot__col">
            <h5>Connect</h5>
            <a href="https://www.instagram.com/tinnie_house_records/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://x.com/Tinnie_House" target="_blank" rel="noopener noreferrer">Twitter / X</a>
            <a href="https://www.facebook.com/TinnieHouse/" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>

        <div className="foot__bot">
          <span>© 2026 Tinnie House Records. All rights reserved.</span>
          <div className="links">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="tinnie-house-theme">
      <PlaybackProvider>
        <TooltipProvider>
          <div className="fx-vignette" />
          <div className="fx-scan" />
          <div className="fx-grain" />

          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-1)" }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </PlaybackProvider>
    </ThemeProvider>
  );
}

export default App;
