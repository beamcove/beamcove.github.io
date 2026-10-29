import { MoreLink } from "@/app/components/more-link";
import { ROUTES } from "@/content/site";
import { STORY, STORY_MARK } from "@/content/values";

/** Landing abstract of the About page: one statement, its key phrase in red ink. */
export function Story() {
    const text = STORY[0] ?? "";
    const at = text.indexOf(STORY_MARK);

    return (
        <section className="section" id="story" aria-labelledby="story-title">
            <div className="container story-statement" data-reveal>
                <div className="story-statement-head">
                    <p className="bc-eyebrow">About Beamcove</p>
                    <h2 className="title-1 section-title" id="story-title">
                        It started with curiosity.
                    </h2>
                    <MoreLink href={ROUTES.about}>More about Beamcove</MoreLink>
                </div>
                <p className="story-statement-text">
                    {at < 0 ? (
                        text
                    ) : (
                        <>
                            {text.slice(0, at)}
                            <em className="story-em">{STORY_MARK}</em>
                            {text.slice(at + STORY_MARK.length)}
                        </>
                    )}
                </p>
            </div>
        </section>
    );
}
