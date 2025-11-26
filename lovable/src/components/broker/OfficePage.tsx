import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Mail, Phone, Trash2, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TeamMember {
  id: string;
  broker_id: string;
  has_statistics_access: boolean;
  created_at: string;
  broker_name: string;
  broker_email: string;
  broker_phone: string | null;
  is_office_owner: boolean;
  is_assistant: boolean;
  is_broker: boolean;
}

interface OfficePageProps {
  userId: string;
}

export function OfficePage({ userId }: OfficePageProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBrokerId, setCurrentBrokerId] = useState<string | null>(null);
  const [officeId, setOfficeId] = useState<string | null>(null);
  const [addMemberEmail, setAddMemberEmail] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOfficeData();
  }, [userId]);

  const fetchOfficeData = async () => {
    try {
      // Get current broker profile
      const { data: brokerData } = await supabase
        .from('brokers')
        .select('id, office_id, is_office_owner')
        .eq('user_id', userId)
        .single();

      if (!brokerData) {
        toast({
          title: 'Fel',
          description: 'Kunde inte hitta mäklarprofil',
          variant: 'destructive',
        });
        return;
      }

      if (!brokerData.is_office_owner) {
        toast({
          title: 'Ingen åtkomst',
          description: 'Endast kontorsägare har tillgång till denna sida',
          variant: 'destructive',
        });
        return;
      }

      setCurrentBrokerId(brokerData.id);
      setOfficeId(brokerData.office_id);

      // Fetch all brokers in the same office
      const { data: officeBrokers } = await supabase
        .from('brokers')
        .select('*')
        .eq('office_id', brokerData.office_id);

      if (officeBrokers) {
        // Fetch team member settings
        const { data: teamSettings } = await supabase
          .from('office_team_members')
          .select('*')
          .eq('office_id', brokerData.office_id);

        // Combine data
        const members = officeBrokers.map((broker) => {
          const settings = teamSettings?.find((s) => s.broker_id === broker.id);
          return {
            id: settings?.id || '',
            broker_id: broker.id,
            has_statistics_access: settings?.has_statistics_access || false,
            created_at: broker.created_at,
            broker_name: broker.broker_name,
            broker_email: broker.broker_email,
            broker_phone: broker.broker_phone,
            is_office_owner: broker.is_office_owner,
            is_assistant: broker.is_assistant,
            is_broker: broker.is_broker,
          };
        });

        setTeamMembers(members);
      }
    } catch (error) {
      console.error('Error fetching office data:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte hämta kontorsdata',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAccess = async (brokerId: string, currentAccess: boolean) => {
    try {
      const member = teamMembers.find((m) => m.broker_id === brokerId);
      
      if (member?.id) {
        // Update existing record
        const { error } = await supabase
          .from('office_team_members')
          .update({ has_statistics_access: !currentAccess })
          .eq('id', member.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('office_team_members')
          .insert({
            office_id: officeId,
            broker_id: brokerId,
            added_by: currentBrokerId,
            has_statistics_access: !currentAccess,
          });

        if (error) throw error;
      }

      toast({
        title: 'Uppdaterat',
        description: 'Behörighet har uppdaterats',
      });

      fetchOfficeData();
    } catch (error) {
      console.error('Error updating access:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte uppdatera behörighet',
        variant: 'destructive',
      });
    }
  };

  const handleAddMember = async () => {
    if (!addMemberEmail.trim()) {
      toast({
        title: 'Fel',
        description: 'Ange en e-postadress',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingMember(true);
    try {
      // Find broker by email
      const { data: brokerData } = await supabase
        .from('brokers')
        .select('id, office_id')
        .eq('broker_email', addMemberEmail.trim())
        .single();

      if (!brokerData) {
        toast({
          title: 'Mäklare hittades inte',
          description: 'Ingen mäklare med den e-postadressen finns i systemet',
          variant: 'destructive',
        });
        return;
      }

      if (brokerData.office_id !== officeId) {
        toast({
          title: 'Fel kontor',
          description: 'Denna mäklare tillhör redan ett annat kontor',
          variant: 'destructive',
        });
        return;
      }

      // Add to team
      const { error } = await supabase
        .from('office_team_members')
        .insert({
          office_id: officeId,
          broker_id: brokerData.id,
          added_by: currentBrokerId,
          has_statistics_access: false,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Redan tillagd',
            description: 'Denna mäklare är redan i teamet',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: 'Tillagd',
        description: 'Mäklare har lagts till i teamet',
      });

      setAddMemberEmail('');
      fetchOfficeData();
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte lägga till mäklare',
        variant: 'destructive',
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  const getRoleBadges = (member: TeamMember) => {
    const roles = [];
    if (member.is_office_owner) roles.push('Kontorsägare');
    if (member.is_broker) roles.push('Mäklare');
    if (member.is_assistant) roles.push('Assistent');
    return roles;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Kontorssida
              </CardTitle>
              <CardDescription>
                Hantera mäklare och behörigheter för ditt kontor
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Lägg till mäklare
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lägg till mäklare</DialogTitle>
                  <DialogDescription>
                    Ange e-postadressen till mäklaren som ska läggas till i teamet
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-email">E-postadress</Label>
                    <Input
                      id="member-email"
                      type="email"
                      placeholder="maklare@byrå.se"
                      value={addMemberEmail}
                      onChange={(e) => setAddMemberEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleAddMember}
                    disabled={isAddingMember}
                    className="w-full"
                  >
                    {isAddingMember ? 'Lägger till...' : 'Lägg till'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Inga mäklare registrerade än
              </p>
            ) : (
              teamMembers.map((member) => (
                <Card key={member.broker_id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{member.broker_name}</h3>
                          {getRoleBadges(member).map((role) => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {member.broker_email}
                          </div>
                          {member.broker_phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {member.broker_phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor={`access-${member.broker_id}`} className="text-sm">
                            Statistikåtkomst
                          </Label>
                          <Switch
                            id={`access-${member.broker_id}`}
                            checked={member.has_statistics_access}
                            onCheckedChange={() =>
                              handleToggleAccess(member.broker_id, member.has_statistics_access)
                            }
                            disabled={member.is_office_owner}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
