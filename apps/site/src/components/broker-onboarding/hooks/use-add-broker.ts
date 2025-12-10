import { useMutation } from "@tanstack/react-query";
import type { NewBroker } from "db";
import { addBroker } from "@/lib/actions/broker";

export type T_Broker_Input = {
  fullName: string;
  phone: string;
  license: string;
  email: string;
};

async function createBroker(brokerData: NewBroker) {
  const result = await addBroker(brokerData);

  if (!result) {
    throw new Error("Failed to add broker");
  }

  return result;
}

function useAddBroker() {
  const query = useMutation({
    mutationFn: (brokerData: NewBroker) => createBroker(brokerData),
  });

  return query;
}

export default useAddBroker;
