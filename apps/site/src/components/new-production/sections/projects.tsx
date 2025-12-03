import {
  CalendarIcon,
  CircleCheckBigIcon,
  ClockIcon,
  StarIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import bgImage from "@/images/bg-image.webp";
import ProjectCard, { type Project } from "../project-card";

const projects: Project[] = [
  {
    image: bgImage,
    badgeOneText: "Lanseras Q2 2025",
    badgeTwoText: "15% sålt",
    badgeOneColor: "premium",
    badgeTwoColor: "success",
    borderColor: "premium",
    name: "Nya Kajen",
    location: "Hammarby Sjöstad, Stockholm",
    description:
      "127 moderna lägenheter med spektakulär sjöutsikt. Från 2-5 rum med egen balkong eller terrass.",
    price: "Från 4,2M kr",
    otherIcon: (
      <StarIcon
        size={16}
        fill="currentColor"
        className="text-accent fill-current"
      />
    ),
    otherInfo: "A+ energiklass",
    button: {
      icon: <CalendarIcon size={16} />,
      text: "Boka visning",
      variant: "default",
      className: "bg-premium hover:bg-premium-dark",
    },
    href: "/nyproduktion/nya-kajen",
  },
  {
    image: bgImage,
    badgeOneText: "Bygger nu",
    badgeTwoText: "68% sålt",
    badgeOneColor: "accent",
    badgeTwoColor: "critical",
    borderColor: "accent",
    name: "Villastad Syd",
    location: "Nacka, Stockholm",
    description:
      "45 exklusiva villor i naturnära miljö. Moderna arkitektoniska lösningar med hållbarhetsfokus.",
    price: "Från 8,9M kr",
    otherIcon: <ZapIcon size={16} className="text-success" />,
    otherInfo: "Solceller inkl.",
    button: {
      icon: <UsersIcon size={16} />,
      text: "Intresseanmälan",
      variant: "outline",
      className: "border-accent text-accent hover:bg-accent/10",
    },
    href: "/nyproduktion/villastad-syd",
  },
  {
    image: bgImage,
    badgeOneText: "Inflyttning 2025",
    badgeTwoText: "42% sålt",
    badgeOneColor: "success",
    badgeTwoColor: "accent",
    borderColor: "success",
    name: "Centrum Park",
    location: "Centrum, Göteborg",
    description:
      "89 lägenheter i hjärtat av Göteborg. Närhet till kollektivtrafik och stadens alla faciliteter.",
    price: "Från 3,1M kr",
    otherIcon: <CircleCheckBigIcon size={16} className="text-success" />,
    otherInfo: "BRF bildad",
    button: {
      icon: <ClockIcon size={16} />,
      text: "Se tillgängliga",
      variant: "default",
      className: "bg-success hover:bg-success-light",
    },
    href: "/nyproduktion/centrum-park",
  },
];

const Projects = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Utvalda projekt</h2>
        <div className="bg-premium text-premium-foreground text-xs font-semibold rounded-full px-3 py-1">
          Lanseras snart
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
