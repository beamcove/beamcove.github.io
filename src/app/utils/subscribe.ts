import { useState, type FormEvent } from "react";

export const ROSTER_URL = "https://roster.beamcove.com/subscribers";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The newsletter sign-up: validation, the POST to the roster and its states.
 * Any form can use it (the home page's Dispatches, every lab site).
 */
export function useSubscribe() {
    const [email, setEmailValue] = useState("");
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const setEmail = (value: string) => {
        setEmailValue(value);
        if (error) setError("");
    };

    const submit = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
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
            setEmailValue("");
        } catch {
            setError("We couldn’t sign you up. Try again in a minute.");
        } finally {
            setSubmitting(false);
        }
    };

    return { email, setEmail, error, done, submitting, submit };
}
