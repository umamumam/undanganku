import React, { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { useTheme } from '@/themes/ThemeProvider';

const LoveStoryTimeline = ({ stories = [] }) => {
  const theme = useTheme();
  const timelineRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState([]);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems(prev => {
              if (!prev.includes(index)) {
                return [...prev, index].sort((a, b) => a - b);
              }
              return prev;
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-50px' }
    );

    const items = timelineRef.current?.querySelectorAll('.timeline-item');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [stories]);

  // Animate line height based on visible items
  useEffect(() => {
    if (visibleItems.length > 0 && stories.length > 0) {
      const maxIndex = Math.max(...visibleItems);
      const percentage = ((maxIndex + 1) / stories.length) * 100;
      setLineHeight(percentage);
    }
  }, [visibleItems, stories.length]);

  if (!stories || stories.length === 0) return null;

  return (
    <div className="relative py-8" ref={timelineRef}>
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 
          className="section-title text-2xl md:text-3xl font-serif"
          style={{ color: theme.primaryColor }}
        >
          Love Story
        </h2>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-lg mx-auto px-4">
        {/* Timeline Line Background (static) */}
        <div 
          className="absolute left-1/2 top-0 w-0.5 h-full -translate-x-1/2 opacity-20"
          style={{ backgroundColor: theme.primaryColor }}
        />
        
        {/* Timeline Line Animated (grows as you scroll) */}
        <div 
          className="absolute left-1/2 top-0 w-0.5 -translate-x-1/2 transition-all duration-1000 ease-out"
          style={{ 
            backgroundColor: theme.accentColor,
            height: `${lineHeight}%`,
            boxShadow: `0 0 10px ${theme.accentColor}50`
          }}
        />

        {/* Timeline Items */}
        {stories.map((story, index) => {
          const isVisible = visibleItems.includes(index);
          const isEven = index % 2 === 0;
          
          return (
            <div 
              key={story.id || index}
              data-index={index}
              className={`timeline-item relative mb-12 last:mb-0 ${isEven ? 'pr-8 md:pr-0' : 'pl-8 md:pl-0'}`}
            >
              {/* Dot on Timeline */}
              <div 
                className={`absolute left-1/2 -translate-x-1/2 z-10 transition-all duration-500 ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                style={{ top: '0' }}
              >
                {/* Outer ring */}
                <div 
                  className="absolute w-10 h-10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"
                  style={{ 
                    backgroundColor: theme.accentColor,
                    opacity: 0.2,
                    left: '50%',
                    top: '50%'
                  }}
                />
                {/* Main dot */}
                <div 
                  className="relative w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                    boxShadow: `0 0 0 4px ${theme.secondaryColor}, 0 0 0 6px ${theme.accentColor}40, 0 4px 15px ${theme.primaryColor}40`
                  }}
                >
                  <Heart className="w-3 h-3 text-white fill-white" />
                </div>
              </div>

              {/* Content Card */}
              <div 
                className={`relative md:w-[calc(50%-40px)] ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Connector Line to Dot (Desktop) */}
                <div 
                  className={`hidden md:block absolute top-3 w-8 h-0.5 ${isEven ? 'right-0' : 'left-0'}`}
                  style={{ 
                    background: `linear-gradient(${isEven ? '90deg' : '270deg'}, ${theme.accentColor}, transparent)`,
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    transitionDelay: `${index * 150 + 300}ms`
                  }}
                />

                {/* Card */}
                <div 
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, white 0%, ${theme.secondaryColor}50 100%)`,
                    boxShadow: `0 10px 40px ${theme.primaryColor}15`,
                    border: `1px solid ${theme.accentColor}20`
                  }}
                >
                  {/* Image */}
                  {story.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      {/* Image Overlay */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, transparent 50%, ${theme.primaryColor}30 100%)`
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Text Content */}
                  <div className="p-5">
                    {/* Date Badge */}
                    <div 
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                      style={{
                        background: `${theme.accentColor}20`,
                        color: theme.accentColor
                      }}
                    >
                      {story.date}
                    </div>
                    
                    {/* Title */}
                    <h4 
                      className="font-serif text-lg mb-2"
                      style={{ color: theme.primaryColor }}
                    >
                      {story.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* End Dot */}
        <div 
          className={`absolute left-1/2 bottom-0 -translate-x-1/2 z-10 transition-all duration-500 ${visibleItems.includes(stories.length - 1) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.primaryColor})`,
              boxShadow: `0 0 0 4px ${theme.secondaryColor}, 0 4px 15px ${theme.primaryColor}40`
            }}
          >
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoveStoryTimeline;
