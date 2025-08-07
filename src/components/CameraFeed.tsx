import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, AlertTriangle, Camera, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

interface CameraFeedProps {
  isDetectionActive: boolean;
  onToggleDetection: () => void;
  onThreatDetected: (threat: string) => void;
}

const CameraFeed = ({ isDetectionActive, onToggleDetection, onThreatDetected }: CameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [threatStatus, setThreatStatus] = useState<"safe" | "threat">("safe");
  const [detectedObject, setDetectedObject] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectionBoxes, setDetectionBoxes] = useState<Array<{x: number, y: number, width: number, height: number, label: string}>>([]);
  const { toast } = useToast();

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError("");
    
    try {
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
      
      const videoElement = videoRef.current;
      if (videoElement) {
        // Assign srcObject and wait for it to be loaded before playing
        videoElement.srcObject = mediaStream; 
        videoElement.onloadedmetadata = () => {
          videoElement.play().catch(console.error);
          setIsLoading(false);
        };
        videoElement.onerror = () => {
          setCameraError("Failed to load video stream");
          setIsLoading(false);
        };
      } else {
        console.error("Video element not found.");
        stopCamera();
        setCameraError("Video display element not found.");
        setIsLoading(false);
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

  useEffect(() => {
    let animationFrameId: number;
    let model: cocoSsd.ObjectDetection | null = null;
    
    const loadModel = async () => {
      try {
        await tf.ready();
        model = await cocoSsd.load();
        console.log("Model loaded successfully.");
      } catch (e) {
        console.error("Failed to load model:", e);
      }
    };

    const detectFrame = async () => {
      if (videoRef.current && model && isDetectionActive && stream) {
        const predictions = await model.detect(videoRef.current);
        
        const filteredPredictions = predictions.filter(p => p.score > 0.6);
        
        const newDetectionBoxes = filteredPredictions.map(p => ({
          x: p.bbox[0],
          y: p.bbox[1],
          width: p.bbox[2],
          height: p.bbox[3],
          label: p.class
        }));
        
        setDetectionBoxes(newDetectionBoxes);
        
        const threatDetected = newDetectionBoxes.find(box => box.label === "knife" || box.label === "scissors" || box.label === "gun");
        if (threatDetected) {
          setThreatStatus("threat");
          setDetectedObject(threatDetected.label);
          onThreatDetected(threatDetected.label);
        } else {
          setThreatStatus("safe");
          setDetectedObject("");
        }
      }
      animationFrameId = requestAnimationFrame(detectFrame);
    };

    if (isDetectionActive && stream) {
      loadModel().then(() => {
        detectFrame();
      });
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDetectionActive, stream, onThreatDetected]);

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
      {stream && !cameraError ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
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
              <Button onClick={startCamera} variant="outline" size="sm">
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

      <div className="absolute bottom-4 left-4 z-10">
        <Badge 
          variant={threatStatus === "safe" ? "default" : "destructive"}
          className="px-3 py-1 shadow-md"
        >
          {threatStatus === "safe" ? "🟢 ALL CLEAR" : "🔴 THREAT DETECTED"}
        </Badge>
      </div>

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