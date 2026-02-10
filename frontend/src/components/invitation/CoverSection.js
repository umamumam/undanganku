import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/themes/ThemeProvider';

const CoverSection = ({ invitation, guestName, onOpenInvitation }) => {
  const theme = useTheme();
  
  // Get cover photo - use provided or fallback to couple photo or default
  const coverPhoto = invitation.cover_photo || 
    invitation.groom?.photo || 
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800';

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center cover-section theme-${invitation.theme || 'floral'}`}>
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
      
      {/* Main Content */}
      <div className="text-center animate-fade-up px-6 relative z-20 max-w-md mx-auto">
        {/* Cover Photo */}
        <div className="relative mb-8">
          <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full overflow-hidden frame-photo">
            <img 
              src={coverPhoto}
              alt="Couple"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative ring */}
          <div 
            className="absolute inset-0 w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full border-2 opacity-30 animate-pulse"
            style={{ borderColor: theme.accentColor, transform: 'scale(1.1)' }}
          />
        </div>
        
        {/* Wedding Text */}
        <p 
          className="text-sm uppercase tracking-[0.3em] mb-4 opacity-70"
          style={{ color: theme.primaryColor }}
        >
          The Wedding Of
        </p>
        
        <h1 
          className="font-script text-5xl md:text-7xl mb-2"
          style={{ color: theme.primaryColor }}
        >
          {invitation.groom?.name || 'Groom'}
        </h1>
        
        <p 
          className="font-script text-3xl my-2"
          style={{ color: theme.accentColor }}
        >
          &
        </p>
        
        <h1 
          className="font-script text-5xl md:text-7xl"
          style={{ color: theme.primaryColor }}
        >
          {invitation.bride?.name || 'Bride'}
        </h1>
        
        {/* Date Preview */}
        {invitation.events?.[0]?.date && (
          <p 
            className="mt-6 text-sm opacity-60"
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
        
        {/* Guest Name */}
        <div className="mt-10 mb-8">
          <p className="text-muted-foreground text-sm mb-2">Kepada Yth.</p>
          <p className="text-base font-serif text-foreground">Bapak/Ibu/Saudara/i</p>
          <p 
            className="text-2xl font-serif mt-2"
            style={{ color: theme.primaryColor }}
          >
            {guestName}
          </p>
        </div>
        
        {/* Open Button */}
        <Button
          onClick={onOpenInvitation}
          className="btn-primary px-8 py-6 rounded-full text-lg font-sans shadow-lg hover:shadow-xl transition-all"
          data-testid="open-invitation-btn"
          style={{
            background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`
          }}
        >
          Buka Undangan
          <ChevronDown className="ml-2 w-5 h-5 animate-bounce" />
        </Button>
      </div>
      
      {/* Bottom Ornament */}
      {theme.ornaments?.bottom && (
        <img 
          src={theme.ornaments.bottom} 
          alt="" 
          className="ornament-bottom object-cover"
        />
      )}
    </div>
  );
};

export default CoverSection;
