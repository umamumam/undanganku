import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Heart, ArrowLeft, Trash2, MessageCircle, Reply, Send } from 'lucide-react';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MessageList = () => {
  const { invitationId } = useParams();
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [invitationId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/invitations/${invitationId}/messages`, {
        headers: getAuthHeaders()
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Gagal memuat ucapan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/messages/${deleteId}`, { headers: getAuthHeaders() });
      toast.success('Ucapan dihapus');
      fetchMessages();
    } catch (error) {
      toast.error('Gagal menghapus');
    } finally {
      setDeleteId(null);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Tulis balasan');
      return;
    }
    setReplyLoading(true);
    try {
      await axios.put(`${API_URL}/messages/${replyMessage.id}/reply`, 
        { reply: replyText },
        { headers: getAuthHeaders() }
      );
      toast.success('Balasan terkirim');
      setReplyMessage(null);
      setReplyText('');
      fetchMessages();
    } catch (error) {
      toast.error('Gagal mengirim balasan');
    } finally {
      setReplyLoading(false);
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
    <div data-testid="message-list-page">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-serif text-foreground">Ucapan Tamu</h1>
          <p className="text-muted-foreground">{messages.length} ucapan diterima</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <MessageCircle className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Belum ada ucapan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-xl border p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-primary text-lg">{msg.guest_name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{msg.guest_name}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-foreground/80">{msg.message}</p>
                    
                    {msg.reply && (
                      <div className="mt-3 pl-4 border-l-2 border-accent bg-secondary/30 p-3 rounded-r-lg">
                        <p className="text-xs text-accent font-medium mb-1">Balasan Anda:</p>
                        <p className="text-sm text-foreground/80">{msg.reply}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyMessage(msg);
                      setReplyText(msg.reply || '');
                    }}
                    className="border-accent text-accent hover:bg-accent hover:text-white"
                    data-testid={`reply-btn-${msg.id}`}
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    {msg.reply ? 'Edit' : 'Balas'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(msg.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    data-testid={`delete-msg-${msg.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog open={!!replyMessage} onOpenChange={() => setReplyMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Balas Ucapan</DialogTitle>
            <DialogDescription>
              Balas ucapan dari {replyMessage?.guest_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">Ucapan:</p>
            <p className="text-foreground bg-secondary/50 p-3 rounded-lg mb-4">"{replyMessage?.message}"</p>
            
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tulis balasan..."
              className="w-full"
              data-testid="reply-input"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyMessage(null)}>Batal</Button>
            <Button 
              onClick={handleReply} 
              disabled={replyLoading}
              className="bg-primary hover:bg-primary/90"
              data-testid="send-reply-btn"
            >
              <Send className="w-4 h-4 mr-2" />
              {replyLoading ? 'Mengirim...' : 'Kirim Balasan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Ucapan?</AlertDialogTitle>
            <AlertDialogDescription>
              Ucapan ini akan dihapus secara permanen.
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

export default MessageList;
