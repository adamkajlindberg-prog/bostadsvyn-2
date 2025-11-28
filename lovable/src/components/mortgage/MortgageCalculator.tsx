import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  Home, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  Percent,
  Building2,
  ExternalLink,
  HelpCircle,
  BarChart3,
  Wallet
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MortgageCalculation {
  propertyPrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  monthlyAfterTax: number;
  loanToValue: number;
}

interface StressTestResult {
  currentPayment: number;
  stressedPayment: number;
  difference: number;
  affordability: 'good' | 'acceptable' | 'risky';
}

interface AffordabilityAnalysis {
  monthlyIncome: number;
  monthlyExpenses: number;
  maxAffordablePayment: number;
  maxAffordablePrice: number;
  debtToIncomeRatio: number;
  recommendation: string;
}

// Bankscenarier - simulerar olika bankers ränteerbjudanden
const BANK_SCENARIOS = {
  'seb': {
    name: 'SEB - Bra läge',
    rates: { variable: 3.19, '1_year': 3.45, '2_year': 3.75, '3_year': 4.05, '5_year': 4.45 }
  },
  'swedbank': {
    name: 'Swedbank - Konkurrenskraftig',
    rates: { variable: 3.25, '1_year': 3.55, '2_year': 3.85, '3_year': 4.15, '5_year': 4.55 }
  },
  'nordea': {
    name: 'Nordea - Stabil',
    rates: { variable: 3.29, '1_year': 3.59, '2_year': 3.89, '3_year': 4.19, '5_year': 4.59 }
  },
  'handelsbanken': {
    name: 'Handelsbanken - Premiumkund',
    rates: { variable: 3.15, '1_year': 3.40, '2_year': 3.70, '3_year': 4.00, '5_year': 4.40 }
  },
  'optimistic': {
    name: 'Optimistiskt scenario',
    rates: { variable: 2.99, '1_year': 3.29, '2_year': 3.59, '3_year': 3.89, '5_year': 4.29 }
  },
  'pessimistic': {
    name: 'Pessimistiskt scenario',
    rates: { variable: 3.49, '1_year': 3.79, '2_year': 4.09, '3_year': 4.39, '5_year': 4.79 }
  }
};

const STRESS_TEST_RATE = 6.0; // Swedish Financial Supervisory Authority stress test rate

