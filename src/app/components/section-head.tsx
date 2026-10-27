import type { ReactNode } from "react";

import { MoreLink } from "@/app/components/more-link";

export function SectionHead({
    id,
    eyebrow,
    title,
    more,
    children,
}: {
    id: string;
    eyebrow: string;
    title: string;
    /** Link to the full page this section summarises. */
    more?: { href: string; label: string };
    children?: ReactNode;
}) {
    return (
        <header className="section-head" data-reveal>
            <div>
                <p className="bc-eyebrow">{eyebrow}</p>
                <h2 className="title-1 section-title" id={`${id}-title`}>
                    {title}
                </h2>
            </div>
            {(children || more) && (
                <div className="section-aside">
                    {children && <p className="body-lg muted section-lead">{children}</p>}
                    {more && <MoreLink href={more.href}>{more.label}</MoreLink>}
                </div>
            )}
        </header>
    );
}
