import { ART } from "@/app/components/glyph-compositions";
import { useSubscribe } from "@/app/utils/subscribe";
import { Button, Callout, Splash, TextField } from "@/design-system";

export { ROSTER_URL } from "@/app/utils/subscribe";

export function Dispatches() {
    const { email, setEmail, error, done, submitting, submit } = useSubscribe();

    return (
        <section className="section" id="newsletter" aria-labelledby="newsletter-title">
            <div className="container">
                <Splash
                    field={ART.newsletter}
                    align="center"
                    className="dispatches"
                    eyebrow="Newsletter"
                    title={<span id="newsletter-title">Hear when we launch.</span>}
                >
                    <p className="bc-splash-body">
                        A friendly email whenever there’s something worth telling you. Unsubscribe
                        any time, no hard feelings.
                    </p>
                    {done ? (
                        <Callout
                            tone="success"
                            title="You’re subscribed."
                            className="dispatch-done"
                        >
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
                    )}
                </Splash>
            </div>
        </section>
    );
}
