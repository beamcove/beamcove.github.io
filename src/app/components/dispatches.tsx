import { useState, type FormEvent } from "react";

import { Button, Callout, Splash, TextField } from "@/design-system";

export const ROSTER_URL = "https://roster.beamcove.com/subscribers";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Dispatches() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value = email.trim();
        if (!value) {
            setError("Enter your email address to subscribe.");
            return;
        }
        if (!EMAIL_PATTERN.test(value)) {
            setError("That email doesn’t look right. Check it and try again.");
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            const response = await fetch(ROSTER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ email: value }),
            });
            if (!response.ok) throw new Error(`Roster responded ${response.status}`);
            setDone(true);
            setEmail("");
        } catch {
            setError("We couldn’t sign you up. Try again in a minute.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="section" id="newsletter" aria-labelledby="newsletter-title">
            <div className="container">
                {/* Splashes print on paper in both themes, so pin their tokens to light. */}
                <Splash
                    tone="tide"
                    align="center"
                    className="dispatches"
                    data-theme="light"
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
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError("");
                                }}
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
