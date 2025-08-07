import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, AlertTriangle, Camera, Play } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [detectionBoxes, setDetectionBoxes] = useState<Array<{x: number, y: number, width: number, height: number, label: string}>>([]);
  const { toast } = useToast();

  // Enhanced camera access with better error handling
  const startCamera = async () => {
    setIsLoading(true);
    setCameraError("");
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported by this browser");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
          setIsLoading(false);
        };
        
        videoRef.current.onerror = () => {
          setCameraError("Failed to load video stream");
          setIsLoading(false);
        };
      }
      
    } catch (error: any) {
      console.error("Camera access error:", error);
      let errorMessage = "Unable to access camera. ";
      
      if (error.name === 'NotAllowedError') {
        errorMessage += "Please allow camera permissions and refresh the page.";
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No camera found on this device.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage += "Camera not supported by this browser.";
      } else {
        errorMessage += error.message || "Unknown error occurred.";
      }
      
      setCameraError(errorMessage);
      setIsLoading(false);
      
      toast({
        title: "Camera Error",
        description: errorMessage,
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
    setDetectionBoxes([]);
  };

  // Enhanced AI detection with visual indicators
  useEffect(() => {
    if (!isDetectionActive || !stream) {
      setDetectionBoxes([]);
      return;
    }

    const interval = setInterval(() => {
      // Simulate object detection
      const random = Math.random();
      
      if (random < 0.2) { // 20% chance of detection
        const objects = [
          { type: "knife", threat: true, label: "Knife Detected" },
          { type: "scissors", threat: true, label: "Scissors Detected" },
          { type: "blade", threat: true, label: "Sharp Blade" },
          { type: "cutter", threat: true, label: "Box Cutter" },
          { type: "person", threat: false, label: "Person" },
          { type: "hand", threat: false, label: "Hand Movement" }
        ];
        
        const detectedObj = objects[Math.floor(Math.random() * objects.length)];
        
        // Create detection box
        const box = {
          x: Math.random() * 400 + 50,
          y: Math.random() * 200 + 50,
          width: 80 + Math.random() * 40,
          height: 60 + Math.random() * 30,
          label: detectedObj.label
        };
        
        setDetectionBoxes([box]);
        
        if (detectedObj.threat) {
          setThreatStatus("threat");
          setDetectedObject(detectedObj.label);
          onThreatDetected(detectedObj.label);
          
          toast({
            title: "🚨 THREAT DETECTED",
            description: `${detectedObj.label} identified in surveillance area`,
            variant: "destructive",
          });

          // Auto-clear after 4 seconds
          setTimeout(() => {
            setThreatStatus("safe");
            setDetectedObject("");
            setDetectionBoxes([]);
          }, 4000);
        } else {
          // Clear non-threat detections quickly
          setTimeout(() => {
            setDetectionBoxes([]);
          }, 1500);
        }
      }
    }, 2000);

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
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Detection Overlay Canvas */}
          <div className="absolute inset-0 pointer-events-none">
            {detectionBoxes.map((box, index) => (
              <div
                key={index}
                className="absolute border-2 border-primary bg-primary/10 rounded"
                style={{
                  left: `${box.x}px`,
                  top: `${box.y}px`,
                  width: `${box.width}px`,
                  height: `${box.height}px`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
                  {box.label}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex flex-col items-center justify-center p-6">
          {isLoading ? (
            <>
              <Video className="w-16 h-16 text-primary animate-pulse mb-4" />
              <p className="text-sm text-muted-foreground text-center">
                Starting camera...
              </p>
            </>
          ) : cameraError ? (
            <>
              <Camera className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground text-center px-4 mb-4">
                {cameraError}
              </p>
              <Button 
                onClick={startCamera} 
                variant="outline" 
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
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
                {isDetectionActive ? "Camera inactive" : "Detection disabled"}
              </p>
            </>
          )}
        </div>
      )}

      {/* Threat Detection Alert */}
      {threatStatus === "threat" && detectedObject && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-destructive/95 text-destructive-foreground px-4 py-3 rounded-lg border-2 border-destructive animate-pulse shadow-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold">THREAT: {detectedObject}</span>
            </div>
          </div>
        </div>
      )}

      {/* Status Overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <Badge 
          variant={threatStatus === "safe" ? "default" : "destructive"}
          className="px-3 py-1 shadow-md"
        >
          {threatStatus === "safe" ? "🟢 ALL CLEAR" : "🔴 THREAT DETECTED"}
        </Badge>
      </div>

      {/* Detection Status & Info */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        <div className={`w-3 h-3 rounded-full shadow-md ${isDetectionActive && stream ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
        {isDetectionActive && stream && (
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            AI Detection Active
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraFeed;