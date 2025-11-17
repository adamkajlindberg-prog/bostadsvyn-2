import { Minus, ThumbsDown, ThumbsUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface GroupVote {
  id: string;
  user_id: string;
  vote: "yes" | "no" | "maybe";
  profiles?: {
    full_name: string;
  };
}

interface PropertyVotingProps {
  groupId: string;
  propertyId: string;
  currentStatus: string;
  onVoteUpdated: () => void;
}

export function PropertyVoting({
  groupId,
  propertyId,
  currentStatus,
  onVoteUpdated,
}: PropertyVotingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [votes, setVotes] = useState<GroupVote[]>([]);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    loadVotes();
  }, [loadVotes]);

  const loadVotes = async () => {
    try {
      const { data: votesData, error } = await supabase
        .from("group_property_votes")
        .select("*, profiles(full_name)")
        .eq("group_id", groupId)
        .eq("property_id", propertyId);

      if (error) {
        console.error("Error loading votes:", error);
        return;
      }

      setVotes(
        (votesData as any[])?.map((vote) => ({
          id: vote.id,
          user_id: vote.user_id,
          vote: vote.vote as "yes" | "no" | "maybe",
          profiles: vote.profiles,
        })) || [],
      );

      // Find user's current vote
      const currentUserVote = votesData?.find(
        (vote) => vote.user_id === user?.id,
      );
      setUserVote(currentUserVote?.vote || null);
    } catch (error) {
      console.error("Error loading votes:", error);
    }
  };

  const castVote = async (voteType: "yes" | "no" | "maybe") => {
    if (!user) return;

    setIsVoting(true);
    try {
      // Check if user already voted
      if (userVote) {
        // Update existing vote
        const { error } = await supabase
          .from("group_property_votes")
          .update({ vote: voteType })
          .eq("group_id", groupId)
          .eq("property_id", propertyId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase.from("group_property_votes").insert({
          group_id: groupId,
          property_id: propertyId,
          user_id: user.id,
          vote: voteType,
        });

        if (error) throw error;
      }

      setUserVote(voteType);
      loadVotes();
      onVoteUpdated();

      toast({
        title: "Röst registrerad!",
        description: `Du röstade ${voteType === "yes" ? "ja" : voteType === "no" ? "nej" : "kanske"} på detta objekt.`,
      });
    } catch (error) {
      console.error("Error casting vote:", error);
      toast({
        title: "Fel vid röstning",
        description: "Kunde inte registrera din röst",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  const getVoteCounts = () => {
    const yes = votes.filter((v) => v.vote === "yes").length;
    const no = votes.filter((v) => v.vote === "no").length;
    const maybe = votes.filter((v) => v.vote === "maybe").length;
    return { yes, no, maybe };
  };

  const { yes, no, maybe } = getVoteCounts();

  return (
    <div className="space-y-3">
      {/* Vote Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={userVote === "yes" ? "default" : "outline"}
          onClick={() => castVote("yes")}
          disabled={isVoting}
          className="flex-1"
        >
          <ThumbsUp className="h-3 w-3 mr-1" />
          Ja ({yes})
        </Button>
        <Button
          size="sm"
          variant={userVote === "maybe" ? "default" : "outline"}
          onClick={() => castVote("maybe")}
          disabled={isVoting}
          className="flex-1"
        >
          <Minus className="h-3 w-3 mr-1" />
          Kanske ({maybe})
        </Button>
        <Button
          size="sm"
          variant={userVote === "no" ? "destructive" : "outline"}
          onClick={() => castVote("no")}
          disabled={isVoting}
          className="flex-1"
        >
          <ThumbsDown className="h-3 w-3 mr-1" />
          Nej ({no})
        </Button>
      </div>

      {/* Vote Summary */}
      {votes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {votes.length} röst{votes.length !== 1 ? "er" : ""}
          </div>

          {/* Progress bars */}
          <div className="space-y-1">
            {yes > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-12 text-green-600">Ja ({yes})</div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(yes / votes.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {maybe > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-12 text-yellow-600">Kanske ({maybe})</div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(maybe / votes.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {no > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-12 text-red-600">Nej ({no})</div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(no / votes.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User's current vote */}
      {userVote && (
        <div className="text-xs text-muted-foreground">
          Din röst:{" "}
          <Badge variant="outline" className="text-xs">
            {userVote === "yes" ? "Ja" : userVote === "no" ? "Nej" : "Kanske"}
          </Badge>
        </div>
      )}
    </div>
  );
}
