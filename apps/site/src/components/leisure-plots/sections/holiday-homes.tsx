import ProjectCard, {
  type Project,
} from "@/components/new-production/project-card";
import bgImage from "@/images/bg-image.webp";

const HOMES: Project[] = [
  {
    image: bgImage,
    badgeOneText: "Havsnära",
    badgeTwoText: "Egen brygga",
    name: "Charmig sommarstuga",
    location: "Möja, Stockholms skärgård",
    description:
      "Autentisk skärgårdsstuga från 1920-talet med modern komfort. Egen brygga och spektakulär havsutsikt.",
    price: "2,8M kr",
    otherInfo: "65 m² • 3 rum",
    button: {
      text: "Visa detaljer",
      variant: "outline",
    },
  },
  {
    image: bgImage,
    badgeOneText: "Byggklar tomt",
    badgeTwoText: "Sjöutsikt",
    name: "Natursköna skogstomt",
    location: "Mariefred, Sörmland",
    description:
      "8,500 m² natursköna skog med byggrättigheter. Perfekt för ditt drömhus med utsikt mot Mälaren.",
    price: "1,2M kr",
    otherInfo: "8,500 m² • Skog/Sjö",
    button: {
      text: "Visa detaljer",
      variant: "outline",
    },
  },
  {
    image: bgImage,
    badgeOneText: "Fjällnära",
    badgeTwoText: "Skidbacksnära",
    name: "Modern fjällstuga",
    location: "Åre, Jämtland",
    description:
      "Nybyggd stuga med panoramautsikt. 5 min till liftar och alla bekvämligheter året runt.",
    price: "4,5M kr",
    otherInfo: "95 m² • 4 rum",
    button: {
      text: "Visa detaljer",
      variant: "outline",
    },
  },
];

const HolidayHomes = () => (
  <>
    <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
      <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight">
        Utvalda fritidsboenden
      </h3>
      <div className="text-xs text-center font-semibold rounded-full border px-3 py-1">
        Handplockade av våra experter
      </div>
    </div>

    <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6 mb-12">
      {HOMES.map((home) => (
        <ProjectCard key={home.name} project={home} />
      ))}
    </div>
  </>
);

export default HolidayHomes;
