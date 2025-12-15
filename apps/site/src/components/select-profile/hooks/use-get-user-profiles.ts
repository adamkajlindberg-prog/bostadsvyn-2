import { useQuery } from "@tanstack/react-query";
import { getUserProfiles } from "@/lib/actions/organization";

export type T_Profile = {
  id: string;
  type: string;
  name: string;
  slug: string | null;
};

async function fetchUserProfiles(): Promise<T_Profile[]> {
  return await getUserProfiles();
}

export function useGetUserProfiles() {
  return useQuery<T_Profile[]>({
    queryKey: ["user-profiles"],
    queryFn: fetchUserProfiles,
  });
}
