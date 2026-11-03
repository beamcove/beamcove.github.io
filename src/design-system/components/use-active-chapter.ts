import { useEffect, useState } from "react";

export interface Chapter {
    id: string;
    label: string;
}

/** Which chapter's section sits under the top 40% of the viewport. */
export function useActiveChapter(chapters: Chapter[]) {
    const [active, setActive] = useState(chapters[0]?.id ?? "");
    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            let current = chapters[0]?.id ?? "";
            for (const { id } of chapters) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
            }
            setActive(current);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [chapters]);
    return active;
}
