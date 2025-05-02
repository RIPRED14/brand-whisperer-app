import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Droplets, Pipette, FlaskConical, Beaker, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BatchNumbersProps {
  waterPeptone: string;
  setWaterPeptone: (value: string) => void;
  petriDishes: string;
  setPetriDishes: (value: string) => void;
  VRBGGel: string;
  setVRBGGel: (value: string) => void;
  YGCGel: string;
  setYGCGel: (value: string) => void;
}

const BatchNumbers = ({
  waterPeptone,
  setWaterPeptone,
  petriDishes,
  setPetriDishes,
  VRBGGel,
  setVRBGGel,
  YGCGel,
  setYGCGel
}: BatchNumbersProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <Label htmlFor="waterPeptone" className="font-medium text-gray-700 block">Eau péptonée</Label>
                <span className="text-xs text-gray-500">Diluant pour échantillons</span>
              </div>
            </div>
            <div className="relative">
              <Input 
                id="waterPeptone" 
                value={waterPeptone} 
                onChange={(e) => setWaterPeptone(e.target.value)} 
                placeholder="Entrez le numéro de lot"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-3 transition-all duration-200"
              />
              {!waterPeptone && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ce champ est recommandé</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <Label htmlFor="petriDishes" className="font-medium text-gray-700 block">Boîtes de Petri</Label>
                <span className="text-xs text-gray-500">Culture de micro-organismes</span>
              </div>
            </div>
            <div className="relative">
              <Input 
                id="petriDishes" 
                value={petriDishes} 
                onChange={(e) => setPetriDishes(e.target.value)} 
                placeholder="Entrez le numéro de lot"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500 pl-3 transition-all duration-200"
              />
              {!petriDishes && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ce champ est recommandé</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                <Beaker className="w-5 h-5" />
              </div>
              <div>
                <Label htmlFor="VRBGGel" className="font-medium text-gray-700 block">Gélose VRBG</Label>
                <span className="text-xs text-gray-500">Détection des entérobactéries</span>
              </div>
            </div>
            <div className="relative">
              <Input 
                id="VRBGGel" 
                value={VRBGGel} 
                onChange={(e) => setVRBGGel(e.target.value)} 
                placeholder="Entrez le numéro de lot"
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 pl-3 transition-all duration-200"
              />
              {!VRBGGel && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ce champ est recommandé</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
                <Pipette className="w-5 h-5" />
              </div>
              <div>
                <Label htmlFor="YGCGel" className="font-medium text-gray-700 block">Gélose YGC</Label>
                <span className="text-xs text-gray-500">Détection des levures et moisissures</span>
              </div>
            </div>
            <div className="relative">
              <Input 
                id="YGCGel" 
                value={YGCGel} 
                onChange={(e) => setYGCGel(e.target.value)} 
                placeholder="Entrez le numéro de lot"
                className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 pl-3 transition-all duration-200"
              />
              {!YGCGel && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ce champ est recommandé</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
          <p>Tous les champs sont facultatifs mais recommandés pour assurer la traçabilité.</p>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BatchNumbers;
