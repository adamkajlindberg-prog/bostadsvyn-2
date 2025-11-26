import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Download, 
  Share2, 
  Heart, 
  HeartOff, 
  Eye, 
  Trash2,
  Calendar,
  Home,
  Sparkles,
  ArrowLeftRight
} from 'lucide-react';

interface AIEdit {
  id: string;
  property_id: string | null;
  property_title: string | null;
  original_image_url: string;
  edited_image_url: string;
  edit_prompt: string;
  created_at: string;
  is_favorite: boolean;
  edit_type: string;
}

const AIImageGallery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [edits, setEdits] = useState<AIEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEdit, setSelectedEdit] = useState<AIEdit | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserEdits();
    }
  }, [user]);

  const loadUserEdits = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_ai_edits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEdits(data || []);
    } catch (error: any) {
      console.error('Error loading edits:', error);
      toast({
        title: "Kunde inte ladda bildgalleri",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (editId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('user_ai_edits')
        .update({ is_favorite: !currentFavorite })
        .eq('id', editId);

      if (error) throw error;

      setEdits(prev => prev.map(edit => 
        edit.id === editId ? { ...edit, is_favorite: !currentFavorite } : edit
      ));

      toast({
        title: currentFavorite ? "Borttaget från favoriter" : "Tillagt som favorit",
        description: currentFavorite ? "Bilden har tagits bort från dina favoriter" : "Bilden har lagts till som favorit",
      });
    } catch (error: any) {
      toast({
        title: "Kunde inte uppdatera favorit",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteEdit = async (editId: string) => {
    try {
      const { error } = await supabase
        .from('user_ai_edits')
        .delete()
        .eq('id', editId);

      if (error) throw error;

      setEdits(prev => prev.filter(edit => edit.id !== editId));
      toast({
        title: "Redigering borttagen",
        description: "Bilden har tagits bort från ditt galleri",
      });
    } catch (error: any) {
      toast({
        title: "Kunde inte ta bort",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Nedladdning misslyckades",
        description: "Kunde inte ladda ner bilden.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (imageUrl: string, prompt: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI-redigerad fastighetsbild',
          text: `Kolla in den här AI-redigeringen: ${prompt}`,
          url: imageUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(imageUrl);
      toast({
        title: "Länk kopierad",
        description: "Bildlänken har kopierats till urklipp.",
      });
    }
  };

  const favoriteEdits = edits.filter(edit => edit.is_favorite);
  const recentEdits = edits.slice(0, 12);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Laddar ditt bildgalleri...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const EditGrid = ({ edits, title }: { edits: AIEdit[], title: string }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        {title}
        <Badge variant="secondary">{edits.length}</Badge>
      </h3>
      
      {edits.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Inga redigeringar ännu</p>
          <p className="text-sm">Använd AI-bildredigeraren för att skapa dina första renoveringsvisualiseringar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {edits.map((edit) => (
            <Card key={edit.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={edit.edited_image_url}
                  alt={edit.edit_prompt}
                  className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setSelectedEdit(edit)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(edit.id, edit.is_favorite);
                    }}
                  >
                    {edit.is_favorite ? (
                      <Heart className="h-3 w-3 fill-current text-red-500" />
                    ) : (
                      <HeartOff className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEdit(edit);
                      setShowComparison(true);
                    }}
                  >
                    <ArrowLeftRight className="h-3 w-3" />
                  </Button>
                </div>

                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(edit.created_at).toLocaleDateString('sv-SE')}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  {edit.property_title && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Home className="h-3 w-3" />
                      <span className="truncate">{edit.property_title}</span>
                    </div>
                  )}
                  <p className="text-sm font-medium line-clamp-2">{edit.edit_prompt}</p>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => handleDownload(edit.edited_image_url, `ai-edit-${edit.id}.jpg`)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Ladda ner
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => handleShare(edit.edited_image_url, edit.edit_prompt)}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Dela
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-destructive hover:text-destructive"
                      onClick={() => deleteEdit(edit.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Mitt AI-bildgalleri
          </CardTitle>
          <p className="text-muted-foreground">
            Alla dina AI-redigerade fastighetsbilder och renoveringsvisualiseringar
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="recent" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Senaste
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favoriter
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent">
              <EditGrid edits={recentEdits} title="Senaste redigeringar" />
            </TabsContent>
            
            <TabsContent value="favorites">
              <EditGrid edits={favoriteEdits} title="Dina favoriter" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detailed View Dialog */}
      <Dialog open={!!selectedEdit} onOpenChange={() => {setSelectedEdit(null); setShowComparison(false);}}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI-redigering</DialogTitle>
          </DialogHeader>
          
          {selectedEdit && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {showComparison && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Före</h3>
                    <img
                      src={selectedEdit.original_image_url}
                      alt="Original"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                )}
                
                <div className={`space-y-2 ${showComparison ? '' : 'md:col-span-2'}`}>
                  <h3 className="font-semibold">Efter (AI-redigerad)</h3>
                  <img
                    src={selectedEdit.edited_image_url}
                    alt="AI Edited"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <h4 className="font-medium mb-2">Redigeringsprompt:</h4>
                  <p className="text-muted-foreground">{selectedEdit.edit_prompt}</p>
                </div>
                
                {selectedEdit.property_title && (
                  <div>
                    <h4 className="font-medium mb-2">Fastighet:</h4>
                    <p className="text-muted-foreground">{selectedEdit.property_title}</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowComparison(!showComparison)}
                    variant="outline"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    {showComparison ? 'Dölj jämförelse' : 'Visa före/efter'}
                  </Button>
                  
                  <Button
                    onClick={() => handleDownload(selectedEdit.edited_image_url, `ai-edit-${selectedEdit.id}.jpg`)}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Ladda ner
                  </Button>
                  
                  <Button
                    onClick={() => handleShare(selectedEdit.edited_image_url, selectedEdit.edit_prompt)}
                    variant="outline"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Dela
                  </Button>
                  
                  <Button
                    onClick={() => toggleFavorite(selectedEdit.id, selectedEdit.is_favorite)}
                    variant="outline"
                  >
                    {selectedEdit.is_favorite ? (
                      <HeartOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Heart className="h-4 w-4 mr-2" />
                    )}
                    {selectedEdit.is_favorite ? 'Ta bort favorit' : 'Lägg till favorit'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIImageGallery;