import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Check, BarChart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import NotificationPanel from '@/components/NotificationPanel';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const sites = [
  { id: 'R1', name: 'Laiterie Collet (R1)' },
  { id: 'R2', name: 'Végétal Santé (R2)' },
  { id: 'BAIKO', name: 'Laiterie Baiko' },
];

const QualityControlPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user?.role === 'coordinator') {
      // Les coordinateurs sont redirigés vers la page technique pour définir le titre du formulaire
      navigate('/technical-info', { 
        state: { 
          selectedSite,
          analysisDate: date 
        } 
      });
    } else {
      // Technicians can only see existing analyses
      const storedAnalysis = localStorage.getItem('savedAnalysis');
      if (storedAnalysis) {
        const analysis = JSON.parse(storedAnalysis);
        navigate('/sample-entry', { 
          state: { 
            reportTitle: analysis.reportTitle || 'Rapport d\'analyse',
            samples: analysis.samples || [],
            brand: analysis.brand || '',
            selectedSite,
            analysisDate: date 
          } 
        });
      } else {
        navigate('/sample-entry', { 
          state: { 
            reportTitle: 'Nouveau rapport',
            samples: [],
            brand: '',
            selectedSite,
            analysisDate: date 
          } 
        });
      }
    }
  };

  const handleViewDashboard = () => {
    navigate('/quality-control-dashboard', {
      state: {
        selectedSite,
        analysisDate: date
      }
    });
  };

  // Fonction pour créer un nouveau formulaire avec données réinitialisées
  const handleCreateNewForm = () => {
    // Réinitialiser toutes les données du localStorage
    localStorage.clear();
    
    // Informer l'utilisateur
    alert("Toutes les données locales ont été effacées. Vous allez créer un formulaire entièrement vide.");
    
    navigate('/technical-info', { 
      state: { 
        selectedSite: '',
        analysisDate: new Date()
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-medium">Sélection du Site et Date</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <RadioGroup 
                    id="site" 
                    value={selectedSite} 
                    onValueChange={setSelectedSite}
                    className="space-y-2"
                  >
                    {sites.map((site) => (
                      <div key={site.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={site.id} id={`site-${site.id}`} />
                        <Label htmlFor={`site-${site.id}`} className="cursor-pointer">{site.name}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date d'analyse</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "d MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  disabled={!selectedSite || !date}
                  className="bg-[#0091CA] hover:bg-[#007AA8] w-full sm:w-auto"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {user?.role === 'coordinator' ? 'Créer une nouvelle analyse' : 'Accéder aux analyses'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto border-[#0091CA] text-[#0091CA] hover:bg-[#E6F4F9] hover:text-[#0091CA]"
                  onClick={handleViewDashboard}
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Tableau de Bord
                </Button>
                
                {user?.role === 'coordinator' && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={handleCreateNewForm}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau formulaire vide
                  </Button>
                )}
              </div>
              
              {user?.role === 'technician' && (
                <div className="text-sm text-amber-600 mt-2">
                  En tant que technicien, vous pouvez uniquement accéder aux analyses existantes pour compléter les données.
                </div>
              )}
            </form>
          </div>

          <div>
            <NotificationPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QualityControlPage;
