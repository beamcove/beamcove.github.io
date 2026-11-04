import { useEffect, useState } from "react";

import { docTop, onLayout } from "./doc-layout";
import { cancelFrame, type FrameView, nextFrame } from "./frame-loop";

export interface Chapter {
    id: string;
    label: string;
}

/** Which chapter's section sits under the top 40% of the viewport. */
export function useActiveChapter(chapters: Chapter[]) {
    const [active, setActive] = useState(chapters[0]?.id ?? "");
    useEffect(() => {
        let tops: { id: string; top: number }[] = [];
        // from cached positions and the frame's scroll (read once per frame): scrolling never
        // reads the layout
        const at = (scrollY: number, vh: number) => {
            const line = scrollY + vh * 0.4;
            let current = chapters[0]?.id ?? "";
            for (const { id, top } of tops) if (top <= line) current = id;
            setActive(current);
        };
        const update = (view: FrameView) => at(view.scrollY, view.vh);
        const onScroll = () => nextFrame(update);
        const stop = onLayout(() => {
            tops = chapters.map(({ id }) => {
                const el = document.getElementById(id);
                return { id, top: el ? docTop(el) : Infinity };
            });
            at(window.scrollY, window.innerHeight);
        });
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelFrame(update);
            stop();
            window.removeEventListener("scroll", onScroll);
        };
    }, [chapters]);
    return active;
}
