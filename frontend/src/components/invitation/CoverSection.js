import React, { useEffect, useState } from 'react';
import { ChevronDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/themes/ThemeProvider';

const CoverSection = ({ invitation, guestName, onOpenInvitation }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);
  
  // Get cover photo
  const coverPhoto = invitation.cover_photo || 
    invitation.groom?.photo || 
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800';

  const groomName = invitation.groom?.name || 'Groom';
  const brideName = invitation.bride?.name || 'Bride';

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      data-testid="cover-section"
      style={{
        background: `linear-gradient(180deg, ${theme.gradientStart} 0%, ${theme.gradientMid} 40%, ${theme.gradientEnd} 100%)`
      }}
    >
      {/* Background Pattern - Subtle circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative circles */}
        <div 
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20"
          style={{ 
            background: `radial-gradient(circle, ${theme.accentColor}40 0%, transparent 70%)` 
          }}
        />
        <div 
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-15"
          style={{ 
            background: `radial-gradient(circle, ${theme.accentColor}40 0%, transparent 70%)` 
          }}
        />
        <div 
          className="absolute top-1/4 right-10 w-20 h-20 rounded-full opacity-20"
          style={{ backgroundColor: theme.accentColor }}
        />
        <div 
          className="absolute bottom-1/3 left-8 w-12 h-12 rounded-full opacity-15"
          style={{ backgroundColor: theme.accentColor }}
        />
        
        {/* Elegant curved lines */}
        <svg className="absolute top-0 left-0 w-48 h-48 opacity-30" viewBox="0 0 100 100">
          <path 
            d="M0,50 Q30,30 50,50 T100,50" 
            stroke={theme.accentColor} 
            strokeWidth="0.5" 
            fill="none"
          />
          <path 
            d="M0,60 Q40,40 60,60 T100,60" 
            stroke={theme.accentColor} 
            strokeWidth="0.3" 
            fill="none"
          />
        </svg>
        <svg className="absolute bottom-0 right-0 w-48 h-48 opacity-30 rotate-180" viewBox="0 0 100 100">
          <path 
            d="M0,50 Q30,30 50,50 T100,50" 
            stroke={theme.accentColor} 
            strokeWidth="0.5" 
            fill="none"
          />
          <path 
            d="M0,60 Q40,40 60,60 T100,60" 
            stroke={theme.accentColor} 
            strokeWidth="0.3" 
            fill="none"
          />
        </svg>
      </div>
      
      {/* Main Content Container */}
      <div className={`text-center px-6 relative z-20 max-w-md mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Photo Frame - Centered with gold border */}
        <div className={`relative mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          {/* Outer decorative ring - animated */}
          <div 
            className="absolute inset-0 w-44 h-44 md:w-52 md:h-52 mx-auto rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${theme.accentColor}50, transparent, ${theme.accentColor}30, transparent, ${theme.accentColor}50)`,
              transform: 'scale(1.15)',
              animation: 'spin-slow 20s linear infinite'
            }}
          />
          
          {/* Gold border frame */}
          <div 
            className="relative w-44 h-44 md:w-52 md:h-52 mx-auto rounded-full p-1"
            style={{
              background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.accentColor}80, ${theme.accentColor})`,
              boxShadow: `0 0 30px ${theme.accentColor}30, 0 0 60px ${theme.accentColor}15`
            }}
          >
            {/* Inner white border */}
            <div 
              className="w-full h-full rounded-full p-1"
              style={{ backgroundColor: 'white' }}
            >
              {/* Photo */}
              <img 
                src={coverPhoto}
                alt="Couple"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          
          {/* Heart badge at bottom */}
          <div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.primaryColor})`,
              boxShadow: `0 4px 15px ${theme.accentColor}50`
            }}
          >
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
        
        {/* The Wedding Of text */}
        <p 
          className={`text-xs md:text-sm uppercase tracking-[0.3em] mb-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-70' : 'opacity-0'}`}
          style={{ 
            color: theme.primaryColor,
            fontFamily: theme.fontBody
          }}
        >
          The Wedding Of
        </p>
        
        {/* Couple Names - HORIZONTAL LAYOUT */}
        <div className={`flex items-center justify-center gap-3 md:gap-4 mb-4 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <h1 
            className="font-script text-4xl md:text-5xl"
            style={{ color: theme.primaryColor }}
          >
            {groomName}
          </h1>
          
          <span 
            className="font-script text-3xl md:text-4xl"
            style={{ color: theme.accentColor }}
          >
            &
          </span>
          
          <h1 
            className="font-script text-4xl md:text-5xl"
            style={{ color: theme.primaryColor }}
          >
            {brideName}
          </h1>
        </div>
        
        {/* Date */}
        {invitation.events?.[0]?.date && (
          <p 
            className={`text-sm mb-6 transition-all duration-700 delay-500 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
            style={{ color: theme.primaryColor }}
          >
            {new Date(invitation.events[0].date).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        )}
        
        {/* Guest Name Card */}
        <div 
          className={`mb-6 py-4 px-6 rounded-2xl transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{
            background: `linear-gradient(135deg, ${theme.secondaryColor}90, ${theme.secondaryColor}60)`,
            border: `1px solid ${theme.accentColor}20`,
            backdropFilter: 'blur(10px)'
          }}
        >
          <p className="text-xs text-muted-foreground mb-1">Kepada Yth.</p>
          <p className="text-xs text-muted-foreground">Bapak/Ibu/Saudara/i</p>
          <p 
            className="text-lg md:text-xl font-serif mt-2"
            style={{ color: theme.primaryColor }}
          >
            {guestName}
          </p>
        </div>
        
        {/* Open Button */}
        <Button
          onClick={onOpenInvitation}
          className={`group px-8 py-6 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-500 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          data-testid="open-invitation-btn"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
            color: 'white'
          }}
        >
          <span className="mr-2">Buka Undangan</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:translate-y-1 transition-transform" />
        </Button>
      </div>
      
      {/* CSS Animation for slow spin */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg) scale(1.15); }
          to { transform: rotate(360deg) scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default CoverSection;
