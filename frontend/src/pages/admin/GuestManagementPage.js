import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  ArrowLeft, Plus, Trash2, Copy, Users, Link2, 
  Search, Download, Upload, CheckCircle, XCircle,
  Edit2, Save, X
} from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const GuestManagementPage = () => {
  const { invitationId } = useParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGuestName, setNewGuestName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchData();
  }, [invitationId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch invitation details
      const invResponse = await axios.get(`${API_URL}/invitations/${invitationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvitation(invResponse.data);
      
      // Fetch guests
      const guestsResponse = await axios.get(`${API_URL}/invitations/${invitationId}/guests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGuests(guestsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const addGuest = async () => {
    if (!newGuestName.trim()) {
      toast.error('Nama tamu tidak boleh kosong');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/invitations/${invitationId}/guests`,
        { name: newGuestName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGuests([...guests, response.data]);
      setNewGuestName('');
      toast.success('Tamu berhasil ditambahkan');
    } catch (error) {
      console.error('Error adding guest:', error);
      toast.error('Gagal menambahkan tamu');
    }
  };

  const deleteGuest = async (guestId) => {
    if (!window.confirm('Yakin ingin menghapus tamu ini?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/invitations/${invitationId}/guests/${guestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setGuests(guests.filter(g => g.id !== guestId));
      toast.success('Tamu berhasil dihapus');
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast.error('Gagal menghapus tamu');
    }
  };

  const updateGuest = async (guestId) => {
    if (!editName.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/invitations/${invitationId}/guests/${guestId}`,
        { name: editName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGuests(guests.map(g => g.id === guestId ? { ...g, name: editName.trim() } : g));
      setEditingId(null);
      setEditName('');
      toast.success('Nama tamu berhasil diubah');
    } catch (error) {
      console.error('Error updating guest:', error);
      toast.error('Gagal mengubah nama tamu');
    }
  };

  const copyLink = (guestName) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/undangan/${invitationId}?kpd=${encodeURIComponent(guestName)}`;
    navigator.clipboard.writeText(link);
    toast.success('Link undangan berhasil disalin!');
  };

  const copyAllLinks = () => {
    const baseUrl = window.location.origin;
    const links = guests.map(g => {
      return `${g.name}: ${baseUrl}/undangan/${invitationId}?kpd=${encodeURIComponent(g.name)}`;
    }).join('\n');
    
    navigator.clipboard.writeText(links);
    toast.success('Semua link berhasil disalin!');
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count RSVP stats
  const rsvpStats = {
    total: guests.length,
    hadir: guests.filter(g => g.rsvp_status === 'hadir').length,
    tidak_hadir: guests.filter(g => g.rsvp_status === 'tidak_hadir').length,
    pending: guests.filter(g => !g.rsvp_status || g.rsvp_status === 'pending').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali
            </button>
            <h1 className="font-serif text-lg text-rose-800">Daftar Tamu</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Invitation Info */}
        {invitation && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-serif text-xl text-rose-800 mb-2">
              {invitation.groom?.name} & {invitation.bride?.name}
            </h2>
            <p className="text-sm text-gray-500">
              {invitation.events?.[0]?.date && new Date(invitation.events[0].date).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-rose-700">{rsvpStats.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{rsvpStats.hadir}</p>
            <p className="text-xs text-gray-500">Hadir</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-red-500">{rsvpStats.tidak_hadir}</p>
            <p className="text-xs text-gray-500">Tidak Hadir</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-400">{rsvpStats.pending}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
        </div>

        {/* Add Guest Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="font-medium text-gray-800 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-rose-600" />
            Tambah Tamu Baru
          </h3>
          <div className="flex gap-3">
            <Input
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              placeholder="Nama tamu undangan..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addGuest()}
            />
            <Button 
              onClick={addGuest}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-600" />
              <h3 className="font-medium text-gray-800">Daftar Tamu ({filteredGuests.length})</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari tamu..."
                  className="pl-9 w-48"
                />
              </div>
              {guests.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={copyAllLinks}
                  className="text-rose-600 border-rose-200"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Salin Semua Link
                </Button>
              )}
            </div>
          </div>

          {filteredGuests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Belum ada tamu yang ditambahkan</p>
              <p className="text-sm">Tambahkan tamu untuk membuat link undangan personal</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredGuests.map((guest, index) => (
                <div 
                  key={guest.id} 
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-medium text-sm">
                      {index + 1}
                    </span>
                    
                    {editingId === guest.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-48"
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && updateGuest(guest.id)}
                        />
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => updateGuest(guest.id)}
                          className="text-green-600"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => { setEditingId(null); setEditName(''); }}
                          className="text-gray-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-800">{guest.name}</p>
                        {guest.rsvp_status && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            guest.rsvp_status === 'hadir' 
                              ? 'bg-green-100 text-green-700' 
                              : guest.rsvp_status === 'tidak_hadir'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {guest.rsvp_status === 'hadir' ? 'Akan Hadir' : 
                             guest.rsvp_status === 'tidak_hadir' ? 'Tidak Hadir' : 'Pending'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditingId(guest.id); setEditName(guest.name); }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyLink(guest.name)}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <Link2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteGuest(guest.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GuestManagementPage;
