import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/themes/ThemeProvider';

const QuoteSection = ({ quranVerse, quranSurah }) => {
  const theme = useTheme();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const defaultVerse = "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.";
  const defaultSurah = "Q.S Ar-Rum : 21";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="text-center py-16 px-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${theme.gradientMid}80 0%, ${theme.gradientStart} 50%, ${theme.gradientMid}80 100%)`
      }}
    >
      {/* Decorative elements */}
      <div 
        className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.accentColor}50, transparent)`
        }}
      />
      
      {/* Quote marks */}
      <div 
        className={`text-6xl font-serif leading-none mb-4 transition-all duration-700 ${isVisible ? 'opacity-20 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        style={{ color: theme.accentColor }}
      >
        "
      </div>
      
      {/* Bismillah */}
      <p 
        className={`text-xl md:text-2xl mb-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ 
          color: theme.primaryColor,
          fontFamily: "'Amiri', 'Traditional Arabic', serif"
        }}
      >
        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
      </p>
      
      {/* Quote Container */}
      <div 
        className={`max-w-md mx-auto p-6 rounded-2xl transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{
          background: `${theme.secondaryColor}60`,
          border: `1px solid ${theme.accentColor}15`,
          backdropFilter: 'blur(8px)'
        }}
      >
        {/* Quote text */}
        <p 
          className="text-sm md:text-base leading-relaxed mb-4"
          style={{ color: theme.primaryColor, opacity: 0.9 }}
        >
          "{quranVerse || defaultVerse}"
        </p>
        
        {/* Divider */}
        <div 
          className="w-12 h-0.5 mx-auto mb-4"
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`
          }}
        />
        
        {/* Surah reference */}
        <p 
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: theme.accentColor }}
        >
          {quranSurah || defaultSurah}
        </p>
      </div>
      
      {/* Closing quote mark */}
      <div 
        className={`text-6xl font-serif leading-none mt-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-20 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ color: theme.accentColor, transform: 'rotate(180deg)' }}
      >
        "
      </div>
      
      {/* Bottom decorative element */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.accentColor}50, transparent)`
        }}
      />
    </section>
  );
};

export default QuoteSection;
