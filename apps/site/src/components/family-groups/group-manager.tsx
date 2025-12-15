"use client";

import { useState, useEffect } from "react";
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

export function GroupManager({
  group: propsGroup,
  onGroupUpdated,
  onGroupCreated,
  showCreateOnly,
  userId,
}: GroupManagerProps) {
  const [group, setGroup] = useState<GroupWithMemberCount | null>(propsGroup || null);
  const [groupMembers, setGroupMembers] = useState<GroupMemberWithProfile[]>([]);
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (group) {
      loadGroupMembers();
    }
  }, [group]);

  const loadGroupMembers = async () => {
    if (!group) return;

    setLoadingMembers(true);
    try {
      const members = await getGroupMembers(group.id);
      setGroupMembers(members);
    } catch (error) {
      console.error("Error loading group members:", error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    setIsLoading(true);
    try {
      const result = await createGroup(groupName.trim(), userId);

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
      console.error("Error creating group:", error);
      toast.error("Fel", {
        description: "Kunde inte skapa grupp",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) return;

    setIsLoading(true);
    try {
      const result = await joinGroup(inviteCode.trim(), userId);

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
      console.error("Error joining group:", error);
      toast.error("Fel", {
        description: "Kunde inte ansluta till grupp",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      toast.success("Kopierat!", {
        description: "Inbjudningskoden har kopierats till urklipp",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeaveGroup = async () => {
    if (!group) return;

    try {
      const result = await leaveGroup(group.id, userId);

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
      console.error("Error leaving group:", error);
      toast.error("Fel", {
        description: "Kunde inte lämna gruppen",
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
              if (e.key === "Enter" && groupName.trim() && !isLoading) {
                handleCreateGroup();
              }
            }}
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
                <Label htmlFor="group-name">Gruppens namn</Label>
                <Input
                  id="group-name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && groupName.trim() && !isLoading) {
                      handleCreateGroup();
                    }
                  }}
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
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inviteCode.trim() && !isLoading) {
                      handleJoinGroup();
                    }
                  }}
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
              <CardTitle>Gruppmedlemmar ({groupMembers.length})</CardTitle>
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
}

