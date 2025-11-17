import { Eye, Mail, MousePointer, Phone, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AdStatistics = () => {
  // Mock data for charts
  const viewsData = [
    {
      name: "Mån",
      visningar: 340,
      klick: 85,
    },
    {
      name: "Tis",
      visningar: 520,
      klick: 142,
    },
    {
      name: "Ons",
      visningar: 680,
      klick: 198,
    },
    {
      name: "Tor",
      visningar: 590,
      klick: 167,
    },
    {
      name: "Fre",
      visningar: 890,
      klick: 256,
    },
    {
      name: "Lör",
      visningar: 1240,
      klick: 389,
    },
    {
      name: "Sön",
      visningar: 980,
      klick: 312,
    },
  ];
  const adTierData = [
    {
      name: "Gratispaket",
      value: 45,
      color: "hsl(var(--muted-foreground))",
    },
    {
      name: "Pluspaket",
      value: 28,
      color: "hsl(var(--success))",
    },
    {
      name: "Exklusivpaket",
      value: 27,
      color: "hsl(var(--premium))",
    },
  ];
  const engagementData = [
    {
      name: "Vecka 1",
      engagement: 12.5,
    },
    {
      name: "Vecka 2",
      engagement: 15.2,
    },
    {
      name: "Vecka 3",
      engagement: 18.8,
    },
    {
      name: "Vecka 4",
      engagement: 22.4,
    },
  ];
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Totala visningar
                </p>
                <p className="text-2xl font-bold">24,567</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +18% från förra veckan
                </p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Klickfrekvens</p>
                <p className="text-2xl font-bold">28.5%</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +5.2% från förra veckan
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Nummerförfrågningar
                </p>
                <p className="text-2xl font-bold">342</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% från förra veckan
                </p>
              </div>
              <Phone className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  E-postförfrågningar
                </p>
                <p className="text-2xl font-bold">186</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% från förra veckan
                </p>
              </div>
              <Mail className="h-8 w-8 text-premium" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Views and Clicks Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Visningar och klick</CardTitle>
          <CardDescription>
            Daglig aktivitet de senaste 7 dagarna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="visningar"
                fill="hsl(var(--primary))"
                name="Visningar"
              />
              <Bar dataKey="klick" fill="hsl(var(--accent))" name="Klick" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ad Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Annonsfördelning per nivå</CardTitle>
            <CardDescription>Antal annonser per annonstier</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={adTierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) =>
                    `${entry.name} ${((entry.value / adTierData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {adTierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Engagemangstrend</CardTitle>
            <CardDescription>Klickfrekvens över tid</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  name="Engagemang %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Ads */}
      <Card>
        <CardHeader>
          <CardTitle>Bäst presterande annonser</CardTitle>
          <CardDescription>
            Dina mest framgångsrika annonser den här månaden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Modern lägenhet i centrala Stockholm",
                views: 3456,
                clicks: 892,
                ctr: "25.8%",
                tier: "exklusivpaket",
              },
              {
                title: "Charmig villa med sjöutsikt",
                views: 2891,
                clicks: 723,
                ctr: "25.0%",
                tier: "pluspaket",
              },
              {
                title: "Nyproducerad radhus i lugnt område",
                views: 2234,
                clicks: 534,
                ctr: "23.9%",
                tier: "pluspaket",
              },
              {
                title: "Rymlig 3:a nära kollektivtrafik",
                views: 1987,
                clicks: 421,
                ctr: "21.2%",
                tier: "gratispaket",
              },
            ].map((ad, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{ad.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{ad.views.toLocaleString()} visningar</span>
                    <span>{ad.clicks} klick</span>
                    <span className="text-success font-medium">
                      CTR: {ad.ctr}
                    </span>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${ad.tier === "exklusivpaket" ? "bg-premium text-premium-foreground" : ad.tier === "pluspaket" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {ad.tier === "exklusivpaket"
                    ? "EXKLUSIVPAKET"
                    : ad.tier === "pluspaket"
                      ? "PLUSPAKET"
                      : "GRATISPAKET"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdStatistics;
