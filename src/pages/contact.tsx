import { ArrowUpRight, Mail } from "lucide";

import { BrandIcon } from "@/app/components/brand";
import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { FaqList } from "@/app/components/faq-list";
import { Section } from "@/app/components/section";
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
            <PageHero scene="hello" eyebrow="Contact" title="Say hello.">
                Questions, partnerships, press, or just a kind word: here’s how to reach us.
            </PageHero>

            <Section id="channels" kicker="Channels" title="Ways to reach us." stacked>
                <ul className="channels">
                    <li className="channel-wide">
                        <a className="channel" href={`mailto:${SITE.email}`}>
                            <Icon node={Mail} size={22} />
                            <span className="channel-text">
                                <span className="kicker-plain">Email</span>
                                <span className="title-2 channel-handle">{SITE.email}</span>
                                <span className="body-text">
                                    Best for anything that needs a proper reply.
                                </span>
                            </span>
                            <Icon node={ArrowUpRight} size={20} />
                        </a>
                    </li>
                    {SOCIALS.map((s) => (
                        <li key={s.name}>
                            <a className="channel" href={s.href} rel="noopener noreferrer">
                                <BrandIcon name={s.name} />
                                <span className="channel-text">
                                    <span className="kicker-plain">{s.label}</span>
                                    <span className="title-3 channel-handle">{s.handle}</span>
                                    <span className="body-text">{BEST_FOR[s.name]}</span>
                                </span>
                                <Icon node={ArrowUpRight} size={20} />
                            </a>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section
                id="questions"
                kicker="FAQ"
                title="Asked and answered."
                lead={
                    <>
                        Didn’t find yours? <a href={`mailto:${SITE.email}`}>Email us</a>. A real
                        person reads every message.
                    </>
                }
            >
                <FaqList items={QUESTIONS} />
            </Section>
        </SiteLayout>
    );
}
