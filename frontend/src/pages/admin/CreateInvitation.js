import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Heart, User, Calendar, MapPin, Image, 
  Gift, MessageCircle, Settings, Plus, Trash2, Save,
  Palette, Music, Video, Check
} from 'lucide-react';
import { THEMES } from '@/themes/ThemeProvider';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initialFormData = {
  theme: 'floral',
  cover_photo: '',
  groom: {
    name: '',
    full_name: '',
    photo: '',
    father_name: '',
    mother_name: '',
    child_order: 'Putra pertama dari',
    instagram: ''
  },
  bride: {
    name: '',
    full_name: '',
    photo: '',
    father_name: '',
    mother_name: '',
    child_order: 'Putri pertama dari',
    instagram: ''
  },
  events: [
    {
      name: 'Akad Nikah',
      date: '',
      time_start: '08:00',
      time_end: '10:00',
      venue_name: '',
      address: '',
      maps_url: '',
      maps_embed: ''
    },
    {
      name: 'Resepsi',
      date: '',
      time_start: '11:00',
      time_end: '14:00',
      venue_name: '',
      address: '',
      maps_url: '',
      maps_embed: ''
    }
  ],
  love_story: [],
  gallery: [],
  gifts: [],
  opening_text: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan',
  closing_text: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.',
  video_url: '',
  streaming_url: '',
  quran_verse: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
  quran_surah: 'Q.S Ar-Rum : 21',
  settings: {
    music_url: '',
    music_list: [],
    active_music_id: '',
    primary_color: '#B76E79',
    secondary_color: '#F5E6E8',
    accent_color: '#D4AF37',
    font_heading: 'Playfair Display',
    font_body: 'Manrope',
    auto_scroll: true,
    show_countdown: true,
    show_love_story: true,
    show_gallery: true,
    show_video: true,
    show_gift: true,
    show_rsvp: true,
    show_messages: true
  }
};

