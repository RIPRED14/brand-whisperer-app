import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Plus, 
  History
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SampleActionButtonsProps {
  onSave: () => void;
  onAdd?: () => void;
  showAddButton?: boolean;
  selectedSamples?: number;
}

const SampleActionButtons: React.FC<SampleActionButtonsProps> = ({
  onSave,
  onAdd,
  showAddButton = false,
  selectedSamples = 0
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCoordinator = user?.role === 'coordinator';

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-wrap gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onSave}
              className="bg-blue-600 hover:bg-blue-700 shadow-sm transition-all duration-200 font-medium"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enregistrer les modifications</p>
          </TooltipContent>
        </Tooltip>
        
        {showAddButton && onAdd && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onAdd} 
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 shadow-sm transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un échantillon
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ajouter un nouvel échantillon</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => navigate('/history')}
              variant="ghost"
              className="hover:bg-gray-100 transition-all duration-200"
            >
              <History className="w-4 h-4 mr-2" />
              Historique
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voir l'historique des modifications</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default SampleActionButtons;
