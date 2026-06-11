/* Beamcove landing — newsletter / "come aboard" section.
  The page's primary action: subscribe with an email. Inline validation +
  a friendly success state backed by a roster API submit. */

import { useState, type FormEvent } from "react";

export function Newsletter({ inkPreset }: { inkPreset: string }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value = email.trim();
        if (!value) {
            setError("We'll need an email to send word.");
            return;
        }
        // simple, forgiving email check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setError("That doesn't look like a course we can chart. Check the address?");
            return;
        }
        setError("");

        try {
            setIsSubmitting(true);
            const response = await fetch("https://roster.beamcove.com/subscribers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email: value }),
            });

            if (!response.ok) {
                throw new Error("Subscription request failed.");
            }

            setDone(true);
            setEmail("");
        } catch {
            setError("We couldn't add you right now. Try again in a minute.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="dispatches" className="lp-section">
            <div className="lp-container">
                <div className={"lp-cta ink-bg ink-bg--" + inkPreset + " lp-reveal"}>
                    <span className="ink-blob ink-blob--a"></span>
                    <span className="ink-blob ink-blob--b"></span>
                    <div className="ink-bg__content">
                        <p className="eyebrow">Dispatches from the cove</p>
                        <h2>Get word when we set sail.</h2>
                        <p className="lead">
                            No noise, no spam — just an occasional note when a new ship launches or
                            something worth sharing rolls in.
                        </p>

                        {done ? (
                            <div className="lp-cta__success" role="status">
                                <i data-lucide="anchor"></i>
                                You're aboard. Welcome to the crew — watch the horizon.
                            </div>
                        ) : (
                            <>
                                <form className="lp-form" onSubmit={submit} noValidate>
                                    <div className="lp-form__field">
                                        <input
                                            className="bc-input"
                                            type="email"
                                            placeholder="you@yourcove.com"
                                            value={email}
                                            aria-label="Email address"
                                            aria-invalid={!!error}
                                            disabled={isSubmitting}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError("");
                                            }}
                                        />
                                    </div>
                                    <button
                                        className="bc-btn bc-btn--pop bc-btn--lg"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Subscribing..." : "Subscribe"}
                                    </button>
                                </form>
                                <div className="lp-cta__error" aria-live="polite">
                                    {error}
                                </div>
                                <p className="lp-cta__fine">
                                    Unsubscribe whenever you like. We won't share your address with
                                    another soul.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
