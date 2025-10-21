import { cn } from "@/lib/utils"

type T_Props = {
    children: React.ReactNode
    className?: string
}

const ContainerWrapper = ({ children, className }: T_Props) => {
    return (
        <div className={cn("container mx-auto max-w-7xl px-6 @lg:px-8 @8xl:px-0", className)}>
            {children}
        </div>
    )
}

export default ContainerWrapper
