import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { 
  Heart, Calendar, MapPin, Clock, 
  Pause, Play, Send, Copy, Gift, ChevronDown,
  ExternalLink, Users, MessageCircle, Instagram
} from 'lucide-react';

// Theme imports
import { ThemeProvider, THEMES } from '@/themes/ThemeProvider';
import '@/themes/AdatTheme.css';
import '@/themes/FloralTheme.css';
import '@/themes/ModernTheme.css';

// Invitation Components
import {
  CoverSection,
  HeroSection,
  CountdownSection,
  QuoteSection,
  VideoSection,
  MusicPlayer,
  LoveStoryTimeline
} from '@/components/invitation';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const InvitationContent = ({ invitation, guestName }) => {
  const [showCover, setShowCover] = useState(true);
  const [musicAutoPlay, setMusicAutoPlay] = useState(false);
  const [messages, setMessages] = useState([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const sectionsRef = useRef([]);

  // Get theme data
  const theme = THEMES[invitation.theme] || THEMES.floral;

  // RSVP Form
  const [rsvpForm, setRsvpForm] = useState({
    guest_name: guestName,
    phone: '',
    attendance: 'hadir',
    guest_count: 1
  });
  const [rsvpLoading, setRsvpLoading] = useState(false);

  // Message Form
  const [messageForm, setMessageForm] = useState({
    guest_name: guestName,
    message: ''
  });
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [invitation.id]);

  useEffect(() => {
    if (invitation?.events?.[0]?.date) {
      const eventDate = new Date(invitation.events[0].date);
      const timer = setInterval(() => {
        const now = new Date();
        const diff = eventDate - now;
        
        if (diff > 0) {
          setCountdown({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [invitation]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [invitation, showCover]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/messages/${invitation.id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleOpenInvitation = () => {
    setShowCover(false);
    setMusicAutoPlay(true);
  };

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    setRsvpLoading(true);
    try {
      await axios.post(`${API_URL}/public/rsvp/${invitation.id}`, rsvpForm);
      toast.success('Konfirmasi kehadiran berhasil dikirim!');
      setRsvpForm({ ...rsvpForm, phone: '', guest_count: 1 });
    } catch (error) {
      toast.error('Gagal mengirim konfirmasi');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!messageForm.message.trim()) {
      toast.error('Mohon tulis ucapan Anda');
      return;
    }
    setMessageLoading(true);
    try {
      await axios.post(`${API_URL}/public/messages/${invitation.id}`, messageForm);
      toast.success('Ucapan berhasil dikirim!');
      setMessageForm({ ...messageForm, message: '' });
      fetchMessages();
    } catch (error) {
      toast.error('Gagal mengirim ucapan');
    } finally {
      setMessageLoading(false);
    }
  };

  const copyBankAccount = (accountNumber) => {
    navigator.clipboard.writeText(accountNumber);
    toast.success('Nomor rekening disalin!');
  };

  const addToCalendar = useCallback(() => {
    if (!invitation?.events?.[0]) return;
    const event = invitation.events[0];
    const startDate = new Date(event.date + 'T' + event.time_start);
    const endDate = new Date(event.date + 'T' + event.time_end);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${invitation.groom.name} & ${invitation.bride.name}`)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&location=${encodeURIComponent(event.address)}&details=${encodeURIComponent(event.venue_name)}`;
    
    window.open(googleCalendarUrl, '_blank');
  }, [invitation]);

  const addSectionRef = (el, index) => {
    sectionsRef.current[index] = el;
  };

  return (
    <div 
      className={`invitation-container theme-${invitation.theme || 'floral'}`} 
      data-testid="invitation-page"
      style={{
        background: `linear-gradient(180deg, ${theme.gradientStart} 0%, ${theme.gradientMid} 30%, ${theme.gradientEnd} 60%, ${theme.gradientMid} 80%, ${theme.gradientStart} 100%)`
      }}
    >
      {/* Cover/Opening */}
      {showCover && (
        <CoverSection 
          invitation={invitation} 
          guestName={guestName} 
          onOpenInvitation={handleOpenInvitation}
        />
      )}

      {/* Main Content */}
      {!showCover && (
        <>
          {/* Hero Section */}
          <section 
            ref={(el) => addSectionRef(el, 0)} 
            className="fade-section"
          >
            <HeroSection invitation={invitation} />
          </section>

          {/* Quote/Opening Text */}
          <section 
            ref={(el) => addSectionRef(el, 1)} 
            className="fade-section"
          >
            <QuoteSection 
              quranVerse={invitation.quran_verse}
              quranSurah={invitation.quran_surah}
            />
          </section>

          {/* Couple Section */}
          <section 
            ref={(el) => addSectionRef(el, 2)} 
            className="fade-section invitation-section"
          >
            <h2 
              className="section-title text-2xl text-center mb-8"
              style={{ fontFamily: theme.fontHeading, color: theme.primaryColor }}
            >
              Mempelai
            </h2>
            
            {/* Opening text */}
            <p className="text-center text-sm mb-10 opacity-80 max-w-sm mx-auto">
              <strong>Assalamu'alaikum Warahmatullahi Wabarakatuh</strong>
              <br /><br />
              {invitation.opening_text}
            </p>
            
            {/* Groom */}
            <div className="text-center mb-10">
              <div className="relative inline-block mb-4">
                <div 
                  className="absolute inset-0 rounded-full animate-spin-slow"
                  style={{
                    background: `conic-gradient(from 0deg, ${theme.accentColor}30, transparent, ${theme.primaryColor}30, transparent, ${theme.accentColor}30)`,
                    transform: 'scale(1.12)'
                  }}
                />
                <img 
                  src={invitation.groom.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"} 
                  alt={invitation.groom.name}
                  className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover relative"
                  style={{
                    border: `4px solid ${theme.accentColor}`,
                    boxShadow: `0 0 0 6px ${theme.secondaryColor}, 0 15px 40px ${theme.primaryColor}25`
                  }}
                />
              </div>
              <p 
                className="font-script text-3xl md:text-4xl mb-1"
                style={{ color: theme.primaryColor }}
              >
                {invitation.groom.name}
              </p>
              <h3 
                className="font-serif text-lg md:text-xl mb-2"
                style={{ color: theme.primaryColor }}
              >
                {invitation.groom.full_name}
              </h3>
              <p className="text-muted-foreground text-sm">{invitation.groom.child_order}</p>
              <p className="text-foreground text-sm mt-1">
                Bapak {invitation.groom.father_name} & Ibu {invitation.groom.mother_name}
              </p>
              {invitation.groom.instagram && (
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
            <div className="flex items-center justify-center gap-3 my-6">
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
            <div className="text-center mt-10">
              <div className="relative inline-block mb-4">
                <div 
                  className="absolute inset-0 rounded-full animate-spin-slow"
                  style={{
                    background: `conic-gradient(from 0deg, ${theme.primaryColor}30, transparent, ${theme.accentColor}30, transparent, ${theme.primaryColor}30)`,
                    transform: 'scale(1.12)',
                    animationDirection: 'reverse'
                  }}
                />
                <img 
                  src={invitation.bride.photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"} 
                  alt={invitation.bride.name}
                  className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover relative"
                  style={{
                    border: `4px solid ${theme.accentColor}`,
                    boxShadow: `0 0 0 6px ${theme.secondaryColor}, 0 15px 40px ${theme.primaryColor}25`
                  }}
                />
              </div>
              <p 
                className="font-script text-3xl md:text-4xl mb-1"
                style={{ color: theme.primaryColor }}
              >
                {invitation.bride.name}
              </p>
              <h3 
                className="font-serif text-lg md:text-xl mb-2"
                style={{ color: theme.primaryColor }}
              >
                {invitation.bride.full_name}
              </h3>
              <p className="text-muted-foreground text-sm">{invitation.bride.child_order}</p>
              <p className="text-foreground text-sm mt-1">
                Bapak {invitation.bride.father_name} & Ibu {invitation.bride.mother_name}
              </p>
              {invitation.bride.instagram && (
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
          </section>

          {/* Countdown Section */}
          <section 
            ref={(el) => addSectionRef(el, 3)} 
            className="fade-section py-12"
            style={{ backgroundColor: `${theme.secondaryColor}40` }}
          >
            <CountdownSection 
              countdown={countdown} 
              onAddToCalendar={addToCalendar}
            />
          </section>

          {/* Events Section */}
          <section 
            ref={(el) => addSectionRef(el, 4)} 
            className="fade-section invitation-section"
          >
            <h2 
              className="section-title text-2xl text-center mb-8"
              style={{ fontFamily: theme.fontHeading, color: theme.primaryColor }}
            >
              Acara Pernikahan
            </h2>
            
            <div className="space-y-6 max-w-sm mx-auto">
              {invitation.events?.map((event, index) => (
                <div 
                  key={index} 
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, white 0%, ${theme.secondaryColor}40 100%)`,
                    border: `1px solid ${theme.accentColor}15`,
                    boxShadow: `0 8px 30px ${theme.primaryColor}10`
                  }}
                >
                  {/* Event Header */}
                  <div 
                    className="p-4 text-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.primaryColor}10, ${theme.accentColor}10)`,
                      borderBottom: `1px solid ${theme.accentColor}15`
                    }}
                  >
                    <h3 
                      className="font-serif text-xl"
                      style={{ color: theme.primaryColor }}
                    >
                      {event.name}
                    </h3>
                  </div>
                  
                  {/* Date Display */}
                  <div className="flex justify-center py-4">
                    <div className="text-center">
                      <p 
                        className="text-sm uppercase tracking-widest mb-1"
                        style={{ color: theme.accentColor }}
                      >
                        {new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                      </p>
                      <p 
                        className="text-4xl font-bold"
                        style={{ 
                          color: theme.primaryColor,
                          fontFamily: theme.fontHeading
                        }}
                      >
                        {new Date(event.date).getDate()}
                      </p>
                      <p 
                        className="text-sm"
                        style={{ color: theme.primaryColor }}
                      >
                        {new Date(event.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Event Details */}
                  <div className="px-5 pb-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${theme.accentColor}15` }}
                      >
                        <Clock className="w-4 h-4" style={{ color: theme.accentColor }} />
                      </div>
                      <p className="text-sm">{event.time_start} - {event.time_end} WIB</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${theme.accentColor}15` }}
                      >
                        <MapPin className="w-4 h-4" style={{ color: theme.accentColor }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.venue_name}</p>
                        <p className="text-xs text-muted-foreground">{event.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  {event.maps_url && (
                    <a
                      href={event.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                        color: 'white'
                      }}
                      data-testid={`maps-btn-${index}`}
                    >
                      <MapPin className="w-4 h-4" />
                      Buka di Google Maps
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  
                  {event.maps_embed && (
                    <div className="h-40 overflow-hidden">
                      <iframe
                        src={event.maps_embed}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map ${event.name}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Love Story Section */}
          {invitation.love_story?.length > 0 && (
            <section 
              ref={(el) => addSectionRef(el, 5)} 
              className="fade-section py-12"
              style={{ 
                background: `linear-gradient(180deg, ${theme.gradientStart} 0%, ${theme.gradientMid} 50%, ${theme.gradientEnd} 100%)`
              }}
            >
              <LoveStoryTimeline stories={invitation.love_story} />
            </section>
          )}

          {/* Gallery Section */}
          {invitation.gallery?.length > 0 && (
            <section 
              ref={(el) => addSectionRef(el, 6)} 
              className="fade-section invitation-section"
            >
              <h2 
                className="section-title text-2xl text-center mb-8"
                style={{ fontFamily: theme.fontHeading, color: theme.primaryColor }}
              >
                Galeri
              </h2>
              
              <div className="gallery-grid">
                {invitation.gallery.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`gallery-item ${index === 0 ? 'wide' : ''}`}
                  >
                    <img 
                      src={item.url} 
                      alt={item.caption || `Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Video Section */}
          {invitation.video_url && (
            <section 
              ref={(el) => addSectionRef(el, 7)} 
              className="fade-section"
              style={{ backgroundColor: `${theme.secondaryColor}40` }}
            >
              <VideoSection 
                videoUrl={invitation.video_url}
                title="Video Kami"
              />
            </section>
          )}

          {/* RSVP Section */}
          <section 
            ref={(el) => addSectionRef(el, 8)} 
            className="fade-section invitation-section"
          >
            <h2 
              className="section-title text-2xl text-center mb-8"
              style={{ fontFamily: theme.fontHeading, color: theme.primaryColor }}
            >
              Konfirmasi Kehadiran
            </h2>
            
            <form onSubmit={handleRSVPSubmit} className="card-section p-6 max-w-sm mx-auto">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Nama</Label>
                  <Input
                    value={rsvpForm.guest_name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, guest_name: e.target.value })}
                    className="mt-1 rounded-xl"
                    style={{ borderColor: `${theme.primaryColor}30` }}
                    data-testid="rsvp-name-input"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">No. WhatsApp (Opsional)</Label>
                  <Input
                    value={rsvpForm.phone}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="mt-1 rounded-xl"
                    style={{ borderColor: `${theme.primaryColor}30` }}
                    data-testid="rsvp-phone-input"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-3 block">Konfirmasi Kehadiran</Label>
                  <RadioGroup
                    value={rsvpForm.attendance}
                    onValueChange={(value) => setRsvpForm({ ...rsvpForm, attendance: value })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hadir" id="hadir" data-testid="rsvp-hadir-radio" />
                      <Label htmlFor="hadir" className="cursor-pointer">Hadir</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tidak_hadir" id="tidak_hadir" data-testid="rsvp-tidak-hadir-radio" />
                      <Label htmlFor="tidak_hadir" className="cursor-pointer">Tidak Hadir</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="belum_pasti" id="belum_pasti" data-testid="rsvp-belum-pasti-radio" />
                      <Label htmlFor="belum_pasti" className="cursor-pointer">Belum Pasti</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {rsvpForm.attendance === 'hadir' && (
                  <div>
                    <Label className="text-sm font-medium">Jumlah Tamu</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={rsvpForm.guest_count}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guest_count: parseInt(e.target.value) || 1 })}
                      className="mt-1 rounded-xl w-24"
                      style={{ borderColor: `${theme.primaryColor}30` }}
                      data-testid="rsvp-guest-count-input"
                    />
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={rsvpLoading}
                  className="w-full rounded-xl py-6 text-white"
                  style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` }}
                  data-testid="rsvp-submit-btn"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {rsvpLoading ? 'Mengirim...' : 'Konfirmasi Kehadiran'}
                </Button>
              </div>
            </form>
          </section>

          {/* Messages/Ucapan Section */}
          <section 
            ref={(el) => addSectionRef(el, 9)} 
            className="fade-section invitation-section py-12"
            style={{ backgroundColor: `${theme.secondaryColor}40` }}
          >
            <h2 
              className="section-title text-2xl text-center mb-8"
              style={{ fontFamily: theme.fontHeading, color: theme.primaryColor }}
            >
              Ucapan & Doa
            </h2>
            
            {/* Message Form */}
            <form onSubmit={handleMessageSubmit} className="card-section p-6 mb-6 max-w-sm mx-auto">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Nama</Label>
                  <Input
                    value={messageForm.guest_name}
                    onChange={(e) => setMessageForm({ ...messageForm, guest_name: e.target.value })}
                    className="mt-1 rounded-xl"
                    style={{ borderColor: `${theme.primaryColor}30` }}
                    data-testid="message-name-input"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Ucapan & Doa</Label>
                  <Textarea
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                    placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                    className="mt-1 rounded-xl min-h-[100px]"
                    style={{ borderColor: `${theme.primaryColor}30` }}
                    data-testid="message-content-input"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={messageLoading}
                  className="w-full rounded-xl py-5 text-white"
                  style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` }}
                  data-testid="message-submit-btn"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {messageLoading ? 'Mengirim...' : 'Kirim Ucapan'}
                </Button>
              </div>
            </form>
            
            {/* Messages List */}
            <div className="space-y-4 max-h-96 overflow-y-auto px-4">
              {messages.map((msg) => (
                <div key={msg.id} className="card-section p-4">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: theme.secondaryColor }}
                    >
                      <span className="font-serif" style={{ color: theme.primaryColor }}>
                        {msg.guest_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{msg.guest_name}</p>
                      <p className="text-muted-foreground text-sm mt-1">{msg.message}</p>
                      {msg.reply && (
                        <div 
                          className="mt-3 pl-4 border-l-2"
                          style={{ borderColor: theme.accentColor }}
                        >
                          <p className="text-sm font-medium" style={{ color: theme.accentColor }}>
                            Balasan dari mempelai:
                          </p>
                          <p className="text-sm text-muted-foreground">{msg.reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Belum ada ucapan. Jadilah yang pertama!</p>
                </div>
              )}
            </div>
          </section>

          {/* Gift Section */}
          {invitation.gifts?.length > 0 && (
            <section 
              ref={(el) => addSectionRef(el, 10)} 
              className="fade-section invitation-section"
            >
              <h2 
                className="section-title text-2xl text-center mb-8"
                style={{ fontFamily: theme.fontHeading, color: theme.primaryColor }}
              >
                Kirim Hadiah
              </h2>
              <p className="text-center text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
                Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. 
                Dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi melalui:
              </p>
              
              <div className="space-y-4 max-w-sm mx-auto">
                {invitation.gifts.map((gift) => (
                  <div 
                    key={gift.id} 
                    className="card-section p-5"
                    style={{ 
                      background: `linear-gradient(135deg, white 0%, ${theme.secondaryColor} 100%)`,
                      border: `1px solid ${theme.accentColor}30`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{gift.bank_name}</p>
                        <p className="font-mono text-lg text-foreground mt-1">{gift.account_number}</p>
                        <p className="text-sm" style={{ color: theme.primaryColor }}>
                          a.n. {gift.account_holder}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyBankAccount(gift.account_number)}
                        className="rounded-lg"
                        style={{ borderColor: theme.accentColor, color: theme.accentColor }}
                        data-testid={`copy-bank-${gift.id}`}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Closing Section */}
          <section 
            ref={(el) => addSectionRef(el, 11)} 
            className="fade-section invitation-section text-center py-16"
            style={{ backgroundColor: `${theme.secondaryColor}60` }}
          >
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
            
            <Heart className="w-8 h-8 mx-auto mb-6" style={{ color: theme.primaryColor }} />
            
            <p className="text-base leading-relaxed max-w-sm mx-auto mb-8 opacity-80">
              {invitation.closing_text}
            </p>
            
            <p className="font-serif text-lg mb-2" style={{ color: theme.primaryColor }}>
              Wassalamu'alaikum Wr. Wb.
            </p>
            
            <div className="mt-8">
              <p className="text-muted-foreground text-sm">Kami yang berbahagia,</p>
              <p 
                className="font-script text-3xl mt-2"
                style={{ color: theme.primaryColor }}
              >
                {invitation.groom?.name} & {invitation.bride?.name}
              </p>
            </div>
            
            <div 
              className="divider w-20 mx-auto mt-12"
              style={{ background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)` }}
            />
            
            <p className="text-xs text-muted-foreground mt-8">
              Made with ❤️ by Undangan Digital
            </p>
          </section>

          {/* Music Player */}
          <MusicPlayer 
            musicUrl={invitation.settings?.music_url}
            musicList={invitation.settings?.music_list || []}
            autoPlay={musicAutoPlay}
          />
        </>
      )}
    </div>
  );
};

const InvitationPage = () => {
  const { invitationId } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('kpd') || 'Tamu Undangan';
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitation();
  }, [invitationId]);

  const fetchInvitation = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/invitation/${invitationId}`);
      setInvitation(response.data);
    } catch (error) {
      console.error('Failed to fetch invitation:', error);
      toast.error('Undangan tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="font-serif text-primary text-xl">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center p-8">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-primary mb-2">Undangan Tidak Ditemukan</h1>
          <p className="text-muted-foreground">Link undangan tidak valid atau sudah dihapus.</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={invitation.theme || 'floral'}>
      <InvitationContent invitation={invitation} guestName={guestName} />
    </ThemeProvider>
  );
};

export default InvitationPage;
