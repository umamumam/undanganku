import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, User, Calendar, MapPin, Image, 
  Gift, MessageCircle, Settings, Plus, Trash2, Save, ArrowLeft
} from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EditInvitation = () => {
  const { invitationId } = useParams();
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('couple');

  useEffect(() => {
    fetchInvitation();
  }, [invitationId]);

  const fetchInvitation = async () => {
    try {
      const response = await axios.get(`${API_URL}/invitations/${invitationId}`, {
        headers: getAuthHeaders()
      });
      setFormData(response.data);
    } catch (error) {
      console.error('Failed to fetch invitation:', error);
      toast.error('Gagal memuat undangan');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    if (!formData.groom.name || !formData.bride.name) {
      toast.error('Nama mempelai harus diisi');
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_URL}/invitations/${invitationId}`, {
        groom: formData.groom,
        bride: formData.bride,
        events: formData.events,
        love_story: formData.love_story,
        gallery: formData.gallery,
        gifts: formData.gifts,
        opening_text: formData.opening_text,
        closing_text: formData.closing_text,
        video_url: formData.video_url,
        streaming_url: formData.streaming_url,
        settings: formData.settings
      }, {
        headers: getAuthHeaders()
      });
      toast.success('Undangan berhasil diperbarui!');
    } catch (error) {
      console.error('Failed to update invitation:', error);
      toast.error('Gagal memperbarui undangan');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Heart className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div data-testid="edit-invitation-page">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-serif text-foreground">Edit Undangan</h1>
            <p className="text-muted-foreground">{formData.groom.name} & {formData.bride.name}</p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl"
          data-testid="save-changes-btn"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-secondary/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="couple" className="flex-1 min-w-[120px] rounded-lg data-[state=active]:bg-white">
            <User className="w-4 h-4 mr-2" />
            Mempelai
          </TabsTrigger>
          <TabsTrigger value="events" className="flex-1 min-w-[120px] rounded-lg data-[state=active]:bg-white">
            <Calendar className="w-4 h-4 mr-2" />
            Acara
          </TabsTrigger>
          <TabsTrigger value="story" className="flex-1 min-w-[120px] rounded-lg data-[state=active]:bg-white">
            <Heart className="w-4 h-4 mr-2" />
            Love Story
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex-1 min-w-[120px] rounded-lg data-[state=active]:bg-white">
            <Image className="w-4 h-4 mr-2" />
            Galeri
          </TabsTrigger>
          <TabsTrigger value="gifts" className="flex-1 min-w-[120px] rounded-lg data-[state=active]:bg-white">
            <Gift className="w-4 h-4 mr-2" />
            Hadiah
          </TabsTrigger>
          <TabsTrigger value="content" className="flex-1 min-w-[120px] rounded-lg data-[state=active]:bg-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Konten
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 min-w-[120px] rounded-lg data-[state=active]:bg-white">
            <Settings className="w-4 h-4 mr-2" />
            Pengaturan
          </TabsTrigger>
        </TabsList>

        {/* Same content structure as CreateInvitation but with formData values */}
        <TabsContent value="couple">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-serif text-lg text-primary mb-4">Mempelai Pria</h3>
              <div className="space-y-4">
                <div>
                  <Label>Nama Panggilan</Label>
                  <Input
                    value={formData.groom.name}
                    onChange={(e) => updateFormData('groom', 'name', e.target.value)}
                    className="mt-1"
                    data-testid="edit-groom-name"
                  />
                </div>
                <div>
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={formData.groom.full_name}
                    onChange={(e) => updateFormData('groom', 'full_name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>URL Foto</Label>
                  <Input
                    value={formData.groom.photo}
                    onChange={(e) => updateFormData('groom', 'photo', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Anak ke-</Label>
                  <Input
                    value={formData.groom.child_order}
                    onChange={(e) => updateFormData('groom', 'child_order', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nama Ayah</Label>
                  <Input
                    value={formData.groom.father_name}
                    onChange={(e) => updateFormData('groom', 'father_name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nama Ibu</Label>
                  <Input
                    value={formData.groom.mother_name}
                    onChange={(e) => updateFormData('groom', 'mother_name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={formData.groom.instagram}
                    onChange={(e) => updateFormData('groom', 'instagram', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-serif text-lg text-primary mb-4">Mempelai Wanita</h3>
              <div className="space-y-4">
                <div>
                  <Label>Nama Panggilan</Label>
                  <Input
                    value={formData.bride.name}
                    onChange={(e) => updateFormData('bride', 'name', e.target.value)}
                    className="mt-1"
                    data-testid="edit-bride-name"
                  />
                </div>
                <div>
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={formData.bride.full_name}
                    onChange={(e) => updateFormData('bride', 'full_name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>URL Foto</Label>
                  <Input
                    value={formData.bride.photo}
                    onChange={(e) => updateFormData('bride', 'photo', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Anak ke-</Label>
                  <Input
                    value={formData.bride.child_order}
                    onChange={(e) => updateFormData('bride', 'child_order', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nama Ayah</Label>
                  <Input
                    value={formData.bride.father_name}
                    onChange={(e) => updateFormData('bride', 'father_name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nama Ibu</Label>
                  <Input
                    value={formData.bride.mother_name}
                    onChange={(e) => updateFormData('bride', 'mother_name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={formData.bride.instagram}
                    onChange={(e) => updateFormData('bride', 'instagram', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="space-y-6">
            {formData.events.map((event, index) => (
              <div key={index} className="bg-white rounded-xl border p-6">
                <h3 className="font-serif text-lg text-primary mb-4">{event.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nama Acara</Label>
                    <Input value={event.name} onChange={(e) => updateEvent(index, 'name', e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Tanggal</Label>
                    <Input type="date" value={event.date} onChange={(e) => updateEvent(index, 'date', e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Waktu Mulai</Label>
                    <Input type="time" value={event.time_start} onChange={(e) => updateEvent(index, 'time_start', e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Waktu Selesai</Label>
                    <Input type="time" value={event.time_end} onChange={(e) => updateEvent(index, 'time_end', e.target.value)} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Nama Tempat</Label>
                    <Input value={event.venue_name} onChange={(e) => updateEvent(index, 'venue_name', e.target.value)} className="mt-1" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Alamat</Label>
                    <Textarea value={event.address} onChange={(e) => updateEvent(index, 'address', e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Link Google Maps</Label>
                    <Input value={event.maps_url} onChange={(e) => updateEvent(index, 'maps_url', e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Embed Google Maps</Label>
                    <Input value={event.maps_embed} onChange={(e) => updateEvent(index, 'maps_embed', e.target.value)} className="mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="story">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-primary">Love Story</h3>
              <Button type="button" variant="outline" onClick={addLoveStory} className="border-primary text-primary">
                <Plus className="w-4 h-4 mr-2" />Tambah
              </Button>
            </div>
            {formData.love_story.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Belum ada cerita</p>
            ) : (
              <div className="space-y-4">
                {formData.love_story.map((story, index) => (
                  <div key={story.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input placeholder="Tahun" value={story.date} onChange={(e) => updateLoveStory(index, 'date', e.target.value)} />
                      <Input placeholder="Judul" value={story.title} onChange={(e) => updateLoveStory(index, 'title', e.target.value)} className="md:col-span-2" />
                      <Textarea placeholder="Deskripsi" value={story.description} onChange={(e) => updateLoveStory(index, 'description', e.target.value)} className="md:col-span-3" />
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeLoveStory(index)} className="mt-2 text-red-500">
                      <Trash2 className="w-4 h-4 mr-1" />Hapus
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-primary">Galeri</h3>
              <Button type="button" variant="outline" onClick={addGalleryItem} className="border-primary text-primary">
                <Plus className="w-4 h-4 mr-2" />Tambah Foto
              </Button>
            </div>
            {formData.gallery.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Belum ada foto</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.gallery.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <Input placeholder="URL Foto" value={item.url} onChange={(e) => updateGalleryItem(index, 'url', e.target.value)} className="mb-2" />
                    <Input placeholder="Caption" value={item.caption} onChange={(e) => updateGalleryItem(index, 'caption', e.target.value)} />
                    {item.url && <img src={item.url} alt="" className="w-full h-32 object-cover rounded-lg mt-2" />}
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeGalleryItem(index)} className="mt-2 text-red-500">
                      <Trash2 className="w-4 h-4 mr-1" />Hapus
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="gifts">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-primary">Rekening Hadiah</h3>
              <Button type="button" variant="outline" onClick={addGiftAccount} className="border-primary text-primary">
                <Plus className="w-4 h-4 mr-2" />Tambah Rekening
              </Button>
            </div>
            {formData.gifts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Belum ada rekening</p>
            ) : (
              <div className="space-y-4">
                {formData.gifts.map((gift, index) => (
                  <div key={gift.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input placeholder="Nama Bank" value={gift.bank_name} onChange={(e) => updateGiftAccount(index, 'bank_name', e.target.value)} />
                      <Input placeholder="No. Rekening" value={gift.account_number} onChange={(e) => updateGiftAccount(index, 'account_number', e.target.value)} />
                      <Input placeholder="Atas Nama" value={gift.account_holder} onChange={(e) => updateGiftAccount(index, 'account_holder', e.target.value)} />
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeGiftAccount(index)} className="mt-2 text-red-500">
                      <Trash2 className="w-4 h-4 mr-1" />Hapus
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <div>
              <Label>Teks Pembuka</Label>
              <Textarea value={formData.opening_text} onChange={(e) => setFormData({ ...formData, opening_text: e.target.value })} className="mt-1 min-h-[100px]" />
            </div>
            <div>
              <Label>Teks Penutup</Label>
              <Textarea value={formData.closing_text} onChange={(e) => setFormData({ ...formData, closing_text: e.target.value })} className="mt-1 min-h-[100px]" />
            </div>
            <div>
              <Label>URL Video</Label>
              <Input value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>URL Streaming</Label>
              <Input value={formData.streaming_url} onChange={(e) => setFormData({ ...formData, streaming_url: e.target.value })} className="mt-1" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-white rounded-xl border p-6 space-y-6">
            <div>
              <Label>URL Musik</Label>
              <Input value={formData.settings.music_url} onChange={(e) => updateFormData('settings', 'music_url', e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Warna Primer</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="color" value={formData.settings.primary_color} onChange={(e) => updateFormData('settings', 'primary_color', e.target.value)} className="w-12 h-10 p-1" />
                  <Input value={formData.settings.primary_color} onChange={(e) => updateFormData('settings', 'primary_color', e.target.value)} className="flex-1" />
                </div>
              </div>
              <div>
                <Label>Warna Sekunder</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="color" value={formData.settings.secondary_color} onChange={(e) => updateFormData('settings', 'secondary_color', e.target.value)} className="w-12 h-10 p-1" />
                  <Input value={formData.settings.secondary_color} onChange={(e) => updateFormData('settings', 'secondary_color', e.target.value)} className="flex-1" />
                </div>
              </div>
              <div>
                <Label>Warna Aksen</Label>
                <div className="flex gap-2 mt-1">
                  <Input type="color" value={formData.settings.accent_color} onChange={(e) => updateFormData('settings', 'accent_color', e.target.value)} className="w-12 h-10 p-1" />
                  <Input value={formData.settings.accent_color} onChange={(e) => updateFormData('settings', 'accent_color', e.target.value)} className="flex-1" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditInvitation;
