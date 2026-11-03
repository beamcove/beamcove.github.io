import { ArrowRight } from "lucide";

import { ChapterHead } from "@/app/components/chapter-head";
import { Icon } from "@/app/components/icon";
import { Scene } from "@/app/components/scene";
import { ROUTES } from "@/content/site";
import { STORY, STORY_MARK } from "@/content/values";

/** The story, its key phrase highlighted, on its own screen. */
export function Story({
    n,
    title = "It started with curiosity.",
    more = false,
    full = false,
}: {
    n?: number;
    title?: string;
    /** Link to the About page (on the home page). */
    more?: boolean;
    /** Every paragraph, not just the first. */
    full?: boolean;
}) {
    const first = STORY[0] ?? "";
    const at = first.indexOf(STORY_MARK);
    return (
        <Scene name="story" id="story" aria-labelledby="story-title">
            <div className="wrap">
                <div className="copy story" data-quiet data-reveal>
                    <ChapterHead id="story" n={n} kicker="About" title={title} />
                    <p className="lead">
                        {at < 0 ? (
                            first
                        ) : (
                            <>
                                {first.slice(0, at)}
                                <em className="bc-em">{STORY_MARK}</em>
                                {first.slice(at + STORY_MARK.length)}
                            </>
                        )}
                    </p>
                    {full &&
                        STORY.slice(1).map((p) => (
                            <p key={p} className="body-text">
                                {p}
                            </p>
                        ))}
                    {more && (
                        <a className="bc-more more" href={ROUTES.about}>
                            More about Beamcove <Icon node={ArrowRight} />
                        </a>
                    )}
                </div>
            </div>
        </Scene>
    );
}
