"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  Calendar,
  Download,
  Heart,
  Home,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { UserAiEdit } from "db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  deleteAiEdit,
  getUserAiEdits,
  toggleFavoriteAiEdit,
} from "@/lib/actions/ai-image-gallery";

const AIImageGallery = () => {
  const [edits, setEdits] = useState<UserAiEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEdit, setSelectedEdit] = useState<UserAiEdit | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadUserEdits();
  }, []);

  const loadUserEdits = async () => {
    setLoading(true);
    try {
      const result = await getUserAiEdits();
      if (!result.success) {
        throw new Error(result.error || "Kunde inte ladda bildgalleri");
      }
      setEdits(result.edits || []);
    } catch (error) {
      console.error("Error loading edits:", error);
      toast.error("Kunde inte ladda bildgalleri", {
        description:
          error instanceof Error
            ? error.message
            : "Ett oväntat fel uppstod",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (
    editId: string,
    currentFavorite: boolean,
  ) => {
    try {
      const result = await toggleFavoriteAiEdit(editId, currentFavorite);
      if (!result.success) {
        throw new Error(result.error || "Kunde inte uppdatera favorit");
      }

      setEdits((prev) =>
        prev.map((edit) =>
          edit.id === editId
            ? { ...edit, isFavorite: !currentFavorite }
            : edit,
        ),
      );

      toast.success(
        currentFavorite ? "Borttaget från favoriter" : "Tillagt som favorit",
        {
          description: currentFavorite
            ? "Bilden har tagits bort från dina favoriter"
            : "Bilden har lagts till som favorit",
        },
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Kunde inte uppdatera favorit", {
        description:
          error instanceof Error ? error.message : "Ett oväntat fel uppstod",
      });
    }
  };

  const handleDelete = async (editId: string) => {
    try {
      const result = await deleteAiEdit(editId);
      if (!result.success) {
        throw new Error(result.error || "Kunde inte ta bort");
      }

      setEdits((prev) => prev.filter((edit) => edit.id !== editId));
      if (selectedEdit?.id === editId) {
        setSelectedEdit(null);
        setShowComparison(false);
      }
      toast.success("Redigering borttagen", {
        description: "Bilden har tagits bort från ditt galleri",
      });
    } catch (error) {
      console.error("Error deleting edit:", error);
      toast.error("Kunde inte ta bort", {
        description:
          error instanceof Error ? error.message : "Ett oväntat fel uppstod",
      });
    }
  };

  const handleDownload = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Nedladdning misslyckades", {
        description: "Kunde inte ladda ner bilden.",
      });
    }
  };

  const handleShare = async (imageUrl: string, prompt: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI-redigerad fastighetsbild",
          text: `Kolla in den här AI-redigeringen: ${prompt}`,
          url: imageUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Share error:", error);
        }
      }
    } else {
      navigator.clipboard.writeText(imageUrl);
      toast.success("Länk kopierad", {
        description: "Bildlänken har kopierats till urklipp.",
      });
    }
  };

  const favoriteEdits = edits.filter((edit) => edit.isFavorite);
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

  const EditGrid = ({
    edits: gridEdits,
    title,
  }: {
    edits: UserAiEdit[];
    title: string;
  }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        {title}
        <Badge variant="secondary">{gridEdits.length}</Badge>
      </h3>

      {gridEdits.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Inga redigeringar ännu</p>
          <p className="text-sm">
            Använd AI-bildredigeraren för att skapa dina första
            renoveringsvisualiseringar!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gridEdits.map((edit) => (
            <Card
              key={edit.id}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={edit.editedImageUrl}
                  alt={edit.editPrompt}
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
                      handleToggleFavorite(edit.id, edit.isFavorite);
                    }}
                  >
                    {edit.isFavorite ? (
                      <Heart className="h-3 w-3 fill-current text-red-500" />
                    ) : (
                      <Heart className="h-3 w-3" />
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
                    {new Date(edit.createdAt).toLocaleDateString("sv-SE")}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  {edit.propertyTitle && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Home className="h-3 w-3" />
                      <span className="truncate">{edit.propertyTitle}</span>
                    </div>
                  )}
                  <p className="text-sm font-medium line-clamp-2">
                    {edit.editPrompt}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() =>
                        handleDownload(
                          edit.editedImageUrl,
                          `ai-edit-${edit.id}.jpg`,
                        )
                      }
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Ladda ner
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() =>
                        handleShare(edit.editedImageUrl, edit.editPrompt)
                      }
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Dela
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-destructive hover:text-destructive"
                      onClick={() => handleDelete(edit.id)}
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
          <CardDescription>
            Alla dina AI-redigerade fastighetsbilder och renoveringsvisualiseringar
          </CardDescription>
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
      <Dialog
        open={!!selectedEdit}
        onOpenChange={() => {
          setSelectedEdit(null);
          setShowComparison(false);
        }}
      >
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
                      src={selectedEdit.originalImageUrl}
                      alt="Original"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                )}

                <div
                  className={`space-y-2 ${showComparison ? "" : "md:col-span-2"}`}
                >
                  <h3 className="font-semibold">Efter (AI-redigerad)</h3>
                  <img
                    src={selectedEdit.editedImageUrl}
                    alt="AI Edited"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <h4 className="font-medium mb-2">Redigeringsprompt:</h4>
                  <p className="text-muted-foreground">
                    {selectedEdit.editPrompt}
                  </p>
                </div>

                {selectedEdit.propertyTitle && (
                  <div>
                    <h4 className="font-medium mb-2">Fastighet:</h4>
                    <p className="text-muted-foreground">
                      {selectedEdit.propertyTitle}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowComparison(!showComparison)}
                    variant="outline"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    {showComparison ? "Dölj jämförelse" : "Visa före/efter"}
                  </Button>

                  <Button
                    onClick={() =>
                      handleDownload(
                        selectedEdit.editedImageUrl,
                        `ai-edit-${selectedEdit.id}.jpg`,
                      )
                    }
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Ladda ner
                  </Button>

                  <Button
                    onClick={() =>
                      handleShare(
                        selectedEdit.editedImageUrl,
                        selectedEdit.editPrompt,
                      )
                    }
                    variant="outline"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Dela
                  </Button>

                  <Button
                    onClick={() =>
                      handleToggleFavorite(
                        selectedEdit.id,
                        selectedEdit.isFavorite,
                      )
                    }
                    variant="outline"
                  >
                    {selectedEdit.isFavorite ? (
                      <Heart className="h-4 w-4 mr-2 fill-current text-red-500" />
                    ) : (
                      <Heart className="h-4 w-4 mr-2" />
                    )}
                    {selectedEdit.isFavorite
                      ? "Ta bort favorit"
                      : "Lägg till favorit"}
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

