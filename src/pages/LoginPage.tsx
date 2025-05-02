
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole, useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Check, Mail, Lock, Home } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('coordinator');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password, role);
      toast({
        title: "Connexion réussie",
        description: `Vous êtes connecté en tant que ${role === 'coordinator' ? 'coordinateur' : 'technicien'}.`,
      });
      navigate('/quality-control');
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Identifiants incorrects. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#0091CA] mb-2">MAISON COLLET</h1>
          <h2 className="text-lg font-medium">Contrôle Qualité Microbiologique</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="pl-10"
                placeholder="votre.email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rôle</Label>
            <RadioGroup 
              value={role} 
              onValueChange={value => setRole(value as UserRole)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent cursor-pointer">
                <RadioGroupItem value="coordinator" id="role-coordinator" />
                <Label htmlFor="role-coordinator" className="flex-grow cursor-pointer">Coordinateur</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent cursor-pointer">
                <RadioGroupItem value="technician" id="role-technician" />
                <Label htmlFor="role-technician" className="flex-grow cursor-pointer">Technicien</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[#0091CA] hover:bg-[#007AA8]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Connexion...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Se connecter
                </span>
              )}
            </Button>
            
            <Link to="/" className="flex items-center justify-center text-[#0091CA] hover:underline">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
