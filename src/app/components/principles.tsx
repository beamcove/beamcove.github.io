import type { CSSProperties } from "react";

import { SectionHead } from "@/app/components/section-head";
import { ROUTES } from "@/content/site";
import { VALUES } from "@/content/values";

export function Principles() {
    return (
        <section className="section" id="principles" aria-labelledby="principles-title">
            <div className="container">
                <div className="principles bc-dots">
                    <SectionHead
                        id="principles"
                        eyebrow="Our values"
                        title="What we hold ourselves to."
                        more={{ href: ROUTES.values, label: "Read our values" }}
                    />
                    <ol className="principle-list">
                        {VALUES.map((value, i) => (
                            <li key={value.id} data-reveal style={{ "--d": i } as CSSProperties}>
                                <span className="ink-figure" aria-hidden="true">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h3 className="title-3">{value.title}</h3>
                                <p className="muted">{value.body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
