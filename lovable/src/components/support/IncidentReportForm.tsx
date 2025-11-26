import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Send } from 'lucide-react';

const IncidentReportForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reportType: 'property',
    category: '',
    description: '',
    subjectId: '',
    severity: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Du måste vara inloggad');

      const { error } = await supabase.from('incident_reports').insert({
        reported_by: user.id,
        report_type: formData.reportType,
        category: formData.category,
        description: formData.description,
        subject_id: formData.subjectId || null,
        severity: formData.severity,
      });

      if (error) throw error;

      toast({
        title: 'Rapport skickad',
        description: 'Din anmälan har mottagits och kommer granskas',
      });

      setFormData({
        reportType: 'property',
        category: '',
        description: '',
        subjectId: '',
        severity: 'medium',
      });
    } catch (error: any) {
      console.error('Report error:', error);
      toast({
        title: 'Fel',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Rapportera problem
        </CardTitle>
        <CardDescription>
          Hjälp oss hålla plattformen säker genom att rapportera missbruk eller problem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Typ av rapport</Label>
              <Select
                value={formData.reportType}
                onValueChange={(value) => setFormData({ ...formData, reportType: value })}
              >
                <SelectTrigger id="reportType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">Fastighet/Annons</SelectItem>
                  <SelectItem value="user">Användare</SelectItem>
                  <SelectItem value="ad">Betalannons</SelectItem>
                  <SelectItem value="other">Annat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Allvarlighetsgrad</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Låg</SelectItem>
                  <SelectItem value="medium">Medel</SelectItem>
                  <SelectItem value="high">Hög</SelectItem>
                  <SelectItem value="critical">Kritisk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              placeholder="t.ex. Bedrägeri, Vilseledande information, Spam"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjectId">ID (valfritt)</Label>
            <Input
              id="subjectId"
              placeholder="ID för fastighet, användare eller annons"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning *</Label>
            <Textarea
              id="description"
              placeholder="Beskriv problemet i detalj..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Skickar...' : 'Skicka rapport'}
          </Button>

          <p className="text-xs text-muted-foreground">
            Din rapport behandlas konfidentiellt och granskas av vårt moderationsteam.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncidentReportForm;
