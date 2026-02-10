import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Plus, Edit, Trash2, Eye, Copy, Users, MessageCircle, 
  ExternalLink, Heart, Calendar, UserPlus
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DashboardHome = () => {
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await axios.get(`${API_URL}/invitations`, {
        headers: getAuthHeaders()
      });
      setInvitations(response.data);
      
      // Fetch stats for each invitation
      const statsPromises = response.data.map(inv => 
        axios.get(`${API_URL}/invitations/${inv.id}/stats`, { headers: getAuthHeaders() })
          .then(res => ({ id: inv.id, ...res.data }))
          .catch(() => ({ id: inv.id, total_rsvp: 0, attending: 0, total_messages: 0 }))
      );
      const allStats = await Promise.all(statsPromises);
      const statsMap = {};
      allStats.forEach(s => { statsMap[s.id] = s; });
      setStats(statsMap);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
      toast.error('Gagal memuat undangan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/invitations/${deleteId}`, {
        headers: getAuthHeaders()
      });
      toast.success('Undangan berhasil dihapus');
      fetchInvitations();
    } catch (error) {
      toast.error('Gagal menghapus undangan');
    } finally {
      setDeleteId(null);
    }
  };

  const copyInvitationLink = (invitationId) => {
    const link = `${window.location.origin}/undangan/${invitationId}`;
    navigator.clipboard.writeText(link);
    toast.success('Link undangan disalin!');
  };

  const totalRSVP = Object.values(stats).reduce((sum, s) => sum + (s.total_rsvp || 0), 0);
  const totalAttending = Object.values(stats).reduce((sum, s) => sum + (s.attending || 0), 0);
  const totalMessages = Object.values(stats).reduce((sum, s) => sum + (s.total_messages || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Heart className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div data-testid="dashboard-home">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Kelola undangan pernikahanmu</p>
        </div>
        <Button
          onClick={() => navigate('/admin/buat')}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl"
          data-testid="create-invitation-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Buat Undangan Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Undangan</p>
              <p className="text-3xl font-serif text-primary mt-1">{invitations.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total RSVP</p>
              <p className="text-3xl font-serif text-primary mt-1">{totalRSVP}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Akan Hadir</p>
              <p className="text-3xl font-serif text-green-600 mt-1">{totalAttending}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Ucapan</p>
              <p className="text-3xl font-serif text-primary mt-1">{totalMessages}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Invitations List */}
      {invitations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Heart className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-foreground mb-2">Belum Ada Undangan</h3>
          <p className="text-muted-foreground mb-6">Buat undangan pertamamu sekarang!</p>
          <Button
            onClick={() => navigate('/admin/buat')}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Undangan
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((inv) => (
            <div key={inv.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary/30 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Heart className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-foreground">
                      {inv.groom.name} & {inv.bride.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {inv.events?.[0]?.date && new Date(inv.events[0].date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {stats[inv.id]?.total_rsvp || 0} RSVP
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {stats[inv.id]?.total_messages || 0} Ucapan
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyInvitationLink(inv.id)}
                    className="border-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg"
                    data-testid={`copy-link-${inv.id}`}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Salin Link
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/undangan/${inv.id}`, '_blank')}
                    className="border-gray-200 hover:border-primary/20 rounded-lg"
                    data-testid={`preview-${inv.id}`}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/rsvp/${inv.id}`)}
                    className="border-gray-200 hover:border-primary/20 rounded-lg"
                    data-testid={`rsvp-list-${inv.id}`}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    RSVP
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/ucapan/${inv.id}`)}
                    className="border-gray-200 hover:border-primary/20 rounded-lg"
                    data-testid={`messages-list-${inv.id}`}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Ucapan
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/edit/${inv.id}`)}
                    className="border-accent/30 text-accent hover:bg-accent hover:text-white rounded-lg"
                    data-testid={`edit-${inv.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(inv.id)}
                    className="border-red-200 text-red-500 hover:bg-red-500 hover:text-white rounded-lg"
                    data-testid={`delete-${inv.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Undangan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua data RSVP dan ucapan juga akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              data-testid="confirm-delete-btn"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardHome;
