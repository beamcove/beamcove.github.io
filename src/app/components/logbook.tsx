import { FaqList } from "@/app/components/faq-list";
import { LogList } from "@/app/components/log-list";
import { MoreLink } from "@/app/components/more-link";
import { QUESTIONS } from "@/content/faq";
import { LOGBOOK } from "@/content/logbook";
import { ROUTES } from "@/content/site";

/** Landing abstract: the latest log entries and the top questions. */
export function Logbook() {
    return (
        <section className="section" aria-label="Updates and questions">
            <div className="container logbook-grid">
                <div id="logbook">
                    <header className="split-head" data-reveal>
                        <p className="bc-eyebrow">Updates</p>
                        <h2 className="title-2">What’s new at Beamcove.</h2>
                    </header>
                    <LogList entries={LOGBOOK.slice(0, 3)} />
                    <div className="split-more">
                        <MoreLink href={ROUTES.updates}>See all updates</MoreLink>
                    </div>
                </div>

                <div id="questions">
                    <header className="split-head" data-reveal>
                        <p className="bc-eyebrow">FAQ</p>
                        <h2 className="title-2">Frequently asked questions.</h2>
                    </header>
                    <FaqList items={QUESTIONS.slice(0, 4)} />
                    <div className="split-more">
                        <MoreLink href={`${ROUTES.contact}#questions`}>See all questions</MoreLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
