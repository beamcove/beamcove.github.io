import type { CSSProperties } from "react";
import { ArrowUpRight, Mail } from "lucide";

import { BrandIcon } from "@/app/components/brand";
import { FaqList } from "@/app/components/faq-list";
import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { RisoArt } from "@/app/components/riso-art";
import { SectionHead } from "@/app/components/section-head";
import { SiteLayout } from "@/app/components/site-layout";
import { QUESTIONS } from "@/content/faq";
import { SITE, SOCIALS } from "@/content/site";

const BEST_FOR: Record<string, string> = {
    x: "News and short updates.",
    github: "Where Beamcove’s code lives.",
};

export function ContactPage() {
    return (
        <SiteLayout>
            <PageHero
                tone="meadow"
                eyebrow="Contact"
                title="Say hello."
                art={<RisoArt name="contact" className="page-splash-art" />}
            >
                Questions, partnerships, press, or just a kind word: here’s how to reach us.
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
                                        Best for anything that needs a proper reply.
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
                <div className="container">
                    <SectionHead id="questions" eyebrow="FAQ" title="Asked and answered.">
                        Didn’t find yours? Email us. A real person reads every message.
                    </SectionHead>
                    <FaqList items={QUESTIONS} />
                </div>
            </section>
        </SiteLayout>
    );
}
