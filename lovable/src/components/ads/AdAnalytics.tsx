import {
  BarChart3,
  Calendar,
  Clock,
  Download,
  Eye,
  Filter,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

interface AdAnalytics {
  ad_id: string;
  ad_title: string;
  ad_tier: string;
  views_count: number;
  clicks_count: number;
  conversion_rate: number;
  ctr: number;
  avg_time_on_page: number;
  created_at: string;
  expires_at: string | null;
  is_featured: boolean;
}

interface AnalyticsSummary {
  total_ads: number;
  total_views: number;
  total_clicks: number;
  avg_ctr: number;
  best_performing_tier: string;
}

const AdAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AdAnalytics[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [dateRange, setDateRange] = useState("30");
  const [tierFilter, setTierFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, fetchAnalytics]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Mock analytics data since we don't have views tracking yet
      const mockAnalytics: AdAnalytics[] = [
        {
          ad_id: "1",
          ad_title: "Stunning Apartment in Stockholm",
          ad_tier: "premium",
          views_count: 1248,
          clicks_count: 89,
          conversion_rate: 7.1,
          ctr: 7.13,
          avg_time_on_page: 145,
          created_at: "2024-01-15T00:00:00Z",
          expires_at: null,
          is_featured: true,
        },
        {
          ad_id: "2",
          ad_title: "Modern House in Göteborg",
          ad_tier: "professional",
          views_count: 892,
          clicks_count: 45,
          conversion_rate: 5.0,
          ctr: 5.04,
          avg_time_on_page: 98,
          created_at: "2024-01-10T00:00:00Z",
          expires_at: null,
          is_featured: false,
        },
        {
          ad_id: "3",
          ad_title: "Cozy Cabin in Malmö",
          ad_tier: "basic",
          views_count: 456,
          clicks_count: 12,
          conversion_rate: 2.6,
          ctr: 2.63,
          avg_time_on_page: 76,
          created_at: "2024-01-08T00:00:00Z",
          expires_at: "2024-02-08T00:00:00Z",
          is_featured: false,
        },
      ];

      const mockSummary: AnalyticsSummary = {
        total_ads: 3,
        total_views: 2596,
        total_clicks: 146,
        avg_ctr: 5.6,
        best_performing_tier: "premium",
      };

      // Filter by tier if selected
      const filteredAnalytics =
        tierFilter === "all"
          ? mockAnalytics
          : mockAnalytics.filter((ad) => ad.ad_tier === tierFilter);

      setAnalytics(filteredAnalytics);
      setSummary(mockSummary);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "premium":
        return "bg-gradient-to-r from-amber-500 to-yellow-600";
      case "professional":
        return "bg-gradient-to-r from-blue-500 to-indigo-600";
      case "basic":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  const exportData = () => {
    const csvContent = [
      [
        "Ad Title",
        "Tier",
        "Views",
        "Clicks",
        "CTR %",
        "Conversion Rate %",
        "Avg. Time on Page (s)",
      ],
      ...analytics.map((ad) => [
        ad.ad_title,
        ad.ad_tier,
        ad.views_count.toString(),
        ad.clicks_count.toString(),
        ad.ctr.toFixed(2),
        ad.conversion_rate.toFixed(2),
        ad.avg_time_on_page.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ad-analytics.csv";
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ad Analytics</h2>
          <p className="text-muted-foreground">
            Track performance and optimize your advertising strategy
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData} className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm">Filters:</span>
        </div>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tiers</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{summary.total_ads}</p>
                  <p className="text-sm text-muted-foreground">Active Ads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {summary.total_views.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{summary.total_clicks}</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {summary.avg_ctr.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg. CTR</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Individual Ad Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.map((ad) => (
              <div key={ad.ad_id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{ad.ad_title}</h3>
                    <Badge
                      className={`${getTierColor(ad.ad_tier)} text-white border-0`}
                    >
                      {ad.ad_tier.toUpperCase()}
                    </Badge>
                    {ad.is_featured && (
                      <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {ad.views_count}
                    </p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>

                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {ad.clicks_count}
                    </p>
                    <p className="text-sm text-muted-foreground">Clicks</p>
                  </div>

                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {ad.ctr.toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">CTR</p>
                  </div>

                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {ad.conversion_rate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Conversion</p>
                  </div>

                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {ad.avg_time_on_page}s
                    </p>
                    <p className="text-sm text-muted-foreground">Avg. Time</p>
                  </div>
                </div>

                {/* Performance indicator */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        ad.ctr > 5
                          ? "bg-green-500"
                          : ad.ctr > 2
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm">
                      {ad.ctr > 5
                        ? "High Performance"
                        : ad.ctr > 2
                          ? "Average Performance"
                          : "Needs Improvement"}
                    </span>
                  </div>

                  {ad.expires_at && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        Expires: {new Date(ad.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-nordic-ice rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Improve CTR</p>
              <p className="text-sm text-muted-foreground">
                Use compelling headlines and high-quality images to increase
                click-through rates
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <Target className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Featured Listings</p>
              <p className="text-sm text-green-700">
                Consider upgrading to premium for featured placement and
                increased visibility
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
            <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <p className="font-medium text-orange-900">Time on Page</p>
              <p className="text-sm text-orange-700">
                Add more detailed descriptions and virtual tours to increase
                engagement time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdAnalytics;
