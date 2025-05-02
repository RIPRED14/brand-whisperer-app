import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import { Sample } from '@/types/samples';

// Sample data for demonstration
const mockSamples: Sample[] = [
  {
    id: 1,
    number: 'ECH-001',
    product: 'Crème dessert vanille',
    smell: 'A',
    texture: 'B',
    taste: 'A',
    aspect: 'A',
    ph: '6.7',
    createdAt: '2023-06-01T10:00:00Z',
    modifiedAt: '2023-06-01T14:30:00Z',
    status: 'completed',
    brand: 'Grand Frais',
  },
  {
    id: 2,
    number: 'ECH-002',
    product: 'Mangue Passion',
    smell: 'A',
    texture: 'A',
    taste: 'A',
    aspect: 'A',
    ph: '6.5',
    createdAt: '2023-07-02T10:00:00Z',
    modifiedAt: '2023-07-02T14:30:00Z',
    status: 'completed',
    brand: "L'Atelier Dessy",
  },
  {
    id: 3,
    number: 'ECH-003',
    product: 'Préparation fruit fraise',
    smell: 'B',
    texture: 'B',
    taste: 'C',
    aspect: 'B',
    ph: '5.9',
    createdAt: '2023-08-03T10:00:00Z',
    modifiedAt: '2023-08-03T14:30:00Z',
    status: 'completed',
    brand: 'BAIKO',
  },
  {
    id: 4,
    number: 'ECH-004',
    product: 'Nature',
    smell: 'D',
    texture: 'C',
    taste: 'B',
    aspect: 'C',
    ph: '6.2',
    createdAt: '2023-09-04T10:00:00Z',
    modifiedAt: '2023-09-04T14:30:00Z',
    status: 'rejected',
    brand: "L'Atelier Dessy",
  },
  {
    id: 5,
    number: 'ECH-005',
    product: 'Préparation fruit mangue passion',
    smell: 'A',
    texture: 'A',
    taste: 'B',
    aspect: 'A',
    ph: '6.0',
    createdAt: '2023-10-05T10:00:00Z',
    modifiedAt: '2023-10-05T14:30:00Z',
    status: 'completed',
    brand: 'BAIKO',
  },
  {
    id: 6,
    number: 'ECH-006',
    product: 'Crème dessert chocolat',
    smell: 'C',
    texture: 'D',
    taste: 'C',
    aspect: 'D',
    ph: '6.3',
    createdAt: '2023-11-15T10:00:00Z',
    modifiedAt: '2023-11-15T14:30:00Z',
    status: 'rejected',
    brand: 'Grand Frais',
  },
];

// Helper function to determine if a sample is conforming
const isConforming = (sample: Sample): boolean => {
  // Logic to determine if a sample is conforming
  // For example, if all attributes are A or B, it's conforming
  const attributes = [sample.smell, sample.texture, sample.taste, sample.aspect];
  return !attributes.some(attr => attr === 'C' || attr === 'D');
};

// Helper function to calculate compliance data for pie chart
const calculateComplianceData = (samples: Sample[]) => {
  const conforming = samples.filter(sample => isConforming(sample)).length;
  const nonConforming = samples.length - conforming;
  
  return [
    { name: 'Conforme', value: conforming },
    { name: 'Non Conforme', value: nonConforming },
  ];
};

// Helper function to calculate monthly compliance data for histogram
const calculateMonthlyComplianceData = (samples: Sample[]) => {
  // Group samples by month
  type MonthlyDataType = { 
    total: number; 
    conforming: number; 
    display: string;
  };
  
  const monthlyData = new Map<string, MonthlyDataType>();
  
  samples.forEach(sample => {
    const date = new Date(sample.createdAt);
    const monthKey = format(date, 'yyyy-MM');
    const monthDisplay = format(date, 'MMM yyyy', { locale: fr });
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { total: 0, conforming: 0, display: monthDisplay });
    }
    
    const data = monthlyData.get(monthKey)!;
    data.total += 1;
    if (isConforming(sample)) {
      data.conforming += 1;
    }
  });
  
  // Calculate percentages and format for chart
  return Array.from(monthlyData.entries())
    .sort((a, b) => a[0].localeCompare(b[0])) // Sort by month
    .map(([key, data]) => ({
      month: data.display,
      conformePercent: (data.conforming / data.total) * 100,
      nonConformePercent: ((data.total - data.conforming) / data.total) * 100,
    }));
};

// Colors for pie charts
const COLORS = ['#22c55e', '#ef4444'];

const QualityControlDashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSite, analysisDate } = location.state || {};
  const [samples] = useState<Sample[]>(mockSamples); // In real app, fetch from API or context
  const [timeRange, setTimeRange] = useState<string>('year');
  
  // Filter samples by the selected site if provided
  const filteredSamples = selectedSite 
    ? samples.filter(sample => {
        if (selectedSite === 'R1') return sample.brand === 'Grand Frais';
        if (selectedSite === 'R2') return sample.brand === "L'Atelier Dessy";
        if (selectedSite === 'BAIKO') return sample.brand === 'BAIKO';
        return true;
      })
    : samples;

  // Calculate time range based on selection
  const getTimeFilteredSamples = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'quarter':
        startDate = subMonths(now, 3);
        break;
      case 'year':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 12); // Default to 1 year
    }
    
    return filteredSamples.filter(sample => new Date(sample.createdAt) >= startDate);
  };

  const timeFilteredSamples = getTimeFilteredSamples();
  const complianceData = calculateComplianceData(timeFilteredSamples);
  const monthlyComplianceData = calculateMonthlyComplianceData(timeFilteredSamples);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate('/quality-control')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Tableau de Bord Contrôle Qualité</h1>
                {selectedSite && (
                  <p className="text-sm text-muted-foreground">
                    Site: {
                      selectedSite === 'R1' ? 'Laiterie Collet (R1)' : 
                      selectedSite === 'R2' ? 'Végétal Santé (R2)' : 
                      'Laiterie Baiko'
                    }
                    {analysisDate && ` - Date: ${format(new Date(analysisDate), 'd MMMM yyyy', { locale: fr })}`}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">30 derniers jours</SelectItem>
                  <SelectItem value="quarter">3 derniers mois</SelectItem>
                  <SelectItem value="year">12 derniers mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Conformité des échantillons</CardTitle>
                <CardDescription>Vue d'ensemble de la conformité des analyses</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={true}
                    >
                      {complianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} échantillons`, 'Quantité']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Évolution mensuelle de la conformité</CardTitle>
                <CardDescription>Pourcentage de conformité par mois</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyComplianceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      tickMargin={20}
                    />
                    <YAxis 
                      label={{ value: 'Pourcentage (%)', angle: -90, position: 'insideLeft' }} 
                      domain={[0, 100]}
                    />
                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, '']} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar 
                      dataKey="conformePercent" 
                      name="Conforme" 
                      stackId="a" 
                      fill="#22c55e" 
                    />
                    <Bar 
                      dataKey="nonConformePercent" 
                      name="Non Conforme" 
                      stackId="a" 
                      fill="#ef4444" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Légende</CardTitle>
              <CardDescription>Critères de conformité des échantillons</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
                  <span>Conforme: Tous les attributs notés A ou B</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
                  <span>Non Conforme: Au moins un attribut noté C ou D</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default QualityControlDashboardPage; 