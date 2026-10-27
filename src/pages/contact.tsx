import type { CSSProperties } from "react";
import { ArrowUpRight, Mail } from "lucide";

import { BrandIcon } from "@/app/components/brand";
import { FaqList } from "@/app/components/faq-list";
import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { QUESTIONS } from "@/content/faq";
import { SITE, SOCIALS } from "@/content/site";

const BEST_FOR: Record<string, string> = {
    github: "Code, issues and anything open source.",
    discord: "Chatting with the crew and other sailors.",
    x: "Launches and short news.",
    reddit: "Longer threads and feedback.",
};

export function ContactPage() {
    return (
        <SiteLayout>
            <PageHero eyebrow="Contact" title="Hail the cove.">
                Questions, ideas or a leak in one of our ships? Here’s where to find us. We read
                everything.
            </PageHero>

            <section className="section section-tight" aria-labelledby="channels-title">
                <div className="container">
                    <h2 className="visually-hidden" id="channels-title">
                        Ways to reach us
                    </h2>
                    <ul className="channel-grid">
                        <li data-reveal className="channel-wide">
                            <a className="channel" href={`mailto:${SITE.email}`}>
                                <span className="icon-tile">
                                    <Icon node={Mail} size={20} />
                                </span>
                                <span className="channel-text">
                                    <span className="headline">Email</span>
                                    <span className="mono channel-handle">{SITE.email}</span>
                                    <span className="muted">
                                        Best for anything that needs a proper reply. We answer
                                        within a few working days.
                                    </span>
                                </span>
                                <Icon node={ArrowUpRight} size={18} />
                            </a>
                        </li>
                        {SOCIALS.map((s, i) => (
                            <li key={s.name} data-reveal style={{ "--d": i + 1 } as CSSProperties}>
                                <a className="channel" href={s.href} rel="noopener noreferrer">
                                    <span className="icon-tile">
                                        <BrandIcon name={s.name} />
                                    </span>
                                    <span className="channel-text">
                                        <span className="headline">{s.label}</span>
                                        <span className="mono channel-handle">{s.handle}</span>
                                        <span className="muted">{BEST_FOR[s.name]}</span>
                                    </span>
                                    <Icon node={ArrowUpRight} size={18} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="section" id="questions" aria-labelledby="questions-title">
                <div className="container faq-page">
                    <SectionHead id="questions" eyebrow="Questions" title="Asked at the dock.">
                        The things people ask us most. If yours isn’t here, send it over.
                    </SectionHead>
                    <FaqList items={QUESTIONS} />
                </div>
            </section>
        </SiteLayout>
    );
}
