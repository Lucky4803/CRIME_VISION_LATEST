import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Calendar,
  Users,
  Shield,
  AlertCircle,
  Clock
} from "lucide-react";

// Mock crime statistics data
const crimeStats = {
  overview: {
    totalCrimes: 1234,
    thisMonth: 89,
    monthlyChange: -12.5,
    clearanceRate: 78.3
  },
  topCategories: [
    { type: "Theft", count: 456, change: -8.2 },
    { type: "Burglary", count: 234, change: -15.3 },
    { type: "Assault", count: 189, change: 5.7 },
    { type: "Vandalism", count: 156, change: -22.1 },
    { type: "Drug Offenses", count: 134, change: -11.8 }
  ],
  recentIncidents: [
    {
      id: 1,
      type: "Theft",
      location: "Bhubaneswar City Center",
      time: "2 hours ago",
      status: "Investigating"
    },
    {
      id: 2,
      type: "Burglary",
      location: "Cuttack Old Town",
      time: "5 hours ago",
      status: "Resolved"
    },
    {
      id: 3,
      type: "Vandalism",
      location: "Puri Beach Road",
      time: "1 day ago",
      status: "Under Review"
    },
    {
      id: 4,
      type: "Drug Offense",
      location: "Berhampur Market",
      time: "2 days ago",
      status: "Resolved"
    }
  ],
  news: [
    {
      id: 1,
      title: "Crime Rate Drops 15% in Bhubaneswar",
      summary: "New AI surveillance systems contribute to significant reduction in street crimes.",
      time: "3 hours ago",
      source: "Odisha Police"
    },
    {
      id: 2,
      title: "Major Drug Bust in Cuttack",
      summary: "Police seize contraband worth ₹2 crores in coordinated operation.",
      time: "1 day ago",
      source: "Times of India"
    },
    {
      id: 3,
      title: "Smart City Initiative Shows Results",
      summary: "Technology-driven policing reduces response time by 40% across Odisha.",
      time: "2 days ago",
      source: "Hindustan Times"
    }
  ]
};

const CrimeStats = () => {
  return (
    <div className="min-h-screen bg-gradient-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Crime Statistics</h1>
            <p className="text-muted-foreground">Live crime data and analytics for Odisha</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Crimes (YTD)</p>
                  <p className="text-2xl font-bold text-foreground">{crimeStats.overview.totalCrimes.toLocaleString()}</p>
                </div>
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">{crimeStats.overview.thisMonth}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-success" />
                    <span className="text-xs text-success">
                      {Math.abs(crimeStats.overview.monthlyChange)}% from last month
                    </span>
                  </div>
                </div>
                <Calendar className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clearance Rate</p>
                  <p className="text-2xl font-bold text-foreground">{crimeStats.overview.clearanceRate}%</p>
                </div>
                <Users className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Detections</p>
                  <p className="text-2xl font-bold text-foreground">247</p>
                  <p className="text-xs text-muted-foreground">This week</p>
                </div>
                <AlertCircle className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crime Categories */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Top Crime Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {crimeStats.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{category.type}</p>
                      <p className="text-sm text-muted-foreground">{category.count} cases</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {category.change < 0 ? (
                      <TrendingDown className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm ${category.change < 0 ? 'text-success' : 'text-destructive'}`}>
                      {Math.abs(category.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Recent Incidents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {crimeStats.recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{incident.type}</span>
                      <Badge 
                        variant={
                          incident.status === "Resolved" ? "default" : 
                          incident.status === "Investigating" ? "destructive" : 
                          "secondary"
                        }
                        className="text-xs"
                      >
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {incident.location}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {incident.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Crime News */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Latest Crime News
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {crimeStats.news.map((article) => (
              <div key={article.id} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-smooth cursor-pointer">
                <h3 className="font-semibold text-foreground mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{article.summary}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Source: {article.source}</span>
                  <span>{article.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrimeStats;