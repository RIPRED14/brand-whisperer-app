
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from '@/contexts/AuthContext';

interface ChangeHistoryEntry {
  id: string;
  sampleId?: number;
  field?: string;
  oldValue?: string;
  newValue?: string;
  action: 'create' | 'update' | 'delete' | 'save' | 'lock_fields' | 'other';
  user: string;
  role: UserRole | 'guest';
  timestamp: string;
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [changeHistory, setChangeHistory] = useState<ChangeHistoryEntry[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('qc_change_history');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setChangeHistory(parsedHistory);
      } catch (error) {
        console.error('Error parsing change history:', error);
      }
    }
  }, []);

  const getActionDescription = (action: string): string => {
    switch (action) {
      case 'create': return 'Création échantillon';
      case 'update': return 'Modification';
      case 'delete': return 'Suppression';
      case 'save': return 'Sauvegarde';
      case 'lock_fields': return 'Verrouillage champs';
      default: return 'Autre action';
    }
  };

  const getFieldDescription = (field?: string): string => {
    if (!field) return '';
    
    const fieldMappings: Record<string, string> = {
      number: 'Numéro',
      product: 'Produit',
      readyTime: 'Heure de prêt',
      fabrication: 'Date de fabrication',
      dlc: 'DLC',
      smell: 'Odeur',
      texture: 'Texture',
      taste: 'Goût',
      aspect: 'Aspect',
      ph: 'pH',
      enterobacteria: 'Entérobactéries',
      yeastMold: 'Levures/Moisissures'
    };
    
    return fieldMappings[field] || field;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Historique des modifications" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Modifications des échantillons</h2>
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
          </div>
          
          {changeHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead>Date et heure</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Échantillon</TableHead>
                    <TableHead>Champ</TableHead>
                    <TableHead>Ancienne valeur</TableHead>
                    <TableHead>Nouvelle valeur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changeHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono">
                        {format(new Date(entry.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: fr })}
                      </TableCell>
                      <TableCell>{entry.user}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          entry.role === 'coordinator' ? 'bg-blue-100 text-blue-800' : 
                          entry.role === 'technician' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.role === 'coordinator' ? 'Coordinateur' : 
                           entry.role === 'technician' ? 'Technicien' : entry.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                          {getActionDescription(entry.action)}
                        </span>
                      </TableCell>
                      <TableCell>{entry.sampleId || '-'}</TableCell>
                      <TableCell>{getFieldDescription(entry.field)}</TableCell>
                      <TableCell>{entry.oldValue || '-'}</TableCell>
                      <TableCell>{entry.newValue || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              Aucun historique de modification disponible.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
