import {
  Calculator,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  History,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ValuationHistoryItem {
  id: string;
  property_data: any;
  valuation_result: any;
  created_at: string;
}

interface AnalysisHistoryItem {
  id: string;
  market_data: any;
  analysis_result: any;
  created_at: string;
}

export const AIAnalysisHistory = () => {
  const { user } = useAuth();
  const [valuationHistory, setValuationHistory] = useState<
    ValuationHistoryItem[]
  >([]);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "valuation" | "analysis";
  } | null>(null);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const [valuationData, analysisData] = await Promise.all([
        supabase
          .from("valuation_history")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("market_analysis_history")
          .select("*")
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false }),
      ]);

      if (valuationData.error) throw valuationData.error;
      if (analysisData.error) throw analysisData.error;

      setValuationHistory(valuationData.data || []);
      setAnalysisHistory(analysisData.data || []);
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Kunde inte ladda historik");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const table =
        itemToDelete.type === "valuation"
          ? "valuation_history"
          : "market_analysis_history";
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", itemToDelete.id);

      if (error) throw error;

      toast.success("Historikpost raderad");
      loadHistory();
    } catch (error) {
      console.error("Error deleting history item:", error);
      toast.error("Kunde inte radera historikpost");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const exportToJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Historik exporterad!");
  };

  const exportValuations = () => {
    exportToJSON(
      valuationHistory,
      `varderingar_${new Date().toISOString().split("T")[0]}.json`,
    );
  };

  const exportAnalyses = () => {
    exportToJSON(
      analysisHistory,
      `marknadsanalyser_${new Date().toISOString().split("T")[0]}.json`,
    );
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laddar historik...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <History className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Analyshistorik</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Se och exportera alla dina tidigare AI-analyser
        </p>
      </div>

      <Tabs defaultValue="valuations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="valuations" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Värderingar ({valuationHistory.length})
          </TabsTrigger>
          <TabsTrigger value="analyses" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Marknadsanalyser ({analysisHistory.length})
          </TabsTrigger>
        </TabsList>

        {/* Valuations Tab */}
        <TabsContent value="valuations" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={exportValuations}
              disabled={valuationHistory.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportera alla
            </Button>
          </div>

          {valuationHistory.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Ingen värderingshistorik
                </h3>
                <p className="text-muted-foreground">
                  Dina värderingar kommer att sparas här automatiskt
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {valuationHistory.map((item) => (
                <Card
                  key={item.id}
                  className="hover:border-primary transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Calculator className="h-5 w-5" />
                          {item.property_data.address}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.created_at).toLocaleDateString(
                              "sv-SE",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                          <Badge variant="secondary">
                            {item.property_data.propertyType}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setExpandedId(
                              expandedId === item.id ? null : item.id,
                            )
                          }
                        >
                          {expandedId === item.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setItemToDelete({ id: item.id, type: "valuation" });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedId === item.id && (
                    <CardContent className="space-y-4 pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Uppskattat värde
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {formatPrice(item.valuation_result.estimatedValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Boarea
                          </p>
                          <p className="text-lg font-semibold">
                            {item.property_data.livingArea} m²
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Rum</p>
                          <p className="text-lg font-semibold">
                            {item.property_data.rooms}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Säkerhet
                          </p>
                          <p className="text-lg font-semibold">
                            {item.valuation_result.confidence}%
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            exportToJSON(
                              item,
                              `vardering_${item.property_data.address}_${item.created_at}.json`,
                            )
                          }
                        >
                          <Download className="h-3 w-3 mr-2" />
                          Exportera
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Analyses Tab */}
        <TabsContent value="analyses" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={exportAnalyses}
              disabled={analysisHistory.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportera alla
            </Button>
          </div>

          {analysisHistory.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Ingen analyshistorik
                </h3>
                <p className="text-muted-foreground">
                  Dina marknadsanalyser kommer att sparas här automatiskt
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {analysisHistory.map((item) => (
                <Card
                  key={item.id}
                  className="hover:border-primary transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          {item.market_data.area}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.created_at).toLocaleDateString(
                              "sv-SE",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                          <Badge variant="secondary">
                            {item.market_data.propertyType}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setExpandedId(
                              expandedId === item.id ? null : item.id,
                            )
                          }
                        >
                          {expandedId === item.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setItemToDelete({ id: item.id, type: "analysis" });
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedId === item.id && (
                    <CardContent className="space-y-4 pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Pristillväxt
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            +{item.analysis_result.marketTrend.percentage}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Dagar på marknaden
                          </p>
                          <p className="text-lg font-semibold">
                            {item.analysis_result.averageDaysOnMarket}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Efterfrågan/Utbud
                          </p>
                          <p className="text-lg font-semibold">
                            {item.analysis_result.demandSupply.ratio.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Prognossäkerhet
                          </p>
                          <p className="text-lg font-semibold">
                            {item.analysis_result.predictions.confidence}%
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            exportToJSON(
                              item,
                              `analys_${item.market_data.area}_${item.created_at}.json`,
                            )
                          }
                        >
                          <Download className="h-3 w-3 mr-2" />
                          Exportera
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Är du säker?</AlertDialogTitle>
            <AlertDialogDescription>
              Denna åtgärd kan inte ångras. Detta kommer permanent radera denna
              historikpost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Radera
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
