import BrokerProfile from "@/components/broker-profile";

type Props = {
  params: Promise<{ brokerId: string }>;
};

export default async function BrokerProfilePage({ params }: Props) {
  const { brokerId } = await params;

  return <BrokerProfile brokerId={brokerId} />;
}
