import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, BarChart3, MapPin, Calendar, Users, Clock, Target, AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
interface MarketData {
  area: string;
  propertyType: string;
  timeframe: string;
}
interface PriceData {
  month: string;
  avgPrice: number;
  medianPrice: number;
  pricePerSqm: number;
  salesVolume: number;
}
interface MarketInsights {
  priceData: PriceData[];
  marketTrend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    description: string;
  };
  demandSupply: {
    demand: number;
    supply: number;
    ratio: number;
    status: 'sellers_market' | 'buyers_market' | 'balanced';
  };
  averageDaysOnMarket: number;
  hotspots: Array<{
    area: string;
    growthRate: number;
    avgPrice: number;
    trend: string;
  }>;
  predictions: {
    next3Months: number;
    next6Months: number;
    next12Months: number;
    confidence: number;
  };
  insights: Array<{
    type: 'opportunity' | 'warning' | 'info';
    title: string;
    description: string;
  }>;
}
const AIMarketAnalysis = () => {
  const {
    user
  } = useAuth();
  const [marketData, setMarketData] = useState<MarketData>({
    area: '',
    propertyType: '',
    timeframe: '12'
  });
  const [analysisResult, setAnalysisResult] = useState<MarketInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const handleInputChange = (field: keyof MarketData, value: string) => {
    setMarketData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const runAnalysis = async () => {
    if (!marketData.area || !marketData.propertyType) {
      toast.error('Vänligen fyll i alla obligatoriska fält');
      return;
    }
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('ai-market-analysis', {
        body: {
          marketData
        }
      });
      if (error) throw error;
      if (!data || !data.success) {
        throw new Error(data?.error || 'Kunde inte genomföra marknadsanalys');
      }

      // Transform the AI response to match our interface
      const aiAnalysis = data.analysis;
      const result: MarketInsights = {
        priceData: (aiAnalysis.priceData || []).map((pd: any) => ({
          month: pd.month || pd.period || '',
          avgPrice: pd.avgPrice || pd.avg_price || pd.averagePrice || 0,
          medianPrice: pd.medianPrice || pd.median_price || 0,
          pricePerSqm: pd.pricePerSqm || pd.price_per_sqm || pd.sqmPrice || 0,
          salesVolume: pd.salesVolume || pd.sales_volume || pd.volume || 0
        })),
        marketTrend: {
          direction: (aiAnalysis.marketTrend?.direction || aiAnalysis.market_trend?.direction || 'stable') as 'up' | 'down' | 'stable',
          percentage: aiAnalysis.marketTrend?.percentage || aiAnalysis.market_trend?.percentage || 0,
          description: aiAnalysis.marketTrend?.description || aiAnalysis.market_trend?.description || 'Stabil marknadsutveckling'
        },
        demandSupply: {
          demand: aiAnalysis.demandSupply?.demand || aiAnalysis.demand_supply?.demand || 50,
          supply: aiAnalysis.demandSupply?.supply || aiAnalysis.demand_supply?.supply || 50,
          ratio: aiAnalysis.demandSupply?.ratio || aiAnalysis.demand_supply?.ratio || 1,
          status: (aiAnalysis.demandSupply?.status || aiAnalysis.demand_supply?.status || 'balanced') as 'sellers_market' | 'buyers_market' | 'balanced'
        },
        averageDaysOnMarket: aiAnalysis.averageDaysOnMarket || aiAnalysis.average_days_on_market || aiAnalysis.daysOnMarket || 30,
        hotspots: (aiAnalysis.hotspots || []).map((hs: any) => ({
          area: hs.area || hs.location || 'Okänt område',
          growthRate: hs.growthRate || hs.growth_rate || hs.growth || 0,
          avgPrice: hs.avgPrice || hs.avg_price || hs.price || 0,
          trend: hs.trend || hs.description || 'Stabil utveckling'
        })),
        predictions: {
          next3Months: aiAnalysis.predictions?.next3Months || aiAnalysis.predictions?.three_months || 0,
          next6Months: aiAnalysis.predictions?.next6Months || aiAnalysis.predictions?.six_months || 0,
          next12Months: aiAnalysis.predictions?.next12Months || aiAnalysis.predictions?.twelve_months || 0,
          confidence: aiAnalysis.predictions?.confidence || 70
        },
        insights: (aiAnalysis.insights || []).map((ins: any) => ({
          type: (ins.type || 'info') as 'opportunity' | 'warning' | 'info',
          title: ins.title || ins.heading || 'Marknadsinsikt',
          description: ins.description || ins.details || ''
        }))
      };
      setAnalysisResult(result);

      // Save to history
      try {
        await supabase.from('market_analysis_history').insert({
          user_id: user!.id,
          market_data: marketData,
          analysis_result: result
        } as any);
      } catch (historyError) {
        console.error('Could not save to history:', historyError);
        // Don't show error to user, history saving is not critical
      }
      toast.success('Marknadsanalys genomförd!');
    } catch (error) {
      console.error('Analysfel:', error);
      toast.error('Ett fel uppstod vid analysen');
    } finally {
      setLoading(false);
    }
  };
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Target className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-primary/20 bg-nordic-ice text-primary';
    }
  };
  if (analysisResult) {
    return <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Marknadsanalys</h2>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-muted-foreground">{marketData.area} - {marketData.propertyType}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">
                    +{analysisResult.marketTrend.percentage}%
                  </p>
                  <p className="text-sm text-green-700">Pristillväxt (12 mån)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-nordic-ice">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{analysisResult.averageDaysOnMarket}</p>
                  <p className="text-sm text-muted-foreground">Dagar på marknaden</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-900">{analysisResult.demandSupply.ratio.toFixed(1)}</p>
                  <p className="text-sm text-orange-700">Efterfrågan/Utbud</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-purple-900">{analysisResult.predictions.confidence}%</p>
                  <p className="text-sm text-purple-700">Prognossäkerhet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Pristrender</TabsTrigger>
            <TabsTrigger value="predictions">Prognoser</TabsTrigger>
            <TabsTrigger value="hotspots">Hotspots</TabsTrigger>
            <TabsTrigger value="insights">Insikter</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prisutveckling senaste 12 månaderna</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analysisResult.priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={value => `${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value, name) => [formatPrice(Number(value)), name === 'avgPrice' ? 'Genomsnittspris' : 'Medianpris']} />
                    <Legend />
                    <Line type="monotone" dataKey="avgPrice" stroke="#8884d8" strokeWidth={2} name="Genomsnittspris" />
                    <Line type="monotone" dataKey="medianPrice" stroke="#82ca9d" strokeWidth={2} name="Medianpris" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Försäljningsvolym</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analysisResult.priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="salesVolume" fill="#8884d8" name="Antal försäljningar" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prisprognos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">+{analysisResult.predictions.next3Months}%</p>
                    <p className="text-sm text-muted-foreground">Nästa 3 månader</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-primary">+{analysisResult.predictions.next6Months}%</p>
                    <p className="text-sm text-muted-foreground">Nästa 6 månader</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">+{analysisResult.predictions.next12Months}%</p>
                    <p className="text-sm text-muted-foreground">Nästa 12 månader</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Prognoserna baseras på historiska data, aktuella marknadstrender och ekonomiska indikatorer. 
                    Säkerhetsnivå: {analysisResult.predictions.confidence}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotspots" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Områden med stark tillväxt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisResult.hotspots.map((hotspot, index) => <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{hotspot.area}</h4>
                        <p className="text-sm text-muted-foreground">{hotspot.trend}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-semibold text-green-600">+{hotspot.growthRate}%</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(hotspot.avgPrice)}</p>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {analysisResult.insights.map((insight, index) => <Card key={index} className={`border ${getInsightColor(insight.type)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="space-y-1">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <p className="text-sm">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => setAnalysisResult(null)} variant="outline">
            Ny analys
          </Button>
          <Button onClick={() => window.print()}>
            Skriv ut rapport
          </Button>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">AI Marknadsanalys</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          Få djupgående insikter om fastighetmarknaden med AI-driven analys
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysparametrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Område/Kommun *</Label>
              <Input id="area" value={marketData.area} onChange={e => handleInputChange('area', e.target.value)} placeholder="T.ex. Stockholm, Göteborg, Malmö" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Fastighetstyp *</Label>
              <Select value={marketData.propertyType} onValueChange={value => handleInputChange('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj fastighetstyp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lägenhet">Lägenhet</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="radhus">Radhus</SelectItem>
                  <SelectItem value="kedjehus">Kedjehus</SelectItem>
                  <SelectItem value="fritidshus">Fritidshus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeframe">Tidsperiod för analys</Label>
            <Select value={marketData.timeframe} onValueChange={value => handleInputChange('timeframe', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">Senaste 6 månaderna</SelectItem>
                <SelectItem value="12">Senaste 12 månaderna</SelectItem>
                <SelectItem value="24">Senaste 2 åren</SelectItem>
                <SelectItem value="36">Senaste 3 åren</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={runAnalysis} disabled={loading || !marketData.area || !marketData.propertyType} className="w-full gap-2">
            {loading ? 'Analyserar...' : 'Starta marknadsanalys'}
            <BarChart3 className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      
    </div>;
};
export default AIMarketAnalysis;