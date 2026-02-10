import React from 'react';
import { useTheme } from '@/themes/ThemeProvider';

const HeroSection = ({ invitation }) => {
  const theme = useTheme();
  
  const heroPhoto = invitation.cover_photo || 
    invitation.groom?.photo || 
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800';

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative p-6 pt-12">
      {/* Ornaments */}
      {theme.ornaments?.topLeft && (
        <img 
          src={theme.ornaments.topLeft} 
          alt="" 
          className="ornament-top-left object-cover"
        />
      )}
      {theme.ornaments?.topRight && (
        <img 
          src={theme.ornaments.topRight} 
          alt="" 
          className="ornament-top-right object-cover"
        />
      )}
      
      {/* Hero Photo */}
      <div className="relative mb-8">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden frame-photo">
          <img 
            src={heroPhoto} 
            alt="Couple" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Names */}
      <p 
        className="text-sm uppercase tracking-[0.3em] mb-4"
        style={{ color: theme.primaryColor, opacity: 0.7 }}
      >
        Pernikahan
      </p>
      
      <h1 
        className="font-script text-5xl md:text-6xl"
        style={{ color: theme.primaryColor }}
      >
        {invitation.groom?.name}
      </h1>
      
      <p 
        className="font-script text-3xl my-2"
        style={{ color: theme.accentColor }}
      >
        &
      </p>
      
      <h1 
        className="font-script text-5xl md:text-6xl"
        style={{ color: theme.primaryColor }}
      >
        {invitation.bride?.name}
      </h1>
      
      {/* Date */}
      {invitation.events?.[0] && (
        <p 
          className="mt-8 text-lg font-serif"
          style={{ color: theme.primaryColor, opacity: 0.8 }}
        >
          {new Date(invitation.events[0].date).toLocaleDateString('id-ID', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      )}
    </section>
  );
};

export default HeroSection;
