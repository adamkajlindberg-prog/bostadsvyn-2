"use client";
import { HeartIcon, LockIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

const LoginTab = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email: email,
        password: password,
        rememberMe: true,
        callbackURL: "/dashboard",
      });

      if (signInError) {
        setError(signInError.message || "Kunde inte logga in");
        toast.error("Inloggning misslyckades", {
          description: signInError.message || "Kunde inte logga in",
        });
        return;
      }

      if (data) {
        toast.success("Välkommen tillbaka!", {
          description: "Du är nu inloggad.",
        });
        // Redirect to home or dashboard
        router.push("/");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ett oväntat fel uppstod";
      setError(message);
      toast.error("Inloggning misslyckades", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-y-6">
        <Field>
          <FieldLabel htmlFor="email">E-postadress</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="din@email.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Lösenord</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="password"
              type="password"
              placeholder="Ditt lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        {error && (
          <Field>
            <FieldError>{error}</FieldError>
          </Field>
        )}
        <Field>
          <Button type="submit" className="mb-5" disabled={loading}>
            {loading ? "Loggar in..." : "Logga in"}
          </Button>
          <Separator />
          <FieldDescription className="flex flex-col @sm:flex-row justify-center items-center gap-x-2 gap-y-1 text-sm text-center @sm:text-start">
            <HeartIcon size={18} className="text-red-400" /> Hitta ditt drömhem
            bland tusentals annonser
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default LoginTab;
