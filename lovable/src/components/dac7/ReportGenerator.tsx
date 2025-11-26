import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ReportGenerator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reportingYear, setReportingYear] = useState(new Date().getFullYear().toString());
  const [format, setFormat] = useState<'csv' | 'xml'>('csv');

  // Generate year options (current year and previous 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const handleGenerateReport = async () => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Ej inloggad',
          description: 'Du måste vara inloggad för att generera rapporter.',
          variant: 'destructive',
        });
        return;
      }

      const response = await supabase.functions.invoke('generate-dac7-report', {
        body: {
          reportingYear: parseInt(reportingYear),
          format,
        },
      });

      if (response.error) {
        throw response.error;
      }

      // Create blob and download
      const blob = new Blob([response.data], {
        type: format === 'csv' ? 'text/csv' : 'application/xml',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DAC7_Report_${reportingYear}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Rapport genererad',
        description: `Din DAC7-rapport för ${reportingYear} har laddats ner.`,
      });
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast({
        title: 'Fel',
        description: error.message || 'Kunde inte generera rapporten. Försök igen.',
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
          <Download className="h-5 w-5" />
          Generera DAC7-rapport
        </CardTitle>
        <CardDescription>
          Exportera dina hyresintäkter för rapportering till Skatteverket
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Rapporten innehåller all registrerad hyresinformation för det valda året enligt DAC7-kraven.
            Ladda ner och skicka till Skatteverket innan den årliga deadlinen.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportingYear">Rapporteringsår</Label>
            <Select value={reportingYear} onValueChange={setReportingYear}>
              <SelectTrigger id="reportingYear">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Filformat</Label>
            <Select value={format} onValueChange={(value: 'csv' | 'xml') => setFormat(value)}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Excel-kompatibel)
                  </div>
                </SelectItem>
                <SelectItem value="xml">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    XML (OECD standard)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerateReport}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          <Download className="h-4 w-4 mr-2" />
          {loading ? 'Genererar rapport...' : 'Ladda ner rapport'}
        </Button>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>✓ Rapporten inkluderar all registrerad hyresinformation</p>
          <p>✓ Formaterad enligt DAC7-krav (EU 2021/514)</p>
          <p>✓ Redo att skickas till Skatteverket</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
