import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, UserPlus, Copy, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Group {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export function GroupManager({ group: props, onGroupUpdated, onGroupCreated, showCreateOnly }: {
  group?: Group;
  onGroupUpdated?: (group: Group) => void;
  onGroupCreated?: (group: Group) => void;
  showCreateOnly?: boolean;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(props || null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserGroup();
    }
  }, [user]);

  useEffect(() => {
    if (group) {
      loadGroupMembers();
    }
  }, [group]);

  const loadUserGroup = async () => {
    try {
      const { data: groupMember, error } = await supabase
        .from('group_members')
        .select(`
          *,
          groups (
            id,
            name,
            invite_code,
            created_by,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading group:', error);
        return;
      }

      if (groupMember && groupMember.groups) {
        setGroup(groupMember.groups as any);
      }
    } catch (error) {
      console.error('Error loading group:', error);
    }
  };

  const loadGroupMembers = async () => {
    if (!group) return;
    
    setLoadingMembers(true);
    try {
      const { data: members, error } = await supabase
        .from('group_members')
        .select(`
          *,
          profiles!group_members_user_id_fkey(
            full_name,
            email
          )
        `)
        .eq('group_id', group.id);

      if (error) {
        console.error('Error loading group members:', error);
        return;
      }

      setGroupMembers(members || [] as any);
    } catch (error) {
      console.error('Error loading group members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const createGroup = async () => {
    if (!groupName.trim() || !user) return;

    setIsLoading(true);
    try {
      // Create group
      const { data: newGroup, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupName.trim(),
          created_by: user.id
        })
        .select()
        .single();

      if (groupError) {
        toast({
          title: "Fel vid skapande av grupp",
          description: groupError.message,
          variant: "destructive",
        });
        return;
      }

      // Add creator as group member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: newGroup.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) {
        toast({
          title: "Fel vid tillägg av gruppmedlem",
          description: memberError.message,
          variant: "destructive",
        });
        return;
      }

      setGroup(newGroup);
      setGroupName('');
      if (onGroupCreated) {
        onGroupCreated(newGroup);
      }
      toast({
        title: "🎉 Grupp skapad!",
        description: `Välkommen till "${newGroup.name}"! Dela inbjudningskoden med vänner och familj så ni kan börja leta efter bostäder tillsammans.`,
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Fel",
        description: "Kunde inte skapa grupp",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async () => {
    if (!inviteCode.trim() || !user) return;

    setIsLoading(true);
    try {
      // Find group by invite code
      const { data: foundGroup, error: findError } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', inviteCode.trim())
        .single();

      if (findError || !foundGroup) {
        toast({
          title: "Ogiltig inbjudningskod",
          description: "Ingen grupp hittades med denna kod",
          variant: "destructive",
        });
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', foundGroup.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast({
          title: "Redan medlem",
          description: "Du är redan medlem i denna grupp",
          variant: "destructive",
        });
        return;
      }

      // Join group
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: foundGroup.id,
          user_id: user.id,
          role: 'member'
        });

      if (joinError) {
        toast({
          title: "Fel vid anslutning till grupp",
          description: joinError.message,
          variant: "destructive",
        });
        return;
      }

      setGroup(foundGroup);
      setInviteCode('');
      toast({
        title: "🎉 Välkommen till gruppen!",
        description: `Nu är du med i "${foundGroup.name}". Börja rösta på bostäder tillsammans!`,
      });
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Fel",
        description: "Kunde inte ansluta till grupp",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (group?.invite_code) {
      navigator.clipboard.writeText(group.invite_code);
      toast({
        title: "Kopierat!",
        description: "Inbjudningskoden har kopierats till urklipp",
      });
    }
  };

  const leaveGroup = async () => {
    if (!group || !user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', group.id)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Fel vid utträde",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setGroup(null);
      setGroupMembers([]);
      toast({
        title: "Lämnat gruppen",
        description: "Du har lämnat gruppen",
      });
    } catch (error) {
      console.error('Error leaving group:', error);
      toast({
        title: "Fel",
        description: "Kunde inte lämna gruppen",
        variant: "destructive",
      });
    }
  };

  if (showCreateOnly) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="group-name">Gruppens namn</Label>
          <Input
            id="group-name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && groupName.trim() && !isLoading) {
                createGroup();
              }
            }}
            placeholder="T.ex. Familjen Andersson, Kompisgruppen"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Välj ett namn som alla känner igen
          </p>
        </div>
        <Button 
          onClick={createGroup} 
          disabled={isLoading || !groupName.trim()}
          className="w-full"
        >
          {isLoading ? 'Skapar grupp...' : 'Skapa din första grupp'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!group ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Create Group */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Skapa grupp
              </CardTitle>
              <CardDescription>
                Hitta och rösta på bostäder tillsammans med vänner och familj
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="group-name">Gruppens namn</Label>
                <Input
                  id="group-name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && groupName.trim() && !isLoading) {
                      createGroup();
                    }
                  }}
                  placeholder="T.ex. Kompisgruppen, Familjen Johansson"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Välj ett namn som alla känner igen
                </p>
              </div>
              <Button 
                onClick={createGroup} 
                disabled={isLoading || !groupName.trim()}
                className="w-full"
              >
                {isLoading ? 'Skapar grupp...' : 'Skapa grupp'}
              </Button>
            </CardContent>
          </Card>

          {/* Join Group */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Gå med i grupp
              </CardTitle>
              <CardDescription>
                Använd en inbjudningskod för att gå med i en befintlig grupp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="invite-code">Inbjudningskod</Label>
                <Input
                  id="invite-code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inviteCode.trim() && !isLoading) {
                      joinGroup();
                    }
                  }}
                  placeholder="Ange inbjudningskod"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Fråga gruppägaren efter koden
                </p>
              </div>
              <Button 
                onClick={joinGroup} 
                disabled={isLoading || !inviteCode.trim()}
                className="w-full"
              >
                {isLoading ? 'Ansluter till grupp...' : 'Gå med i grupp'}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Group Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {group.name}
              </CardTitle>
              <CardDescription>
                Hitta bostäder och rösta tillsammans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Label>Inbjudningskod:</Label>
                <code className="bg-muted px-2 py-1 rounded text-sm">{group.invite_code}</code>
                <Button size="sm" variant="outline" onClick={copyInviteCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Dela denna kod med gruppmedlemmar så att de kan gå med
              </p>
              <Button variant="destructive" size="sm" onClick={leaveGroup}>
                Lämna grupp
              </Button>
            </CardContent>
          </Card>

          {/* Group Members */}
          <Card>
            <CardHeader>
              <CardTitle>Gruppmedlemmar ({groupMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMembers ? (
                <p>Laddar medlemmar...</p>
              ) : (
                <div className="space-y-2">
                  {groupMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{member.profiles?.full_name || 'Okänd användare'}</p>
                        <p className="text-sm text-muted-foreground">{member.profiles?.email}</p>
                      </div>
                      <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                        {member.role === 'admin' ? 'Admin' : 'Medlem'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}