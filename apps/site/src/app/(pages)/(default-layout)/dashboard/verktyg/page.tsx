import { Suspense } from "react";
import { getServerSession } from "@/auth/server-session";
import Tools from "@/components/tools";

export default async function VerktygPage() {
  const session = await getServerSession();
  if (!session?.user) {
    return null; // Layout handles redirect
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar verktyg...</p>
          </div>
        </div>
      }
    >
      <VerktygContent />
    </Suspense>
  );
}

const VerktygContent = () => {
  return <Tools />;
};
