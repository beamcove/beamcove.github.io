import { FaqList } from "@/app/components/faq-list";
import { SectionHead } from "@/app/components/section-head";
import { QUESTIONS } from "@/content/faq";
import { ROUTES } from "@/content/site";

/** Landing abstract of the FAQ: the top questions, linking to the full list. */
export function Questions() {
    return (
        <section className="section" id="questions" aria-labelledby="questions-title">
            <div className="container">
                <SectionHead
                    id="questions"
                    eyebrow="FAQ"
                    title="Asked and answered."
                    more={{ href: `${ROUTES.contact}#questions`, label: "See all questions" }}
                />
                <FaqList items={QUESTIONS.slice(0, 4)} />
            </div>
        </section>
    );
}
