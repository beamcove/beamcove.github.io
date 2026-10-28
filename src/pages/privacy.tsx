import { LegalPage, type LegalSection } from "@/app/components/legal-page";
import { ROUTES, SITE } from "@/content/site";

const email = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;

const SECTIONS: LegalSection[] = [
    {
        id: "scope",
        title: "What this covers",
        body: (
            <>
                <p>
                    This policy covers beamcove.com and the Beamcove newsletter. It explains what we
                    collect, why, and what you can do about it. “We” means {SITE.legalName}, a
                    limited liability company registered in Georgia, USA; “you” means anyone
                    visiting the site or reading the newsletter.
                </p>
                <p>
                    Each Beamcove product will have its own privacy notice when it launches, because
                    each one handles different data.
                </p>
            </>
        ),
    },
    {
        id: "collect",
        title: "What we collect",
        body: (
            <>
                <p>
                    <strong>If you subscribe to the newsletter:</strong> your email address. That’s
                    all. We store it with our subscriber service so we can send you the newsletter.
                </p>
                <p>
                    <strong>When you browse:</strong> nothing that identifies you. This site has no
                    analytics, no advertising, no tracking pixels and no tracking cookies. Our fonts
                    are served from our own domain, so loading a page doesn’t contact anyone else.
                </p>
                <p>
                    <strong>On your device:</strong> if you switch to the dark theme, your browser
                    remembers that choice in local storage under <code>bc-theme</code>. It never
                    leaves your device, and clearing your site data removes it.
                </p>
                <p>
                    <strong>Hosting:</strong> the site is hosted on GitHub Pages. Like most hosts,
                    GitHub may log technical details such as IP addresses to keep the service
                    secure. We don’t receive those logs. GitHub’s own privacy statement covers them.
                </p>
            </>
        ),
    },
    {
        id: "use",
        title: "How we use it",
        body: (
            <ul>
                <li>We use your email address only to send the newsletter.</li>
                <li>We don’t build profiles, sell data or share it for advertising.</li>
                <li>We don’t combine it with data from other sources.</li>
            </ul>
        ),
    },
    {
        id: "sharing",
        title: "Who else sees it",
        body: (
            <p>
                Only the service providers that store and deliver the newsletter on our behalf, and
                only for that purpose. We’d also disclose data if the law required it, and we’d tell
                you unless we were legally prevented from doing so.
            </p>
        ),
    },
    {
        id: "retention",
        title: "How long we keep it",
        body: (
            <p>
                We keep your email address while you’re subscribed. Every newsletter email has an
                unsubscribe link; when you use it, or ask us, we remove your address from our list.
            </p>
        ),
    },
    {
        id: "rights",
        title: "Your choices and rights",
        body: (
            <>
                <p>
                    You can ask to see, correct or delete the data we hold about you, or object to
                    how we use it. Email {email} with your request. Depending on where you live, you
                    may also have the right to complain to your local data protection authority.
                </p>
            </>
        ),
    },
    {
        id: "children",
        title: "Children",
        body: (
            <p>
                This site isn’t aimed at children under 13, and we don’t knowingly collect their
                data. If you think a child has subscribed, tell us and we’ll remove them.
            </p>
        ),
    },
    {
        id: "changes",
        title: "Changes to this policy",
        body: (
            <p>
                If we change this policy, we’ll update the date at the top and note the change in
                our <a href={ROUTES.updates}>updates</a>. If a change matters for subscribers, we’ll
                say so in the newsletter.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact",
        body: <p>Questions about privacy go to {email}.</p>,
    },
];

export function PrivacyPage() {
    return (
        <LegalPage
            eyebrow="Privacy"
            title="Privacy policy."
            lead="What we collect, why we collect it and what you can do about it, in plain words."
            summary={[
                "We don’t track you on this site: no analytics, ads or tracking cookies.",
                "If you subscribe to the newsletter, we keep your email address to send it, and nothing else.",
                "We never sell your data, and you can ask us to delete it at any time.",
            ]}
            sections={SECTIONS}
        />
    );
}
