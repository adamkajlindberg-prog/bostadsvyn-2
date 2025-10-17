import Logo from "@/components/common/logo"
import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEnd, HomeIcon } from "lucide-react"
import Link from "next/link"

const LoginPage = () => {
    return  (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href="/" className="flex items-center gap-3 self-center font-medium">
                    <div className="bg-white p-2.5 rounded-full text-primary">
                        <HomeIcon size={36} />
                    </div>
                    <h3 className="text-2xl font-semibold text-primary-foreground">
                        Bostadsvyn.se
                    </h3>
                </Link>
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage