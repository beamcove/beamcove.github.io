import { useEffect, useState } from "react";

import { docTop, onLayout } from "./doc-layout";

export interface Chapter {
    id: string;
    label: string;
}

/** Which chapter's section sits under the top 40% of the viewport. */
export function useActiveChapter(chapters: Chapter[]) {
    const [active, setActive] = useState(chapters[0]?.id ?? "");
    useEffect(() => {
        let frame = 0;
        let tops: { id: string; top: number }[] = [];
        // from cached positions and scrollY: scrolling never reads the layout
        const update = () => {
            frame = 0;
            const line = window.scrollY + window.innerHeight * 0.4;
            let current = chapters[0]?.id ?? "";
            for (const { id, top } of tops) if (top <= line) current = id;
            setActive(current);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        const stop = onLayout(() => {
            tops = chapters.map(({ id }) => {
                const el = document.getElementById(id);
                return { id, top: el ? docTop(el) : Infinity };
            });
            update();
        });
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            stop();
            window.removeEventListener("scroll", onScroll);
        };
    }, [chapters]);
    return active;
}
