import Link from "next/link";
import { BrokerLoginForm } from "@/components/broker-login-form";
import Logo from "@/components/common/logo";

const LoginPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 @container">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link
          href="/"
          className="flex flex-col self-center hover:opacity-90 hover:scale-105 transition-all duration-300 mb-1.5"
        >
          <div className="flex items-center gap-3 self-center font-medium mb-2 ">
            <div className="bg-primary ring-2 ring-primary-light rounded-lg p-1 shadow-lg">
              <Logo
                className="h-6 w-6 @lg:h-7 @lg:w-7 text-primary-foreground"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-2xl @lg:text-3xl font-semibold text-primary">
              Bostadsvyn.se
            </h2>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            Sveriges smartaste fastighetsmäklarportal
          </div>
        </Link>
        <BrokerLoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
