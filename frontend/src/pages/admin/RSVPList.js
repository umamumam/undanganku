import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { Heart, ArrowLeft, Trash2, Users, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const RSVPList = () => {
  const { invitationId } = useParams();
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [invitationId]);

  const fetchData = async () => {
    try {
      const [rsvpRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/invitations/${invitationId}/rsvps`, { headers: getAuthHeaders() }),
        axios.get(`${API_URL}/invitations/${invitationId}/stats`, { headers: getAuthHeaders() })
      ]);
      setRsvps(rsvpRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/rsvps/${deleteId}`, { headers: getAuthHeaders() });
      toast.success('RSVP dihapus');
      fetchData();
    } catch (error) {
      toast.error('Gagal menghapus');
    } finally {
      setDeleteId(null);
    }
  };

  const getAttendanceBadge = (attendance) => {
    switch (attendance) {
      case 'hadir':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Hadir</Badge>;
      case 'tidak_hadir':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Tidak Hadir</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><HelpCircle className="w-3 h-3 mr-1" />Belum Pasti</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Heart className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div data-testid="rsvp-list-page">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-serif text-foreground">Daftar RSVP</h1>
          <p className="text-muted-foreground">Konfirmasi kehadiran tamu</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Total RSVP</p>
            <p className="text-2xl font-serif text-primary">{stats.total_rsvp}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Akan Hadir</p>
            <p className="text-2xl font-serif text-green-600">{stats.attending}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Tidak Hadir</p>
            <p className="text-2xl font-serif text-red-500">{stats.not_attending}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">Total Tamu</p>
            <p className="text-2xl font-serif text-accent">{stats.total_guests}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {rsvps.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Belum ada RSVP</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Tamu</TableHead>
                <TableHead>No. WhatsApp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rsvps.map((rsvp) => (
                <TableRow key={rsvp.id}>
                  <TableCell className="font-medium">{rsvp.guest_name}</TableCell>
                  <TableCell>{rsvp.phone || '-'}</TableCell>
                  <TableCell>{getAttendanceBadge(rsvp.attendance)}</TableCell>
                  <TableCell>{rsvp.guest_count} orang</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(rsvp.created_at).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(rsvp.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      data-testid={`delete-rsvp-${rsvp.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus RSVP?</AlertDialogTitle>
            <AlertDialogDescription>
              Data RSVP ini akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RSVPList;
