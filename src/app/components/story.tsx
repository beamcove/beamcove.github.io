import { ArrowRight } from "lucide";

import { ChapterHead } from "@/app/components/chapter-head";
import { Icon } from "@/app/components/icon";
import { Scene } from "@/app/components/scene";
import { ROUTES } from "@/content/site";
import { STORY, STORY_MARK } from "@/content/values";

/** The home page's story screen: the first paragraph, its key phrase highlighted. */
export function Story({ n }: { n?: number }) {
    const first = STORY[0] ?? "";
    const at = first.indexOf(STORY_MARK);
    return (
        <Scene name="story" id="story" aria-labelledby="story-title">
            <div className="wrap">
                <div className="copy story" data-quiet data-reveal>
                    <ChapterHead
                        id="story"
                        n={n}
                        kicker="About"
                        title="It started with curiosity."
                    />
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
                    <a className="bc-more more" href={ROUTES.about}>
                        More about Beamcove <Icon node={ArrowRight} />
                    </a>
                </div>
            </div>
        </Scene>
    );
}
