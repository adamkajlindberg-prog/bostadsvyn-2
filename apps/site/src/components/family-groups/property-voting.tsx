"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Minus, Users } from "lucide-react";
import { toast } from "sonner";
import { castVote, getPropertyVotes, type PropertyVote } from "@/lib/actions/groups";

interface PropertyVotingProps {
  groupId: string;
  propertyId: string;
  currentStatus: string;
  onVoteUpdated: () => void;
  userId: string;
}

export const PropertyVoting = memo(function PropertyVoting({
  groupId,
  propertyId,
  currentStatus,
  onVoteUpdated,
  userId,
}: PropertyVotingProps) {
  const isMountedRef = useRef(true);

  const [votes, setVotes] = useState<PropertyVote[]>([]);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load votes with abort controller
  useEffect(() => {
    if (!groupId || !propertyId) {
      setVotes([]);
      setUserVote(null);
      return;
    }

    const abortController = new AbortController();

    const loadVotes = async () => {
      if (!groupId || !propertyId || !isMountedRef.current) return;

      try {
        const votesData = await getPropertyVotes(groupId, propertyId);

        if (!isMountedRef.current || abortController.signal.aborted) return;

        setVotes(votesData);

        // Find user's current vote
        const currentUserVote = votesData.find((vote) => vote.userId === userId);
        setUserVote(currentUserVote?.vote || null);
      } catch (error) {
        if (!isMountedRef.current || abortController.signal.aborted) return;

        console.error("Error loading votes:", error);
      }
    };

    loadVotes();

    return () => {
      abortController.abort();
    };
  }, [groupId, propertyId, userId]);

  const loadVotes = useCallback(async () => {
    if (!groupId || !propertyId || !isMountedRef.current) return;

    try {
      const votesData = await getPropertyVotes(groupId, propertyId);

      if (!isMountedRef.current) return;

      setVotes(votesData);

      // Find user's current vote
      const currentUserVote = votesData.find((vote) => vote.userId === userId);
      setUserVote(currentUserVote?.vote || null);
    } catch (error) {
      if (!isMountedRef.current) return;

      console.error("Error loading votes:", error);
    }
  }, [groupId, propertyId, userId]);

  const handleCastVote = useCallback(async (voteType: "yes" | "no" | "maybe") => {
    if (!isMountedRef.current) return;

    setIsVoting(true);
    try {
      const result = await castVote(groupId, propertyId, userId, voteType);

      if (!isMountedRef.current) return;

      if (!result.success) {
        toast.error("Fel vid röstning", {
          description: result.error || "Kunde inte registrera din röst",
        });
        return;
      }

      setUserVote(voteType);
      await loadVotes();
      onVoteUpdated();

      const voteLabels = {
        yes: "ja",
        no: "nej",
        maybe: "kanske",
      };

      toast.success("Röst registrerad!", {
        description: `Du röstade ${voteLabels[voteType]} på detta objekt.`,
      });
    } catch (error) {
      if (!isMountedRef.current) return;

      console.error("Error casting vote:", error);
      toast.error("Fel vid röstning", {
        description: "Kunde inte registrera din röst",
      });
    } finally {
      if (isMountedRef.current) {
        setIsVoting(false);
      }
    }
  }, [groupId, propertyId, userId, loadVotes, onVoteUpdated]);

  const voteCounts = useMemo(() => {
    const yes = votes.filter((v) => v.vote === "yes").length;
    const no = votes.filter((v) => v.vote === "no").length;
    const maybe = votes.filter((v) => v.vote === "maybe").length;
    return { yes, no, maybe };
  }, [votes]);

  const { yes, no, maybe } = voteCounts;
  const totalVotes = votes.length;

  return (
    <div className="space-y-3">
      {/* Vote Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={userVote === "yes" ? "default" : "outline"}
          onClick={() => handleCastVote("yes")}
          disabled={isVoting}
          className="flex-1"
        >
          <ThumbsUp className="h-3 w-3 mr-1" />
          Ja ({yes})
        </Button>
        <Button
          size="sm"
          variant={userVote === "maybe" ? "default" : "outline"}
          onClick={() => handleCastVote("maybe")}
          disabled={isVoting}
          className="flex-1"
        >
          <Minus className="h-3 w-3 mr-1" />
          Kanske ({maybe})
        </Button>
        <Button
          size="sm"
          variant={userVote === "no" ? "destructive" : "outline"}
          onClick={() => handleCastVote("no")}
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
            {totalVotes} röst{totalVotes !== 1 ? "er" : ""}
          </div>

          {/* Progress bars */}
          <div className="space-y-1">
            {yes > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <div className="w-12 text-green-600">Ja ({yes})</div>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(yes / totalVotes) * 100}%` }}
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
                    style={{ width: `${(maybe / totalVotes) * 100}%` }}
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
                    style={{ width: `${(no / totalVotes) * 100}%` }}
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
            {userVote === "yes"
              ? "Ja"
              : userVote === "no"
                ? "Nej"
                : "Kanske"}
          </Badge>
        </div>
      )}
    </div>
  );
});

