import {
  Building2Icon,
  FileDigitIcon,
  LockIcon,
  MailIcon,
  MapIcon,
  MapPinnedIcon,
  PhoneIcon,
  SignpostIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const RegisterTab = () => {
  return (
    <FieldGroup className="gap-y-0 mb-4">
      <div className="text-sm text-primary font-semibold mb-3">
        Kontorsinformation
      </div>
      <div className="space-y-4 mb-6">
        <Field>
          <FieldLabel htmlFor="officeName">Kontorets namn</FieldLabel>
          <InputGroup>
            <InputGroupInput type="text" placeholder="Ditt kontor namn" />
            <InputGroupAddon>
              <Building2Icon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="address">Gatuadress</FieldLabel>
          <InputGroup>
            <InputGroupInput type="text" placeholder="Ditt kontor gatuadress" />
            <InputGroupAddon>
              <MapIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="city">Stad</FieldLabel>
          <InputGroup>
            <InputGroupInput type="text" placeholder="Ditt kontor stad" />
            <InputGroupAddon>
              <MapPinnedIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="postal">Postnummer</FieldLabel>
          <InputGroup>
            <InputGroupInput type="text" placeholder="Ditt kontor postnummer" />
            <InputGroupAddon>
              <SignpostIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="officePhone">Kontorets telefon</FieldLabel>
          <InputGroup>
            <InputGroupInput type="text" placeholder="+46123456789" />
            <InputGroupAddon>
              <PhoneIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="officeEmail">Kontorets e-post</FieldLabel>
          <InputGroup>
            <InputGroupInput type="email" placeholder="info@kontor.se" />
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>

      <div className="text-sm text-primary font-semibold mb-3">
        Din information som mäklare
      </div>
      <div className="space-y-4 mb-6">
        <Field>
          <FieldLabel htmlFor="fullName">Fullständigt namn</FieldLabel>
          <InputGroup>
            <InputGroupInput type="text" placeholder="Ditt fullständiga namn" />
            <InputGroupAddon>
              <UserIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Telefonnummer</FieldLabel>
          <InputGroup>
            <InputGroupInput type="text" placeholder="+46123456789" />
            <InputGroupAddon>
              <PhoneIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="license">Mäklarlicens</FieldLabel>
          <InputGroup>
            <InputGroupInput
              type="text"
              placeholder="Ditt mäklarlicensnummer"
            />
            <InputGroupAddon>
              <FileDigitIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">E-postadress</FieldLabel>
          <InputGroup>
            <InputGroupInput type="email" placeholder="din.epost@maklare.se" />
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Lösenord</FieldLabel>
          <InputGroup>
            <InputGroupInput
              type="password"
              placeholder="Välj ett säkert lösenord"
            />
            <InputGroupAddon>
              <LockIcon />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>

      <Field>
        <Button type="submit" className="mb-2">
          Registrera mäklarkonto
        </Button>
        <FieldDescription className="text-xs text-center">
          Genom att registrera dig accepterar du våra villkor för mäklare och
          bekräftar att du har rätt att representera din mäklarbyrå.
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
};

export default RegisterTab;
