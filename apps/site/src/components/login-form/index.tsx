import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import LoginTab from "./login-tab";
import RegisterTab from "./register-tab";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full max-w-md shadow-xs">
        <CardHeader className="text-center">
          <CardTitle className="text-xl @sm:text-2xl">Välkommen!</CardTitle>
          <CardDescription>
            Logga in eller skapa ett konto för att komma igång
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Tabs defaultValue="login">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="login">Logga in</TabsTrigger>
                <TabsTrigger value="register">Skapa konto</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginTab />
              </TabsContent>
              <TabsContent value="register">
                <RegisterTab />
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
