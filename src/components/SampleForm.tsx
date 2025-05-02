import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import SampleFormHeader from './sample-form/SampleFormHeader';
import SampleFormInputs from './sample-form/SampleFormInputs';
import SampleFormActions from './sample-form/SampleFormActions';
import SamplesFormTable from './sample-form/SamplesFormTable';
import SampleFormDialog from './sample-form/SampleFormDialog';
import { Sample } from '@/types/samples';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import DownloadFormButton from './sample-form/DownloadFormButton';
import { Spinner } from './ui/spinner';

const SampleForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [site, setSite] = useState('');
  const [sampleDate, setSampleDate] = useState('');
  const [reference, setReference] = useState('');
  const [samples, setSamples] = useState<Sample[]>([]);
  const [selectedSamples, setSelectedSamples] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentSample, setCurrentSample] = useState<Sample | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [sampleToDelete, setSampleToDelete] = useState<number | null>(null);
  
  const handleSave = async () => {
    if (!site || !sampleDate) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Vérifier que les échantillons ont les champs obligatoires
    const invalidSamples = samples.filter(sample => 
      !sample.program || !sample.label || !sample.nature
    );
    
    if (invalidSamples.length > 0) {
      toast({
        title: "Échantillons incomplets",
        description: `${invalidSamples.length} échantillon(s) avec des champs obligatoires manquants.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reportId = uuidv4();
      
      const { data: formData, error: formError } = await supabase
        .from('sample_forms')
        .insert({
          report_id: reportId,
          site: site,
          sample_date: sampleDate,
          reference: reference,
          created_by: user?.id
        })
        .select('id')
        .single();
        
      if (formError) throw formError;
      
      if (samples.length > 0) {
        const samplesData = samples.map(sample => ({
          report_id: reportId,
          program: sample.program,
          label: sample.label,
          nature: sample.nature,
          lab_comment: sample.labComment,
          additional_details: sample.additionalDetails,
          temperature: sample.temperature,
          analysis_date: sample.analysisDate,
          storage_temp: sample.storageTemp,
          break_date: sample.breakDate
        }));
        
        const { error: samplesError } = await supabase
          .from('form_samples')
          .insert(samplesData);
          
        if (samplesError) throw samplesError;
      }
      
      toast({
        title: "Sauvegardé",
        description: "Les informations ont été sauvegardées avec succès."
      });

      navigate('/sample-entry', { 
        state: { 
          reportId,
          site,
          sampleDate,
          reference
        } 
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement des données.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSample = () => {
    const sampleId = Math.max(0, ...samples.map(s => Number(s.id))) + 1;
    const newSample: Sample = {
      id: sampleId,
      number: String(sampleId).padStart(3, '0'),
      product: '',
      readyTime: '',
      fabrication: '',
      dlc: '',
      smell: 'N',
      texture: 'N',
      taste: 'N',
      aspect: 'N',
      ph: '',
      enterobacteria: '',
      yeastMold: '',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      status: 'pending',
      // Nouveaux champs pour le formulaire
      program: '',
      label: '',
      nature: '',
      labComment: '',
      additionalDetails: '',
      temperature: '',
      analysisDate: '',
      storageTemp: '',
      breakDate: '',
    };
    
    setSamples([...samples, newSample]);
    toast({
      title: "Échantillon ajouté",
      description: "Un nouvel échantillon a été ajouté à la liste."
    });
  };

  const handleEditSample = (id: number) => {
    const sample = samples.find(s => s.id === id);
    if (sample) {
      setCurrentSample(sample);
      setOpenEditDialog(true);
    }
  };

  const handleSaveSampleEdit = (updatedSample: Sample) => {
    setSamples(samples.map(s => s.id === updatedSample.id ? updatedSample : s));
    setCurrentSample(null);
    toast({
      title: "Échantillon modifié",
      description: "Les modifications ont été appliquées avec succès."
    });
  };

  const handleCopy = () => {
    if (selectedSamples.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins un échantillon à copier.",
        variant: "destructive"
      });
      return;
    }
    
    const lastId = Math.max(0, ...samples.map(s => Number(s.id)));
    const copiedSamples = samples
      .filter(sample => selectedSamples.includes(sample.id))
      .map((sample, index) => ({
        ...sample,
        id: lastId + index + 1,
        number: String(lastId + index + 1).padStart(3, '0'),
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      }));
    
    setSamples([...samples, ...copiedSamples]);
    toast({
      title: "Copié",
      description: `${selectedSamples.length} échantillon(s) copié(s).`
    });
  };

  const handleDuplicate = (id?: number) => {
    const samplesToDuplicate = id 
      ? samples.filter(s => s.id === id)
      : samples.filter(s => selectedSamples.includes(s.id));
    
    if (samplesToDuplicate.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins un échantillon à dupliquer.",
        variant: "destructive"
      });
      return;
    }
    
    const lastId = Math.max(0, ...samples.map(s => Number(s.id)));
    const duplicatedSamples = samplesToDuplicate.map((sample, index) => ({
      ...sample,
      id: lastId + index + 1,
      number: String(lastId + index + 1).padStart(3, '0'),
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    }));
    
    setSamples([...samples, ...duplicatedSamples]);
    toast({
      title: "Dupliqué",
      description: `${duplicatedSamples.length} échantillon(s) dupliqué(s).`
    });
  };

  const confirmDelete = (id?: number) => {
    if (id) {
      setSampleToDelete(id);
    } else if (selectedSamples.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins un échantillon à supprimer.",
        variant: "destructive"
      });
      return;
    }
    
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (sampleToDelete !== null) {
      // Supprimer un seul échantillon
      setSamples(samples.filter(s => s.id !== sampleToDelete));
      toast({
        title: "Supprimé",
        description: "L'échantillon a été supprimé."
      });
      setSampleToDelete(null);
    } else if (selectedSamples.length > 0) {
      // Supprimer plusieurs échantillons
      setSamples(samples.filter(sample => !selectedSamples.includes(sample.id)));
      toast({
        title: "Supprimé",
        description: `${selectedSamples.length} échantillon(s) supprimé(s).`
      });
      setSelectedSamples([]);
    }
    
    setDeleteConfirmOpen(false);
  };

  const toggleSelectSample = (id: number) => {
    if (selectedSamples.includes(id)) {
      setSelectedSamples(selectedSamples.filter(sampleId => sampleId !== id));
    } else {
      setSelectedSamples([...selectedSamples, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedSamples.length === samples.length) {
      setSelectedSamples([]);
    } else {
      setSelectedSamples(samples.map(s => s.id));
    }
  };

  // Fonction pour gérer l'annulation des modifications
  const handleCancel = () => {
    // Réinitialiser les sélections
    setSelectedSamples([]);
    setCurrentSample(null);
    
    toast({
      title: "Opération annulée",
      description: "Les modifications ont été annulées."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <SampleFormHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-800">Formulaire d'échantillons</h2>
                {isSubmitting && (
                  <div className="flex items-center text-blue-500 gap-2 pl-2">
                    <Spinner className="h-4 w-4" />
                    <span className="text-sm font-medium">Traitement en cours...</span>
                  </div>
                )}
              </div>
              <p className="text-gray-500 mt-1">
                {site ? `Site: ${site}` : 'Nouveau formulaire'} 
                {sampleDate ? ` • Date: ${sampleDate}` : ''}
              </p>
            </div>
          </div>
          <SampleFormInputs 
            site={site}
            setSite={setSite}
            sampleDate={sampleDate}
            setSampleDate={setSampleDate}
            reference={reference}
            setReference={setReference}
          />

          <div className="flex flex-wrap gap-2 my-6">
            <SampleFormActions 
              handleSave={handleSave}
              handleAddSample={handleAddSample}
              handleCopy={handleCopy}
              handleDuplicate={() => handleDuplicate()}
              handleDelete={() => confirmDelete()}
              isSubmitting={isSubmitting}
              hasSamples={samples.length > 0}
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200">
            <SamplesFormTable
              samples={samples}
              selectedSamples={selectedSamples}
              toggleSelectSample={toggleSelectSample}
              toggleSelectAll={toggleSelectAll}
              onEditSample={handleEditSample}
              onCopySample={handleDuplicate}
              onDeleteSample={confirmDelete}
            />
          </div>

          {samples.length > 0 && (
            <div className="mt-6 flex justify-end">
              <div className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md p-2 flex items-center">
                <span className="font-medium">{samples.length}</span>
                <span className="ml-1">échantillon{samples.length > 1 ? 's' : ''}</span>
                {selectedSamples.length > 0 && (
                  <span className="ml-2">
                    (<span className="font-medium text-blue-600">{selectedSamples.length}</span> sélectionné{selectedSamples.length > 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Dialog pour éditer un échantillon */}
      <SampleFormDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        sample={currentSample}
        onSave={handleSaveSampleEdit}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              {sampleToDelete !== null
                ? "Êtes-vous sûr de vouloir supprimer cet échantillon ?"
                : `Êtes-vous sûr de vouloir supprimer ${selectedSamples.length} échantillon(s) ?`}
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SampleForm;
