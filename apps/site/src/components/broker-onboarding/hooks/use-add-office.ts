import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/auth/client";

type T_Office = {
  name: string;
  slug: string;
  metadata: {
    type: string;
    office: {
      address: string;
      city: string;
      postalCode: string;
      phone: string;
      email: string;
    };
  };
};

export type T_Office_Input = {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
};

async function createOffice(officeData: T_Office) {
  const { data, error } = await authClient.organization.create(officeData);

  if (error) {
    throw new Error(error.message || "Failed to create organization");
  }

  if (!data) {
    throw new Error("No data returned from organization creation");
  }

  return data;
}

function useAddOffice() {
  return useMutation({
    mutationFn: (officeData: T_Office) => createOffice(officeData),
  });
}

export default useAddOffice;
