import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import { useState } from "react";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Tinnie House Records Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="font-orbitron font-bold text-xl">Tinnie House Records</span>
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
        <div className="md:hidden border-t bg-background">
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
              <img 
                src="/logo.png" 
                alt="Tinnie House Records Logo" 
                className="w-6 h-6 object-contain"
              />
              <span className="font-orbitron font-bold">Tinnie House Records</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pushing the boundaries of electronic music since 2020.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Music</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#releases" className="hover:text-blue-500 transition-colors">Latest Releases</a></li>
              <li><a href="#artists" className="hover:text-blue-500 transition-colors">Artists</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Compilations</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Playlists</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Label</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-blue-500 transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Demo Policy</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Press Kit</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Spotify</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Bandcamp</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t text-sm text-muted-foreground">
          <p>&copy; 2024 Tinnie House Records. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Cookie Policy</a>
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="tinnie-house-theme">
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
    </QueryClientProvider>
  );
}

export default App;
