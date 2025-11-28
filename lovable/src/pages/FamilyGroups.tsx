import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import LegalFooter from '@/components/LegalFooter';
import { GroupManager } from '@/components/group/GroupManager';
import { GroupProperties } from '@/components/group/GroupProperties';
import { 
  Users, 
  Plus, 
  Crown, 
  Vote, 
  Home,
  UserPlus,
  Settings,
  Heart,
  TrendingUp
} from 'lucide-react';

interface Group {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
  member_count?: number;
  role?: string;
}

const FamilyGroups = () => {
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserGroups();
    }
  }, [user]);

  const fetchUserGroups = async () => {
    try {
      const { data: groupsData, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(role),
          group_members(id)
        `)
        .eq('group_members.user_id', user?.id);

      if (error) throw error;

      const formattedGroups = groupsData?.map(group => ({
        ...group,
        member_count: group.group_members?.length || 0,
        role: group.group_members?.[0]?.role || 'member'
      })) || [];

      setUserGroups(formattedGroups);
      
      if (formattedGroups.length > 0 && !activeGroup) {
        setActiveGroup(formattedGroups[0]);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: 'Fel vid hämtning av grupper',
        description: 'Kunde inte ladda dina grupper.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCreated = (newGroup: Group) => {
    setUserGroups(prev => [...prev, newGroup]);
    setActiveGroup(newGroup);
    toast({
      title: 'Grupp skapad!',
      description: `Välkommen till ${newGroup.name}. Dela inbjudningskoden med familjemedlemmar.`,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-8">
          <Card className="shadow-card max-w-md mx-auto">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Logga in för familjekonton</CardTitle>
              <CardDescription>
                Skapa ett konto för att använda familjekonton och gruppfunktioner.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <a href="/login">Logga in / Registrera</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <LegalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-nordic bg-clip-text text-transparent">
            Gruppkonto
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ett verktyg för vänner och familj att hitta och besluta om bostäder tillsammans - för både köp och hyra
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge className="bg-success text-success-foreground">
              <Vote className="h-3 w-3 mr-1" />
              Demokratisk röstning
            </Badge>
            <Badge className="bg-premium text-premium-foreground">
              <Heart className="h-3 w-3 mr-1" />
              Familjevänligt
            </Badge>
          </div>
        </div>

        {loading ? (
          <Card className="shadow-card">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Laddar dina grupper...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Group Selection */}
            {userGroups.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Dina grupper
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userGroups.map((group) => (
                      <Card 
                        key={group.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          activeGroup?.id === group.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setActiveGroup(group)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{group.name}</h3>
                            {group.role === 'admin' && (
                              <Crown className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{group.member_count} medlemmar</span>
                          </div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {group.role === 'admin' ? 'Administratör' : 'Medlem'}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Content */}
            {activeGroup ? (
              <Tabs defaultValue="properties" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="properties" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Sparade bostäder
                  </TabsTrigger>
                  <TabsTrigger value="votes" className="flex items-center gap-2">
                    <Vote className="h-4 w-4" />
                    Röstningar
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Inställningar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="properties">
                  <GroupProperties groupId={activeGroup.id} />
                </TabsContent>

                <TabsContent value="votes">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Vote className="h-5 w-5" />
                        Aktiva röstningar
                      </CardTitle>
                      <CardDescription>
                        Se pågående och avslutade röstningar för gruppens fastigheter
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Inga aktiva röstningar för tillfället</p>
                        <p className="text-sm mt-2">Lägg till fastigheter för att starta röstningar</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <GroupManager 
                    group={activeGroup}
                    onGroupUpdated={(updated) => {
                      setActiveGroup(updated);
                      setUserGroups(prev => 
                        prev.map(g => g.id === updated.id ? updated : g)
                      );
                    }}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              /* No Groups - Welcome Screen */
              <Card className="shadow-card">
                <CardHeader className="text-center">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <CardTitle className="text-2xl">Välkommen till Gruppkonto!</CardTitle>
                  <CardDescription className="text-lg">
                    Skapa din första grupp för att hitta bostäder tillsammans - för både köp och hyra
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <UserPlus className="h-8 w-8 mx-auto text-primary mb-2" />
                        <h3 className="font-medium mb-1">Skapa grupp</h3>
                        <p className="text-sm text-muted-foreground">
                          Starta en ny familjegrupp och bjud in medlemmar
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Home className="h-8 w-8 mx-auto text-primary mb-2" />
                        <h3 className="font-medium mb-1">Spara bostäder</h3>
                        <p className="text-sm text-muted-foreground">
                          Lägg till bostäder eller hyresobjekt som gruppen kan rösta om
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Vote className="h-8 w-8 mx-auto text-primary mb-2" />
                        <h3 className="font-medium mb-1">Rösta tillsammans</h3>
                        <p className="text-sm text-muted-foreground">
                          Alla röstar Ja, Kanske eller Nej. Majoriteten bestämmer vad som händer
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <GroupManager 
                      onGroupCreated={handleGroupCreated}
                      showCreateOnly={true}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
      <LegalFooter />
    </div>
  );
};

export default FamilyGroups;