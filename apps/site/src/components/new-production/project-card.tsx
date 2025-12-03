import { MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type bgImage from "@/images/bg-image.webp";
import { cn } from "@/lib/utils";

export type Project = {
  image: typeof bgImage;
  badgeOneText: string;
  badgeTwoText: string;
  badgeOneColor?: "premium" | "accent" | "success";
  badgeTwoColor?: "premium" | "accent" | "success" | "critical";
  borderColor?: "premium" | "accent" | "success";
  name: string;
  location: string;
  description: string;
  price: string;
  otherIcon?: JSX.Element;
  otherInfo: string;
  button: {
    icon?: JSX.Element;
    text: string;
    variant: React.ComponentProps<typeof Button>["variant"];
    className?: string;
  };
  href?: string;
};

const ProjectCard = ({ project }: { project: Project }) => {
  const badgeOneColorClass =
    project.badgeOneColor === "premium"
      ? "bg-premium text-premium-foreground"
      : project.badgeOneColor === "accent"
        ? "bg-accent text-accent-foreground"
        : project.badgeOneColor === "success"
          ? "bg-success text-success-foreground"
          : "bg-premium text-premium-foreground";

  const badgeTwoColorClass =
    project.badgeTwoColor === "premium"
      ? "bg-premium text-premium-foreground"
      : project.badgeTwoColor === "accent"
        ? "bg-accent text-accent-foreground"
        : project.badgeTwoColor === "success"
          ? "bg-success text-success-foreground"
          : project.badgeTwoColor === "critical"
            ? "bg-critical text-critical-foreground"
            : "bg-success text-success-foreground";

  const borderColorClass =
    project.borderColor === "premium"
      ? "border-premium/20"
      : project.borderColor === "accent"
        ? "border-accent/20"
        : project.borderColor === "success"
          ? "border-success/20"
          : "border-premium/20";

  const cardContent = (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-hover transition-shadow cursor-pointer",
        borderColorClass,
      )}
    >
      <CardContent className="p-0">
        <div className="relative">
          <div className="relative h-48 bg-gray-100">
            <Image
              src={project.image}
              alt={`${project.name} - ${project.description}`}
              fill
              className="object-cover"
            />
            <div
              className={cn(
                "absolute top-4 left-4 text-xs font-medium rounded-full px-3 py-1",
                badgeOneColorClass,
              )}
            >
              {project.badgeOneText}
            </div>
            <div
              className={cn(
                "absolute top-4 right-4 text-xs font-medium rounded-full px-3 py-1",
                badgeTwoColorClass,
              )}
            >
              {project.badgeTwoText}
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <MapPinIcon className="h-4 w-4" />
              <span>{project.location}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {project.description}
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">{project.price}</span>
              <div className="flex items-center gap-1">
                {project.otherIcon}
                <span className="text-sm">{project.otherInfo}</span>
              </div>
            </div>
            <Button
              variant={project.button.variant}
              className={cn("w-full", project.button.className)}
            >
              {project.button.icon && (
                <span className="mr-2">{project.button.icon}</span>
              )}
              {project.button.text}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (project.href) {
    return (
      <Link href={project.href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default ProjectCard;
