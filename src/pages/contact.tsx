import { ArrowUpRight, Mail } from "lucide";

import { BrandIcon } from "@/app/components/brand";
import { Icon } from "@/app/components/icon";
import { PageHero } from "@/app/components/page-hero";
import { Questions } from "@/app/components/questions";
import { Scene } from "@/app/components/scene";
import { SiteLayout } from "@/app/components/site-layout";
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

            <Scene name="channels" aria-labelledby="channels-title">
                <div className="wrap">
                    <h2 className="visually-hidden" id="channels-title">
                        Ways to reach us
                    </h2>
                    <ul className="channels" data-quiet data-reveal>
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
                </div>
            </Scene>

            <Questions all />
        </SiteLayout>
    );
}
