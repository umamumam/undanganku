import React, { useEffect, useState } from 'react';
import { useTheme } from '@/themes/ThemeProvider';
import { Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CountdownSection = ({ countdown, onAddToCalendar }) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);
  
  // Check if event has passed
  const isEventPassed = countdown.days === 0 && countdown.hours === 0 && 
                        countdown.minutes === 0 && countdown.seconds === 0;
  
  const countdownItems = [
    { value: countdown.days, label: 'Hari' },
    { value: countdown.hours, label: 'Jam' },
    { value: countdown.minutes, label: 'Menit' },
    { value: countdown.seconds, label: 'Detik' }
  ];

  return (
    <section className="invitation-section text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(theme.primaryColor)}' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Heart icon */}
      <div className={`flex justify-center mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.accentColor}20)`,
            border: `1px solid ${theme.accentColor}30`
          }}
        >
          <Heart className="w-5 h-5" style={{ color: theme.primaryColor }} />
        </div>
      </div>
      
      <h2 
        className={`section-title text-xl md:text-2xl mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ fontFamily: theme.fontHeading, color: theme.primaryColor }}
      >
        Menuju Hari Bahagia
      </h2>
      
      {/* Event passed message or Countdown boxes */}
      {isEventPassed ? (
        <div 
          className={`py-6 px-8 mx-auto max-w-xs rounded-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            background: `linear-gradient(145deg, white 0%, ${theme.secondaryColor}50 100%)`,
            border: `1px solid ${theme.accentColor}20`,
            boxShadow: `0 8px 25px ${theme.primaryColor}10`
          }}
        >
          <Heart className="w-8 h-8 mx-auto mb-3" style={{ color: theme.primaryColor }} />
          <p 
            className="text-base font-serif"
            style={{ color: theme.primaryColor }}
          >
            Acara Telah Berlangsung
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Terima kasih atas doa dan ucapannya
          </p>
        </div>
      ) : (
        <>
          {/* Countdown boxes */}
          <div className="flex justify-center gap-3 md:gap-4">
            {countdownItems.map((item, index) => (
              <div 
                key={index} 
                className={`countdown-box text-center px-3 md:px-5 py-4 min-w-[65px] md:min-w-[80px] transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`,
                  background: `linear-gradient(145deg, white 0%, ${theme.secondaryColor}50 100%)`,
                  border: `1px solid ${theme.accentColor}20`,
                  borderRadius: '16px',
                  boxShadow: `0 8px 25px ${theme.primaryColor}10`
                }}
              >
                <div 
                  className="countdown-number text-2xl md:text-4xl font-bold tabular-nums"
                  style={{ 
                    color: theme.primaryColor,
                    fontFamily: theme.fontHeading
                  }}
                >
                  {String(item.value).padStart(2, '0')}
                </div>
                <div 
                  className="countdown-label text-xs uppercase tracking-wider mt-1"
                  style={{ color: theme.primaryColor, opacity: 0.6 }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Save to calendar button - only show if event not passed */}
      {!isEventPassed && (
        <div className={`mt-8 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Button
            onClick={onAddToCalendar}
            className="rounded-full px-6 py-5 text-sm"
            style={{ 
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
              color: 'white',
              boxShadow: `0 4px 15px ${theme.primaryColor}30`
            }}
            data-testid="save-calendar-btn"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Simpan Tanggal
          </Button>
        </div>
      )}
    </section>
  );
};

export default CountdownSection;
