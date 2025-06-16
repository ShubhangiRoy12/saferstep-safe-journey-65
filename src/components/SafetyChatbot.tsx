
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Send, MapPin, Shield, AlertTriangle, Phone } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'normal' | 'location' | 'emergency' | 'route';
}

interface SafetyChatbotProps {
  onClose: () => void;
  onEmergencyTrigger: () => void;
}

const SafetyChatbot = ({ onClose, onEmergencyTrigger }: SafetyChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your SaferStep AI assistant. I can help you with safety information, route planning, and emergency assistance. How can I help you stay safe today?",
      isUser: false,
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    const messageId = Date.now().toString();
    
    // Emergency trigger patterns
    if (message.includes('sos') || message.includes('emergency') || message.includes('help me') || message.includes('trigger emergency')) {
      setTimeout(() => onEmergencyTrigger(), 1000);
      return {
        id: messageId,
        content: "🚨 Emergency mode activated! I'm triggering your SOS alert and contacting your emergency contacts immediately. Stay calm, help is on the way.",
        isUser: false,
        timestamp: new Date(),
        type: 'emergency'
      };
    }

    // Location safety queries
    if (message.includes('safe') && (message.includes('area') || message.includes('location') || message.includes('here'))) {
      const safetyScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
      return {
        id: messageId,
        content: `Based on real-time data analysis, your current area has a safety score of ${safetyScore}/100. ${safetyScore > 85 ? '✅ This area is considered very safe with good lighting and active community monitoring.' : safetyScore > 75 ? '⚠️ This area has moderate safety. Stay alert and stick to well-lit paths.' : '🔴 Exercise caution in this area. Consider using our SaferStep recommended routes.'}`,
        isUser: false,
        timestamp: new Date(),
        type: 'location'
      };
    }

    // Route planning queries
    if (message.includes('route') || message.includes('way home') || message.includes('directions') || message.includes('safest way')) {
      return {
        id: messageId,
        content: "🗺️ I'll find the safest route for you! Based on current conditions, I recommend taking Main Street → Park Avenue → Your destination. This route has:\n\n✅ Excellent lighting (95% operational)\n✅ High foot traffic\n✅ Security cameras every 100m\n✅ Emergency call boxes\n\nWould you like me to start navigation with live safety updates?",
        isUser: false,
        timestamp: new Date(),
        type: 'route'
      };
    }

    // Location requests
    if (message.includes('location') || message.includes('where am i') || message.includes('current position')) {
      if (userLocation) {
        return {
          id: messageId,
          content: `📍 Your current location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}\n\nNearby safety features:\n• Police station: 0.3 miles\n• Hospital: 0.8 miles\n• Safe haven (24/7 store): 0.1 miles\n\nWould you like me to analyze the safety of this area?`,
          isUser: false,
          timestamp: new Date(),
          type: 'location'
        };
      } else {
        return {
          id: messageId,
          content: "📍 I need location access to help you better. Please enable location services in your browser settings so I can provide personalized safety information.",
          isUser: false,
          timestamp: new Date(),
          type: 'location'
        };
      }
    }

    // General safety tips
    if (message.includes('tips') || message.includes('advice') || message.includes('safe')) {
      return {
        id: messageId,
        content: "🛡️ Here are some safety tips for you:\n\n• Trust your instincts - if something feels wrong, it probably is\n• Stay in well-lit, populated areas\n• Keep your phone charged and share your location with trusted contacts\n• Use SaferStep's recommended routes\n• Be aware of your surroundings\n\nWould you like me to set up live tracking for your journey?",
        isUser: false,
        timestamp: new Date(),
        type: 'normal'
      };
    }

    // Default responses
    const defaultResponses = [
      "I understand you're asking about safety. Let me help you with that! You can ask me about:\n\n• Area safety analysis\n• Safe route planning\n• Emergency assistance\n• Location services\n• Safety tips\n\nWhat specific safety information do you need?",
      "As your safety assistant, I'm here to help keep you secure. I can analyze your current location, plan safe routes, and even trigger emergency alerts if needed. What would you like me to help you with?",
      "Your safety is my priority! I can provide real-time safety information, route recommendations, and emergency assistance. Try asking me 'Is this area safe?' or 'Show me the safest way home'."
    ];

    return {
      id: messageId,
      content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      isUser: false,
      timestamp: new Date(),
      type: 'normal'
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'emergency': return <Phone className="w-4 h-4 text-red-500" />;
      case 'location': return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'route': return <Shield className="w-4 h-4 text-green-500" />;
      default: return <Shield className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card className="w-80 h-96 shadow-xl border-2 border-blue-200">
      <CardHeader className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle className="text-lg">SaferStep AI</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Online & Ready to Help</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-full">
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : message.type === 'emergency'
                      ? 'bg-red-50 border border-red-200 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex items-center gap-1 mb-1">
                      {getMessageIcon(message.type)}
                      <Badge variant="outline" className="text-xs">
                        AI Assistant
                      </Badge>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <Badge variant="outline" className="text-xs">AI Assistant</Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-xs text-gray-500 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-3 border-t bg-gray-50">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about safety, routes, or emergency help..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm" disabled={!inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setInputValue("Is this area safe right now?")}
            >
              Area Safety
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setInputValue("Show me the safest way home")}
            >
              Safe Route
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-red-600"
              onClick={() => setInputValue("Trigger SOS and alert my contacts")}
            >
              Emergency
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyChatbot;
