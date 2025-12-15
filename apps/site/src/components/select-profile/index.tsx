"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { getOrganizationBroker } from "@/lib/actions/organization";
import { cn } from "@/lib/utils";
import { getUserInitials } from "@/utils/get-user-initials";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import Spinner from "../ui/spinner";
import {
  type T_Profile,
  useGetUserProfiles,
} from "./hooks/use-get-user-profiles";

const SelectProfile = () => {
  const [selected, setSelected] = useState<T_Profile | undefined>(undefined);
  const [isContinue, setIsContinue] = useState<boolean>(false);
  const router = useRouter();

  const { data, isLoading, error } = useGetUserProfiles();

  const handleContinue = async () => {
    setIsContinue(true);

    if (selected?.type === "private") {
      router.push("/dashboard");
      return;
    }

    const broker = await getOrganizationBroker(selected?.id ?? "");

    if (broker) {
      await authClient.organization.setActive({
        organizationId: selected?.id,
        organizationSlug: selected?.slug ?? "",
      }, {
        onSuccess: () => {
          router.push(`/maklare/${broker.id}`)
        },
        onError: (error) => {
          setIsContinue(false);
          console.error("Error setting active organization:", error);
          toast.error(`Kunde inte välja organisation`);
        }
      });
    } else {
      setIsContinue(false);
      toast.error("Ingen mäklare hittades för den valda organisationen");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="w-full max-w-md shadow-xs py-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-left">Fortsätt som</CardTitle>
          <CardDescription className="text-left">
            Välj ditt konto från listan nedan:
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {error && (
            <div className="mb-4 text-sm text-destructive">
              Kunde inte hämta profiler. Försök igen senare.
            </div>
          )}

          {isLoading && !data && !error
            ? [...Array(3)].map((_, index) => (
              <ProfileSkeleton key={`skeleton-${index}`} />
            ))
            : data?.map((profile) => (
              <button
                key={profile.name}
                type="button"
                className={`flex items-center gap-2 rounded-md ${selected?.id === profile.id ? "border-2 border-primary p-1.5" : "hover:bg-primary/5 p-2"}`}
                onClick={() => setSelected(profile)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getUserInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-0.5 text-left">
                  <div className="text-sm font-medium line-clamp-1">
                    {profile.name}
                  </div>
                  <div className="text-xs text-foreground/60 line-clamp-1 capitalize">
                    {profile.type}
                  </div>
                </div>
              </button>
            ))}

          {!error && (
            <div className="border-t mt-4 pt-4">
              <Button
                className="w-full"
                onClick={handleContinue}
                disabled={!selected || isLoading || isContinue}
              >
                {isContinue ? <Spinner /> : "Fortsätta"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="flex items-center gap-2 rounded-md p-2">
      <div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="flex flex-col gap-1 text-left w-full">
        <Skeleton className="w-2/5 h-3" />
        <Skeleton className="w-1/4 h-2.5" />
      </div>
    </div>
  );
};

export default SelectProfile;
