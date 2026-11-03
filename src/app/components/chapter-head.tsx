import type { ReactNode } from "react";

import { Kicker } from "@/design-system";

/** A chapter's opening: a numbered kicker, the title, an optional lead. */
export function ChapterHead({
    id,
    n,
    kicker,
    title,
    size = "md",
    children,
}: {
    /** The h2's id is `${id}-title`, for aria-labelledby. */
    id: string;
    n?: number;
    kicker: string;
    title: ReactNode;
    size?: "md" | "lg";
    children?: ReactNode;
}) {
    return (
        <header className="chapter-head">
            <Kicker n={n}>{kicker}</Kicker>
            <h2
                className={size === "lg" ? "display chapter-title" : "title-1 chapter-title"}
                id={`${id}-title`}
            >
                {title}
            </h2>
            {children && <p className="lead">{children}</p>}
        </header>
    );
}
