import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Liste complète des marques et leurs produits par site
const siteProducts = {
  'R1': [
    { id: '1', name: 'Grand Frais (GF)', products: [
      'Crème dessert vanille',
      'Crème dessert chocolat',
      'Crème dessert caramel'
    ]}
  ],
  'R2': [
    { id: '6', name: 'L\'Atelier Dessy', products: [
      'L\'Atelier Dessy Mangue Passion',
      'L\'Atelier Dessy Nature', 
      'L\'Atelier Dessy Caramel Salé et Chocolat noir',
      'L\'Atelier Dessy Framboise Mure'
    ]}
  ],
  'BAIKO': [
    { id: '7', name: 'Préparation fruit', products: [
      'Préparation fruit fraise',
      'Préparation fruit mangue passion',
      'Préparation fruit poire'
    ]}
  ]
};

interface TechnicalInfoProps {
  selectedSite?: string;
  analysisDate?: Date;
}

const TechnicalInfoPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSite, analysisDate } = (location.state as TechnicalInfoProps) || {};

  const [brand, setBrand] = useState<string>('');
  const [reportTitle, setReportTitle] = useState<string>('');
  const [availableBrands, setAvailableBrands] = useState<Array<{id: string, name: string, products?: string[]}>>([]);
  
  useEffect(() => {
    // Si un site est sélectionné, filtrer les marques disponibles
    if (selectedSite && siteProducts[selectedSite]) {
      setAvailableBrands(siteProducts[selectedSite]);
      
      // Si une seule marque est disponible, la sélectionner automatiquement
      if (siteProducts[selectedSite].length === 1) {
        setBrand(siteProducts[selectedSite][0].id);
        setReportTitle(`Formulaire contrôle microbiologique – ${siteProducts[selectedSite][0].name}`);
      }
    } else {
      setAvailableBrands([]);
      setBrand('');
      setReportTitle('');
    }
  }, [selectedSite]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand) {
      toast({
        title: "Champs requis",
        description: "Veuillez sélectionner une marque.",
        variant: "destructive"
      });
      return;
    }

    // Trouver la marque sélectionnée pour accéder à ses produits
    const selectedBrandInfo = availableBrands.find(b => b.id === brand);
    const products = selectedBrandInfo?.products || [];

    navigate('/sample-entry', {
      state: {
        ...location.state,
        brand,
        reportTitle,
        site: selectedSite,
        sampleDate: analysisDate ? analysisDate.toLocaleDateString() : '',
        reference: `REF-${selectedSite}-${Date.now().toString().substring(8)}`,
        GF_PRODUCTS: products // Transmettre les produits disponibles pour cette marque
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-[#0091CA] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold">Contrôle Qualité Microbiologique</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-medium">Informations Techniques</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site">Site sélectionné</Label>
                <Input 
                  id="site" 
                  value={selectedSite ? sites.find(s => s.id === selectedSite)?.name || selectedSite : ''} 
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Marque du produit</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Sélectionner une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBrands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableBrands.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Aucune marque disponible pour ce site.
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportTitle">Titre du rapport</Label>
                <Input 
                  id="reportTitle" 
                  value={reportTitle} 
                  onChange={(e) => setReportTitle(e.target.value)} 
                  placeholder="Entrez un titre pour ce rapport"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/quality-control')}
              >
                Retour
              </Button>
              
              <Button 
                type="submit" 
                className="bg-[#0091CA] hover:bg-[#007AA8]"
                disabled={!brand || !reportTitle}
              >
                <Check className="w-4 h-4 mr-2" />
                Valider
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

// Liste des sites pour affichage
const sites = [
  { id: 'R1', name: 'Laiterie Collet (R1)' },
  { id: 'R2', name: 'Végétal Santé (R2)' },
  { id: 'BAIKO', name: 'Laiterie Baiko' },
];

export default TechnicalInfoPage;
