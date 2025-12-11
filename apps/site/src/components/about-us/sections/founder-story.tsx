import { Card, CardContent } from "@/components/ui/card";
import { founderStoryContent } from "../data/content";

const FounderStory = () => {
  return (
    <section className="mb-16" aria-labelledby="founder-story-title">
      <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div>
              <h2
                id="founder-story-title"
                className="text-2xl md:text-3xl font-bold mb-2"
              >
                {founderStoryContent.title}
              </h2>
              <p className="text-accent font-semibold">
                {founderStoryContent.subtitle}
              </p>
            </div>
          </div>
          <p className="text-foreground leading-relaxed mb-4 text-lg">
            {founderStoryContent.description}
          </p>

          <blockquote className="mt-6 border-l-4 border-accent pl-6 italic text-foreground text-lg">
            <p className="leading-relaxed mb-2">"{founderStoryContent.quote}"</p>
            <p className="text-sm font-semibold not-italic text-accent">
              {founderStoryContent.author}
            </p>
          </blockquote>
        </CardContent>
      </Card>
    </section>
  );
};

export default FounderStory;
