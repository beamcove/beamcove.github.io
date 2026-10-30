import { LegalPage, type LegalSection } from "@/app/components/legal-page";
import { ROUTES, SITE } from "@/content/site";

const SECTIONS: LegalSection[] = [
    {
        id: "about",
        title: "About these terms",
        body: (
            <>
                <p>
                    These terms are an agreement between you and {SITE.legalName}, a limited
                    liability company registered in Georgia, USA. They cover your use of
                    beamcove.com and the Beamcove newsletter. By using the site you agree to them.
                    If you don’t agree, please don’t use the site.
                </p>
                <p>
                    Each Beamcove product or service will have its own terms when it launches. Where
                    those terms differ from these ones, they take precedence for that product or
                    service.
                </p>
            </>
        ),
    },
    {
        id: "use",
        title: "Using the site",
        body: (
            <>
                <p>You’re welcome to browse, read, share links and subscribe. Please don’t:</p>
                <ul>
                    <li>use the site for anything unlawful;</li>
                    <li>try to break, overload or get around the security of the site;</li>
                    <li>scrape it in a way that degrades it for others;</li>
                    <li>sign other people up for the newsletter without their permission.</li>
                </ul>
            </>
        ),
    },
    {
        id: "newsletter",
        title: "The newsletter",
        body: (
            <p>
                The newsletter is free. You can unsubscribe at any time with the link in every
                email. We may change how often we send it, or stop sending it. How we handle your
                email address is covered by our <a href={ROUTES.privacy}>privacy policy</a>.
            </p>
        ),
    },
    {
        id: "content",
        title: "Our content and name",
        body: (
            <p>
                The text, design and code of this site belong to {SITE.legalName} unless we say
                otherwise. The Beamcove name and wordmark are ours too. You’re welcome to use them
                to write about us, following the <a href={ROUTES.brand}>brand kit</a>, but not in a
                way that suggests we endorse you or your product.
            </p>
        ),
    },
    {
        id: "links",
        title: "Links to other sites",
        body: (
            <p>
                We link to other sites, such as X and GitHub. We don’t control those sites and
                aren’t responsible for them. Their own terms and policies apply when you visit.
            </p>
        ),
    },
    {
        id: "warranty",
        title: "No guarantees",
        body: (
            <p>
                We work hard to keep the site accurate and available, but we provide it “as is”,
                without warranties of any kind. Plans for products and services, including dates and
                features, can change before launch.
            </p>
        ),
    },
    {
        id: "liability",
        title: "Limits on liability",
        body: (
            <p>
                To the fullest extent the law allows, {SITE.legalName} isn’t liable for any indirect
                or consequential loss arising from your use of the site. Nothing in these terms
                limits liability that can’t be limited by law.
            </p>
        ),
    },
    {
        id: "law",
        title: "Governing law",
        body: (
            <p>
                These terms are governed by the laws of the State of Georgia, USA, without regard to
                its conflict-of-law rules.
            </p>
        ),
    },
    {
        id: "changes",
        title: "Changes to these terms",
        body: (
            <p>
                We may update these terms. When we do, we’ll change the date at the top and note it
                in our <a href={ROUTES.updates}>updates</a>. Using the site after a change means you
                accept the new terms.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact",
        body: (
            <p>
                Questions about these terms go to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>
        ),
    },
];

export function TermsPage() {
    return (
        <LegalPage
            eyebrow="Terms"
            title="Terms of use."
            lead="The rules for using beamcove.com and the Beamcove newsletter."
            summary={[
                "Use the site lawfully and kindly.",
                "The newsletter is free and you can unsubscribe any time.",
                "Our name and content are ours; the brand kit says how to use them.",
                "Georgia law applies.",
                "Each product or service will have its own terms when it launches.",
            ]}
            sections={SECTIONS}
        />
    );
}
