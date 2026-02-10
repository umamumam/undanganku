import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { useTheme } from '@/themes/ThemeProvider';

const MusicPlayer = ({ musicUrl, musicList = [], autoPlay = false }) => {
  const theme = useTheme();
  const audioRef = useRef(null);
  const youtubeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [musicType, setMusicType] = useState('mp3'); // 'mp3' or 'youtube'
  
  useEffect(() => {
    // Determine music source
    const activeMusic = musicList.find(m => m.is_active) || musicList[0];
    
    if (activeMusic) {
      setCurrentMusic(activeMusic);
      setMusicType(activeMusic.source_type);
    } else if (musicUrl) {
      // Check if it's a YouTube URL
      if (musicUrl.includes('youtube.com') || musicUrl.includes('youtu.be')) {
        setMusicType('youtube');
        setCurrentMusic({ url: musicUrl, source_type: 'youtube' });
      } else {
        setMusicType('mp3');
        setCurrentMusic({ url: musicUrl, source_type: 'mp3' });
      }
    }
  }, [musicUrl, musicList]);
  
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url.split('embed/')[1]?.split('?')[0];
    }
    return null;
  };
  
  const toggleMusic = () => {
    if (musicType === 'mp3' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    } else if (musicType === 'youtube' && youtubeRef.current) {
      // For YouTube, we use a hidden iframe
      // Toggle play state
      setIsPlaying(!isPlaying);
    }
  };
  
  const playMusic = () => {
    if (musicType === 'mp3' && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    } else if (musicType === 'youtube') {
      setIsPlaying(true);
    }
  };
  
  // Expose play function
  useEffect(() => {
    if (autoPlay && currentMusic) {
      setTimeout(() => playMusic(), 500);
    }
  }, [autoPlay, currentMusic]);

  if (!currentMusic) return null;

  return (
    <>
      {/* Audio Element for MP3 */}
      {musicType === 'mp3' && (
        <audio 
          ref={audioRef} 
          src={currentMusic.url} 
          loop 
          preload="auto"
        />
      )}
      
      {/* Hidden YouTube iframe for audio */}
      {musicType === 'youtube' && isPlaying && (
        <iframe
          ref={youtubeRef}
          src={`https://www.youtube.com/embed/${getYouTubeVideoId(currentMusic.url)}?autoplay=1&loop=1&playlist=${getYouTubeVideoId(currentMusic.url)}`}
          style={{ display: 'none' }}
          allow="autoplay"
          title="Background Music"
        />
      )}
      
      {/* Music Player Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all z-50"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`
        }}
        data-testid="music-toggle-btn"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6 ml-1" />
        )}
        
        {/* Spinning vinyl effect */}
        <span 
          className={`absolute inset-0 rounded-full border-2 border-white/30 ${isPlaying ? 'animate-spin' : ''}`}
          style={{ animationDuration: '3s' }}
        />
      </button>
    </>
  );
};

export default MusicPlayer;
