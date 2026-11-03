import { ArrowRight } from "lucide";

import { ChapterHead } from "@/app/components/chapter-head";
import { Icon } from "@/app/components/icon";
import { LogList } from "@/app/components/log-list";
import { Scene } from "@/app/components/scene";
import { LOGBOOK } from "@/content/logbook";
import { ROUTES } from "@/content/site";

/** The newest updates, linking to the full log. */
export function LatestUpdates({ n }: { n?: number }) {
    return (
        <Scene name="updates" id="updates" aria-labelledby="updates-title">
            <div className="wrap">
                <div className="copy" data-quiet data-reveal>
                    <ChapterHead id="updates" n={n} kicker="Updates" title="Latest updates.">
                        Newest first. Our first projects are in the works, so for now it’s mostly
                        the site.
                    </ChapterHead>
                    <LogList entries={LOGBOOK.slice(0, 3)} />
                    <a className="bc-more more" href={ROUTES.updates}>
                        All updates <Icon node={ArrowRight} />
                    </a>
                </div>
            </div>
        </Scene>
    );
}
