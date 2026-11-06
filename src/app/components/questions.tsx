import { ArrowRight } from "lucide";

import { ChapterHead } from "@/app/components/chapter-head";
import { FaqList } from "@/app/components/faq-list";
import { Icon } from "@/app/components/icon";
import { Scene } from "@/app/components/scene";
import { QUESTIONS } from "@/content/faq";
import { ROUTES } from "@/content/site";

/** The home page's FAQ screen: the top four questions, linking to the rest. */
export function Questions({ n }: { n?: number }) {
    return (
        <Scene name="faq" id="questions" aria-labelledby="questions-title">
            <div className="wrap split">
                <div className="copy" data-quiet data-reveal>
                    <ChapterHead id="questions" n={n} kicker="FAQ" title="Asked and answered.">
                        The things people ask us most.
                    </ChapterHead>
                    <a className="bc-more more" href={`${ROUTES.contact}#questions`}>
                        See all questions <Icon node={ArrowRight} />
                    </a>
                </div>
                <div data-quiet data-reveal>
                    <FaqList items={QUESTIONS.slice(0, 4)} />
                </div>
            </div>
        </Scene>
    );
}
