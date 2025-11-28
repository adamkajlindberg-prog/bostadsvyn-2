import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Settings, Phone, User, LogOut, Plus, Building2, Briefcase, MapPin, Palmtree, Users, TrendingUp, Target, FileText, Shield, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useChatSidebar } from '@/hooks/useChatSidebar';
import Logo from '@/components/Logo';

const Navigation = () => {
  const {
    user,
    signOut,
    profile,
    userRoles
  } = useAuth();
  const { isExpanded } = useChatSidebar();
  const navigate = useNavigate();
  
  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/login');
    }
  };
  
  const handleBrokerLogin = () => {
    navigate('/maklare-login');
  };
  
  const getUserInitials = () => {
    if (userRoles.includes('company') && profile?.company_name) {
      return profile.company_name.substring(0, 2).toUpperCase();
    }
    if (profile?.full_name) {
      return profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'AN';
  };
  
  // Regular users (non-brokers) get pro badge for AI tools
  const showProBadge = !userRoles.includes('broker') && (userRoles.includes('admin'));
  
  return (
    <nav className={`sticky top-0 z-30 bg-background border-b border-border transition-all duration-300 ${isExpanded ? 'ml-14' : 'ml-14'}`} aria-label="Huvudnavigering">
      <div className="pl-4 pr-0 max-w-full">
        <div className="flex items-center h-10 flex-nowrap">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 flex-shrink-0" 
            aria-label="Bostadsvyn startsida"
          >
            <div className="bg-primary ring-2 ring-primary-light rounded-lg p-1 shadow-lg">
              <Logo className="h-7 w-7 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-foreground whitespace-nowrap">Bostadsvyn.se</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 ml-3" role="menubar" aria-label="Huvudmeny">
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary text-sm" asChild>
              <Link to="/salj" role="menuitem">
                <Plus className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Sälj
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary text-sm" asChild>
              <Link to="/hyresbostader" role="menuitem">
                <Home className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Hyra
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary text-sm" asChild>
              <Link to="/nyproduktion" role="menuitem">
                <Building2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Nyproduktion
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary text-sm" asChild>
              <Link to="/fritid-tomter" role="menuitem">
                <Palmtree className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Fritid & Tomter
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary text-sm" asChild>
              <Link to="/kommersiellt" role="menuitem">
                <Briefcase className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Kommersiellt
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary text-sm" asChild>
              <Link to="/ai-tools" role="menuitem">
                <Sparkles className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                AI-verktyg
                {showProBadge && <Badge className="ml-1 bg-premium text-premium-foreground text-xs" aria-label="Premium funktion">Pro</Badge>}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary text-sm" asChild>
              <Link to="/om-oss" role="menuitem">
                Om oss
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary text-sm" asChild>
              <Link to="/fragor-svar" role="menuitem">
                <HelpCircle className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Frågor & svar
              </Link>
            </Button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 ml-auto mr-0">
            {!user && (
              <Button 
                variant="outline"
                size="sm"
                onClick={handleBrokerLogin} 
                className="hidden sm:flex text-sm"
                aria-label="Logga in som fastighetsmäklare"
              >
                <Building2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Mäklare
              </Button>
            )}
            {user ? (
              <>
                {userRoles.includes('broker') && (
                  <Button 
                    size="sm"
                    className="bg-success hover:bg-success-light hidden sm:flex text-sm" 
                    onClick={() => window.location.href = '/mäklarportal'}
                    aria-label="Öppna mäklarportalen"
                  >
                    <Building2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Mäklarportalen
                  </Button>
                )}
                
                {!userRoles.includes('broker') && (
                  <Button 
                    size="sm"
                    className="hidden sm:flex text-sm bg-primary hover:bg-primary-deep text-primary-foreground" 
                    onClick={() => navigate('/dashboard')}
                    aria-label="Gå till mina sidor"
                  >
                    <User className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Mina sidor
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-7 w-7 rounded-full"
                      aria-label={`Användarmeny för ${profile?.full_name || user.email}`}
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">
                          {userRoles.includes('company') && profile?.company_name 
                            ? profile.company_name 
                            : profile?.full_name || 'Användare'}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <div className="flex gap-1 mt-1" role="list" aria-label="Användarroller">
                          {userRoles
                            .filter(role => !(role === 'buyer' && userRoles.includes('company')))
                            .map(role => (
                              <Badge key={role} variant="secondary" className="text-xs" role="listitem">
                                {role === 'buyer' ? 'Privatperson' : role === 'company' ? 'Företag' : role === 'seller' ? 'Säljare' : role === 'broker' ? 'Mäklare' : role === 'admin' ? 'Admin' : role}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {!userRoles.includes('broker') && (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">
                          <User className="mr-2 h-4 w-4" aria-hidden="true" />
                          <span>Mina sidor</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/support">
                        <HelpCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                        <span>Support & Hjälp</span>
                      </Link>
                    </DropdownMenuItem>
                    {userRoles.includes('admin') && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/moderation">
                          <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
                          <span>Moderering</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleAuthAction}>
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      <span>Logga ut</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                size="sm"
                onClick={handleAuthAction} 
                className="bg-primary hover:bg-primary-deep text-sm"
                aria-label="Logga in på ditt konto"
              >
                <User className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Logga in
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;