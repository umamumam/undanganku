import React, { useEffect, useState, useRef } from 'react';
import { Heart, Instagram } from 'lucide-react';
import { useTheme } from '@/themes/ThemeProvider';

const CoupleSection = ({ invitation }) => {
  const theme = useTheme();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Photo Frame Component with Floral Decorations
  const PhotoFrame = ({ photo, name, isReverse }) => (
    <div className="relative inline-block">
      {/* Floral decorations around frame */}
      <svg 
        className={`absolute -top-6 ${isReverse ? '-right-4' : '-left-4'} w-20 h-20 opacity-50`}
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id={`floralGrad-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.primaryColor} stopOpacity="0.7"/>
            <stop offset="100%" stopColor={theme.accentColor} stopOpacity="0.4"/>
          </linearGradient>
        </defs>
        {/* Leaves */}
        <ellipse cx="30" cy="40" rx="12" ry="22" fill={`url(#floralGrad-${name})`} transform="rotate(-40 30 40)"/>
        <ellipse cx="50" cy="30" rx="10" ry="18" fill={`url(#floralGrad-${name})`} transform="rotate(-20 50 30)"/>
        <ellipse cx="70" cy="45" rx="8" ry="15" fill={`url(#floralGrad-${name})`} transform="rotate(10 70 45)"/>
        {/* Small flower */}
        <circle cx="45" cy="50" r="8" fill={theme.accentColor} opacity="0.6"/>
        <circle cx="45" cy="50" r="4" fill="white" opacity="0.8"/>
      </svg>
      
      <svg 
        className={`absolute -bottom-6 ${isReverse ? '-left-4' : '-right-4'} w-20 h-20 opacity-50 rotate-180`}
        viewBox="0 0 100 100"
      >
        <ellipse cx="30" cy="40" rx="12" ry="22" fill={`url(#floralGrad-${name})`} transform="rotate(-40 30 40)"/>
        <ellipse cx="50" cy="30" rx="10" ry="18" fill={`url(#floralGrad-${name})`} transform="rotate(-20 50 30)"/>
        <ellipse cx="70" cy="45" rx="8" ry="15" fill={`url(#floralGrad-${name})`} transform="rotate(10 70 45)"/>
        <circle cx="45" cy="50" r="8" fill={theme.accentColor} opacity="0.6"/>
        <circle cx="45" cy="50" r="4" fill="white" opacity="0.8"/>
      </svg>
      
      {/* Animated ring */}
      <div 
        className="absolute inset-0 rounded-full animate-spin-slow"
        style={{
          background: `conic-gradient(from 0deg, ${theme.accentColor}30, transparent, ${theme.primaryColor}20, transparent, ${theme.accentColor}30)`,
          transform: 'scale(1.15)',
          animationDirection: isReverse ? 'reverse' : 'normal'
        }}
      />
      
      {/* Gold border frame */}
      <div 
        className="relative w-36 h-36 md:w-44 md:h-44 rounded-full p-1"
        style={{
          background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.accentColor}80, ${theme.accentColor})`,
          boxShadow: `0 0 30px ${theme.accentColor}25`
        }}
      >
        <div 
          className="w-full h-full rounded-full p-1"
          style={{ backgroundColor: 'white' }}
        >
          <img 
            src={photo} 
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 px-4 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${theme.gradientMid}60 0%, ${theme.gradientStart} 30%, ${theme.gradientStart} 70%, ${theme.gradientMid}60 100%)`
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left side floral */}
        <div className="absolute left-0 top-1/4 w-24 h-64 opacity-30">
          <svg viewBox="0 0 80 200" className="w-full h-full">
            <ellipse cx="20" cy="40" rx="15" ry="30" fill={theme.primaryColor} opacity="0.5"/>
            <ellipse cx="30" cy="80" rx="12" ry="25" fill={theme.accentColor} opacity="0.4"/>
            <ellipse cx="15" cy="120" rx="10" ry="22" fill={theme.primaryColor} opacity="0.5"/>
            <ellipse cx="25" cy="160" rx="13" ry="28" fill={theme.accentColor} opacity="0.4"/>
            <circle cx="35" cy="55" r="8" fill={theme.accentColor} opacity="0.6"/>
            <circle cx="25" cy="100" r="6" fill={theme.primaryColor} opacity="0.5"/>
          </svg>
        </div>
        
        {/* Right side floral */}
        <div className="absolute right-0 top-1/3 w-24 h-64 opacity-30 scale-x-[-1]">
          <svg viewBox="0 0 80 200" className="w-full h-full">
            <ellipse cx="20" cy="40" rx="15" ry="30" fill={theme.primaryColor} opacity="0.5"/>
            <ellipse cx="30" cy="80" rx="12" ry="25" fill={theme.accentColor} opacity="0.4"/>
            <ellipse cx="15" cy="120" rx="10" ry="22" fill={theme.primaryColor} opacity="0.5"/>
            <ellipse cx="25" cy="160" rx="13" ry="28" fill={theme.accentColor} opacity="0.4"/>
            <circle cx="35" cy="55" r="8" fill={theme.accentColor} opacity="0.6"/>
            <circle cx="25" cy="100" r="6" fill={theme.primaryColor} opacity="0.5"/>
          </svg>
        </div>
      </div>

      {/* Content Card with opacity background */}
      <div 
        className="relative max-w-md mx-auto rounded-3xl p-8"
        style={{
          background: `linear-gradient(145deg, rgba(255,255,255,0.85) 0%, ${theme.secondaryColor}60 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 10px 40px ${theme.primaryColor}10`
        }}
      >
        {/* Section Title */}
        <h2 
          className={`section-title text-2xl text-center mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ fontFamily: theme.fontHeading, color: theme.primaryColor }}
        >
          Mempelai
        </h2>
        
        {/* Opening text */}
        <p className={`text-center text-sm mb-10 opacity-80 max-w-sm mx-auto transition-all duration-700 delay-100 ${isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <strong>Assalamu'alaikum Warahmatullahi Wabarakatuh</strong>
          <br /><br />
          {invitation.opening_text || 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan'}
        </p>
        
        {/* Groom */}
        <div className={`text-center mb-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex justify-center mb-4">
            <PhotoFrame 
              photo={invitation.groom?.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"} 
              name={invitation.groom?.name}
              isReverse={false}
            />
          </div>
          <p 
            className="font-script text-3xl md:text-4xl mb-1"
            style={{ color: theme.primaryColor }}
          >
            {invitation.groom?.name}
          </p>
          <h3 
            className="font-serif text-lg mb-2"
            style={{ color: theme.primaryColor }}
          >
            {invitation.groom?.full_name}
          </h3>
          <p className="text-muted-foreground text-sm">{invitation.groom?.child_order}</p>
          <p className="text-foreground text-sm mt-1">
            Bapak {invitation.groom?.father_name} & Ibu {invitation.groom?.mother_name}
          </p>
          {invitation.groom?.instagram && (
            <a 
              href={`https://instagram.com/${invitation.groom.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 px-4 py-1.5 rounded-full text-sm transition-colors"
              style={{ 
                color: theme.primaryColor,
                background: `${theme.secondaryColor}80`,
                border: `1px solid ${theme.accentColor}20`
              }}
            >
              <Instagram className="w-4 h-4 mr-1" />
              @{invitation.groom.instagram}
            </a>
          )}
        </div>

        {/* Heart Divider */}
        <div className={`flex items-center justify-center gap-3 my-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div 
            className="w-16 h-0.5"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.accentColor})` }}
          />
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
              boxShadow: `0 4px 15px ${theme.primaryColor}30`
            }}
          >
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div 
            className="w-16 h-0.5"
            style={{ background: `linear-gradient(270deg, transparent, ${theme.accentColor})` }}
          />
        </div>

        {/* Bride */}
        <div className={`text-center mt-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex justify-center mb-4">
            <PhotoFrame 
              photo={invitation.bride?.photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"} 
              name={invitation.bride?.name}
              isReverse={true}
            />
          </div>
          <p 
            className="font-script text-3xl md:text-4xl mb-1"
            style={{ color: theme.primaryColor }}
          >
            {invitation.bride?.name}
          </p>
          <h3 
            className="font-serif text-lg mb-2"
            style={{ color: theme.primaryColor }}
          >
            {invitation.bride?.full_name}
          </h3>
          <p className="text-muted-foreground text-sm">{invitation.bride?.child_order}</p>
          <p className="text-foreground text-sm mt-1">
            Bapak {invitation.bride?.father_name} & Ibu {invitation.bride?.mother_name}
          </p>
          {invitation.bride?.instagram && (
            <a 
              href={`https://instagram.com/${invitation.bride.instagram}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center mt-3 px-4 py-1.5 rounded-full text-sm transition-colors"
              style={{ 
                color: theme.primaryColor,
                background: `${theme.secondaryColor}80`,
                border: `1px solid ${theme.accentColor}20`
              }}
            >
              <Instagram className="w-4 h-4 mr-1" />
              @{invitation.bride.instagram}
            </a>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg) scale(1.15); }
          to { transform: rotate(360deg) scale(1.15); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CoupleSection;