const ThemePreview = ({ theme, isSelected, onClick }) => {
  const themeData = THEMES[theme];
  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${
        isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Preview */}
      <div 
        className="h-32 p-4 flex flex-col items-center justify-center"
        style={{ 
          background: `linear-gradient(to bottom, ${themeData.gradientStart}, ${themeData.gradientMid}, ${themeData.gradientEnd})`
        }}
      >
        <p className="text-xs opacity-60" style={{ color: themeData.primaryColor }}>THE WEDDING OF</p>
        <p 
          className="font-script text-xl mt-1"
          style={{ color: themeData.primaryColor, fontFamily: "'Great Vibes', cursive" }}
        >
          Romeo & Juliet
        </p>
        <div 
          className="w-8 h-0.5 mt-2"
          style={{ background: themeData.accentColor }}
        />
      </div>
      
      {/* Info */}
      <div className="p-3 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{themeData.name}</p>
            <p className="text-xs text-muted-foreground">{themeData.description}</p>
          </div>
          {isSelected && (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        
        {/* Color swatches */}
        <div className="flex gap-1 mt-2">
          <div 
            className="w-5 h-5 rounded-full border"
            style={{ backgroundColor: themeData.primaryColor }}
            title="Primary"
          />
          <div 
            className="w-5 h-5 rounded-full border"
            style={{ backgroundColor: themeData.secondaryColor }}
            title="Secondary"
          />
          <div 
            className="w-5 h-5 rounded-full border"
            style={{ backgroundColor: themeData.accentColor }}
            title="Accent"
          />
        </div>
      </div>
    </div>
  );
};

const CreateInvitation = () => {
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('theme');

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof field === 'string' 
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const updateEvent = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.map((event, i) => 
        i === index ? { ...event, [field]: value } : event
      )
    }));
  };

  const addLoveStory = () => {
    setFormData(prev => ({
      ...prev,
      love_story: [...prev.love_story, { id: Date.now().toString(), date: '', title: '', description: '', image: '' }]
    }));
  };

  const updateLoveStory = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      love_story: prev.love_story.map((story, i) => 
        i === index ? { ...story, [field]: value } : story
      )
    }));
  };

  const removeLoveStory = (index) => {
    setFormData(prev => ({
      ...prev,
      love_story: prev.love_story.filter((_, i) => i !== index)
    }));
  };

  const addGalleryItem = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, { id: Date.now().toString(), url: '', caption: '' }]
    }));
  };

  const updateGalleryItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeGalleryItem = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const addGiftAccount = () => {
    setFormData(prev => ({
      ...prev,
      gifts: [...prev.gifts, { id: Date.now().toString(), bank_name: '', account_number: '', account_holder: '' }]
    }));
  };

  const updateGiftAccount = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      gifts: prev.gifts.map((gift, i) => 
        i === index ? { ...gift, [field]: value } : gift
      )
    }));
  };

  const removeGiftAccount = (index) => {
    setFormData(prev => ({
      ...prev,
      gifts: prev.gifts.filter((_, i) => i !== index)
    }));
  };

  // Music list functions
  const addMusicItem = () => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        music_list: [
          ...prev.settings.music_list,
          { id: Date.now().toString(), title: '', source_type: 'mp3', url: '', is_active: false }
        ]
      }
    }));
  };

  const updateMusicItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        music_list: prev.settings.music_list.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const removeMusicItem = (index) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        music_list: prev.settings.music_list.filter((_, i) => i !== index)
      }
    }));
  };

  const setActiveMusic = (id) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        active_music_id: id,
        music_list: prev.settings.music_list.map(item => ({
          ...item,
          is_active: item.id === id
        }))
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.groom.name || !formData.bride.name) {
      toast.error('Nama mempelai harus diisi');
      return;
    }
    if (!formData.events[0].date) {
      toast.error('Tanggal acara harus diisi');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/invitations`, formData, {
        headers: getAuthHeaders()
      });
      toast.success('Undangan berhasil dibuat!');
      navigate('/admin');
    } catch (error) {
      console.error('Failed to create invitation:', error);
      toast.error('Gagal membuat undangan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="create-invitation-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Buat Undangan Baru</h1>
          <p className="text-muted-foreground">Isi data undangan pernikahanmu</p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl"
          data-testid="save-invitation-btn"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Menyimpan...' : 'Simpan Undangan'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-secondary/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="theme" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-white">
            <Palette className="w-4 h-4 mr-2" />
            Tema
          </TabsTrigger>
          <TabsTrigger value="couple" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-white">
            <User className="w-4 h-4 mr-2" />
            Mempelai
          </TabsTrigger>
          <TabsTrigger value="events" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-white">
            <Calendar className="w-4 h-4 mr-2" />
            Acara
          </TabsTrigger>
          <TabsTrigger value="story" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-white">
            <Heart className="w-4 h-4 mr-2" />
            Love Story
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-white">
            <Image className="w-4 h-4 mr-2" />
            Galeri
          </TabsTrigger>
          <TabsTrigger value="media" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-white">
            <Video className="w-4 h-4 mr-2" />
            Media
          </TabsTrigger>
          <TabsTrigger value="gifts" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-white">
            <Gift className="w-4 h-4 mr-2" />
            Hadiah
          </TabsTrigger>
          <TabsTrigger value="content" className="flex-1 min-w-[100px] rounded-lg data-[state=active]:bg-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Konten
          </TabsTrigger>
        </TabsList>

        {/* Theme Tab */}
        <TabsContent value="theme">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-serif text-lg text-primary mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Pilih Tema Undangan
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Pilih tema yang sesuai dengan konsep pernikahan Anda
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.keys(THEMES).map((themeKey) => (
                <ThemePreview
                  key={themeKey}
                  theme={themeKey}
                  isSelected={formData.theme === themeKey}
                  onClick={() => setFormData(prev => ({ ...prev, theme: themeKey }))}
                />
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Label>Foto Cover (untuk tampilan awal undangan)</Label>
              <Input
                value={formData.cover_photo}
                onChange={(e) => setFormData({ ...formData, cover_photo: e.target.value })}
                placeholder="https://example.com/foto-cover.jpg"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Foto ini akan ditampilkan di halaman cover/pembuka undangan
              </p>
              
              {formData.cover_photo && (
                <div className="mt-3">
                  <img 
                    src={formData.cover_photo} 
                    alt="Cover Preview" 
                    className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Couple Tab */}
        <TabsContent value="couple">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Groom */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-serif text-lg text-primary mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Mempelai Pria
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Nama Panggilan *</Label>
                  <Input
                    value={formData.groom.name}
                    onChange={(e) => updateFormData('groom', 'name', e.target.value)}
                    placeholder="Contoh: Budi"
                    className="mt-1"
                    data-testid="groom-name-input"
                  />
                </div>
                <div>
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={formData.groom.full_name}
                    onChange={(e) => updateFormData('groom', 'full_name', e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.Kom"
                    className="mt-1"
                    data-testid="groom-fullname-input"
                  />
                </div>
                <div>
                  <Label>URL Foto</Label>
                  <Input
                    value={formData.groom.photo}
                    onChange={(e) => updateFormData('groom', 'photo', e.target.value)}
                    placeholder="https://example.com/foto.jpg"
                    className="mt-1"
                  />
                  {formData.groom.photo && (
                    <img src={formData.groom.photo} alt="Preview" className="w-20 h-20 object-cover rounded-full mt-2" />
                  )}
                </div>
                <div>
                  <Label>Anak ke- / Keterangan</Label>
                  <Input
                    value={formData.groom.child_order}
                    onChange={(e) => updateFormData('groom', 'child_order', e.target.value)}
                    placeholder="Putra pertama dari"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nama Ayah</Label>
                  <Input
                    value={formData.groom.father_name}
                    onChange={(e) => updateFormData('groom', 'father_name', e.target.value)}
                    placeholder="Nama ayah"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nama Ibu</Label>
                  <Input
                    value={formData.groom.mother_name}
                    onChange={(e) => updateFormData('groom', 'mother_name', e.target.value)}
                    placeholder="Nama ibu"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Instagram (tanpa @)</Label>
                  <Input
                    value={formData.groom.instagram}
                    onChange={(e) => updateFormData('groom', 'instagram', e.target.value)}
                    placeholder="username"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Bride */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-serif text-lg text-primary mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Mempelai Wanita
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Nama Panggilan *</Label>
                  <Input
                    value={formData.bride.name}
                    onChange={(e) => updateFormData('bride', 'name', e.target.value)}
                    placeholder="Contoh: Ani"
                    className="mt-1"
                    data-testid="bride-name-input"
                  />
                </div>
                <div>
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={formData.bride.full_name}
                    onChange={(e) => updateFormData('bride', 'full_name', e.target.value)}
                    placeholder="Contoh: Ani Wijaya, S.E."
                    className="mt-1"
                    data-testid="bride-fullname-input"
                  />
                </div>
                <div>
                  <Label>URL Foto</Label>
                  <Input
                    value={formData.bride.photo}
                    onChange={(e) => updateFormData('bride', 'photo', e.target.value)}
                    placeholder="https://example.com/foto.jpg"
                    className="mt-1"
                  />
                  {formData.bride.photo && (
                    <img src={formData.bride.photo} alt="Preview" className="w-20 h-20 object-cover rounded-full mt-2" />
                  )}
                </div>
                <div>
                  <Label>Anak ke- / Keterangan</Label>
                  <Input
                    value={formData.bride.child_order}
                    onChange={(e) => updateFormData('bride', 'child_order', e.target.value)}
                    placeholder="Putri pertama dari"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nama Ayah</Label>
                  <Input
                    value={formData.bride.father_name}
                    onChange={(e) => updateFormData('bride', 'father_name', e.target.value)}
                    placeholder="Nama ayah"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nama Ibu</Label>
                  <Input
                    value={formData.bride.mother_name}
                    onChange={(e) => updateFormData('bride', 'mother_name', e.target.value)}
                    placeholder="Nama ibu"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Instagram (tanpa @)</Label>
                  <Input
                    value={formData.bride.instagram}
                    onChange={(e) => updateFormData('bride', 'instagram', e.target.value)}
                    placeholder="username"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <div className="space-y-6">
            {formData.events.map((event, index) => (
              <div key={index} className="bg-white rounded-xl border p-6">
                <h3 className="font-serif text-lg text-primary mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {event.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Acara</Label>
                    <Input
                      value={event.name}
                      onChange={(e) => updateEvent(index, 'name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Tanggal *</Label>
                    <Input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateEvent(index, 'date', e.target.value)}
                      className="mt-1"
                      data-testid={`event-date-${index}`}
                    />
                  </div>
                  <div>
                    <Label>Waktu Mulai</Label>
                    <Input
                      type="time"
                      value={event.time_start}
                      onChange={(e) => updateEvent(index, 'time_start', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Waktu Selesai</Label>
                    <Input
                      type="time"
                      value={event.time_end}
                      onChange={(e) => updateEvent(index, 'time_end', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Nama Tempat</Label>
                    <Input
                      value={event.venue_name}
                      onChange={(e) => updateEvent(index, 'venue_name', e.target.value)}
                      placeholder="Contoh: Gedung Serbaguna"
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Alamat Lengkap</Label>
                    <Textarea
                      value={event.address}
                      onChange={(e) => updateEvent(index, 'address', e.target.value)}
                      placeholder="Jl. Contoh No. 123, Kota, Provinsi"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Link Google Maps</Label>
                    <Input
                      value={event.maps_url}
                      onChange={(e) => updateEvent(index, 'maps_url', e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Embed Google Maps</Label>
                    <Input
                      value={event.maps_embed}
                      onChange={(e) => updateEvent(index, 'maps_embed', e.target.value)}
                      placeholder="https://www.google.com/maps/embed?..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Love Story Tab */}
        <TabsContent value="story">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-primary flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Love Story Timeline
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={addLoveStory}
                className="border-primary text-primary hover:bg-primary hover:text-white"
                data-testid="add-story-btn"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Cerita
              </Button>
            </div>
            
            {formData.love_story.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Belum ada cerita. Klik "Tambah Cerita" untuk menambahkan.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.love_story.map((story, index) => (
                  <div key={story.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Tanggal/Tahun</Label>
                        <Input
                          value={story.date}
                          onChange={(e) => updateLoveStory(index, 'date', e.target.value)}
                          placeholder="2020"
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Judul</Label>
                        <Input
                          value={story.title}
                          onChange={(e) => updateLoveStory(index, 'title', e.target.value)}
                          placeholder="Pertama Bertemu"
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Label>Deskripsi</Label>
                        <Textarea
                          value={story.description}
                          onChange={(e) => updateLoveStory(index, 'description', e.target.value)}
                          placeholder="Ceritakan momen spesial..."
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Label>URL Gambar (opsional)</Label>
                        <Input
                          value={story.image}
                          onChange={(e) => updateLoveStory(index, 'image', e.target.value)}
                          placeholder="https://example.com/foto.jpg"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLoveStory(index)}
                      className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-primary flex items-center gap-2">
                <Image className="w-5 h-5" />
                Galeri Foto
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={addGalleryItem}
                className="border-primary text-primary hover:bg-primary hover:text-white"
                data-testid="add-gallery-btn"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Foto
              </Button>
            </div>
            
            {formData.gallery.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Belum ada foto. Klik "Tambah Foto" untuk menambahkan.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.gallery.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="space-y-3">
                      <div>
                        <Label>URL Foto</Label>
                        <Input
                          value={item.url}
                          onChange={(e) => updateGalleryItem(index, 'url', e.target.value)}
                          placeholder="https://example.com/foto.jpg"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Caption (Opsional)</Label>
                        <Input
                          value={item.caption}
                          onChange={(e) => updateGalleryItem(index, 'caption', e.target.value)}
                          placeholder="Deskripsi foto"
                          className="mt-1"
                        />
                      </div>
                      {item.url && (
                        <img src={item.url} alt={item.caption} className="w-full h-32 object-cover rounded-lg" />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGalleryItem(index)}
                      className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Media Tab (Video & Music) */}
        <TabsContent value="media">
          <div className="space-y-6">
            {/* Video Section */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-serif text-lg text-primary mb-4 flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>URL Video YouTube</Label>
                  <Input
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=xxxxx atau https://youtu.be/xxxxx"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Masukkan link YouTube biasa, akan otomatis dikonversi ke embed player
                  </p>
                </div>
                <div>
                  <Label>URL Live Streaming</Label>
                  <Input
                    value={formData.streaming_url}
                    onChange={(e) => setFormData({ ...formData, streaming_url: e.target.value })}
                    placeholder="https://..."
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            {/* Music Section */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-primary flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Musik Background
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMusicItem}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Musik
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Anda bisa menambahkan beberapa musik dan memilih satu yang aktif. 
                Mendukung link MP3 langsung atau link YouTube.
              </p>
              
              {formData.settings.music_list.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Music className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Belum ada musik. Klik "Tambah Musik" untuk menambahkan.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.settings.music_list.map((music, index) => (
                    <div 
                      key={music.id} 
                      className={`border rounded-lg p-4 ${music.is_active ? 'border-primary bg-primary/5' : ''}`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <Label>Judul Lagu</Label>
                          <Input
                            value={music.title}
                            onChange={(e) => updateMusicItem(index, 'title', e.target.value)}
                            placeholder="Nama lagu"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Tipe</Label>
                          <select
                            value={music.source_type}
                            onChange={(e) => updateMusicItem(index, 'source_type', e.target.value)}
                            className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
                          >
                            <option value="mp3">MP3 URL</option>
                            <option value="youtube">YouTube</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <Label>URL</Label>
                          <Input
                            value={music.url}
                            onChange={(e) => updateMusicItem(index, 'url', e.target.value)}
                            placeholder={music.source_type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://example.com/music.mp3'}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Button
                          type="button"
                          variant={music.is_active ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveMusic(music.id)}
                          className={music.is_active ? 'bg-primary' : ''}
                        >
                          {music.is_active ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Aktif
                            </>
                          ) : 'Jadikan Aktif'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMusicItem(index)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Legacy music URL support */}
              <div className="mt-4 pt-4 border-t">
                <Label>Atau gunakan URL Musik Langsung (Legacy)</Label>
                <Input
                  value={formData.settings.music_url}
                  onChange={(e) => updateFormData('settings', 'music_url', e.target.value)}
                  placeholder="https://example.com/music.mp3"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL musik langsung (MP3) sebagai fallback jika tidak ada musik di daftar
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Gifts Tab */}
        <TabsContent value="gifts">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-primary flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Rekening Titip Hadiah
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={addGiftAccount}
                className="border-primary text-primary hover:bg-primary hover:text-white"
                data-testid="add-gift-btn"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Rekening
              </Button>
            </div>
            
            {formData.gifts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Belum ada rekening. Klik "Tambah Rekening" untuk menambahkan.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.gifts.map((gift, index) => (
                  <div key={gift.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Nama Bank</Label>
                        <Input
                          value={gift.bank_name}
                          onChange={(e) => updateGiftAccount(index, 'bank_name', e.target.value)}
                          placeholder="BCA"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Nomor Rekening</Label>
                        <Input
                          value={gift.account_number}
                          onChange={(e) => updateGiftAccount(index, 'account_number', e.target.value)}
                          placeholder="1234567890"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Nama Pemilik</Label>
                        <Input
                          value={gift.account_holder}
                          onChange={(e) => updateGiftAccount(index, 'account_holder', e.target.value)}
                          placeholder="Atas nama"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGiftAccount(index)}
                      className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content">
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <div>
              <Label>Ayat Al-Quran</Label>
              <Textarea
                value={formData.quran_verse}
                onChange={(e) => setFormData({ ...formData, quran_verse: e.target.value })}
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div>
              <Label>Surat & Ayat</Label>
              <Input
                value={formData.quran_surah}
                onChange={(e) => setFormData({ ...formData, quran_surah: e.target.value })}
                placeholder="Q.S Ar-Rum : 21"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Teks Pembuka</Label>
              <Textarea
                value={formData.opening_text}
                onChange={(e) => setFormData({ ...formData, opening_text: e.target.value })}
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div>
              <Label>Teks Penutup</Label>
              <Textarea
                value={formData.closing_text}
                onChange={(e) => setFormData({ ...formData, closing_text: e.target.value })}
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button (Mobile) */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 shadow-lg"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Menyimpan...' : 'Simpan Undangan'}
        </Button>
      </div>
    </div>
  );
};

export default CreateInvitation;
