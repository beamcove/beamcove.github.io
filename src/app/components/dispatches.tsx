import { ArrowUpRight, Mail } from "lucide";

import { BrandIcon } from "@/app/components/brand";
import { ChapterHead } from "@/app/components/chapter-head";
import { Icon } from "@/app/components/icon";
import { Scene } from "@/app/components/scene";
import { Section } from "@/app/components/section";
import { useSubscribe } from "@/app/utils/subscribe";
import { SITE, SOCIALS } from "@/content/site";
import { Button, Callout, TextField } from "@/design-system";

export { ROSTER_URL } from "@/app/utils/subscribe";

/** The closing screen: the newsletter, and the other ways to say hello. `compact` is the reading-page version. */
export function Dispatches({ n, compact = false }: { n?: number; compact?: boolean }) {
    const { email, setEmail, error, done, submitting, submit } = useSubscribe();

    const form = done ? (
        <Callout tone="success" title="You’re subscribed." className="dispatch-done">
            We’ll write when there’s news.
        </Callout>
    ) : (
        <form className="dispatch-form" onSubmit={submit} noValidate>
            <TextField
                label="Email address"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                error={error || undefined}
                hint="We only use it to send the newsletter."
                disabled={submitting}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={submitting}>
                {submitting ? "Subscribing…" : "Subscribe"}
            </Button>
        </form>
    );

    if (compact) {
        return (
            <Section
                id="newsletter"
                kicker="Newsletter"
                title="Hear when we launch."
                lead="A friendly email whenever there’s something worth telling you. Unsubscribe any time, no hard feelings."
            >
                {form}
            </Section>
        );
    }

    return (
        <Scene
            name="contact"
            className="dispatches"
            id="newsletter"
            aria-labelledby="newsletter-title"
        >
            <div className="wrap close">
                <div className="copy" data-quiet data-reveal>
                    <ChapterHead
                        id="newsletter"
                        n={n}
                        kicker="Newsletter"
                        title="Hear when we launch."
                    >
                        A friendly email whenever there’s something worth telling you. Unsubscribe
                        any time, no hard feelings.
                    </ChapterHead>
                    {form}
                </div>
                <div className="hello" data-quiet data-reveal>
                    <h3 className="kicker-plain">Or say hello</h3>
                    <ul>
                        <li>
                            <a href={`mailto:${SITE.email}`}>
                                <Icon node={Mail} size={18} />
                                {SITE.email}
                            </a>
                        </li>
                        {SOCIALS.map((s) => (
                            <li key={s.name}>
                                <a href={s.href} rel="noopener noreferrer">
                                    <BrandIcon name={s.name} />
                                    {s.label}
                                    <span className="handle">{s.handle}</span>
                                    <Icon node={ArrowUpRight} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Scene>
    );
}
