import { Switch, Route, Link } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { Menu } from "lucide-react";
import { useState } from "react";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import CookiePolicy from "@/pages/cookie-policy";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-background/10 supports-[backdrop-filter]:bg-background/10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Logo size="md" />
            <span className="font-orbitron font-bold text-xl tracking-wide">Tinnie House Records</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <button onClick={() => scrollToSection("releases")} className="text-sm font-medium hover:text-blue-500 transition-colors">
            Releases
          </button>
          <button onClick={() => scrollToSection("artists")} className="text-sm font-medium hover:text-blue-500 transition-colors">
            Artists
          </button>
          <button onClick={() => scrollToSection("about")} className="text-sm font-medium hover:text-blue-500 transition-colors">
            About
          </button>
          <button onClick={() => scrollToSection("contact")} className="text-sm font-medium hover:text-blue-500 transition-colors">
            Contact
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <button 
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t backdrop-blur-md bg-background/10">
          <div className="container py-4 space-y-2">
            <button onClick={() => scrollToSection("releases")} className="block py-2 text-sm font-medium hover:text-blue-500 transition-colors w-full text-left">
              Releases
            </button>
            <button onClick={() => scrollToSection("artists")} className="block py-2 text-sm font-medium hover:text-blue-500 transition-colors w-full text-left">
              Artists
            </button>
            <button onClick={() => scrollToSection("about")} className="block py-2 text-sm font-medium hover:text-blue-500 transition-colors w-full text-left">
              About
            </button>
            <button onClick={() => scrollToSection("contact")} className="block py-2 text-sm font-medium hover:text-blue-500 transition-colors w-full text-left">
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Logo size="sm" />
              <span className="font-orbitron font-bold tracking-wide">Tinnie House Records</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pushing the boundaries of electronic music since 2015.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Music</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#releases" className="hover:text-blue-500 transition-colors">Latest Releases</a></li>
              <li><a href="#artists" className="hover:text-blue-500 transition-colors">Artists</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Label</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-blue-500 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Demo Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://www.beatport.com/label/tinnie-house-records/50650" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Beatport</a></li>
              <li><a href="https://soundcloud.com/tinniehouserecords" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">SoundCloud</a></li>
              <li><a href="https://www.youtube.com/@tinniehouserecords3141" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">YouTube</a></li>
              <li><a href="https://www.instagram.com/tinnie_house_records/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Instagram</a></li>
              <li><a href="https://x.com/Tinnie_House" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Twitter</a></li>
              <li><a href="https://www.facebook.com/TinnieHouse/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Facebook</a></li>
              <li><a href="https://www.junodownload.com/labels/Tinnie+House/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Juno Download</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t text-sm text-muted-foreground">
          <p>&copy; 2025 Tinnie House Records. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-blue-500 transition-colors">Cookie Policy</Link>
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
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
