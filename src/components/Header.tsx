import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ClipboardList, FlaskConical, LogOut, User, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Contrôle Qualité Microbiologique" }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: <Home className="w-4 h-4 mr-2" />, label: 'Accueil', path: '/' },
    { icon: <ClipboardList className="w-4 h-4 mr-2" />, label: 'Contrôle Qualité', path: '/quality-control' },
    { icon: <FlaskConical className="w-4 h-4 mr-2" />, label: 'Historique', path: '/history' },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white py-3 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center transition-transform hover:scale-105 duration-200">
            <div className="md:mr-2">
              <div className="text-2xl font-bold tracking-tight">MAISON COLLET</div>
              <div className="text-xs text-blue-100 hidden md:block">Qualité & Excellence</div>
            </div>
          </Link>
          {title && (
            <>
              <div className="hidden md:block h-8 mx-4 w-px bg-white/30"></div>
              <h2 className="text-xl hidden md:block font-semibold">{title}</h2>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Menu pour écrans de taille moyenne et large */}
          <div className="hidden md:flex items-center gap-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => navigate(item.path)}
                variant="ghost"
                className="text-white hover:bg-white/20 hover:text-white transition-all duration-200"
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </div>
          
          {/* Menu mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/20">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="py-4">
                <div className="text-lg font-semibold mb-6">Menu</div>
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <Button
                      key={index}
                      onClick={() => navigate(item.path)}
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full h-10 w-10 p-0 bg-white/10 hover:bg-white/20 transition-colors">
                {user ? (
                  <div className="h-8 w-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold">
                    {user.name?.substring(0, 1).toUpperCase() || 'U'}
                  </div>
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user && (
                <DropdownMenuItem className="flex items-center gap-2 text-sm">
                  <div className="bg-blue-100 text-blue-600 h-8 w-8 rounded-full flex items-center justify-center">
                    {user.name?.substring(0, 1).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name || 'Utilisateur'}</span>
                    <span className="text-gray-500 text-xs capitalize">{user.role}</span>
                  </div>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/history')}>
                <ClipboardList className="mr-2 h-4 w-4" />
                <span>Historique</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
