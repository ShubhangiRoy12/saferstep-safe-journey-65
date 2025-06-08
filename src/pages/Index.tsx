import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Search, Phone } from 'lucide-react';
import SafetyMap from '@/components/SafetyMap';
import EmergencyPanel from '@/components/EmergencyPanel';
import RoutePanel from '@/components/RoutePanel';
import CommunityReports from '@/components/CommunityReports';
import LiveTracking from '@/components/LiveTracking';
import OfflineMode from '@/components/OfflineMode';
import DelhiRoutes from '@/components/DelhiRoutes';
import SafetyContacts from '@/components/SafetyContacts';

const Index = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [destination, setDestination] = useState('');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="safety-gradient text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SaferStep</h1>
              <p className="text-blue-100 text-sm">Navigate not just faster, but safer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <OfflineMode />
            <Button
              variant={isEmergencyMode ? "destructive" : "secondary"}
              size="sm"
              onClick={() => setIsEmergencyMode(!isEmergencyMode)}
              className={isEmergencyMode ? "animate-pulse-emergency" : ""}
            >
              <Phone className="w-4 h-4 mr-2" />
              {isEmergencyMode ? "Emergency Active" : "Emergency"}
            </Button>
          </div>
        </div>
      </header>

      {/* Emergency Panel */}
      {isEmergencyMode && (
        <div className="animate-slide-up">
          <EmergencyPanel onClose={() => setIsEmergencyMode(false)} />
        </div>
      )}

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Quick Search */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Where would you like to go safely?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter destination address..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Find Safe Route
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'map', label: 'Safety Map', badge: 'Live' },
            { id: 'delhi', label: 'Delhi Routes', badge: 'NCR' },
            { id: 'routes', label: 'Safe Routes', badge: 'AI' },
            { id: 'reports', label: 'Community Reports', badge: '24' },
            { id: 'tracking', label: 'Live Tracking', badge: 'New' },
            { id: 'contacts', label: 'Safety Contacts', badge: 'Emergency' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {tab.label}
              <Badge variant="secondary" className="text-xs">
                {tab.badge}
              </Badge>
            </Button>
          ))}
        </div>

        <Separator />

        {/* Tab Content */}
        <div className="animate-slide-up">
          {activeTab === 'map' && <SafetyMap />}
          {activeTab === 'delhi' && <DelhiRoutes />}
          {activeTab === 'routes' && <RoutePanel destination={destination} />}
          {activeTab === 'reports' && <CommunityReports />}
          {activeTab === 'tracking' && <LiveTracking />}
          {activeTab === 'contacts' && <SafetyContacts />}
        </div>
      </div>
    </div>
  );
};

export default Index;
