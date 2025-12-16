"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  createGroup,
  joinGroup,
  leaveGroup,
  getGroupMembers,
  type GroupWithMemberCount,
  type GroupMemberWithProfile,
} from "@/lib/actions/groups";

interface GroupManagerProps {
  group?: GroupWithMemberCount;
  onGroupUpdated?: (group: GroupWithMemberCount) => void;
  onGroupCreated?: (group: GroupWithMemberCount) => void;
  showCreateOnly?: boolean;
  userId: string;
}

export const GroupManager = memo(function GroupManager({
  group: propsGroup,
  onGroupUpdated,
  onGroupCreated,
  showCreateOnly,
  userId,
}: GroupManagerProps) {
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [group, setGroup] = useState<GroupWithMemberCount | null>(propsGroup || null);
  const [groupMembers, setGroupMembers] = useState<GroupMemberWithProfile[]>([]);
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [copied, setCopied] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Sync group prop changes
  useEffect(() => {
    if (propsGroup && propsGroup.id !== group?.id) {
      setGroup(propsGroup);
    }
  }, [propsGroup, group?.id]);

  // Load group members with abort controller
  useEffect(() => {
    if (!group) {
      setGroupMembers([]);
      return;
    }

    const abortController = new AbortController();

    const loadGroupMembers = async () => {
      if (!group || !isMountedRef.current) return;

      setLoadingMembers(true);
      try {
        const members = await getGroupMembers(group.id);
        
        if (!isMountedRef.current || abortController.signal.aborted) return;
        
        setGroupMembers(members);
      } catch (error) {
        if (!isMountedRef.current || abortController.signal.aborted) return;
        
        console.error("Error loading group members:", error);
      } finally {
        if (isMountedRef.current && !abortController.signal.aborted) {
          setLoadingMembers(false);
        }
      }
    };

    loadGroupMembers();

    return () => {
      abortController.abort();
    };
  }, [group?.id]);

  const handleCreateGroup = useCallback(async () => {
    if (!groupName.trim() || !isMountedRef.current) return;

    setIsLoading(true);
    try {
      const result = await createGroup(groupName.trim(), userId);

      if (!isMountedRef.current) return;

      if (!result.success || !result.group) {
        toast.error("Fel vid skapande av grupp", {
          description: result.error || "Kunde inte skapa grupp",
        });
        return;
      }

      setGroup(result.group);
      setGroupName("");
      if (onGroupCreated) {
        onGroupCreated(result.group);
      }
      toast.success("🎉 Grupp skapad!", {
        description: `Välkommen till "${result.group.name}"! Dela inbjudningskoden med vänner och familj så ni kan börja leta efter bostäder tillsammans.`,
      });
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error("Error creating group:", error);
      toast.error("Fel", {
        description: "Kunde inte skapa grupp",
      });
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [groupName, userId, onGroupCreated]);

  const handleJoinGroup = useCallback(async () => {
    if (!inviteCode.trim() || !isMountedRef.current) return;

    setIsLoading(true);
    try {
      const result = await joinGroup(inviteCode.trim(), userId);

      if (!isMountedRef.current) return;

      if (!result.success || !result.group) {
        toast.error("Ogiltig inbjudningskod", {
          description: result.error || "Ingen grupp hittades med denna kod",
        });
        return;
      }

      setGroup(result.group);
      setInviteCode("");
      if (onGroupCreated) {
        onGroupCreated(result.group);
      }
      toast.success("🎉 Välkommen till gruppen!", {
        description: `Nu är du med i "${result.group.name}". Börja rösta på bostäder tillsammans!`,
      });
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error("Error joining group:", error);
      toast.error("Fel", {
        description: "Kunde inte ansluta till grupp",
      });
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [inviteCode, userId, onGroupCreated]);

  const copyInviteCode = useCallback(() => {
    if (!group?.inviteCode || !isMountedRef.current) return;

    navigator.clipboard.writeText(group.inviteCode).catch((error) => {
      console.error("Failed to copy to clipboard:", error);
    });
    
    setCopied(true);
    toast.success("Kopierat!", {
      description: "Inbjudningskoden har kopierats till urklipp",
    });
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout with cleanup
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setCopied(false);
      }
    }, 2000);
  }, [group?.inviteCode]);

  const handleLeaveGroup = useCallback(async () => {
    if (!group || !isMountedRef.current) return;

    try {
      const result = await leaveGroup(group.id, userId);

      if (!isMountedRef.current) return;

      if (!result.success) {
        toast.error("Fel vid utträde", {
          description: result.error || "Kunde inte lämna gruppen",
        });
        return;
      }

      setGroup(null);
      setGroupMembers([]);
      toast.success("Lämnat gruppen", {
        description: "Du har lämnat gruppen",
      });
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error("Error leaving group:", error);
      toast.error("Fel", {
        description: "Kunde inte lämna gruppen",
      });
    }
  }, [group, userId]);

  const handleGroupNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value);
  }, []);

  const handleInviteCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(e.target.value.toUpperCase());
  }, []);

  const handleGroupNameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && groupName.trim() && !isLoading) {
      handleCreateGroup();
    }
  }, [groupName, isLoading, handleCreateGroup]);

  const handleInviteCodeKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inviteCode.trim() && !isLoading) {
      handleJoinGroup();
    }
  }, [inviteCode, isLoading, handleJoinGroup]);

  const memberCount = useMemo(() => groupMembers.length, [groupMembers.length]);

  if (showCreateOnly) {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="group-name">Gruppens namn</Label>
          <Input
            id="group-name"
            value={groupName}
            onChange={handleGroupNameChange}
            onKeyDown={handleGroupNameKeyDown}
            placeholder="T.ex. Familjen Andersson, Kompisgruppen"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Välj ett namn som alla känner igen
          </p>
        </div>
        <Button
          onClick={handleCreateGroup}
          disabled={isLoading || !groupName.trim()}
          className="w-full"
        >
          {isLoading ? "Skapar grupp..." : "Skapa din första grupp"}
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
                <Label htmlFor="group-name-create">Gruppens namn</Label>
                <Input
                  id="group-name-create"
                  value={groupName}
                  onChange={handleGroupNameChange}
                  onKeyDown={handleGroupNameKeyDown}
                  placeholder="T.ex. Kompisgruppen, Familjen Johansson"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Välj ett namn som alla känner igen
                </p>
              </div>
              <Button
                onClick={handleCreateGroup}
                disabled={isLoading || !groupName.trim()}
                className="w-full"
              >
                {isLoading ? "Skapar grupp..." : "Skapa grupp"}
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
                  onChange={handleInviteCodeChange}
                  onKeyDown={handleInviteCodeKeyDown}
                  placeholder="Ange inbjudningskod"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Fråga gruppägaren efter koden
                </p>
              </div>
              <Button
                onClick={handleJoinGroup}
                disabled={isLoading || !inviteCode.trim()}
                className="w-full"
              >
                {isLoading ? "Ansluter till grupp..." : "Gå med i grupp"}
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
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                  {group.inviteCode}
                </code>
                <Button size="sm" variant="outline" onClick={copyInviteCode}>
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Dela denna kod med gruppmedlemmar så att de kan gå med
              </p>
              <Button variant="destructive" size="sm" onClick={handleLeaveGroup}>
                Lämna grupp
              </Button>
            </CardContent>
          </Card>

          {/* Group Members */}
          <Card>
            <CardHeader>
              <CardTitle>Gruppmedlemmar ({memberCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMembers ? (
                <p>Laddar medlemmar...</p>
              ) : (
                <div className="space-y-2">
                  {groupMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {member.name || "Okänd användare"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                      <Badge
                        variant={member.role === "admin" ? "default" : "secondary"}
                      >
                        {member.role === "admin" ? "Admin" : "Medlem"}
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
});

