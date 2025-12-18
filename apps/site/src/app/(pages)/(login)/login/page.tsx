import Link from "next/link";
import Logo from "@/components/common/logo";
import { LoginForm } from "@/components/login-form";

const LoginPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 @container">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 self-center font-medium mb-1.5 hover:opacity-90 hover:scale-105 transition-all duration-300"
        >
          <div className="bg-primary ring-2 ring-primary-light rounded-lg p-1 shadow-lg">
            <Logo
              className="h-6 w-6 @lg:h-7 @lg:w-7 text-primary-foreground"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-2xl @lg:text-5xl font-semibold">Bostadsvyn.se</h2>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
