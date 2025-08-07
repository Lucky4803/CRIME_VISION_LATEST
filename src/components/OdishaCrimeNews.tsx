import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, AlertTriangle, TrendingUp } from "lucide-react";

const OdishaCrimeNews = () => {
  const crimeStats = [
    {
      type: "Theft Cases",
      count: 127,
      trend: "+8%",
      location: "Bhubaneswar",
      severity: "medium"
    },
    {
      type: "Assault",
      count: 45,
      trend: "-12%", 
      location: "Cuttack",
      severity: "high"
    },
    {
      type: "Cyber Crime",
      count: 89,
      trend: "+25%",
      location: "Puri",
      severity: "high"
    },
    {
      type: "Drug Seizure",
      count: 34,
      trend: "+5%",
      location: "Rourkela",
      severity: "medium"
    }
  ];

  const recentIncidents = [
    {
      title: "Armed Robbery at Jewelry Store",
      location: "Bhubaneswar Market Area",
      time: "2 hours ago",
      severity: "high",
      details: "Police responded to armed robbery incident. Suspects fled with valuable items."
    },
    {
      title: "Drug Trafficking Bust",
      location: "Cuttack Railway Station", 
      time: "5 hours ago",
      severity: "medium",
      details: "Major drug smuggling operation intercepted. 3 suspects arrested."
    },
    {
      title: "Cyber Fraud Alert",
      location: "Puri District",
      time: "8 hours ago", 
      severity: "medium",
      details: "Online banking fraud reported. Citizens advised to verify transactions."
    },
    {
      title: "Vehicle Theft Ring Busted",
      location: "Rourkela Industrial Area",
      time: "1 day ago",
      severity: "low",
      details: "Coordinated operation led to arrest of vehicle theft gang members."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Crime Statistics */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Odisha Crime Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crimeStats.map((stat, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{stat.type}</h4>
                  <Badge 
                    variant={stat.severity === "high" ? "destructive" : stat.severity === "medium" ? "secondary" : "default"}
                    className="text-xs"
                  >
                    {stat.severity}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{stat.count}</span>
                  <div className="text-right">
                    <div className={`text-sm ${stat.trend.startsWith('+') ? 'text-destructive' : 'text-success'}`}>
                      {stat.trend}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {stat.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Recent Crime Incidents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentIncidents.map((incident, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground text-sm">{incident.title}</h4>
                <Badge 
                  variant={incident.severity === "high" ? "destructive" : incident.severity === "medium" ? "secondary" : "default"}
                  className="text-xs"
                >
                  {incident.severity}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{incident.details}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {incident.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {incident.time}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OdishaCrimeNews;