import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Save, DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import BatchNumbers from '@/components/BatchNumbers';
import SamplesTable from '@/components/SamplesTable';
import SamplePageHeader from '@/components/SamplePageHeader';
import SampleActionButtons from '@/components/SampleActionButtons';
import { useSamples } from '@/hooks/useSamples';
import { supabase } from '@/integrations/supabase/client';

const SampleEntryPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    reportTitle = '', 
    samples: savedSamples = [], 
    brand = '', 
    site = '', 
    sampleDate = '', 
    reference = '',
    GF_PRODUCTS = ['Crème dessert vanille', 'Crème dessert chocolat', 'Crème dessert caramel'] // Valeur par défaut
  } = location.state || {};
  
  const [waterPeptone, setWaterPeptone] = useState<string>('');
  const [petriDishes, setPetriDishes] = useState<string>('');
  const [VRBGGel, setVRBGGel] = useState<string>('');
  const [YGCGel, setYGCGel] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [selectedSamples, setSelectedSamples] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier si c'est un nouveau formulaire (sans échantillons préexistants)
    const isNewForm = !savedSamples || savedSamples.length === 0;
    
    if (isNewForm) {
      console.log("Nouveau formulaire détecté, nettoyage des données précédentes");
      localStorage.removeItem('savedAnalysis');
      console.log("Toutes les données précédentes ont été supprimées pour ce nouveau formulaire");
    } else {
      // Charger les numéros de lot uniquement si ce n'est PAS un nouveau formulaire
      const storedAnalysis = localStorage.getItem('savedAnalysis');
      if (storedAnalysis) {
        const { batchNumbers } = JSON.parse(storedAnalysis);
        if (batchNumbers) {
          setWaterPeptone(batchNumbers.waterPeptone || '');
          setPetriDishes(batchNumbers.petriDishes || '');
          setVRBGGel(batchNumbers.VRBGGel || '');
          setYGCGel(batchNumbers.YGCGel || '');
        }
      }
    }
  }, [savedSamples]);

  const { 
    samples, 
    addSample, 
    updateSample, 
    toggleConformity, 
    validateSamples, 
    addChangeHistory, 
    sendToTechnician,
    deleteSample 
  } = useSamples({
    savedSamples,
    brand
  });

  const handleSave = async () => {
    if (!validateSamples()) return;
    
    setIsLoading(true);

    try {
      // Créer un identifiant unique pour le formulaire s'il n'existe pas déjà
      const formId = reportTitle || `Formulaire-${new Date().toISOString().slice(0, 10)}`;
      
      // Save batch numbers
      const { error: batchError } = await supabase
        .from('batch_numbers')
        .insert([{
          report_id: formId,
          water_peptone: waterPeptone,
          petri_dishes: petriDishes,
          vrbg_gel: VRBGGel,
          ygc_gel: YGCGel
        }]);

      if (batchError) throw batchError;
      
      // Statut global du formulaire - sera mis à jour en fonction des échantillons
      let samplesUpdated = 0;

      // Mettre à jour le statut des échantillons en fonction du rôle et de l'étape
      if (user?.role === 'technician') {
        // Si c'est un technicien qui sauvegarde, vérifiez l'état de chaque échantillon
        for (const sample of samples) {
          let updates = {};
          
          // Première sauvegarde par le technicien après le coordinateur
          if ((sample.status === 'in_progress' || sample.status === 'pending') && !sample.enterobacteria && !sample.yeastMold) {
            console.log("Échantillon initial rempli, en attente d'entérobactéries:", sample.id);
            
            // Calculer les dates d'échéance pour les lectures microbiologiques
            const now = new Date();
            const enteroReadingDue = new Date(now);
            enteroReadingDue.setHours(now.getHours() + 24); // +24h pour entérobactéries
            
            const yeastReadingDue = new Date(now);
            yeastReadingDue.setDate(now.getDate() + 5); // +5 jours pour levures/moisissures
            
            updates = {
              status: 'in_progress', // Utilisez les valeurs de status qui existent dans le type
              entero_reading_due: enteroReadingDue.toISOString(),
              yeast_reading_due: yeastReadingDue.toISOString(),
              report_title: reportTitle
            };
          } 
          // Mise à jour avec les résultats d'entérobactéries
          else if (sample.status === 'in_progress' && sample.enterobacteria && !sample.yeastMold) {
            console.log("Enterobactéries remplies, en attente de levures/moisissures:", sample.id);
            
            updates = {
              status: 'in_progress', // Utilisez les valeurs de status qui existent dans le type
              enterobacteria: sample.enterobacteria,
              report_title: reportTitle
            };
          }
          // Mise à jour avec les résultats de levures/moisissures (analyse complète)
          else if (sample.status === 'in_progress' && 
                   sample.enterobacteria && sample.yeastMold) {
            console.log("Échantillon complètement rempli:", sample.id);
            
            updates = {
              status: 'completed',
              enterobacteria: sample.enterobacteria,
              yeast_mold: sample.yeastMold,
              report_title: reportTitle
            };
          }
          
          // Si des mises à jour sont nécessaires, envoyer à Supabase
          if (Object.keys(updates).length > 0) {
            // Ajouter le site et la marque aux mises à jour
            updates = {
              ...updates,
              site: site,
              brand: brand,
              modified_at: new Date().toISOString(),
              modified_by: user?.name
            };
            
            console.log("Mise à jour de l'échantillon:", sample.id, updates);
            
            try {
              // Convertir l'ID en string si c'est un nombre
              const sampleId = typeof sample.id === 'number' ? String(sample.id) : sample.id;
              
              const { error } = await supabase
                .from('samples')
                .update(updates)
                .eq('id', sampleId);
                
              if (error) {
                console.error('Erreur lors de la mise à jour du statut:', error);
                throw error;
              }
              
              // Incrémenter le compteur d'échantillons mis à jour
              samplesUpdated++;
            } catch (updateError) {
              console.error('Erreur lors de la mise à jour de l\'échantillon:', updateError);
            }
          }
        }
      } else if (user?.role === 'coordinator') {
        // Si c'est un coordinateur qui sauvegarde, initialiser les échantillons
        for (const sample of samples) {
          try {
            // Extraire l'ID de l'échantillon
            const sampleId = typeof sample.id === 'number' ? String(sample.id) : sample.id;
            
            // Vérifier si l'ID est valide
            const idExists = sampleId && sampleId !== "undefined" && sampleId.length > 5;
            
            // Préparer les données de l'échantillon en s'assurant que tous les champs ont des valeurs valides
            const sampleData = {
              number: sample.number || '',
              product: sample.product || '',
              ready_time: sample.readyTime || '',
              fabrication: sample.fabrication || '',
              dlc: sample.dlc || '',
              smell: sample.smell || 'N',
              texture: sample.texture || 'N',
              taste: sample.taste || 'N',
              aspect: sample.aspect || 'N',
              ph: typeof sample.ph === 'number' ? String(sample.ph) : (sample.ph || ''),
              enterobacteria: sample.enterobacteria || '',
              yeast_mold: sample.yeastMold || '',
              status: 'in_progress',
              brand: brand || '',
              report_title: reportTitle || '',
              modified_at: new Date().toISOString(),
              modified_by: user?.name || 'Utilisateur'
            };
            
            console.log("Données de l'échantillon à sauvegarder:", { id: sampleId, data: sampleData });
            
            if (idExists) {
              // Mettre à jour l'échantillon existant
              const { error } = await supabase
                .from('samples')
                .update(sampleData)
                .eq('id', sampleId);
                
              if (error) {
                console.error('Erreur mise à jour échantillon:', error);
                throw error;
              }
            } else {
              // Insérer un nouvel échantillon
              const { error } = await supabase
                .from('samples')
                .insert({
                  ...sampleData,
                  created_at: new Date().toISOString()
                });
                
              if (error) {
                console.error('Erreur création échantillon:', error);
                throw error;
              }
            }
            
            // Incrémenter le compteur d'échantillons mis à jour
            samplesUpdated++;
          } catch (sampleError) {
            console.error('Erreur lors de la sauvegarde de l\'échantillon:', sampleError);
          }
        }
      }

      // Sauvegarder l'analyse en local
      localStorage.setItem('savedAnalysis', JSON.stringify({
        reportTitle,
        formId,
        samples,
        date: new Date().toISOString(),
        brand,
        site: site,
        batchNumbers: {
          waterPeptone,
          petriDishes,
          VRBGGel,
          YGCGel
        }
      }));

      // Enregistrer la sauvegarde dans l'historique
      addChangeHistory({
        action: 'save',
        user: user?.name || 'Unknown',
        role: user?.role || 'guest'
      });

      toast({
        title: "Analyse sauvegardée",
        description: `${samplesUpdated} échantillon(s) enregistré(s) avec succès.`,
      });
      
      // Si le technicien vient de remplir les données initiales, afficher un message
      if (user?.role === 'technician' && samples.some(s => s.status === 'in_progress')) {
        toast({
          title: "Incubation en cours",
          description: "Les échantillons sont en incubation. Vous recevrez une notification lorsqu'il sera temps de saisir les résultats microbiologiques.",
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'analyse",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkLockStatus = () => {
      const storedAnalysis = localStorage.getItem('savedAnalysis');
      if (storedAnalysis) {
        const { lockedByCoordinator } = JSON.parse(storedAnalysis);
        if (lockedByCoordinator) setIsLocked(true);
      }
    };
    
    checkLockStatus();
  }, []); // Only run once on mount

  const handleSendToTechnician = async () => {
    if (!validateSamples()) return;
    
    setIsLoading(true);
    
    // Convertir les IDs numériques en chaînes
    const selectedSampleIds = selectedSamples.length > 0 
      ? selectedSamples.map(id => id.toString()) 
      : undefined;
      
    const success = await sendToTechnician(selectedSampleIds);
    setIsLoading(false);
    
    if (success) {
      // Rediriger vers la page de contrôle de qualité après envoi au technicien
      setTimeout(() => {
        navigate('/quality-control');
      }, 1500);
    }
  };

  const handleToggleSelectSample = (sampleId: number) => {
    if (selectedSamples.includes(sampleId)) {
      setSelectedSamples(selectedSamples.filter(id => id !== sampleId));
    } else {
      setSelectedSamples([...selectedSamples, sampleId]);
    }
  };

  // Modification de la fonction pour utiliser deleteSample du hook
  const handleDeleteSample = (sampleId: number) => {
    // Demander confirmation à l'utilisateur
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'échantillon sélectionné ?`)) {
      // Convertir l'ID en string pour le deleteSample
      deleteSample(sampleId.toString());
      
      // Si l'échantillon était sélectionné, le retirer de la sélection
      if (selectedSamples.includes(sampleId)) {
        setSelectedSamples(selectedSamples.filter(id => id !== sampleId));
      }
    }
  };

  // Fonction pour gérer l'annulation des modifications
  const handleCancel = () => {
    // Réinitialiser les sélections
    setSelectedSamples([]);
    
    toast({
      title: "Opération annulée",
      description: "Les modifications ont été annulées."
    });
  };

  const handleDownload = () => {
    try {
      // Créer un objet avec toutes les données
      const dataToExport = {
        reportTitle,
        brand,
        site,
        sampleDate,
        reference,
        samples,
        batchNumbers: {
          waterPeptone,
          petriDishes,
          VRBGGel,
          YGCGel
        }
      };
      
      // Convertir en JSON
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportTitle.replace(/\s+/g, '_')}_export.json`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export réussi",
        description: "Les données ont été exportées avec succès",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive"
      });
    }
  };

  const isGrandFrais = brand === '1';
  const isCoordinator = user?.role === 'coordinator';
  const isTechnician = user?.role === 'technician';

  // Fonction pour ajouter un échantillon avec un produit par défaut
  const handleAddSample = () => {
    // Utiliser le premier produit de la liste comme valeur par défaut
    const defaultProduct = GF_PRODUCTS && GF_PRODUCTS.length > 0 ? GF_PRODUCTS[0] : '';
    addSample(defaultProduct);
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <SamplePageHeader title={reportTitle} />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Saisie des Échantillons</h2>
              <p className="text-gray-500 mt-1">{reportTitle}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span>Site: {site}</span>
                <span>•</span>
                <span>Référence: {reference}</span>
                <span>•</span>
                <span>Date: {sampleDate}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SampleActionButtons 
                onSave={handleSave}
                onAdd={handleAddSample}
                showAddButton={isCoordinator && !isLocked}
                selectedSamples={selectedSamples.length}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 mb-8 shadow-sm transition-all duration-300 hover:shadow-md">
            {samples.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun échantillon</h3>
                <p className="text-gray-500 max-w-md mb-6">Ajoutez des échantillons pour commencer l'analyse.</p>
                {isCoordinator && !isLocked && (
                  <Button
                    onClick={handleAddSample}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un échantillon
                  </Button>
                )}
              </div>
            ) : (
              <SamplesTable
                samples={samples}
                isGrandFrais={isGrandFrais}
                GF_PRODUCTS={GF_PRODUCTS}
                updateSample={updateSample}
                toggleConformity={toggleConformity}
                isLocked={isLocked}
                userRole={user?.role || 'guest'}
                selectedSamples={selectedSamples}
                onToggleSelectSample={handleToggleSelectSample}
                onDeleteSample={handleDeleteSample}
              />
            )}
          </div>

          {samples.length > 0 && isCoordinator && !isLocked && (
            <div className="flex justify-center mb-8">
              <Button
                variant="outline"
                onClick={handleAddSample}
                className="w-full md:w-auto max-w-xs mx-auto border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un échantillon
              </Button>
            </div>
          )}

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">Info</span>
              Informations sur les lots
            </h3>
            <BatchNumbers 
              waterPeptone={waterPeptone}
              setWaterPeptone={setWaterPeptone}
              petriDishes={petriDishes}
              setPetriDishes={setPetriDishes}
              VRBGGel={VRBGGel}
              setVRBGGel={setVRBGGel}
              YGCGel={YGCGel}
              setYGCGel={setYGCGel}
            />
          </div>

          {samples.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  <span className="font-medium">{samples.length}</span> échantillon{samples.length > 1 ? 's' : ''} au total
                </div>
                {selectedSamples.length > 0 && (
                  <div>
                    <span className="font-medium">{selectedSamples.length}</span> sélectionné{selectedSamples.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SampleEntryPage;
