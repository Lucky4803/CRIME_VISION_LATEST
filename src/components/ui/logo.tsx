import { Eye } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 48
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative">
        <Eye 
          size={iconSizes[size]} 
          className="text-primary drop-shadow-glow animate-pulse" 
        />
        <div className="absolute inset-0 bg-gradient-glow rounded-full opacity-30" />
      </div>
      <div className={`font-bold text-foreground tracking-wider ${sizeClasses[size]}`}>
        <span className="text-primary">CRIME</span>
        <br />
        <span className="text-accent">VISION</span>
      </div>
    </div>
  );
}