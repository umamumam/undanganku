import React from 'react';
import { useTheme } from '@/themes/ThemeProvider';

const QuoteSection = ({ quranVerse, quranSurah }) => {
  const theme = useTheme();
  
  const defaultVerse = "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.";
  const defaultSurah = "Q.S Ar-Rum : 21";

  return (
    <section className="invitation-section text-center py-12 px-6">
      {/* Bismillah */}
      <p 
        className="text-lg md:text-xl mb-8 font-arabic"
        style={{ color: theme.primaryColor }}
      >
        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
      </p>
      
      {/* Divider */}
      <div 
        className="divider w-24 mx-auto mb-8"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)` }}
      />
      
      {/* Quote */}
      <div className="max-w-md mx-auto">
        <p 
          className="text-base leading-relaxed italic mb-4"
          style={{ color: theme.primaryColor, opacity: 0.85 }}
        >
          "{quranVerse || defaultVerse}"
        </p>
        <p 
          className="text-sm font-medium"
          style={{ color: theme.accentColor }}
        >
          {quranSurah || defaultSurah}
        </p>
      </div>
    </section>
  );
};

export default QuoteSection;
