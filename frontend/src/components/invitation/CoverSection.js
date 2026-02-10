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
  
  // Get cover photo - use provided or fallback
  const coverPhoto = invitation.cover_photo || 
    invitation.groom?.photo || 
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800';

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden theme-${invitation.theme || 'floral'}`}
      data-testid="cover-section"
      style={{
        background: `linear-gradient(180deg, ${theme.gradientStart} 0%, ${theme.gradientMid} 50%, ${theme.gradientEnd} 100%)`
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(theme.primaryColor)}' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Top Left Ornament */}
      <div 
        className={`absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 transition-all duration-1000 ${isVisible ? 'opacity-60 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-10 -translate-y-10'}`}
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0,0 Q50,50 0,100' stroke='${encodeURIComponent(theme.primaryColor)}' stroke-width='0.5' fill='none'/%3E%3Cpath d='M10,0 Q60,50 10,100' stroke='${encodeURIComponent(theme.accentColor)}' stroke-width='0.3' fill='none'/%3E%3Ccircle cx='20' cy='20' r='5' fill='${encodeURIComponent(theme.accentColor)}' opacity='0.3'/%3E%3Ccircle cx='10' cy='40' r='3' fill='${encodeURIComponent(theme.primaryColor)}' opacity='0.2'/%3E%3Ccircle cx='30' cy='10' r='2' fill='${encodeURIComponent(theme.primaryColor)}' opacity='0.2'/%3E%3C/svg%3E") no-repeat`,
          backgroundSize: 'contain'
        }}
      />
      
      {/* Top Right Ornament */}
      <div 
        className={`absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 transition-all duration-1000 ${isVisible ? 'opacity-60 translate-x-0 translate-y-0' : 'opacity-0 translate-x-10 -translate-y-10'}`}
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100,0 Q50,50 100,100' stroke='${encodeURIComponent(theme.primaryColor)}' stroke-width='0.5' fill='none'/%3E%3Cpath d='M90,0 Q40,50 90,100' stroke='${encodeURIComponent(theme.accentColor)}' stroke-width='0.3' fill='none'/%3E%3Ccircle cx='80' cy='20' r='5' fill='${encodeURIComponent(theme.accentColor)}' opacity='0.3'/%3E%3Ccircle cx='90' cy='40' r='3' fill='${encodeURIComponent(theme.primaryColor)}' opacity='0.2'/%3E%3Ccircle cx='70' cy='10' r='2' fill='${encodeURIComponent(theme.primaryColor)}' opacity='0.2'/%3E%3C/svg%3E") no-repeat`,
          backgroundSize: 'contain'
        }}
      />
      
      {/* Bottom Left Ornament */}
      <div 
        className={`absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-60 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-10 translate-y-10'}`}
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0,100 Q50,50 0,0' stroke='${encodeURIComponent(theme.primaryColor)}' stroke-width='0.5' fill='none'/%3E%3Cpath d='M10,100 Q60,50 10,0' stroke='${encodeURIComponent(theme.accentColor)}' stroke-width='0.3' fill='none'/%3E%3Ccircle cx='20' cy='80' r='5' fill='${encodeURIComponent(theme.accentColor)}' opacity='0.3'/%3E%3Ccircle cx='10' cy='60' r='3' fill='${encodeURIComponent(theme.primaryColor)}' opacity='0.2'/%3E%3C/svg%3E") no-repeat`,
          backgroundSize: 'contain'
        }}
      />
      
      {/* Bottom Right Ornament */}
      <div 
        className={`absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-60 translate-x-0 translate-y-0' : 'opacity-0 translate-x-10 translate-y-10'}`}
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M100,100 Q50,50 100,0' stroke='${encodeURIComponent(theme.primaryColor)}' stroke-width='0.5' fill='none'/%3E%3Cpath d='M90,100 Q40,50 90,0' stroke='${encodeURIComponent(theme.accentColor)}' stroke-width='0.3' fill='none'/%3E%3Ccircle cx='80' cy='80' r='5' fill='${encodeURIComponent(theme.accentColor)}' opacity='0.3'/%3E%3Ccircle cx='90' cy='60' r='3' fill='${encodeURIComponent(theme.primaryColor)}' opacity='0.2'/%3E%3C/svg%3E") no-repeat`,
          backgroundSize: 'contain'
        }}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${8 + i * 4}px`,
              height: `${8 + i * 4}px`,
              backgroundColor: i % 2 === 0 ? theme.accentColor : theme.primaryColor,
              opacity: 0.15,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className={`text-center px-6 relative z-20 max-w-md mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Cover Photo with Frame */}
        <div className="relative mb-8">
          {/* Decorative outer ring */}
          <div 
            className="absolute inset-0 w-52 h-52 md:w-64 md:h-64 mx-auto rounded-full animate-spin-slow"
            style={{
              background: `conic-gradient(from 0deg, ${theme.accentColor}40, transparent, ${theme.primaryColor}40, transparent, ${theme.accentColor}40)`,
              transform: 'scale(1.15)'
            }}
          />
          
          {/* Photo frame */}
          <div 
            className="relative w-52 h-52 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden"
            style={{
              border: `4px solid ${theme.accentColor}`,
              boxShadow: `0 0 0 8px ${theme.secondaryColor}, 0 20px 50px ${theme.primaryColor}40`
            }}
          >
            <img 
              src={coverPhoto}
              alt="Couple"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Heart badge */}
          <div 
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center animate-pulse"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
              boxShadow: `0 4px 15px ${theme.primaryColor}50`
            }}
          >
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
        
        {/* Wedding Text */}
        <p 
          className={`text-xs uppercase tracking-[0.4em] mb-3 transition-all duration-700 delay-300 ${isVisible ? 'opacity-70' : 'opacity-0'}`}
          style={{ color: theme.primaryColor }}
        >
          The Wedding Of
        </p>
        
        {/* Couple Names */}
        <h1 
          className={`font-script text-5xl md:text-6xl lg:text-7xl mb-1 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ color: theme.primaryColor }}
        >
          {invitation.groom?.name || 'Groom'}
        </h1>
        
        <p 
          className={`font-script text-3xl md:text-4xl my-2 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ color: theme.accentColor }}
        >
          &
        </p>
        
        <h1 
          className={`font-script text-5xl md:text-6xl lg:text-7xl transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ color: theme.primaryColor }}
        >
          {invitation.bride?.name || 'Bride'}
        </h1>
        
        {/* Divider */}
        <div 
          className={`w-24 h-0.5 mx-auto my-6 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`
          }}
        />
        
        {/* Date Preview */}
        {invitation.events?.[0]?.date && (
          <p 
            className={`text-sm opacity-70 transition-all duration-700 delay-800 ${isVisible ? 'opacity-70' : 'opacity-0'}`}
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
          className={`mt-8 mb-6 p-4 rounded-2xl backdrop-blur-sm transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{
            background: `${theme.secondaryColor}80`,
            border: `1px solid ${theme.accentColor}30`
          }}
        >
          <p className="text-xs text-muted-foreground mb-1">Kepada Yth.</p>
          <p className="text-sm text-muted-foreground">Bapak/Ibu/Saudara/i</p>
          <p 
            className="text-xl font-serif mt-2"
            style={{ color: theme.primaryColor }}
          >
            {guestName}
          </p>
        </div>
        
        {/* Open Button */}
        <Button
          onClick={onOpenInvitation}
          className={`group px-8 py-6 rounded-full text-base font-sans shadow-lg hover:shadow-xl transition-all duration-500 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          data-testid="open-invitation-btn"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
            color: 'white'
          }}
        >
          <span className="mr-2">Buka Undangan</span>
          <ChevronDown className="w-5 h-5 animate-bounce group-hover:translate-y-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default CoverSection;
