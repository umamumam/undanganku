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
  Heart, Calendar, MapPin, Clock, Music, 
  Pause, Play, Send, Copy, Gift, ChevronDown,
  ExternalLink, Users, MessageCircle
} from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const InvitationPage = () => {
  const { invitationId } = useParams();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('kpd') || 'Tamu Undangan';
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCover, setShowCover] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const audioRef = useRef(null);
  const sectionsRef = useRef([]);

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
    fetchInvitation();
    fetchMessages();
  }, [invitationId]);

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

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/messages/${invitationId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleOpenInvitation = () => {
    setShowCover(false);
    if (audioRef.current && invitation?.settings?.music_url) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    setRsvpLoading(true);
    try {
      await axios.post(`${API_URL}/public/rsvp/${invitationId}`, rsvpForm);
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
      await axios.post(`${API_URL}/public/messages/${invitationId}`, messageForm);
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
    <div className="invitation-container" data-testid="invitation-page">
      {/* Audio Player */}
      <audio ref={audioRef} src={invitation.settings?.music_url} loop />
      
      {/* Cover/Opening */}
      {showCover && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-secondary via-white to-secondary p-6">
          <div className="text-center animate-fade-up">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">The Wedding Of</p>
            <h1 className="font-script text-5xl md:text-7xl text-primary mb-2">{invitation.groom.name}</h1>
            <p className="font-script text-3xl text-accent">&</p>
            <h1 className="font-script text-5xl md:text-7xl text-primary mt-2">{invitation.bride.name}</h1>
            
            <div className="mt-12 mb-8">
              <p className="text-muted-foreground mb-2">Kepada Yth.</p>
              <p className="text-xl font-serif text-foreground">Bapak/Ibu/Saudara/i</p>
              <p className="text-2xl font-serif text-primary mt-1">{guestName}</p>
            </div>
            
            <Button
              onClick={handleOpenInvitation}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full text-lg font-sans shadow-lg hover:shadow-xl transition-all"
              data-testid="open-invitation-btn"
            >
              Buka Undangan
              <ChevronDown className="ml-2 w-5 h-5 animate-bounce" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!showCover && (
        <>
          {/* Hero Section */}
          <section 
            ref={(el) => addSectionRef(el, 0)} 
            className="fade-section min-h-screen flex flex-col items-center justify-center relative p-6 pt-12"
          >
            <img 
              src={invitation.groom.photo || "https://images.unsplash.com/photo-1528298936130-dace32e4221c?w=800"} 
              alt="Couple" 
              className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white shadow-xl mb-8"
            />
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">Pernikahan</p>
            <h1 className="font-script text-5xl md:text-6xl text-primary">{invitation.groom.name}</h1>
            <p className="font-script text-3xl text-accent my-2">&</p>
            <h1 className="font-script text-5xl md:text-6xl text-primary">{invitation.bride.name}</h1>
            
            {invitation.events?.[0] && (
              <p className="mt-8 text-lg text-muted-foreground font-serif">
                {new Date(invitation.events[0].date).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            )}
          </section>

          {/* Opening Text */}
          <section 
            ref={(el) => addSectionRef(el, 1)} 
            className="fade-section invitation-section text-center"
          >
            <p className="text-base md:text-lg leading-relaxed text-foreground/80 max-w-sm mx-auto font-serif italic">
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
            </p>
            <p className="mt-6 text-base leading-relaxed text-foreground/80 max-w-sm mx-auto">
              {invitation.opening_text}
            </p>
          </section>

          {/* Couple Section */}
          <section 
            ref={(el) => addSectionRef(el, 2)} 
            className="fade-section invitation-section"
          >
            <h2 className="invitation-title">Mempelai</h2>
            
            {/* Groom */}
            <div className="text-center mb-12">
              <img 
                src={invitation.groom.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"} 
                alt={invitation.groom.name}
                className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-white shadow-lg mb-4"
              />
              <h3 className="font-script text-4xl text-primary mb-2">{invitation.groom.full_name}</h3>
              <p className="text-muted-foreground">{invitation.groom.child_order}</p>
              <p className="text-foreground mt-1">
                Bapak {invitation.groom.father_name} & Ibu {invitation.groom.mother_name}
              </p>
              {invitation.groom.instagram && (
                <a 
                  href={`https://instagram.com/${invitation.groom.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary mt-2 hover:underline"
                >
                  @{invitation.groom.instagram}
                </a>
              )}
            </div>

            <div className="flex justify-center my-8">
              <Heart className="w-8 h-8 text-accent" />
            </div>

            {/* Bride */}
            <div className="text-center">
              <img 
                src={invitation.bride.photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"} 
                alt={invitation.bride.name}
                className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-white shadow-lg mb-4"
              />
              <h3 className="font-script text-4xl text-primary mb-2">{invitation.bride.full_name}</h3>
              <p className="text-muted-foreground">{invitation.bride.child_order}</p>
              <p className="text-foreground mt-1">
                Bapak {invitation.bride.father_name} & Ibu {invitation.bride.mother_name}
              </p>
              {invitation.bride.instagram && (
                <a 
                  href={`https://instagram.com/${invitation.bride.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary mt-2 hover:underline"
                >
                  @{invitation.bride.instagram}
                </a>
              )}
            </div>
          </section>

          {/* Countdown Section */}
          <section 
            ref={(el) => addSectionRef(el, 3)} 
            className="fade-section invitation-section bg-secondary/30"
          >
            <h2 className="invitation-title">Menuju Hari Bahagia</h2>
            <div className="flex justify-center gap-3 md:gap-4">
              {[
                { value: countdown.days, label: 'Hari' },
                { value: countdown.hours, label: 'Jam' },
                { value: countdown.minutes, label: 'Menit' },
                { value: countdown.seconds, label: 'Detik' }
              ].map((item, index) => (
                <div key={index} className="countdown-box text-center">
                  <div className="countdown-number">{item.value}</div>
                  <div className="countdown-label">{item.label}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button
                onClick={addToCalendar}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-6"
                data-testid="save-calendar-btn"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Simpan ke Kalender
              </Button>
            </div>
          </section>

          {/* Events Section */}
          <section 
            ref={(el) => addSectionRef(el, 4)} 
            className="fade-section invitation-section"
          >
            <h2 className="invitation-title">Acara Pernikahan</h2>
            
            <div className="space-y-6">
              {invitation.events?.map((event, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
                  <h3 className="font-serif text-xl text-primary mb-4 text-center">{event.name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {new Date(event.date).toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-accent mt-0.5" />
                      <p>{event.time_start} - {event.time_end} WIB</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium">{event.venue_name}</p>
                        <p className="text-sm text-muted-foreground">{event.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  {event.maps_url && (
                    <a
                      href={event.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center w-full py-3 bg-secondary text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                      data-testid={`maps-btn-${index}`}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Buka di Google Maps
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  )}
                  
                  {event.maps_embed && (
                    <div className="mt-4 rounded-xl overflow-hidden h-48">
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
              className="fade-section invitation-section bg-secondary/30"
            >
              <h2 className="invitation-title">Love Story</h2>
              
              <div className="relative">
                <div className="timeline-line" />
                <div className="space-y-8">
                  {invitation.love_story.map((story, index) => (
                    <div key={story.id} className={`flex items-start gap-4 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                        <p className="text-sm text-accent font-medium mb-1">{story.date}</p>
                        <h4 className="font-serif text-lg text-primary mb-2">{story.title}</h4>
                        <p className="text-sm text-muted-foreground">{story.description}</p>
                      </div>
                      <div className="timeline-dot flex-shrink-0 relative z-10" />
                      <div className="w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {invitation.gallery?.length > 0 && (
            <section 
              ref={(el) => addSectionRef(el, 6)} 
              className="fade-section invitation-section"
            >
              <h2 className="invitation-title">Galeri</h2>
              
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
              className="fade-section invitation-section bg-secondary/30"
            >
              <h2 className="invitation-title">Video</h2>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src={invitation.video_url}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Wedding Video"
                />
              </div>
            </section>
          )}

          {/* RSVP Section */}
          <section 
            ref={(el) => addSectionRef(el, 8)} 
            className="fade-section invitation-section"
          >
            <h2 className="invitation-title">Konfirmasi Kehadiran</h2>
            
            <form onSubmit={handleRSVPSubmit} className="rsvp-form max-w-sm mx-auto">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Nama</Label>
                  <Input
                    value={rsvpForm.guest_name}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, guest_name: e.target.value })}
                    className="mt-1 rounded-xl border-primary/20"
                    data-testid="rsvp-name-input"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">No. WhatsApp (Opsional)</Label>
                  <Input
                    value={rsvpForm.phone}
                    onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="mt-1 rounded-xl border-primary/20"
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
                      className="mt-1 rounded-xl border-primary/20 w-24"
                      data-testid="rsvp-guest-count-input"
                    />
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={rsvpLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6"
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
            className="fade-section invitation-section bg-secondary/30"
          >
            <h2 className="invitation-title">Ucapan & Doa</h2>
            
            {/* Message Form */}
            <form onSubmit={handleMessageSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10 mb-6 max-w-sm mx-auto">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Nama</Label>
                  <Input
                    value={messageForm.guest_name}
                    onChange={(e) => setMessageForm({ ...messageForm, guest_name: e.target.value })}
                    className="mt-1 rounded-xl border-primary/20"
                    data-testid="message-name-input"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Ucapan & Doa</Label>
                  <Textarea
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                    placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                    className="mt-1 rounded-xl border-primary/20 min-h-[100px]"
                    data-testid="message-content-input"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={messageLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-5"
                  data-testid="message-submit-btn"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {messageLoading ? 'Mengirim...' : 'Kirim Ucapan'}
                </Button>
              </div>
            </form>
            
            {/* Messages List */}
            <div className="space-y-4 max-h-96 overflow-y-auto px-1">
              {messages.map((msg) => (
                <div key={msg.id} className="message-card">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="font-serif text-primary">{msg.guest_name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{msg.guest_name}</p>
                      <p className="text-muted-foreground text-sm mt-1">{msg.message}</p>
                      {msg.reply && (
                        <div className="mt-3 pl-4 border-l-2 border-accent">
                          <p className="text-sm text-accent font-medium">Balasan dari mempelai:</p>
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
              <h2 className="invitation-title">Kirim Hadiah</h2>
              <p className="text-center text-muted-foreground mb-6 max-w-sm mx-auto">
                Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih, dapat melalui:
              </p>
              
              <div className="space-y-4 max-w-sm mx-auto">
                {invitation.gifts.map((gift) => (
                  <div key={gift.id} className="gift-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{gift.bank_name}</p>
                        <p className="font-mono text-lg text-foreground mt-1">{gift.account_number}</p>
                        <p className="text-sm text-primary">a.n. {gift.account_holder}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyBankAccount(gift.account_number)}
                        className="border-accent text-accent hover:bg-accent hover:text-white rounded-lg"
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
            className="fade-section invitation-section bg-secondary/50 text-center"
          >
            <Heart className="w-8 h-8 text-primary mx-auto mb-6" />
            <p className="text-base leading-relaxed text-foreground/80 max-w-sm mx-auto mb-8">
              {invitation.closing_text}
            </p>
            
            <p className="font-serif text-lg text-primary mb-2">Wassalamu'alaikum Wr. Wb.</p>
            
            <div className="mt-8">
              <p className="text-muted-foreground text-sm">Kami yang berbahagia,</p>
              <p className="font-script text-3xl text-primary mt-2">
                {invitation.groom.name} & {invitation.bride.name}
              </p>
            </div>
            
            <div className="section-divider mt-12" />
            
            <p className="text-xs text-muted-foreground mt-8">
              Made with ❤️ by Undangan Digital
            </p>
          </section>

          {/* Music Player Button */}
          <button
            onClick={toggleMusic}
            className="music-player-btn"
            data-testid="music-toggle-btn"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
            <span className={`absolute inset-0 rounded-full border-2 border-white/30 ${isPlaying ? 'vinyl-spinning' : ''}`} />
          </button>
        </>
      )}
    </div>
  );
};

export default InvitationPage;
