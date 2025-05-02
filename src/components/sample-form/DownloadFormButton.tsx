import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sample } from '@/types/samples';

interface DownloadFormButtonProps {
  samples: Sample[];
  reportTitle?: string;
  site?: string;
  sampleDate?: string;
  reference?: string;
  batchNumbers?: {
    waterPeptone?: string;
    petriDishes?: string;
    VRBGGel?: string;
    YGCGel?: string;
  };
  className?: string;
  disabled?: boolean;
  label?: string;
  filename?: string;
}

const DownloadFormButton: React.FC<DownloadFormButtonProps> = ({
  samples,
  reportTitle = "Rapport d'échantillons",
  site = "",
  sampleDate = "",
  reference = "",
  batchNumbers = {},
  className = "border-[#0091CA] text-[#0091CA] hover:bg-blue-50",
  disabled = false,
  label = "Télécharger le rapport",
  filename = "rapport-echantillons"
}) => {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      if (samples.length === 0) {
        toast({
          title: "Aucun échantillon",
          description: "Il n'y a aucun échantillon à télécharger.",
          variant: "destructive"
        });
        return;
      }

      // Create the content for the file
      const content = {
        title: reportTitle,
        site,
        date: sampleDate,
        reference,
        batchNumbers,
        samples: samples.map(sample => ({
          id: sample.id,
          number: sample.number,
          program: sample.program || '',
          label: sample.label || '',
          nature: sample.nature || '',
          product: sample.product || '',
          readyTime: sample.readyTime || '',
          fabrication: sample.fabrication || '',
          dlc: sample.dlc || '',
          smell: sample.smell || '',
          texture: sample.texture || '',
          taste: sample.taste || '',
          aspect: sample.aspect || '',
          ph: sample.ph || '',
          enterobacteria: sample.enterobacteria || '',
          yeastMold: sample.yeastMold || '',
          labComment: sample.labComment || '',
          additionalDetails: sample.additionalDetails || '',
          temperature: sample.temperature || '',
          analysisDate: sample.analysisDate || '',
          storageTemp: sample.storageTemp || '',
          breakDate: sample.breakDate || '',
          status: sample.status
        })),
        exportDate: new Date().toISOString()
      };

      // Convert to JSON string
      const fileContent = JSON.stringify(content, null, 2);

      // Create blob and download link
      const blob = new Blob([fileContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set file name with date
      const date = new Date().toISOString().split('T')[0];
      link.download = `${filename}-${date}.json`;
      
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: "Le rapport a été téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement du fichier.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="outline"
      className={className}
      onClick={handleDownload}
      disabled={disabled || samples.length === 0}
    >
      <Download className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};

export default DownloadFormButton;
