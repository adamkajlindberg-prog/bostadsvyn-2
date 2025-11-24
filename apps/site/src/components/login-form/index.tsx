"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/auth/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "AN";
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (user) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="w-full max-w-md shadow-xs">
          <CardHeader className="text-center">
            <CardTitle className="text-xl @sm:text-2xl">
              Du är inloggad
            </CardTitle>
            <CardDescription>
              Du är redan inloggad på ditt konto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <p className="font-medium text-lg">{user.name || user.email}</p>
                {user.name && user.email && (
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                )}
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full mt-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logga ut
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        </CardContent>
      </Card>
    </div>
  );
}
