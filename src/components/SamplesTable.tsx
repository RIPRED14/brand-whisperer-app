import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import SampleTableRow from './SampleTableRow';
import { UserRole } from '@/contexts/AuthContext';
import { Sample } from '@/types/samples';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, FlaskConical, Check, Trash2 } from 'lucide-react';

interface SamplesTableProps {
  samples: Sample[];
  isGrandFrais: boolean;
  GF_PRODUCTS: string[];
  updateSample: (id: string, field: keyof Sample, value: string) => void;
  toggleConformity: (id: string, field: 'smell' | 'texture' | 'taste' | 'aspect') => void;
  isLocked?: boolean;
  userRole: UserRole | 'guest';
  selectedSamples?: number[];
  onToggleSelectSample?: (id: number) => void;
  onDeleteSample?: (id: number) => void;
}

const SamplesTable: React.FC<SamplesTableProps> = ({
  samples,
  isGrandFrais,
  GF_PRODUCTS,
  updateSample,
  toggleConformity,
  isLocked = false,
  userRole,
  selectedSamples = [],
  onToggleSelectSample,
  onDeleteSample
}) => {
  const isCoordinator = userRole === 'coordinator';
  const isTechnician = userRole === 'technician';
  const showSelectionColumn = isCoordinator && !!onToggleSelectSample;

  const handleSelectAllSamples = () => {
    if (!onToggleSelectSample) return;
    
    // Si tous les échantillons sont sélectionnés, on désélectionne tout
    if (samples.length > 0 && samples.every(sample => selectedSamples.includes(sample.id))) {
      samples.forEach(sample => onToggleSelectSample(sample.id));
    } else {
      // Sinon, on sélectionne tous les échantillons non sélectionnés
      samples.forEach(sample => {
        if (!selectedSamples.includes(sample.id)) {
          onToggleSelectSample(sample.id);
        }
      });
    }
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm">
      <div className="w-full rounded-md">
        <Table className="w-full table-fixed border-collapse">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-500 to-blue-600 text-white animate-fadeIn">
              {/* Selection column */}
              {showSelectionColumn && (
                <TableHead className="text-white w-[35px] bg-blue-600 text-white border-r border-blue-400 px-0 py-2">
                  <div className="flex items-center justify-center">
                    <Checkbox 
                      checked={samples.length > 0 && samples.every(sample => selectedSamples.includes(sample.id))}
                      onCheckedChange={handleSelectAllSamples}
                      aria-label="Sélectionner tous les échantillons"
                      className="h-4 w-4 border-white text-white data-[state=checked]:bg-white data-[state=checked]:text-blue-600 transition-all duration-200"
                    />
                  </div>
                </TableHead>
              )}
              
              {/* Coordinator fields */}
              <TableHead className="text-white py-2 px-2 w-[65px] bg-blue-500 text-white border-r border-blue-400 font-medium text-xs">N° Éch.</TableHead>
              <TableHead className="text-white py-2 px-2 w-[120px] bg-blue-500 text-white border-r border-blue-400 font-medium text-xs">Produit</TableHead>
              <TableHead className="text-white py-2 px-2 w-[80px] bg-blue-500 text-white border-r border-blue-400 font-medium text-xs">Heure</TableHead>
              <TableHead className="text-white py-2 px-2 w-[100px] bg-blue-500 text-white border-r border-blue-400 font-medium text-xs">Fabric.</TableHead>
              <TableHead className="text-white py-2 px-2 w-[100px] bg-blue-500 text-white border-r border-blue-400 font-medium text-xs">DLC</TableHead>
              
              {/* Technician fields */}
              <TableHead className="text-white py-2 px-2 w-[70px] bg-green-600 text-white border-r border-green-500 font-medium text-xs">Odeur</TableHead>
              <TableHead className="text-white py-2 px-2 w-[70px] bg-green-600 text-white border-r border-green-500 font-medium text-xs">Texture</TableHead>
              <TableHead className="text-white py-2 px-2 w-[70px] bg-green-600 text-white border-r border-green-500 font-medium text-xs">Goût</TableHead>
              <TableHead className="text-white py-2 px-2 w-[70px] bg-green-600 text-white border-r border-green-500 font-medium text-xs">Aspect</TableHead>
              <TableHead className="text-white py-2 px-2 w-[50px] bg-green-600 text-white border-r border-green-500 font-medium text-xs">pH</TableHead>
              <TableHead className="text-white py-2 px-2 w-[90px] bg-green-600 text-white border-r border-green-500 font-medium text-xs">Entéro.</TableHead>
              <TableHead className="text-white py-2 px-2 w-[90px] bg-green-600 text-white font-medium text-xs">Lev/Mois</TableHead>
              {isCoordinator && !isLocked && (
                <>
                  <TableHead className="text-white py-2 px-2 w-[120px] bg-gray-600 text-white font-medium text-xs border-r border-gray-500">Comment.</TableHead>
                  <TableHead className="text-white py-2 px-2 w-[45px] bg-gray-600 text-white font-medium text-xs"></TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {samples.length > 0 ? (
              samples.map((sample, index) => (
                <SampleTableRow
                  key={sample.id}
                  sample={sample}
                  isGrandFrais={isGrandFrais}
                  GF_PRODUCTS={GF_PRODUCTS}
                  updateSample={updateSample}
                  toggleConformity={toggleConformity}
                  isLocked={isLocked}
                  userRole={userRole}
                  isSelected={selectedSamples.includes(sample.id)}
                  onToggleSelect={onToggleSelectSample}
                  showSelectionColumn={showSelectionColumn}
                  onDeleteSample={onDeleteSample}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-fadeIn"
                />
              ))
            ) : (
              <TableRow className="hover:bg-gray-50">
                <TableHead colSpan={showSelectionColumn ? 14 : 13} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-4 py-12 animate-fadeIn">
                    <div className="rounded-full bg-gray-50 p-4 mb-2 shadow-inner">
                      <div className="rounded-full bg-blue-50 p-6 animate-pulse transition-all duration-300">
                        <FlaskConical className="h-12 w-12 text-blue-500" />
                      </div>
                    </div>
                    <div className="text-center max-w-md space-y-2">
                      <h3 className="text-lg font-medium text-gray-700">Aucun échantillon disponible</h3>
                      <p className="text-sm text-gray-500">
                        {isCoordinator && !isLocked 
                          ? "Vous pouvez commencer par ajouter un nouvel échantillon en utilisant le bouton ci-dessous."
                          : "Aucun échantillon n'a été ajouté à ce rapport pour le moment."}
                      </p>
                      {isCoordinator && !isLocked && (
                        <Button 
                          onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow hover:shadow-md transition-all duration-200"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter un échantillon
                        </Button>
                      )}
                    </div>
                  </div>
                </TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {samples.length > 0 && (
        <div className="mt-2 px-3 py-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3 mr-1" />
              {samples.filter(s => s.status === 'completed').length} complétés
            </span>
            <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
              {samples.filter(s => s.status !== 'completed').length} en attente
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SamplesTable;