export default function MortgageCalculator() {
  const { toast } = useToast();
  const [calculation, setCalculation] = useState<MortgageCalculation>({
    propertyPrice: 4000000,
    downPayment: 600000,
    loanAmount: 3400000,
    interestRate: 4.0,
    loanTerm: 25,
    monthlyPayment: 0,
    totalInterest: 0,
    totalCost: 0,
    monthlyAfterTax: 0,
    loanToValue: 85,
  });

  const [affordability, setAffordability] = useState<AffordabilityAnalysis>({
    monthlyIncome: 45000,
    monthlyExpenses: 25000,
    maxAffordablePayment: 0,
    maxAffordablePrice: 0,
    debtToIncomeRatio: 0,
    recommendation: '',
  });

  const [stressTest, setStressTest] = useState<StressTestResult>({
    currentPayment: 0,
    stressedPayment: 0,
    difference: 0,
    affordability: 'good',
  });

  const [selectedRateType, setSelectedRateType] = useState<string>('3_year');
  const [selectedBank, setSelectedBank] = useState<string>('seb');
const [includeRunningCosts, setIncludeRunningCosts] = useState(true);
  const [runningCosts, setRunningCosts] = useState({
    monthlyFee: 3500,
    propertyTax: 8000, // yearly
    insurance: 6000, // yearly
    maintenance: 12000, // yearly
    electricity: 12000, // yearly
    heating: 15000, // yearly
    water: 3600, // yearly
  });

  const [showAmortizationSchedule, setShowAmortizationSchedule] = useState(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState<Array<{
    year: number;
    principal: number;
    interest: number;
    totalPayment: number;
    remainingBalance: number;
  }>>([]);

  useEffect(() => {
    calculateMortgage();
    generateAmortizationSchedule();
  }, [
    calculation.propertyPrice,
    calculation.downPayment,
    calculation.interestRate,
    calculation.loanTerm,
    selectedRateType,
    selectedBank,
  ]);

  useEffect(() => {
    calculateAffordability();
  }, [affordability.monthlyIncome, affordability.monthlyExpenses, calculation.interestRate, calculation.loanTerm]);

  useEffect(() => {
    performStressTest();
  }, [calculation.monthlyPayment, calculation.loanAmount]);

  const calculateMortgage = () => {
    const price = calculation.propertyPrice;
    const down = calculation.downPayment;
    const loanAmount = price - down;
    const currentBank = BANK_SCENARIOS[selectedBank as keyof typeof BANK_SCENARIOS];
    const rate = currentBank.rates[selectedRateType as keyof typeof currentBank.rates] / 100 / 12;
    const months = calculation.loanTerm * 12;

    // Calculate monthly payment using the loan payment formula
    const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    
    const totalCost = monthlyPayment * months;
    const totalInterest = totalCost - loanAmount;
    const loanToValue = (loanAmount / price) * 100;

    // Calculate after-tax payment (Swedish tax deduction for mortgage interest)
    const monthlyInterest = loanAmount * (currentBank.rates[selectedRateType as keyof typeof currentBank.rates] / 100 / 12);
    const taxDeduction = monthlyInterest * 0.30; // 30% tax deduction on interest
    const monthlyAfterTax = monthlyPayment - taxDeduction;

    setCalculation(prev => ({
      ...prev,
      loanAmount,
      monthlyPayment,
      totalInterest,
      totalCost,
      monthlyAfterTax,
      loanToValue,
      interestRate: currentBank.rates[selectedRateType as keyof typeof currentBank.rates],
    }));
  };

  const calculateAffordability = () => {
    const income = affordability.monthlyIncome;
    const expenses = affordability.monthlyExpenses;
    const availableIncome = income - expenses;
    
    // Swedish banks typically use 25-30% of gross income as max housing cost
    const maxAffordablePayment = Math.min(availableIncome * 0.8, income * 0.30);
    
    // Calculate max affordable property price
    const rate = calculation.interestRate / 100 / 12;
    const months = calculation.loanTerm * 12;
    const maxLoanAmount = maxAffordablePayment * (Math.pow(1 + rate, months) - 1) / (rate * Math.pow(1 + rate, months));
    const maxAffordablePrice = maxLoanAmount / 0.85; // Assuming 15% down payment

    const debtToIncomeRatio = (calculation.monthlyPayment / income) * 100;

    let recommendation = '';
    if (debtToIncomeRatio < 25) {
      recommendation = 'Utmärkt - Du har god ekonomisk marginal';
    } else if (debtToIncomeRatio < 30) {
      recommendation = 'Bra - Inom rekommenderade gränser';
    } else if (debtToIncomeRatio < 35) {
      recommendation = 'Acceptabel - Men begränsad marginal';
    } else {
      recommendation = 'Riskabelt - Överstiger rekommenderade gränser';
    }

    setAffordability(prev => ({
      ...prev,
      maxAffordablePayment,
      maxAffordablePrice,
      debtToIncomeRatio,
      recommendation,
    }));
  };

  const performStressTest = () => {
    const currentPayment = calculation.monthlyPayment;
    const loanAmount = calculation.loanAmount;
    const stressRate = STRESS_TEST_RATE / 100 / 12;
    const months = calculation.loanTerm * 12;

    const stressedPayment = loanAmount * (stressRate * Math.pow(1 + stressRate, months)) / (Math.pow(1 + stressRate, months) - 1);
    const difference = stressedPayment - currentPayment;
    
    let affordabilityLevel: 'good' | 'acceptable' | 'risky' = 'good';
    const stressRatio = (stressedPayment / affordability.monthlyIncome) * 100;
    
    if (stressRatio > 35) {
      affordabilityLevel = 'risky';
    } else if (stressRatio > 30) {
      affordabilityLevel = 'acceptable';
    }

    setStressTest({
      currentPayment,
      stressedPayment,
      difference,
      affordability: affordabilityLevel,
    });
  };

  const updatePropertyPrice = (value: number) => {
    const newDownPayment = Math.max(value * 0.15, calculation.downPayment); // Minimum 15%
    setCalculation(prev => ({
      ...prev,
      propertyPrice: value,
      downPayment: newDownPayment,
    }));
  };

  const updateDownPayment = (value: number) => {
    const minDownPayment = calculation.propertyPrice * 0.15;
    const actualDownPayment = Math.max(value, minDownPayment);
    setCalculation(prev => ({
      ...prev,
      downPayment: actualDownPayment,
    }));
  };

  const getTotalMonthlyCost = () => {
    if (!includeRunningCosts) return calculation.monthlyAfterTax;
    
    const yearlyRunningCosts = runningCosts.propertyTax + runningCosts.insurance + 
                               runningCosts.maintenance + runningCosts.electricity + 
                               runningCosts.heating + runningCosts.water;
    const monthlyRunningCosts = runningCosts.monthlyFee + (yearlyRunningCosts / 12);
    
    return calculation.monthlyAfterTax + monthlyRunningCosts;
  };

  const generateAmortizationSchedule = () => {
    const loanAmount = calculation.loanAmount;
    const rate = calculation.interestRate / 100 / 12;
    const months = calculation.loanTerm * 12;
    const monthlyPayment = calculation.monthlyPayment;
    
    if (!loanAmount || !rate || !monthlyPayment) return;
    
    const schedule: Array<{
      year: number;
      principal: number;
      interest: number;
      totalPayment: number;
      remainingBalance: number;
    }> = [];
    
    let remainingBalance = loanAmount;
    
    for (let year = 1; year <= calculation.loanTerm; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const monthNumber = (year - 1) * 12 + month;
        if (monthNumber > months) break;
        
        const interestPayment = remainingBalance * rate;
        const principalPayment = monthlyPayment - interestPayment;
        
        yearlyPrincipal += principalPayment;
        yearlyInterest += interestPayment;
        remainingBalance -= principalPayment;
      }
      
      schedule.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        totalPayment: yearlyPrincipal + yearlyInterest,
        remainingBalance: Math.max(0, remainingBalance)
      });
    }
    
    setAmortizationSchedule(schedule);
  };

  const getAffordabilityColor = (level: string) => {
    switch (level) {
      case 'good': return 'text-success';
      case 'acceptable': return 'text-warning';
      case 'risky': return 'text-critical';
      default: return 'text-muted-foreground';
    }
  };

  const getAffordabilityIcon = (level: string) => {
    switch (level) {
      case 'good': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'acceptable': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'risky': return <AlertCircle className="h-4 w-4 text-critical" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const exportCalculation = () => {
    const report = {
      calculation,
      affordability,
      stressTest,
      runningCosts: includeRunningCosts ? runningCosts : null,
      totalMonthlyCost: getTotalMonthlyCost(),
      generatedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lånekalkyler_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Kalkyl exporterad",
      description: "Dina lånekalkyler har exporterats som JSON-fil",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Bolånekalkylator</CardTitle>
                <CardDescription className="mt-1">
                  Beräkna månadsavgift, totalkostnad och stresstest enligt svenska bankers kriterier
                </CardDescription>
              </div>
              <Badge variant="secondary" className="ml-2">Svenskt system</Badge>
            </div>
            
            <Button variant="outline" onClick={exportCalculation}>
              <Download className="h-4 w-4 mr-2" />
              Exportera kalkyl
            </Button>
          </div>
          
          {/* Antaganden */}
          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-muted-foreground/20">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="label-text mb-2">Förinställda antaganden:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Kontantinsats: 15% (minimum enligt lag)</li>
                  <li>• Ränteavdrag: 30% (enligt Skatteverket)</li>
                  <li>• Stresstest: 6% ränta (enligt Finansinspektionen)</li>
                  <li>• Alla belopp anges i SEK</li>
                </ul>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calculation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculation">Beräkning</TabsTrigger>
          <TabsTrigger value="affordability">Betalningsförmåga</TabsTrigger>
          <TabsTrigger value="stresstest">Stresstest</TabsTrigger>
          <TabsTrigger value="comparison">Jämförelse</TabsTrigger>
        </TabsList>

        <TabsContent value="calculation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Parameters */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Låneuppgifter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bank/Scenario Selection */}
                <div className="space-y-2">
                  <Label className="label-text">Välj bank eller scenario</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BANK_SCENARIOS).map(([key, bank]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {bank.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Jämför ränteerbjudanden från olika banker eller olika marknadsscenarier
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="label-text">Fastighetspris</Label>
                  <Input
                    type="number"
                    value={calculation.propertyPrice}
                    onChange={(e) => updatePropertyPrice(Number(e.target.value))}
                    placeholder="Pris i SEK"
                    className="text-lg font-semibold"
                  />
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[calculation.propertyPrice]}
                      onValueChange={([value]) => updatePropertyPrice(value)}
                      max={15000000}
                      min={1000000}
                      step={100000}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="label-text">Kontantinsats</Label>
                  <Input
                    type="number"
                    value={calculation.downPayment}
                    onChange={(e) => updateDownPayment(Number(e.target.value))}
                    placeholder="Kontantinsats i SEK"
                    className="text-lg font-semibold"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="font-medium">Min: {(calculation.propertyPrice * 0.15).toLocaleString('sv-SE')} kr (15%)</span>
                    <span className="font-semibold">Aktuell: {((calculation.downPayment / calculation.propertyPrice) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[calculation.downPayment]}
                      onValueChange={([value]) => updateDownPayment(value)}
                      max={calculation.propertyPrice * 0.5}
                      min={calculation.propertyPrice * 0.15}
                      step={50000}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="label-text">Räntebindning</Label>
                  <Select value={selectedRateType} onValueChange={setSelectedRateType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        const currentBank = BANK_SCENARIOS[selectedBank as keyof typeof BANK_SCENARIOS];
                        return (
                          <>
                            <SelectItem value="variable">Rörlig ränta - {currentBank.rates.variable}%</SelectItem>
                            <SelectItem value="1_year">1 år - {currentBank.rates['1_year']}%</SelectItem>
                            <SelectItem value="2_year">2 år - {currentBank.rates['2_year']}%</SelectItem>
                            <SelectItem value="3_year">3 år - {currentBank.rates['3_year']}%</SelectItem>
                            <SelectItem value="5_year">5 år - {currentBank.rates['5_year']}%</SelectItem>
                          </>
                        );
                      })()}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Lånetid (år)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[calculation.loanTerm]}
                      onValueChange={([value]) => setCalculation(prev => ({ ...prev, loanTerm: value }))}
                      max={50}
                      min={5}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-16 text-sm font-medium">{calculation.loanTerm} år</span>
                  </div>
                </div>

                <Separator />

                {/* Running Costs */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Inkludera driftskostnader</Label>
                    <input
                      type="checkbox"
                      checked={includeRunningCosts}
                      onChange={(e) => setIncludeRunningCosts(e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  {includeRunningCosts && (
                    <div className="space-y-3 pl-4 border-l-2 border-muted">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Avgift/månad</Label>
                          <Input
                            type="number"
                            value={runningCosts.monthlyFee}
                            onChange={(e) => setRunningCosts(prev => ({ ...prev, monthlyFee: Number(e.target.value) }))}
                            placeholder="SEK/mån"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Fastighetsavgift/år</Label>
                          <Input
                            type="number"
                            value={runningCosts.propertyTax}
                            onChange={(e) => setRunningCosts(prev => ({ ...prev, propertyTax: Number(e.target.value) }))}
                            placeholder="SEK/år"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Försäkring/år</Label>
                          <Input
                            type="number"
                            value={runningCosts.insurance}
                            onChange={(e) => setRunningCosts(prev => ({ ...prev, insurance: Number(e.target.value) }))}
                            placeholder="SEK/år"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Underhåll/år</Label>
                          <Input
                            type="number"
                            value={runningCosts.maintenance}
                            onChange={(e) => setRunningCosts(prev => ({ ...prev, maintenance: Number(e.target.value) }))}
                            placeholder="SEK/år"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">El/år</Label>
                          <Input
                            type="number"
                            value={runningCosts.electricity}
                            onChange={(e) => setRunningCosts(prev => ({ ...prev, electricity: Number(e.target.value) }))}
                            placeholder="SEK/år"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Uppvärmning/år</Label>
                          <Input
                            type="number"
                            value={runningCosts.heating}
                            onChange={(e) => setRunningCosts(prev => ({ ...prev, heating: Number(e.target.value) }))}
                            placeholder="SEK/år"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Vatten/år</Label>
                          <Input
                            type="number"
                            value={runningCosts.water}
                            onChange={(e) => setRunningCosts(prev => ({ ...prev, water: Number(e.target.value) }))}
                            placeholder="SEK/år"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Resultat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="price-text text-primary">
                      {calculation.monthlyPayment.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </p>
                    <p className="text-xs text-muted-foreground">Månadsavgift (före skatt)</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-success/5 border border-success/20">
                    <Home className="h-6 w-6 mx-auto mb-2 text-success" />
                    <p className="price-text text-success">
                      {calculation.monthlyAfterTax.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </p>
                    <p className="text-xs text-muted-foreground">Månadsavgift (efter skatt)</p>
                  </div>
                </div>

                {/* Total monthly cost */}
                {includeRunningCosts && (
                  <div className="text-center p-6 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30">
                    <Calendar className="h-8 w-8 mx-auto mb-3 text-accent" />
                    <p className="price-text text-accent mb-1">
                      {getTotalMonthlyCost().toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </p>
                    <p className="property-type-text text-muted-foreground">Total månadsavgift (inkl. drift)</p>
                  </div>
                )}
                
                {/* Loan Application CTA */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="property-type-text mb-1">Klar att ansöka?</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Ansök om lånelöfte hos våra samarbetsbanker för att se exakta erbjudanden
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ansök om lånelöfte
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Amortization Schedule Toggle */}
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAmortizationSchedule(!showAmortizationSchedule)}
                    className="w-full"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {showAmortizationSchedule ? 'Dölj' : 'Visa'} amorteringsplan per år
                  </Button>
                  
                  {showAmortizationSchedule && amortizationSchedule.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">År</th>
                            <th className="text-right p-2">Amortering</th>
                            <th className="text-right p-2">Ränta</th>
                            <th className="text-right p-2">Återstående</th>
                          </tr>
                        </thead>
                        <tbody>
                          {amortizationSchedule.map((row) => (
                            <tr key={row.year} className="border-b hover:bg-muted/25">
                              <td className="p-2">{row.year}</td>
                              <td className="text-right p-2 text-success">{row.principal.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</td>
                              <td className="text-right p-2 text-muted-foreground">{row.interest.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</td>
                              <td className="text-right p-2 font-medium">{row.remainingBalance.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Detailed breakdown */}
                <div className="space-y-3">
                  <TooltipProvider>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="label-text">Lånebelopp:</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Fastighetspris minus kontantinsats</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="property-type-text">{calculation.loanAmount.toLocaleString('sv-SE')} kr</span>
                    </div>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="label-text">Belåningsgrad:</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Max 85% enligt lag (min 15% kontantinsats)</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="property-type-text">{calculation.loanToValue.toFixed(1)}%</span>
                    </div>
                  </TooltipProvider>
                  
                  <div className="flex justify-between items-center">
                    <span className="label-text">Ränta ({BANK_SCENARIOS[selectedBank as keyof typeof BANK_SCENARIOS].name}):</span>
                    <span className="property-type-text">{calculation.interestRate.toFixed(2)}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="label-text">Total ränta:</span>
                    <span className="property-type-text">{calculation.totalInterest.toLocaleString('sv-SE')} kr</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="label-text">Total kostnad:</span>
                    <span className="property-type-text">{calculation.totalCost.toLocaleString('sv-SE')} kr</span>
                  </div>
                </div>

                {/* Warnings */}
                {calculation.loanToValue > 85 && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-critical/5 border border-critical/20">
                    <AlertCircle className="h-4 w-4 text-critical mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-critical">Hög belåningsgrad</p>
                      <p className="text-xs text-muted-foreground">
                        Belåningsgrad över 85% kan kräva högre ränta eller amorteringskrav
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="affordability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income and Expenses */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Inkomst och utgifter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Månadsinkomst (brutto)</Label>
                  <Input
                    type="number"
                    value={affordability.monthlyIncome}
                    onChange={(e) => setAffordability(prev => ({ ...prev, monthlyIncome: Number(e.target.value) }))}
                    placeholder="SEK/månad"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Övriga månadsutgifter</Label>
                  <Input
                    type="number"
                    value={affordability.monthlyExpenses}
                    onChange={(e) => setAffordability(prev => ({ ...prev, monthlyExpenses: Number(e.target.value) }))}
                    placeholder="SEK/månad"
                  />
                  <p className="text-xs text-muted-foreground">
                    Inkludera mat, transport, övriga lån, etc.
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Kvar efter utgifter:</span>
                    <span className="font-semibold">
                      {(affordability.monthlyIncome - affordability.monthlyExpenses).toLocaleString('sv-SE')} kr
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Max bostadskostnad:</span>
                    <span className="font-semibold">
                      {affordability.maxAffordablePayment.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affordability Analysis */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Betalningsförmågeanalys</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className={`text-3xl font-bold ${getAffordabilityColor(
                    affordability.debtToIncomeRatio < 25 ? 'good' : 
                    affordability.debtToIncomeRatio < 30 ? 'acceptable' : 'risky'
                  )}`}>
                    {affordability.debtToIncomeRatio.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Skuldsättningsgrad</p>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  {getAffordabilityIcon(
                    affordability.debtToIncomeRatio < 25 ? 'good' : 
                    affordability.debtToIncomeRatio < 30 ? 'acceptable' : 'risky'
                  )}
                  <div>
                    <p className="font-semibold text-sm">Bedömning</p>
                    <p className="text-xs text-muted-foreground">{affordability.recommendation}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Max fastighetspris:</span>
                    <span className="font-semibold">
                      {affordability.maxAffordablePrice.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Aktuell bostadskostnad:</span>
                    <span className="font-semibold">
                      {getTotalMonthlyCost().toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Marginal:</span>
                    <span className={`font-semibold ${
                      affordability.maxAffordablePayment > getTotalMonthlyCost() ? 'text-success' : 'text-critical'
                    }`}>
                      {(affordability.maxAffordablePayment - getTotalMonthlyCost()).toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                    </span>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="p-3 rounded-lg bg-info/5 border border-info/20">
                  <h4 className="font-semibold text-sm mb-2">Bankernas riktlinjer:</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Max 85% belåningsgrad (första 4,5 miljoner)</li>
                    <li>• Max 30% av bruttoinkomst till bostadskostnader</li>
                    <li>• Stresstest med 6% ränta</li>
                    <li>• Amorteringskrav vid belåning över 50%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stresstest" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Finansinspektionens stresstest
              </CardTitle>
              <p className="text-muted-foreground">
                Beräkning med {STRESS_TEST_RATE}% ränta enligt Finansinspektionens krav
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold">
                    {stressTest.currentPayment.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                  </p>
                  <p className="text-sm text-muted-foreground">Nuvarande månadsavgift</p>
                  <p className="text-xs text-muted-foreground">({calculation.interestRate.toFixed(2)}% ränta)</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="text-lg font-bold text-warning">
                    {stressTest.stressedPayment.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                  </p>
                  <p className="text-sm text-muted-foreground">Vid stresstest</p>
                  <p className="text-xs text-muted-foreground">({STRESS_TEST_RATE}% ränta)</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-critical/5 border border-critical/20">
                  <p className="text-lg font-bold text-critical">
                    +{stressTest.difference.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr
                  </p>
                  <p className="text-sm text-muted-foreground">Skillnad per månad</p>
                  <p className="text-xs text-muted-foreground">
                    (+{(stressTest.difference * 12).toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr/år)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 rounded-lg border">
                {getAffordabilityIcon(stressTest.affordability)}
                <div>
                  <p className="font-semibold">
                    Stresstest: <span className={getAffordabilityColor(stressTest.affordability)}>
                      {stressTest.affordability === 'good' ? 'Godkänd' : 
                       stressTest.affordability === 'acceptable' ? 'Acceptabel' : 'Riskabel'}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Skuldsättningsgrad vid stresstest: {((stressTest.stressedPayment / affordability.monthlyIncome) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Vad händer om räntan höjs?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[5, 6, 7, 8].map(rate => {
                    const rateMonthly = rate / 100 / 12;
                    const months = calculation.loanTerm * 12;
                    const payment = calculation.loanAmount * (rateMonthly * Math.pow(1 + rateMonthly, months)) / (Math.pow(1 + rateMonthly, months) - 1);
                    const increase = payment - calculation.monthlyPayment;

                    return (
                      <div key={rate} className="p-3 rounded-lg border">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{rate}% ränta:</span>
                          <div className="text-right">
                            <p className="font-bold">{payment.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</p>
                            <p className="text-xs text-critical">+{increase.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-info/5 border border-info/20">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Tips för räntehöjningar
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Bygg upp en buffert för högre räntor</li>
                  <li>• Överväg längre räntebindning vid låga räntor</li>
                  <li>• Amortera extra när det går för att minska skulden</li>
                  <li>• Ha 3-6 månaders utgifter som säkerhetsmarginal</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Jämför räntebindningar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Räntebindning</th>
                      <th className="text-left p-3">Ränta</th>
                      <th className="text-left p-3">Månadsavgift</th>
                      <th className="text-left p-3">Total ränta</th>
                      <th className="text-left p-3">Total kostnad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(BANK_SCENARIOS[selectedBank as keyof typeof BANK_SCENARIOS].rates).map(([type, rate]) => {
                      const monthlyRate = rate / 100 / 12;
                      const months = calculation.loanTerm * 12;
                      const payment = calculation.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
                      const totalInterest = (payment * months) - calculation.loanAmount;
                      const totalCost = payment * months;

                      const isSelected = type === selectedRateType;

                      return (
                        <tr key={type} className={`border-b hover:bg-muted/25 ${isSelected ? 'bg-primary/5' : ''}`}>
                          <td className="p-3">
                            <span className="property-type-text">
                              {type === 'variable' ? 'Rörlig' : 
                               type === '1_year' ? '1 år' :
                               type === '2_year' ? '2 år' :
                               type === '3_year' ? '3 år' : '5 år'}
                            </span>
                            {isSelected && <Badge className="ml-2" variant="secondary">Vald</Badge>}
                          </td>
                          <td className="p-3 property-type-text">{rate.toFixed(2)}%</td>
                          <td className="p-3 property-type-text">{payment.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</td>
                          <td className="p-3 font-medium">{totalInterest.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</td>
                          <td className="p-3 font-medium">{totalCost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} kr</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}