import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sample, SupabaseSample } from '@/types/samples';

interface UseSamplesProps {
  savedSamples?: Sample[];
  brand?: string;
}

export const useSamples = ({ savedSamples = [], brand = '' }: UseSamplesProps) => {
  const [samples, setSamples] = useState<Sample[]>(savedSamples);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si des savedSamples sont fournis, on les utilise directement
    if (savedSamples && savedSamples.length > 0) {
      setSamples(savedSamples);
      return;
    }
    
    // Sinon, on charge depuis Supabase
    const loadSamples = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('samples')
          .select('*')
          .eq('brand', brand)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const mappedSamples: Sample[] = data.map(sample => {
            let status = sample.status;
            if (status === 'inProgress') {
              status = 'in_progress';
            }
            
            return {
              id: sample.id,
              number: sample.number || '',
              product: sample.product || '',
              readyTime: sample.ready_time || '',
              fabrication: sample.fabrication || '',
              dlc: sample.dlc || '',
              smell: sample.smell || '',
              texture: sample.texture || '',
              taste: sample.taste || '',
              aspect: sample.aspect || '',
              ph: sample.ph || '',
              enterobacteria: sample.enterobacteria || '',
              yeastMold: sample.yeast_mold || '',
              createdAt: sample.created_at || '',
              modifiedAt: sample.modified_at || '',
              modifiedBy: sample.modified_by || '',
              status: status as 'pending' | 'in_progress' | 'completed' | 'rejected',
              assignedTo: sample.assigned_to || '',
              reportTitle: sample.report_title || '',
              brand: sample.brand || ''
            };
          });
          
          setSamples(mappedSamples);
        }
      } catch (error) {
        console.error('Error fetching samples:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les échantillons",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    // Ne charger depuis Supabase que si brand est fourni
    if (brand) {
      loadSamples();
    }
  }, [brand, savedSamples]);

  const addSample = async (defaultProduct?: string) => {
    const currentDate = new Date().toISOString();
    const sampleNumber = (samples.length + 1).toString();
    const newSampleBase = {
      number: sampleNumber,
      product: defaultProduct || '',
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
      status: 'pending' as const,
      brand: brand
    };

    try {
      const { data, error } = await supabase
        .from('samples')
        .insert([{
          number: newSampleBase.number,
          product: newSampleBase.product,
          ready_time: newSampleBase.readyTime,
          fabrication: newSampleBase.fabrication,
          dlc: newSampleBase.dlc,
          smell: newSampleBase.smell,
          texture: newSampleBase.texture,
          taste: newSampleBase.taste,
          aspect: newSampleBase.aspect,
          ph: newSampleBase.ph,
          enterobacteria: newSampleBase.enterobacteria,
          yeast_mold: newSampleBase.yeastMold,
          brand: newSampleBase.brand
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newSample: Sample = {
          id: data.id,
          number: data.number,
          product: data.product,
          readyTime: data.ready_time,
          fabrication: data.fabrication,
          dlc: data.dlc,
          smell: data.smell,
          texture: data.texture,
          taste: data.taste,
          aspect: data.aspect,
          ph: data.ph || '',
          enterobacteria: data.enterobacteria || '',
          yeastMold: data.yeast_mold || '',
          createdAt: data.created_at,
          modifiedAt: data.modified_at,
          modifiedBy: data.modified_by || undefined,
          status: data.status as 'pending' | 'in_progress' | 'completed' | 'rejected',
          assignedTo: data.assigned_to || undefined,
          reportTitle: data.report_title || undefined,
          brand: data.brand || undefined
        };
        
        setSamples(prev => [newSample, ...prev]);
      }

      await addChangeHistory({
        action: 'create',
        user: 'Utilisateur',
        role: 'system'
      });

    } catch (error) {
      console.error('Error adding sample:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'échantillon",
        variant: "destructive"
      });
    }
  };

  const updateSample = async (id: string, field: keyof Sample, value: string) => {
    try {
      const sample = samples.find(s => s.id === id);
      if (!sample) return;

      const oldValue = sample[field] as string;
      
      const fieldMap: Record<string, string> = {
        readyTime: 'ready_time',
        yeastMold: 'yeast_mold',
        createdAt: 'created_at',
        modifiedAt: 'modified_at',
        modifiedBy: 'modified_by',
        id: 'id',
        number: 'number',
        product: 'product', 
        fabrication: 'fabrication',
        dlc: 'dlc',
        smell: 'smell',
        texture: 'texture',
        taste: 'taste',
        aspect: 'aspect',
        ph: 'ph',
        enterobacteria: 'enterobacteria',
        status: 'status',
        assignedTo: 'assigned_to',
        reportTitle: 'report_title',
        brand: 'brand',
        program: 'program',
        label: 'label',
        nature: 'nature',
        labComment: 'lab_comment'
      };

      const updateData: Record<string, any> = {
        [fieldMap[field] || field]: value,
        modified_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('samples')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSamples(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

      // Vérifier si le champ modifié doit déclencher une notification
      const notificationFields = ['smell', 'texture', 'taste', 'aspect', 'ph', 'enterobacteria', 'yeastMold'];
      if (notificationFields.includes(field)) {
        // Créer une notification pour informer les coordinateurs
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            message: `Donnée mise à jour: ${field} pour échantillon ${sample.number}`,
            type: 'info',
            sample_number: sample.number,
            read: false,
            for_role: 'coordinator',
            sample_id: id
          });

        if (notifError) {
          console.warn('Erreur lors de la création de la notification:', notifError);
        }
      }

      await addChangeHistory({
        action: 'update',
        user: sample.modifiedBy || 'Utilisateur',
        role: 'system',
        field: field.toString(),
        oldValue,
        newValue: value
      });

    } catch (error) {
      console.error('Error updating sample:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'échantillon",
        variant: "destructive"
      });
    }
  };

  const toggleConformity = async (id: string, field: 'smell' | 'texture' | 'taste' | 'aspect') => {
    try {
      const sample = samples.find(s => s.id === id);
      if (!sample) return;

      const oldValue = sample[field];
      const newValue = sample[field] === 'N' ? 'NC' : 'N';

      const { error } = await supabase
        .from('samples')
        .update({ [field]: newValue })
        .eq('id', id);

      if (error) throw error;

      setSamples(prev => prev.map(s => 
        s.id === id ? { ...s, [field]: newValue } : s
      ));

      await addChangeHistory({
        action: 'update',
        user: 'Utilisateur',
        role: 'system',
        field: field,
        oldValue,
        newValue
      });

    } catch (error) {
      console.error('Error toggling conformity:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la conformité",
        variant: "destructive"
      });
    }
  };

  const addChangeHistory = async (data: {
    action: string;
    user: string;
    role: string;
    field?: string;
    oldValue?: string;
    newValue?: string;
  }) => {
    try {
      // Ajoutons un timestamp unique pour éviter les conflits
      const { error } = await supabase
        .from('change_history')
        .insert({
          user_name: data.user,
          action: data.action,
          field: data.field || null,
          old_value: data.oldValue || null,
          new_value: data.newValue || null,
          role: data.role,
          timestamp: new Date().toISOString() // Assure que chaque entrée a un timestamp unique
        });

      if (error) {
        console.error('Error adding change history:', error);
        // Ne pas renvoyer d'erreur pour éviter d'interrompre le flux principal
      }
    } catch (error) {
      console.error('Error adding change history:', error);
      // Ne pas renvoyer d'erreur pour éviter d'interrompre le flux principal
    }
  };

  const validateSamples = () => {
    const isValidSamples = samples.every(sample => 
      sample.number && 
      sample.product && 
      sample.readyTime && 
      sample.fabrication
    );

    if (!isValidSamples) {
      toast({
        title: "Données incomplètes",
        description: "Veuillez remplir au moins les 4 premières colonnes pour chaque échantillon.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const sendToTechnician = async (sampleIds: string[] = []) => {
    try {
      const samplesToUpdate = sampleIds.length > 0 
        ? samples.filter(sample => sampleIds.includes(sample.id))
        : samples;
      
      if (samplesToUpdate.length === 0) {
        toast({
          title: "Aucun échantillon",
          description: "Aucun échantillon à envoyer au technicien.",
          variant: "destructive"
        });
        return;
      }
      
      const updatedSamples = samples.map(sample => {
        if (samplesToUpdate.some(s => s.id === sample.id)) {
          return {
            ...sample,
            status: 'in_progress',
            modifiedAt: new Date().toISOString()
          };
        }
        return sample;
      });
      
      // Mettre à jour chaque échantillon dans la base de données
      for (const sample of samplesToUpdate) {
        const { error } = await supabase
          .from('samples')
          .update({
            status: 'in_progress',
            modified_at: new Date().toISOString()
          })
          .eq('id', sample.id);
          
        if (error) throw error;
      }
      
      // Créer une notification pour les techniciens
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          message: `${samplesToUpdate.length} échantillon(s) prêt(s) pour analyse technique`,
          type: 'info',
          sample_number: samplesToUpdate.map(s => s.number).join(', '),
          read: false,
          for_role: 'technician', // Notification spécifique pour les techniciens
          site: brand // Utiliser le brand comme site pour la notification
        });
        
      if (notifError) throw notifError;
      
      setSamples(updatedSamples);
      
      toast({
        title: "Envoyé au technicien",
        description: `${samplesToUpdate.length} échantillon(s) envoyé(s) au technicien pour analyse.`
      });
      
      addChangeHistory({
        action: 'send_to_technician',
        user: 'Coordinator',
        role: 'coordinator'
      });
      
      return true;
    } catch (error) {
      console.error('Error sending samples to technician:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer les échantillons au technicien",
        variant: "destructive"
      });
      return false;
    }
  };

  // Fonction pour supprimer un échantillon
  const deleteSample = async (id: string) => {
    try {
      const sample = samples.find(s => s.id === id);
      if (!sample) return false;

      // Supprimer l'échantillon de la base de données
      const { error } = await supabase
        .from('samples')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Mettre à jour l'état local
      setSamples(prev => prev.filter(s => s.id !== id));

      // Ajouter à l'historique des modifications
      await addChangeHistory({
        action: 'delete',
        user: 'Utilisateur',
        role: 'system',
        field: 'all',
        oldValue: sample.number,
        newValue: ''
      });

      toast({
        title: "Échantillon supprimé",
        description: `L'échantillon ${sample.number} a été supprimé avec succès.`
      });

      return true;
    } catch (error) {
      console.error('Error deleting sample:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'échantillon",
        variant: "destructive"
      });
      return false;
    }
  };

  // Fonction pour réinitialiser les échantillons
  const resetSamples = () => {
    setSamples([]);
  };

  return {
    samples,
    addSample,
    updateSample,
    toggleConformity,
    validateSamples,
    addChangeHistory,
    sendToTechnician,
    deleteSample,
    resetSamples,
    loading
  };
};
