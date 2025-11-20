import { getServerSession } from "@/auth/server-session";
import MessagingCenter from "@/components/messaging-center";

export default async function MeddelandenPage() {
  const session = await getServerSession();
  if (!session?.user) {
    return null; // Layout handles redirect
  }

  // Redirect to /messages or embed MessagingCenter
  // For now, we'll embed it to keep it within the dashboard layout
  return <MessagingCenter />;
}
