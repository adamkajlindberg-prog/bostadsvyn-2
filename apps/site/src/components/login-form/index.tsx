import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { HeartIcon, LockIcon, MailIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Välkommen!</CardTitle>
          <CardDescription>
            Logga in eller skapa ett konto för att komma igång
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Tabs defaultValue="login">
              <TabsList className="w-full mb-4">
                  <TabsTrigger value="login">
                      Logga in
                  </TabsTrigger>
                  <TabsTrigger value="register">
                      Skapa konto
                  </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">E-postadress</FieldLabel>
                    <InputGroup>
                      <InputGroupInput placeholder="din@email.se" />
                      <InputGroupAddon>
                        <MailIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Lösenord</FieldLabel>
                    <InputGroup>
                      <InputGroupInput placeholder="Ditt lösenord" />
                      <InputGroupAddon>
                        <LockIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <Button type="submit" className="mb-4">Logga in</Button>
                    <Separator />
                    <FieldDescription className="mt-1 flex justify-center items-center gap-x-2">
                      <HeartIcon size={18} className="text-red-400" /> Hitta ditt drömhem bland tusentals annonser
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </TabsContent>
            </Tabs>
           
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
