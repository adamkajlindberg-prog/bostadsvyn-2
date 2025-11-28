import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-card/30 backdrop-blur-md border-2 border-primary-foreground/40 text-primary-foreground hover:bg-card/40 hover:border-primary-foreground/60 shadow-elevated hover:shadow-glow",
        heroSecondary:
          "bg-transparent border-2 border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground/15 hover:border-primary-foreground shadow-lg",
        nordic:
          "bg-gradient-nordic text-primary-foreground hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 shadow-nordic",
        warm: "bg-gradient-warm text-accent-warm-foreground hover:shadow-glow transform hover:-translate-y-0.5 transition-all duration-300 shadow-card",
        ocean:
          "bg-gradient-ocean text-white hover:shadow-glow transform hover:-translate-y-0.5 transition-all duration-300 shadow-card",
        sage: "bg-accent-sage text-accent-sage-foreground hover:bg-accent-sage/80 shadow-success hover:shadow-elevated",
        success:
          "bg-success text-success-foreground hover:bg-success-light shadow-success hover:shadow-elevated",
        premium:
          "bg-gradient-premium text-premium-foreground hover:shadow-glow-premium border-2 border-premium/30 shadow-premium",
        critical:
          "bg-critical text-critical-foreground hover:bg-critical/80 shadow-lg hover:shadow-elevated",
        gold: "bg-gradient-gold text-accent-gold-foreground hover:shadow-gold border-2 border-accent-gold/40 shadow-gold",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
