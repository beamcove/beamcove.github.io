import { SectionHead } from "@/app/components/section-head";
import { StudioFacts } from "@/app/components/studio-facts";
import { ROUTES } from "@/content/site";
import { STORY } from "@/content/values";

/** Landing abstract of the About page. */
export function Story() {
    return (
        <section className="section" id="story" aria-labelledby="story-title">
            <div className="container">
                <SectionHead
                    id="story"
                    eyebrow="Our story"
                    title="A safe harbor for promising projects."
                    more={{ href: ROUTES.about, label: "More about the studio" }}
                >
                    {STORY[0]}
                </SectionHead>
            </div>
            <StudioFacts />
        </section>
    );
}
