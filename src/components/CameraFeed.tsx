import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, AlertTriangle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraFeedProps {
  isDetectionActive: boolean;
  onToggleDetection: () => void;
  onThreatDetected: (threat: string) => void;
}

const CameraFeed = ({ isDetectionActive, onToggleDetection, onThreatDetected }: CameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [threatStatus, setThreatStatus] = useState<"safe" | "threat">("safe");
  const [detectedObject, setDetectedObject] = useState<string>("");
  const { toast } = useToast();

  // Camera access
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError("");
    } catch (error) {
      console.error("Camera access denied:", error);
      setCameraError("Camera access denied. Please allow camera permissions.");
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Simulated AI detection
  useEffect(() => {
    if (!isDetectionActive || !stream) return;

    const interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.15) { // 15% chance of threat detection
        const threats = [
          "Knife Detected",
          "Sharp Object - Scissors", 
          "Blade Weapon",
          "Metal Sharp Object",
          "Cutting Tool"
        ];
        const threat = threats[Math.floor(Math.random() * threats.length)];
        setThreatStatus("threat");
        setDetectedObject(threat);
        onThreatDetected(threat);
        
        toast({
          title: "⚠️ THREAT DETECTED",
          description: `${threat} identified in surveillance area`,
          variant: "destructive",
        });

        // Auto-clear after 4 seconds
        setTimeout(() => {
          setThreatStatus("safe");
          setDetectedObject("");
        }, 4000);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isDetectionActive, stream, onThreatDetected, toast]);

  // Initialize camera on component mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleToggleDetection = () => {
    if (!stream && !cameraError) {
      startCamera();
    }
    onToggleDetection();
  };

  return (
    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
      {/* Camera Feed */}
      {stream && !cameraError ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center">
          {cameraError ? (
            <>
              <Camera className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground text-center px-4">
                {cameraError}
              </p>
              <Button 
                onClick={startCamera} 
                variant="outline" 
                className="mt-4"
              >
                Try Again
              </Button>
            </>
          ) : (
            <>
              {isDetectionActive ? (
                <Video className="w-16 h-16 text-primary animate-pulse" />
              ) : (
                <VideoOff className="w-16 h-16 text-muted-foreground" />
              )}
              <p className="text-sm text-muted-foreground mt-4">
                {isDetectionActive ? "Starting camera..." : "Camera inactive"}
              </p>
            </>
          )}
        </div>
      )}

      {/* Detection Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: isDetectionActive ? 'block' : 'none' }}
      />

      {/* Threat Detection Overlay */}
      {threatStatus === "threat" && detectedObject && (
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg border-2 border-destructive animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold">THREAT: {detectedObject}</span>
            </div>
          </div>
        </div>
      )}

      {/* Status Overlay */}
      <div className="absolute bottom-4 left-4">
        <Badge 
          variant={threatStatus === "safe" ? "default" : "destructive"}
          className="px-3 py-1"
        >
          {threatStatus === "safe" ? "ALL CLEAR" : "THREAT DETECTED"}
        </Badge>
      </div>

      {/* Detection Status Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-3 h-3 rounded-full ${isDetectionActive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
      </div>
    </div>
  );
};

export default CameraFeed;