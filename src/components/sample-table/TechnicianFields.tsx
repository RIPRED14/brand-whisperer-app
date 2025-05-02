import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell } from '@/components/ui/table';
import { Check, X, AlertTriangle, AlertCircle } from 'lucide-react';
import { Sample } from '@/types/samples';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TechnicianFieldsProps {
  sample: Sample;
  toggleConformity: (id: string, field: 'smell' | 'texture' | 'taste' | 'aspect') => void;
  updateSample: (id: string, field: keyof Sample, value: string) => void;
  isTechnician: boolean;
  alertStatus: string | null;
}

export const TechnicianFields: React.FC<TechnicianFieldsProps> = ({
  sample,
  toggleConformity,
  updateSample,
  isTechnician,
  alertStatus
}) => {
  const renderConformityButton = (field: 'smell' | 'texture' | 'taste' | 'aspect') => (
    <Button 
      onClick={() => isTechnician && toggleConformity(sample.id.toString(), field)}
      className={`w-full h-8 ${sample[field] === 'N' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white p-0`}
      disabled={!isTechnician}
    >
      {sample[field] === 'N' ? (
        <Check className="w-3 h-3 mr-1" />
      ) : (
        <X className="w-3 h-3 mr-1" />
      )}
      <span className="text-xs">{sample[field]}</span>
    </Button>
  );

  return (
    <>
      <TableCell className="px-1 py-1 bg-green-50 w-[70px] border-r border-gray-200">{renderConformityButton('smell')}</TableCell>
      <TableCell className="px-1 py-1 bg-green-50 w-[70px] border-r border-gray-200">{renderConformityButton('texture')}</TableCell>
      <TableCell className="px-1 py-1 bg-green-50 w-[70px] border-r border-gray-200">{renderConformityButton('taste')}</TableCell>
      <TableCell className="px-1 py-1 bg-green-50 w-[70px] border-r border-gray-200">{renderConformityButton('aspect')}</TableCell>
      <TableCell className="px-1 py-1 bg-green-50 w-[50px] border-r border-gray-200">
        <Input 
          value={sample.ph} 
          onChange={(e) => updateSample(sample.id.toString(), 'ph', e.target.value)} 
          className="w-full h-8 text-xs px-2"
          type="number"
          step="0.01"
          min="0"
          max="14"
          readOnly={!isTechnician}
          disabled={!isTechnician}
        />
      </TableCell>
      <TableCell className={`px-1 py-1 bg-green-50 w-[90px] border-r border-gray-200 ${alertStatus === 'warning' ? 'bg-yellow-100' : ''}`}>
        <div className="flex items-center">
          <Input 
            value={sample.enterobacteria} 
            onChange={(e) => updateSample(sample.id.toString(), 'enterobacteria', e.target.value)} 
            className={`w-full h-8 text-xs px-2 ${alertStatus === 'warning' ? 'border-yellow-400' : ''}`}
            readOnly={!isTechnician}
            disabled={!isTechnician}
          />
          {alertStatus === 'warning' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="ml-1 h-4 w-4 text-yellow-500 flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="text-xs p-2">
                  <p>Analyse des entérobactéries requise (24h écoulées)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
      <TableCell className={`px-1 py-1 bg-green-50 w-[90px] ${alertStatus === 'urgent' ? 'bg-red-100' : ''}`}>
        <div className="flex items-center">
          <Input 
            value={sample.yeastMold} 
            onChange={(e) => updateSample(sample.id.toString(), 'yeastMold', e.target.value)} 
            className={`w-full h-8 text-xs px-2 ${alertStatus === 'urgent' ? 'border-red-400' : ''}`}
            readOnly={!isTechnician}
            disabled={!isTechnician}
          />
          {alertStatus === 'urgent' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="ml-1 h-4 w-4 text-red-500 flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="text-xs p-2">
                  <p>URGENT: Analyse des levures/moisissures requise (5 jours écoulés)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
    </>
  );
};
