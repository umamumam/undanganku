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
      { threshold: 0.2, rootMargin: '-30px' }
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
      setLineHeight(Math.min(percentage, 100));
    }
  }, [visibleItems, stories.length]);

  if (!stories || stories.length === 0) return null;

  return (
    <div className="relative py-8 px-4" ref={timelineRef}>
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 
          className="section-title text-2xl md:text-3xl font-serif"
          style={{ color: theme.primaryColor }}
        >
          Love Story
        </h2>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-md mx-auto">
        {/* Center Timeline Line - Background (static) */}
        <div 
          className="absolute left-6 md:left-1/2 top-0 w-0.5 h-full md:-translate-x-1/2 opacity-20 rounded-full"
          style={{ backgroundColor: theme.primaryColor }}
        />
        
        {/* Center Timeline Line - Animated (grows as you scroll) */}
        <div 
          className="absolute left-6 md:left-1/2 top-0 w-0.5 md:-translate-x-1/2 transition-all duration-1000 ease-out rounded-full"
          style={{ 
            backgroundColor: theme.accentColor,
            height: `${lineHeight}%`,
            boxShadow: `0 0 8px ${theme.accentColor}60`
          }}
        />

        {/* Timeline Items */}
        {stories.map((story, index) => {
          const isVisible = visibleItems.includes(index);
          
          return (
            <div 
              key={story.id || index}
              data-index={index}
              className="timeline-item relative mb-10 last:mb-0 pl-14 md:pl-0"
            >
              {/* Dot on Timeline */}
              <div 
                className={`absolute left-4 md:left-1/2 top-0 md:-translate-x-1/2 z-10 transition-all duration-500 ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
              >
                {/* Ping animation */}
                <div 
                  className="absolute w-8 h-8 rounded-full -left-1 -top-1 animate-ping opacity-20"
                  style={{ backgroundColor: theme.accentColor }}
                />
                {/* Main dot with heart */}
                <div 
                  className="relative w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                    boxShadow: `0 0 0 3px ${theme.secondaryColor}, 0 0 0 5px ${theme.accentColor}30, 0 4px 12px ${theme.primaryColor}30`
                  }}
                >
                  <Heart className="w-3 h-3 text-white fill-white" />
                </div>
              </div>

              {/* Content Card - Mobile: Always right, Desktop: Alternating */}
              <div 
                className={`relative md:w-[calc(50%-30px)] ${index % 2 === 0 ? 'md:mr-auto md:pr-6' : 'md:ml-auto md:pl-6'} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Connector line to dot (Desktop only) */}
                <div 
                  className={`hidden md:block absolute top-3 w-6 h-0.5 ${index % 2 === 0 ? 'right-0' : 'left-0'}`}
                  style={{ 
                    background: `linear-gradient(${index % 2 === 0 ? '90deg' : '270deg'}, ${theme.accentColor}, transparent)`,
                    opacity: isVisible ? 0.6 : 0,
                    transition: 'opacity 0.5s ease',
                    transitionDelay: `${index * 100 + 200}ms`
                  }}
                />

                {/* Card */}
                <div 
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, white 0%, ${theme.secondaryColor}40 100%)`,
                    boxShadow: `0 8px 30px ${theme.primaryColor}10`,
                    border: `1px solid ${theme.accentColor}15`
                  }}
                >
                  {/* Image */}
                  {story.image && (
                    <div className="relative h-40 md:h-44 overflow-hidden">
                      <img 
                        src={story.image} 
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      {/* Gradient overlay */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(180deg, transparent 60%, ${theme.primaryColor}20 100%)`
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Text Content */}
                  <div className="p-4">
                    {/* Date Badge */}
                    <div 
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                      style={{
                        background: `${theme.accentColor}15`,
                        color: theme.accentColor
                      }}
                    >
                      {story.date}
                    </div>
                    
                    {/* Title */}
                    <h4 
                      className="font-serif text-base md:text-lg mb-2"
                      style={{ color: theme.primaryColor }}
                    >
                      {story.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* End Dot with Heart */}
        <div 
          className={`absolute left-4 md:left-1/2 bottom-0 md:-translate-x-1/2 z-10 transition-all duration-500 ${visibleItems.includes(stories.length - 1) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
          style={{ transitionDelay: '500ms' }}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.primaryColor})`,
              boxShadow: `0 0 0 3px ${theme.secondaryColor}, 0 4px 12px ${theme.primaryColor}30`
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
