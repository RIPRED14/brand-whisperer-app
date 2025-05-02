import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Sample } from '@/types/samples';

interface SampleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sample: Sample | null;
  onSave: (updatedSample: Sample) => void;
}

const SampleFormDialog: React.FC<SampleFormDialogProps> = ({
  open,
  onOpenChange,
  sample,
  onSave
}) => {
  const [formState, setFormState] = useState<Sample | null>(null);
  const [analysisDate, setAnalysisDate] = useState<Date | undefined>(undefined);
  const [breakDate, setBreakDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (sample) {
      setFormState({ ...sample });
      
      if (sample.analysisDate) {
        setAnalysisDate(new Date(sample.analysisDate));
      }
      
      if (sample.breakDate) {
        setBreakDate(new Date(sample.breakDate));
      }
    }
  }, [sample]);

  if (!formState) return null;

  const handleInputChange = (field: keyof Sample, value: string) => {
    setFormState(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleSave = () => {
    if (!formState) return;
    
    const updatedSample = {
      ...formState,
      analysisDate: analysisDate ? format(analysisDate, 'yyyy-MM-dd') : '',
      breakDate: breakDate ? format(breakDate, 'yyyy-MM-dd') : ''
    };
    
    onSave(updatedSample);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'échantillon</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">Programme*</Label>
              <Input
                id="program"
                value={formState.program}
                onChange={e => handleInputChange('program', e.target.value)}
                placeholder="Référence du programme"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="label">Numéro d'étiquette*</Label>
              <Input
                id="label"
                value={formState.label}
                onChange={e => handleInputChange('label', e.target.value)}
                placeholder="N° d'étiquette"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nature">Nature de l'échantillon*</Label>
              <Input
                id="nature"
                value={formState.nature}
                onChange={e => handleInputChange('nature', e.target.value)}
                placeholder="Type d'échantillon"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="temperature">T(°C) produit</Label>
              <Input
                id="temperature"
                value={formState.temperature}
                onChange={e => handleInputChange('temperature', e.target.value)}
                placeholder="Ex: 4.5"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="labComment">Commentaire laboratoire</Label>
              <Input
                id="labComment"
                value={formState.labComment}
                onChange={e => handleInputChange('labComment', e.target.value)}
                placeholder="Commentaires laboratoire"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storageTemp">T(°C) de conservation</Label>
              <Input
                id="storageTemp"
                value={formState.storageTemp}
                onChange={e => handleInputChange('storageTemp', e.target.value)}
                placeholder="Ex: 2.0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date prévue de mise en analyse</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !analysisDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {analysisDate ? (
                      format(analysisDate, 'd MMMM yyyy', { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={analysisDate}
                    onSelect={setAnalysisDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Date de rupture</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !breakDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {breakDate ? (
                      format(breakDate, 'd MMMM yyyy', { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={breakDate}
                    onSelect={setBreakDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="additionalDetails">Précisions complémentaires</Label>
            <Input
              id="additionalDetails"
              value={formState.additionalDetails}
              onChange={e => handleInputChange('additionalDetails', e.target.value)}
              placeholder="Autres informations"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SampleFormDialog; 