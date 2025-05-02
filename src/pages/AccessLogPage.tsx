
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

interface AccessLogEntry {
  userId: string;
  email: string;
  role: UserRole | string;
  timestamp: string;
  action: string;
}

const AccessLogPage = () => {
  const navigate = useNavigate();
  const [accessLog, setAccessLog] = useState<AccessLogEntry[]>([]);

  useEffect(() => {
    const storedLog = localStorage.getItem('qc_access_log');
    if (storedLog) {
      try {
        const parsedLog = JSON.parse(storedLog);
        setAccessLog(parsedLog);
      } catch (error) {
        console.error('Error parsing access log:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header title="Journal des accès" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Historique des connexions</h2>
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
          </div>
          
          {accessLog.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead>Date et heure</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessLog.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">
                        {format(new Date(entry.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: fr })}
                      </TableCell>
                      <TableCell>{entry.email}</TableCell>
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
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          entry.action === 'login' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {entry.action === 'login' ? 'Connexion' : 'Déconnexion'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              Aucune entrée dans le journal des accès.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AccessLogPage;
