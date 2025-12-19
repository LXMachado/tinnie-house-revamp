import { useTheme } from "@/lib/theme-provider";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const { theme } = useTheme();
  
  // Use enhanced logo for dark theme, regular logo for light theme
  const isDarkTheme = theme === "dark";
  const logoSrc = isDarkTheme ? "/logo-dark.png" : "/logo.png";
  
  // Size mapping
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <img
      src={logoSrc}
      alt="Tinnie House Records Logo"
      className={`object-contain ${sizeClasses[size]} ${className}`}
    />
  );
}

// Favicon component that always uses the enhanced dark logo
export function Favicon() {
  return (
    <link
      rel="icon"
      type="image/png"
      href="/logo-dark.png"
    />
  );
}