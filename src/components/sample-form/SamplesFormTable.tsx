import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sample } from '@/types/samples';
import { Edit, Copy, Trash2, MoreVertical } from 'lucide-react';

interface SamplesFormTableProps {
  samples: Sample[];
  selectedSamples: number[];
  toggleSelectSample: (id: number) => void;
  toggleSelectAll: () => void;
  onEditSample?: (id: number) => void;
  onCopySample?: (id: number) => void;
  onDeleteSample?: (id: number) => void;
}

const SamplesFormTable = ({ 
  samples,
  selectedSamples,
  toggleSelectSample,
  toggleSelectAll,
  onEditSample,
  onCopySample,
  onDeleteSample
}: SamplesFormTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-12">
            <Checkbox 
              checked={selectedSamples.length === samples.length && samples.length > 0}
              onCheckedChange={toggleSelectAll}
              aria-label="Sélectionner tous les échantillons"
            />
          </TableHead>
          <TableHead>Programme*</TableHead>
          <TableHead>Numéro d'étiquette*</TableHead>
          <TableHead>Nature de l'échantillon*</TableHead>
          <TableHead>Commentaire laboratoire</TableHead>
          <TableHead>Précisions complémentaires</TableHead>
          <TableHead>T(°C) produit</TableHead>
          <TableHead>Date prévue de mise en analyse</TableHead>
          <TableHead>T(°C) de conservation</TableHead>
          <TableHead>Date de rupture</TableHead>
          <TableHead className="w-20">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {samples.length > 0 ? (
          samples.map(sample => (
            <TableRow key={sample.id} className={selectedSamples.includes(sample.id) ? "bg-muted/30" : ""}>
              <TableCell className="p-2">
                <Checkbox 
                  checked={selectedSamples.includes(sample.id)}
                  onCheckedChange={() => toggleSelectSample(sample.id)}
                  aria-label={`Sélectionner l'échantillon ${sample.id}`}
                />
              </TableCell>
              <TableCell>{sample.program || '-'}</TableCell>
              <TableCell>{sample.label || '-'}</TableCell>
              <TableCell>{sample.nature || '-'}</TableCell>
              <TableCell>{sample.labComment || '-'}</TableCell>
              <TableCell>{sample.additionalDetails || '-'}</TableCell>
              <TableCell>{sample.temperature || '-'}</TableCell>
              <TableCell>{sample.analysisDate || '-'}</TableCell>
              <TableCell>{sample.storageTemp || '-'}</TableCell>
              <TableCell>{sample.breakDate || '-'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Ouvrir le menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEditSample && onEditSample(sample.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopySample && onCopySample(sample.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive" 
                      onClick={() => onDeleteSample && onDeleteSample(sample.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={11} className="text-center py-4 text-muted-foreground">
              Aucun échantillon. Cliquez sur "Ajouter échantillon" pour commencer.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SamplesFormTable;
