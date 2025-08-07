import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  Camera,
  Clock
} from "lucide-react";

// Mock detection data
const mockDetections = [
  {
    id: 1,
    timestamp: "2024-01-07 14:30:25",
    threatType: "Knife",
    confidence: "95.2%",
    camera: "Camera 01 - Main Entrance",
    status: "threat",
    image: "detection-1.jpg"
  },
  {
    id: 2,
    timestamp: "2024-01-07 13:15:42",
    threatType: "Sharp Object",
    confidence: "87.8%",
    camera: "Camera 02 - Corridor",
    status: "threat",
    image: "detection-2.jpg"
  },
  {
    id: 3,
    timestamp: "2024-01-07 12:45:18",
    threatType: "Person",
    confidence: "99.1%",
    camera: "Camera 01 - Main Entrance",
    status: "safe",
    image: "detection-3.jpg"
  },
  {
    id: 4,
    timestamp: "2024-01-07 11:22:33",
    threatType: "Scissors",
    confidence: "92.5%",
    camera: "Camera 03 - Security Room",
    status: "threat",
    image: "detection-4.jpg"
  },
  {
    id: 5,
    timestamp: "2024-01-07 10:08:15",
    threatType: "Person",
    confidence: "98.7%",
    camera: "Camera 02 - Corridor",
    status: "safe",
    image: "detection-5.jpg"
  }
];

const History = () => {
  const [filter, setFilter] = useState("all");
  const [searchDate, setSearchDate] = useState("");

  const filteredDetections = mockDetections.filter(detection => {
    if (filter === "threats" && detection.status !== "threat") return false;
    if (filter === "safe" && detection.status !== "safe") return false;
    if (searchDate && !detection.timestamp.includes(searchDate)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Detection History</h1>
              <p className="text-muted-foreground">Review past surveillance detections</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter by:</span>
              </div>
              
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Detections</SelectItem>
                  <SelectItem value="threats">Threats Only</SelectItem>
                  <SelectItem value="safe">Safe Detections</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-auto"
                placeholder="Filter by date"
              />

              <div className="ml-auto text-sm text-muted-foreground">
                Showing {filteredDetections.length} of {mockDetections.length} detections
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detection List */}
        <div className="space-y-4">
          {filteredDetections.map((detection) => (
            <Card key={detection.id} className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/70 transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Detection Image Placeholder */}
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>

                  {/* Detection Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={detection.status === "threat" ? "destructive" : "default"}
                        className="font-medium"
                      >
                        {detection.status === "threat" ? "THREAT" : "SAFE"}
                      </Badge>
                      <span className="text-lg font-semibold text-foreground">
                        {detection.threatType}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {detection.confidence} confidence
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {detection.timestamp}
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        {detection.camera}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {detection.status === "threat" && (
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDetections.length === 0 && (
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Detections Found</h3>
              <p className="text-muted-foreground">
                No surveillance detections match your current filter criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;