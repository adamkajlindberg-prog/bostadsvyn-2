import { LockIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const LoginTab = () => {
  return (
    <FieldGroup className="gap-y-6">
      <Field>
        <FieldLabel htmlFor="email">E-postadress</FieldLabel>
        <InputGroup>
          <InputGroupInput type="email" placeholder="mäklare@byrå.se" />
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Lösenord</FieldLabel>
        <InputGroup>
          <InputGroupInput type="password" placeholder="Ditt lösenord" />
          <InputGroupAddon>
            <LockIcon />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <Button type="submit">Logga in i portalen</Button>
      </Field>
    </FieldGroup>
  );
};

export default LoginTab;
