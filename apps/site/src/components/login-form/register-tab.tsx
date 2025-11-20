"use client";
import {
  FilePenIcon,
  HeartIcon,
  HouseIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
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

const RegisterTab = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        name: fullName,
        email: email,
        password: password,
        callbackURL: "/dashboard",
      });

      if (signUpError) {
        setError(signUpError.message || "Kunde inte skapa konto");
        toast.error("Registrering misslyckades", {
          description: signUpError.message || "Kunde inte skapa konto",
        });
        return;
      }

      if (data) {
        toast.success("Konto skapat!", {
          description: "Kontrollera din e-post för att bekräfta ditt konto.",
        });
        // Optionally redirect or reset form
        setFullName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ett oväntat fel uppstod";
      setError(message);
      toast.error("Registrering misslyckades", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-y-6 mb-4">
        <Field>
          <FieldLabel htmlFor="fullName">Fullständigt namn</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="fullName"
              type="text"
              placeholder="Ditt fullständiga namn"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
            <InputGroupAddon>
              <UserIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
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
              placeholder="Välj ett säkert lösenord"
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
          <Button type="submit" className="mb-3" disabled={loading}>
            {loading ? "Skapar konto..." : "Skapa konto"}
          </Button>
          <FieldDescription className="text-sm text-center">
            Som privatperson kan du:
          </FieldDescription>
        </Field>
      </FieldGroup>
      <div className="grid grid-cols-1 @sm:grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-center rounded-md bg-muted/50 p-2 gap-x-1.5">
          <HouseIcon size={18} className="text-primary-deep" />
          Söka bostäder
        </div>
        <div className="flex items-center justify-center rounded-md bg-muted/50 p-2 gap-x-1.5">
          <FilePenIcon size={18} className="text-primary-deep" />
          Skapa hyresannonser
        </div>
        <div className="flex items-center justify-center rounded-md bg-muted/50 p-2 gap-x-1.5">
          <HeartIcon size={18} className="text-primary-deep" />
          Spara favoriter
        </div>
        <div className="flex items-center justify-center rounded-md bg-muted/50 p-2 gap-x-1.5">
          <PhoneIcon size={18} className="text-primary-deep" />
          Kontakta hyresvärdar
        </div>
      </div>
    </form>
  );
};

export default RegisterTab;
