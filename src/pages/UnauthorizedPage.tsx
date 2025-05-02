
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertTitle>Accès non autorisé</AlertTitle>
          <AlertDescription>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col space-y-2">
          <Button onClick={() => navigate('/')} variant="default">
            Retour à l'accueil
          </Button>
          <Button onClick={() => navigate(-1)} variant="outline">
            Page précédente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
