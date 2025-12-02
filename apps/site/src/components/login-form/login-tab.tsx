"use client";
import { HeartIcon, LockIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/auth/client";
import { BankIdLogo } from "@/components/bank-id-logo";
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
  const [bankIdLoading, setBankIdLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
        router.push("/dashboard");
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

  const handleBankIdSignIn = async () => {
    setError(null);
    setBankIdLoading(true);

    try {
      await authClient.signIn.social({
        provider: "idura",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ett oväntat fel uppstod";
      setError(message);
      toast.error("BankID-inloggning misslyckades", {
        description: message,
      });
      setBankIdLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ett oväntat fel uppstod";
      setError(message);
      toast.error("Google-inloggning misslyckades", {
        description: message,
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div>
      <FieldGroup className="gap-y-6">
        <Field>
          <Button
            type="button"
            variant="outline"
            className="w-full mb-3 h-12"
            onClick={handleBankIdSignIn}
            disabled={bankIdLoading || loading || googleLoading}
          >
            <div className="flex items-center justify-center gap-3">
              <BankIdLogo className="size-12" />
              <span>
                {bankIdLoading ? "Loggar in..." : "Logga in med BankID"}
              </span>
            </div>
          </Button>
        </Field>
        <Field>
          <Button
            type="button"
            variant="outline"
            className="w-full mb-4 h-12"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading || bankIdLoading}
          >
            <div className="flex items-center justify-center gap-3">
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Google logo"
              >
                <title>Google logo</title>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>
                {googleLoading ? "Loggar in..." : "Logga in med Google"}
              </span>
            </div>
          </Button>
        </Field>
        <div className="relative my-4">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-background px-2 text-sm text-muted-foreground">
              ELLER
            </span>
          </div>
        </div>
      </FieldGroup>
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
            <Button
              type="submit"
              className="mb-5"
              disabled={loading || bankIdLoading || googleLoading}
            >
              {loading ? "Loggar in..." : "Logga in"}
            </Button>
            <Separator />
            <FieldDescription className="flex flex-col @sm:flex-row justify-center items-center gap-x-2 gap-y-1 text-sm text-center @sm:text-start">
              <HeartIcon size={18} className="text-red-400" /> Hitta ditt
              drömhem bland tusentals annonser
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default LoginTab;
