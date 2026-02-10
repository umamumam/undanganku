import React from 'react';
import { useTheme } from '@/themes/ThemeProvider';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CountdownSection = ({ countdown, onAddToCalendar }) => {
  const theme = useTheme();
  
  const countdownItems = [
    { value: countdown.days, label: 'Hari' },
    { value: countdown.hours, label: 'Jam' },
    { value: countdown.minutes, label: 'Menit' },
    { value: countdown.seconds, label: 'Detik' }
  ];

  return (
    <section className="invitation-section text-center">
      <h2 
        className="section-title text-2xl mb-8"
        style={{ fontFamily: theme.fontHeading }}
      >
        Menuju Hari Bahagia
      </h2>
      
      <div className="flex justify-center gap-3 md:gap-4">
        {countdownItems.map((item, index) => (
          <div key={index} className="countdown-box text-center px-4 py-4 min-w-[70px]">
            <div 
              className="countdown-number text-2xl md:text-3xl font-bold"
              style={{ color: theme.primaryColor }}
            >
              {item.value}
            </div>
            <div className="countdown-label text-xs uppercase tracking-wider mt-1 opacity-60">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <Button
          onClick={onAddToCalendar}
          variant="outline"
          className="rounded-full px-6 py-5"
          style={{ 
            borderColor: theme.primaryColor, 
            color: theme.primaryColor 
          }}
          data-testid="save-calendar-btn"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Simpan ke Kalender
        </Button>
      </div>
    </section>
  );
};

export default CountdownSection;
