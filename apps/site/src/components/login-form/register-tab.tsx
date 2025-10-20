import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { FilePenIcon, HeartIcon, HouseIcon, LockIcon, MailIcon, PhoneIcon } from "lucide-react"

const RegisterTab = () => {
    return (
        <>
        <FieldGroup className="gap-y-6 mb-4">
            <Field>
                <FieldLabel htmlFor="fullName">Fullständigt namn</FieldLabel>
                <InputGroup>
                    <InputGroupInput type="text" placeholder="Ditt fullständiga namn" />
                    <InputGroupAddon>
                    <MailIcon />
                    </InputGroupAddon>
                </InputGroup>
            </Field>
            <Field>
            <FieldLabel htmlFor="email">E-postadress</FieldLabel>
            <InputGroup>
                <InputGroupInput type="email" placeholder="din@email.se" />
                <InputGroupAddon>
                <MailIcon />
                </InputGroupAddon>
            </InputGroup>
            </Field>
            <Field>
            <FieldLabel htmlFor="password">Lösenord</FieldLabel>
            <InputGroup>
                <InputGroupInput type="password" placeholder="Välj ett säkert lösenord" />
                <InputGroupAddon>
                <LockIcon />
                </InputGroupAddon>
            </InputGroup>
            </Field>
            <Field>
            <Button type="submit" className="mb-3">Skapa konto</Button>
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
        </>
    )
}

export default RegisterTab