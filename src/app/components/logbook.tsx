import { FaqList } from "@/app/components/faq-list";
import { LogList } from "@/app/components/log-list";
import { MoreLink } from "@/app/components/more-link";
import { QUESTIONS } from "@/content/faq";
import { LOGBOOK } from "@/content/logbook";
import { ROUTES } from "@/content/site";

/** Landing abstract: the latest log entries and the top questions. */
export function Logbook() {
    return (
        <section className="section" aria-label="Logbook and questions">
            <div className="container logbook-grid">
                <div id="logbook">
                    <header className="split-head" data-reveal>
                        <p className="bc-eyebrow">Logbook</p>
                        <h2 className="title-2">Notes from the voyage so far.</h2>
                    </header>
                    <LogList entries={LOGBOOK.slice(0, 3)} />
                    <div className="split-more">
                        <MoreLink href={ROUTES.logbook}>Open the logbook</MoreLink>
                    </div>
                </div>

                <div id="questions">
                    <header className="split-head" data-reveal>
                        <p className="bc-eyebrow">Questions</p>
                        <h2 className="title-2">Asked at the dock.</h2>
                    </header>
                    <FaqList items={QUESTIONS.slice(0, 4)} />
                    <div className="split-more">
                        <MoreLink href={`${ROUTES.contact}#questions`}>More questions</MoreLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
