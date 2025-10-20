import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { HeartIcon, LockIcon, MailIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const LoginTab = () => {
    return (
        <FieldGroup className="gap-y-6">
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
                <InputGroupInput type="password" placeholder="Ditt lösenord" />
                <InputGroupAddon>
                <LockIcon />
                </InputGroupAddon>
            </InputGroup>
            </Field>
            <Field>
            <Button type="submit" className="mb-5">Logga in</Button>
            <Separator />
            <FieldDescription className="flex flex-col @sm:flex-row justify-center items-center gap-x-2 gap-y-1 text-sm text-center @sm:text-start">
                <HeartIcon size={18} className="text-red-400" /> Hitta ditt drömhem bland tusentals annonser
            </FieldDescription>
            </Field>
        </FieldGroup>
    )
}

export default LoginTab