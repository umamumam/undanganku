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

  return (
    <section 
      className="min-h-screen flex flex-col items-center justify-center relative py-16 px-6"
      style={{
        background: `linear-gradient(180deg, ${theme.gradientStart} 0%, ${theme.gradientMid} 50%, ${theme.gradientEnd} 100%)`
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(theme.primaryColor)}' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Corner Ornaments */}
      <div 
        className={`absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 transition-all duration-1000 ${isVisible ? 'opacity-50' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(circle at 0% 0%, ${theme.accentColor}30 0%, transparent 70%)`
        }}
      />
      <div 
        className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 transition-all duration-1000 ${isVisible ? 'opacity-50' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(circle at 100% 0%, ${theme.accentColor}30 0%, transparent 70%)`
        }}
      />
      
      {/* Hero Photo */}
      <div className={`relative mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {/* Decorative ring */}
        <div 
          className="absolute inset-0 w-56 h-56 md:w-72 md:h-72 mx-auto rounded-full animate-spin-slow"
          style={{
            background: `conic-gradient(from 0deg, ${theme.accentColor}30, transparent, ${theme.primaryColor}30, transparent, ${theme.accentColor}30)`,
            transform: 'scale(1.1)'
          }}
        />
        
        {/* Photo frame */}
        <div 
          className="relative w-56 h-56 md:w-72 md:h-72 mx-auto rounded-full overflow-hidden"
          style={{
            border: `5px solid ${theme.accentColor}`,
            boxShadow: `0 0 0 10px ${theme.secondaryColor}, 0 25px 60px ${theme.primaryColor}30`
          }}
        >
          <img 
            src={heroPhoto} 
            alt="Couple" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Heart badge */}
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
            boxShadow: `0 4px 15px ${theme.primaryColor}50`
          }}
        >
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>
      </div>
      
      {/* Text Content */}
      <div className="text-center">
        {/* Pernikahan text */}
        <p 
          className={`text-xs uppercase tracking-[0.4em] mb-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
          style={{ color: theme.primaryColor }}
        >
          Pernikahan
        </p>
        
        {/* Names */}
        <h1 
          className={`font-script text-5xl md:text-6xl lg:text-7xl transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ color: theme.primaryColor }}
        >
          {invitation.groom?.name}
        </h1>
        
        <p 
          className={`font-script text-3xl md:text-4xl my-3 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ color: theme.accentColor }}
        >
          &
        </p>
        
        <h1 
          className={`font-script text-5xl md:text-6xl lg:text-7xl transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ color: theme.primaryColor }}
        >
          {invitation.bride?.name}
        </h1>
        
        {/* Divider */}
        <div 
          className={`w-20 h-0.5 mx-auto my-8 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`
          }}
        />
        
        {/* Date */}
        {invitation.events?.[0] && (
          <p 
            className={`text-base font-serif transition-all duration-700 delay-800 ${isVisible ? 'opacity-70' : 'opacity-0'}`}
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
    </section>
  );
};

export default HeroSection;
