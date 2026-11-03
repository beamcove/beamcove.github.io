import { ArrowRight } from "lucide";

import { ChapterHead } from "@/app/components/chapter-head";
import { FaqList } from "@/app/components/faq-list";
import { Icon } from "@/app/components/icon";
import { Scene } from "@/app/components/scene";
import { QUESTIONS } from "@/content/faq";
import { ROUTES, SITE } from "@/content/site";

/** The FAQ screen: a heading on the left, the questions on the right. */
export function Questions({ n, all = false }: { n?: number; all?: boolean }) {
    return (
        <Scene name="faq" id="questions" aria-labelledby="questions-title">
            <div className="wrap split">
                <div className="copy" data-quiet data-reveal>
                    <ChapterHead id="questions" n={n} kicker="FAQ" title="Asked and answered.">
                        {all ? (
                            <>
                                Didn’t find yours? <a href={`mailto:${SITE.email}`}>Email us</a>. A
                                real person reads every message.
                            </>
                        ) : (
                            "The things people ask us most."
                        )}
                    </ChapterHead>
                    {!all && (
                        <a className="bc-more more" href={`${ROUTES.contact}#questions`}>
                            See all questions <Icon node={ArrowRight} />
                        </a>
                    )}
                </div>
                <div data-quiet data-reveal>
                    <FaqList items={all ? QUESTIONS : QUESTIONS.slice(0, 4)} />
                </div>
            </div>
        </Scene>
    );
}
