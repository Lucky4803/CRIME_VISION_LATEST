import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Eye, 
  Shield, 
  AlertTriangle,
  Calendar,
  Clock,
  Users,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CameraFeed from "@/components/CameraFeed";
import OdishaCrimeNews from "@/components/OdishaCrimeNews";

const Dashboard = () => {
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [threatStatus, setThreatStatus] = useState<"safe" | "threat">("safe");
  const [detectedObject, setDetectedObject] = useState<string>("");
  const [stats, setStats] = useState({
    threatsToday: 0,
    totalDetections: 0,
    activeTime: "0h 0m",
    accuracy: "98.5%"
  });

  const { toast } = useToast();

  const handleThreatDetected = (threat: string) => {
    setStats(prev => ({
      ...prev,
      threatsToday: prev.threatsToday + 1,
      totalDetections: prev.totalDetections + 1
    }));
  };

  const toggleDetection = () => {
    setIsDetectionActive(!isDetectionActive);
    toast({
      title: isDetectionActive ? "Detection Stopped" : "Detection Started",
      description: isDetectionActive 
        ? "AI surveillance monitoring disabled" 
        : "AI surveillance monitoring active",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Crime Vision Dashboard</h1>
              <p className="text-muted-foreground">AI-Powered Surveillance System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={isDetectionActive ? "default" : "secondary"} className="px-4 py-2">
              {isDetectionActive ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Threats Today</p>
                  <p className="text-2xl font-bold text-foreground">{stats.threatsToday}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Detections</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalDetections}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Time</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeTime}</p>
                </div>
                <Clock className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold text-foreground">{stats.accuracy}</p>
                </div>
                <Shield className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Feed */}
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Live Camera Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CameraFeed 
                isDetectionActive={isDetectionActive}
                onToggleDetection={toggleDetection}
                onThreatDetected={handleThreatDetected}
              />

              <div className="flex gap-4 mt-4">
                <Button
                  onClick={toggleDetection}
                  variant={isDetectionActive ? "destructive" : "glow"}
                  className="flex-1"
                >
                  {isDetectionActive ? (
                    <>
                      <VideoOff className="w-4 h-4 mr-2" />
                      Stop Detection
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Start Detection
                    </>
                  )}
                </Button>
                
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System Active</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Person Detected</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sharp Object Alert</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Odisha Crime Details */}
        <OdishaCrimeNews />
      </div>
    </div>
  );
};

export default Dashboard;