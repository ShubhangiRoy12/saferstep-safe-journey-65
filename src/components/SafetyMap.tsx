
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface SafetyZone {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  incidents: number;
  lastUpdated: string;
}

const SafetyMap = () => {
  const [selectedZone, setSelectedZone] = useState<SafetyZone | null>(null);

  const safetyZones: SafetyZone[] = [
    { id: '1', name: 'Downtown Core', riskLevel: 'low', incidents: 2, lastUpdated: '5 min ago' },
    { id: '2', name: 'University District', riskLevel: 'low', incidents: 1, lastUpdated: '12 min ago' },
    { id: '3', name: 'Industrial Area', riskLevel: 'medium', incidents: 8, lastUpdated: '3 min ago' },
    { id: '4', name: 'Riverside Park', riskLevel: 'high', incidents: 15, lastUpdated: '1 min ago' },
    { id: '5', name: 'Shopping Center', riskLevel: 'low', incidents: 0, lastUpdated: '8 min ago' },
    { id: '6', name: 'Transit Hub', riskLevel: 'medium', incidents: 4, lastUpdated: '6 min ago' }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-amber-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Map Visualization */}
      <div className="lg:col-span-2">
        <Card className="h-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Live Safety Heatmap
              <Badge variant="outline" className="ml-auto">Real-time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 bg-gradient-to-br from-blue-50 to-slate-100 rounded-lg overflow-hidden">
              {/* Simulated Map with Safety Zones */}
              <div className="absolute inset-0 p-4">
                <div className="grid grid-cols-3 gap-2 h-full">
                  {safetyZones.map((zone, index) => (
                    <div
                      key={zone.id}
                      className={`relative rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${getRiskColor(zone.riskLevel)} opacity-70 hover:opacity-90`}
                      onClick={() => setSelectedZone(zone)}
                      style={{
                        gridColumn: index === 3 ? 'span 2' : 'span 1',
                        gridRow: index >= 4 ? '2' : '1'
                      }}
                    >
                      <div className="absolute inset-2 bg-white/20 rounded flex items-center justify-center">
                        <div className="text-center text-white text-sm font-medium">
                          <div className="text-xs opacity-90">{zone.name}</div>
                          <div className="text-lg font-bold">{zone.incidents}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="text-xs font-medium mb-2">Risk Level</div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                    <span className="text-xs">Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs">High</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zone Details */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Zone Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedZone ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedZone.name}</h3>
                  <Badge className={getRiskBadge(selectedZone.riskLevel)}>
                    {selectedZone.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Incidents:</span>
                    <span className="font-medium">{selectedZone.incidents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{selectedZone.lastUpdated}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Avoid This Area
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Click on a zone to view details</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">City Safety Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Overall Safety Score</span>
              <Badge className="bg-green-100 text-green-800">87/100</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Active Incidents</span>
              <span className="font-medium">30</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Safe Routes Available</span>
              <span className="font-medium">142</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Community Reports</span>
              <span className="font-medium">68 today</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SafetyMap;
