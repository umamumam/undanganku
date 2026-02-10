import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useTheme } from '@/themes/ThemeProvider';

const HeroSection = ({ invitation }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);
  
  const heroPhoto = invitation.cover_photo || 
    invitation.groom?.photo || 
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800';

  const groomName = invitation.groom?.name || 'Groom';
  const brideName = invitation.bride?.name || 'Bride';

  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-center relative py-16 px-6 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${theme.gradientStart} 0%, ${theme.gradientMid} 50%, ${theme.gradientEnd} 100%)`
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top left floral decoration */}
        <div className="absolute top-0 left-0 w-32 h-48 opacity-40">
          <svg viewBox="0 0 100 150" className="w-full h-full">
            <defs>
              <linearGradient id="floralGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.primaryColor} stopOpacity="0.6"/>
                <stop offset="100%" stopColor={theme.accentColor} stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            {/* Leaves */}
            <ellipse cx="20" cy="30" rx="15" ry="25" fill="url(#floralGrad1)" transform="rotate(-30 20 30)"/>
            <ellipse cx="35" cy="50" rx="12" ry="20" fill="url(#floralGrad1)" transform="rotate(-15 35 50)"/>
            <ellipse cx="15" cy="70" rx="10" ry="18" fill="url(#floralGrad1)" transform="rotate(-45 15 70)"/>
            {/* Small flowers */}
            <circle cx="30" cy="20" r="5" fill={theme.accentColor} opacity="0.5"/>
            <circle cx="45" cy="40" r="4" fill={theme.primaryColor} opacity="0.4"/>
          </svg>
        </div>
        
        {/* Top right floral decoration */}
        <div className="absolute top-0 right-0 w-32 h-48 opacity-40 scale-x-[-1]">
          <svg viewBox="0 0 100 150" className="w-full h-full">
            <defs>
              <linearGradient id="floralGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.primaryColor} stopOpacity="0.6"/>
                <stop offset="100%" stopColor={theme.accentColor} stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <ellipse cx="20" cy="30" rx="15" ry="25" fill="url(#floralGrad2)" transform="rotate(-30 20 30)"/>
            <ellipse cx="35" cy="50" rx="12" ry="20" fill="url(#floralGrad2)" transform="rotate(-15 35 50)"/>
            <ellipse cx="15" cy="70" rx="10" ry="18" fill="url(#floralGrad2)" transform="rotate(-45 15 70)"/>
            <circle cx="30" cy="20" r="5" fill={theme.accentColor} opacity="0.5"/>
            <circle cx="45" cy="40" r="4" fill={theme.primaryColor} opacity="0.4"/>
          </svg>
        </div>
        
        {/* Decorative circles */}
        <div 
          className="absolute top-20 right-8 w-16 h-16 rounded-full opacity-20"
          style={{ backgroundColor: theme.accentColor }}
        />
        <div 
          className="absolute bottom-32 left-6 w-10 h-10 rounded-full opacity-15"
          style={{ backgroundColor: theme.accentColor }}
        />
      </div>
      
      {/* Hero Photo with Frame */}
      <div className={`relative mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {/* Outer decorative ring */}
        <div 
          className="absolute inset-0 w-52 h-52 md:w-64 md:h-64 mx-auto rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${theme.accentColor}40, transparent, ${theme.primaryColor}30, transparent, ${theme.accentColor}40)`,
            transform: 'scale(1.12)',
            animation: 'spin-slow 25s linear infinite'
          }}
        />
        
        {/* Gold frame */}
        <div 
          className="relative w-52 h-52 md:w-64 md:h-64 mx-auto rounded-full p-1"
          style={{
            background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.accentColor}80, ${theme.accentColor})`,
            boxShadow: `0 0 40px ${theme.accentColor}25`
          }}
        >
          <div 
            className="w-full h-full rounded-full p-1"
            style={{ backgroundColor: 'white' }}
          >
            <img 
              src={heroPhoto} 
              alt="Couple" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        
        {/* Heart badge */}
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
      
      {/* Text Content */}
      <div className="text-center relative z-10">
        {/* Pernikahan label */}
        <p 
          className={`text-xs uppercase tracking-[0.3em] mb-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
          style={{ color: theme.primaryColor }}
        >
          Pernikahan
        </p>
        
        {/* Names - Horizontal */}
        <div className={`flex items-center justify-center gap-3 md:gap-4 mb-4 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <h1 
            className="font-script text-4xl md:text-5xl lg:text-6xl"
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
            className="font-script text-4xl md:text-5xl lg:text-6xl"
            style={{ color: theme.primaryColor }}
          >
            {brideName}
          </h1>
        </div>
        
        {/* Divider */}
        <div 
          className={`w-20 h-0.5 mx-auto mb-4 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`
          }}
        />
        
        {/* Date */}
        {invitation.events?.[0] && (
          <p 
            className={`text-sm md:text-base transition-all duration-700 delay-600 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
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
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg) scale(1.12); }
          to { transform: rotate(360deg) scale(1.12); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
