
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FloatingChatIconProps {
  onClick: () => void;
  isActive: boolean;
}

const FloatingChatIcon = ({ onClick, isActive }: FloatingChatIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Notification badge */}
        {!isActive && (
          <Badge 
            className="absolute -top-2 -right-2 bg-red-500 text-white animate-pulse z-10"
            variant="destructive"
          >
            AI
          </Badge>
        )}
        
        {/* Main chat button */}
        <Button
          onClick={onClick}
          className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isActive ? (
            <Shield className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>

        {/* Floating tooltip */}
        {isHovered && !isActive && (
          <div className="absolute bottom-16 right-0 bg-black text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap animate-slide-up">
            Need help? Chat with SaferStep AI
            <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
          </div>
        )}

        {/* Pulsing ring animation when not active */}
        {!isActive && (
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-30"></div>
        )}
      </div>
    </div>
  );
};

export default FloatingChatIcon;
