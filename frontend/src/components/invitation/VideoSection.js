import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '@/themes/ThemeProvider';

const VideoSection = ({ videoUrl, title = 'Video Kami' }) => {
  const theme = useTheme();
  const [embedUrl, setEmbedUrl] = useState('');
  
  useEffect(() => {
    if (!videoUrl) return;
    
    // Convert YouTube URL to embed URL
    let finalUrl = videoUrl;
    
    if (videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      if (videoId) {
        finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    } else if (videoUrl.includes('youtube.com/shorts/')) {
      const videoId = videoUrl.split('shorts/')[1]?.split('?')[0];
      if (videoId) {
        finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    }
    
    setEmbedUrl(finalUrl);
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <section className="invitation-section text-center py-12 px-4">
      <h2 
        className="section-title text-2xl mb-8"
        style={{ fontFamily: theme.fontHeading }}
      >
        {title}
      </h2>
      
      <div className="aspect-video rounded-2xl overflow-hidden shadow-lg max-w-lg mx-auto">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Wedding Video"
          className="w-full h-full"
        />
      </div>
    </section>
  );
};

export default VideoSection;
