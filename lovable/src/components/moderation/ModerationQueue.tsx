import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, AlertTriangle, Eye, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PendingItem {
  id: string;
  type: 'property' | 'ad';
  title: string;
  description: string;
  created_at: string;
  user_email?: string;
  moderation_status: string;
}

const ModerationQueue = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PendingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPendingItems();
  }, []);

  const loadPendingItems = async () => {
    try {
      // Load pending properties
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, title, description, created_at, moderation_status')
        .eq('moderation_status', 'pending')
        .order('created_at', { ascending: true });

      if (propError) throw propError;

      // Load pending ads
      const { data: ads, error: adsError } = await supabase
        .from('ads')
        .select('id, title, description, created_at, moderation_status')
        .eq('moderation_status', 'pending')
        .order('created_at', { ascending: true });

      if (adsError) throw adsError;

      const combined = [
        ...(properties || []).map(p => ({ ...p, type: 'property' as const })),
        ...(ads || []).map(a => ({ ...a, type: 'ad' as const })),
      ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      setItems(combined);
    } catch (error: any) {
      console.error('Error loading moderation queue:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte ladda modereringskön',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (itemId: string, itemType: 'property' | 'ad', status: 'approved' | 'rejected' | 'flagged') => {
    setActionLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updateData = {
        moderation_status: status,
        moderation_notes: moderationNotes,
        moderated_by: user.id,
        moderated_at: new Date().toISOString(),
      };

      const table = itemType === 'property' ? 'properties' : 'ads';
      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', itemId);

      if (error) throw error;

      // Log to security audit
      await supabase.from('security_audit_log').insert({
        user_id: user.id,
        event_type: 'moderation_action',
        event_category: 'admin_action',
        severity: 'info',
        resource_type: itemType,
        resource_id: itemId,
        action_performed: `Moderation status changed to ${status}`,
        metadata: { notes: moderationNotes },
      });

      toast({
        title: 'Moderering klar',
        description: `${itemType === 'property' ? 'Fastighet' : 'Annons'} har ${
          status === 'approved' ? 'godkänts' : status === 'rejected' ? 'nekats' : 'flaggats'
        }`,
      });

      setSelectedItem(null);
      setModerationNotes('');
      loadPendingItems();
    } catch (error: any) {
      console.error('Moderation error:', error);
      toast({
        title: 'Fel',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Modereringskö</span>
            <Badge variant="secondary">{items.length} väntande</Badge>
          </CardTitle>
          <CardDescription>
            Granska och godkänn annonser innan publicering
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Inga annonser att granska</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {item.type === 'property' ? 'Fastighet' : 'Annons'}
                        </Badge>
                        <h4 className="font-medium">{item.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Skapad: {new Date(item.created_at).toLocaleString('sv-SE')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Granska
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Granska {selectedItem?.type === 'property' ? 'fastighet' : 'annons'}</DialogTitle>
            <DialogDescription>
              Kontrollera att innehållet följer riktlinjer och lagar
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Titel</h4>
                <p>{selectedItem.title}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Beskrivning</h4>
                <p className="text-sm">{selectedItem.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Anteckningar (valfritt)</h4>
                <Textarea
                  placeholder="Skriv anteckningar om modereringsbeslutet..."
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleModeration(selectedItem.id, selectedItem.type, 'approved')}
                  disabled={actionLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Godkänn
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => handleModeration(selectedItem.id, selectedItem.type, 'flagged')}
                  disabled={actionLoading}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Flagga
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={() => handleModeration(selectedItem.id, selectedItem.type, 'rejected')}
                  disabled={actionLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Neka
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModerationQueue;
