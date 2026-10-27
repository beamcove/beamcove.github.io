import type { ReactNode } from "react";

export function SectionHead({
    id,
    eyebrow,
    title,
    children,
}: {
    id: string;
    eyebrow: string;
    title: string;
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
            {children && <p className="body-lg muted section-lead">{children}</p>}
        </header>
    );
}
