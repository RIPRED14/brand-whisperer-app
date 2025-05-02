import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleQuickAccess = async (role: 'coordinator' | 'technician') => {
    await login(`demo.${role}@collet.fr`, 'demo123', role);
    navigate('/quality-control');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">MAISON COLLET</h1>
          <h2 className="text-xl text-gray-600 mb-8">Contrôle Qualité Microbiologique</h2>
        </div>

        <div className="space-y-4">
          <Button 
            className="w-full h-16 text-lg bg-blue-100 hover:bg-blue-200 text-blue-800"
            variant="outline"
            onClick={() => handleQuickAccess('coordinator')}
          >
            Accès Coordinateur
          </Button>
          
          <Button 
            className="w-full h-16 text-lg bg-green-100 hover:bg-green-200 text-green-800"
            variant="outline"
            onClick={() => handleQuickAccess('technician')}
          >
            Accès Technicien
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Cette page permet un accès rapide pour tester l'application. <br/>
          Pour un accès sécurisé, utilisez la <a href="/login" className="text-[#0091CA] hover:underline">page de connexion</a>.
        </p>
      </div>
    </div>
  );
};

export default Index;
