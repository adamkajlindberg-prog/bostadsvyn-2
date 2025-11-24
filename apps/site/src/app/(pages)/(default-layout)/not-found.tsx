import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Sidan hittades inte</h2>
      <p className="text-muted-foreground mb-8">
        Sidan du söker finns inte eller har flyttats.
      </p>
      <Button asChild>
        <Link href="/">Tillbaka till startsidan</Link>
      </Button>
    </div>
  );
}
