import { useEffect, useRef } from "react";

import type { GlyphComposition } from "../glyph/engine";
import { motionAllowed } from "../glyph/motion";
import { createPainter, quietRects } from "../glyph/painter";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export interface StageProps {
    /** Every scene a `Screen` on this page may name, by name. */
    scenes: Record<string, GlyphComposition>;
    /** The scene whose screen sweeps the lighthouse beam; default "hero". */
    beamScene?: string;
}

/**
 * The page's one glyph field: a fixed canvas behind everything that
 * dissolves from scene to scene as each `Screen` (`[data-scene]`) arrives,
 * stays quiet behind every `[data-quiet]` box, and sweeps the beam on the
 * beam scene. It also writes scroll progress (`--p`, and `data-step` when
 * asked) on pinned screens (`[data-progress]`). It only runs under
 * `html.motion`; without it each Screen prints its own still.
 */
export function Stage({ scenes, beamScene = "hero" }: StageProps) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas || !motionAllowed()) return;
        const painter = createPainter(canvas);
        if (!painter) return;
        const screens = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
        const pins = [...document.querySelectorAll<HTMLElement>("[data-progress]")];
        const first = screens[0]?.dataset.scene ?? beamScene;
        const seen = new Map<HTMLElement, string>();
        let width = 0;
        let height = 0;
        let frame = 0;
        let last = 0;

        const tick = (now: number) => {
            frame = requestAnimationFrame(tick);
            if (now - last < 33) return;
            last = now;
            const cw = canvas.clientWidth;
            const ch = canvas.clientHeight;
            // phones resize the viewport as the toolbar hides: only rebuild on real changes
            if (cw !== width || Math.abs(ch - height) > 120) {
                width = cw;
                height = ch;
                painter.resize(cw, ch, 1.5);
            }
            const vh = window.innerHeight;
            const tops = screens.map((s) => s.getBoundingClientRect().top);
            // a scene takes over as its screen's top crosses from 75% to 25% of the viewport
            let at = 0;
            tops.forEach((top, i) => {
                if (top <= vh * 0.25) at = i;
            });
            const next = screens[at + 1];
            const t = next ? clamp01((vh * 0.75 - tops[at + 1]!) / (vh * 0.5)) : 0;
            const nameA = screens[at]?.dataset.scene ?? first;
            const nameB = next && t > 0 ? next.dataset.scene : undefined;
            const a = scenes[nameA] ?? scenes[first];
            if (!a) return;

            for (const pin of pins) {
                const r = pin.getBoundingClientRect();
                const span = r.height - vh;
                const p = span > 40 ? clamp01(-r.top / span) : 1;
                const steps = Number(pin.dataset.progress) || 0;
                const key = p.toFixed(3);
                if (seen.get(pin) === key) continue;
                seen.set(pin, key);
                pin.style.setProperty("--p", key);
                if (steps) pin.dataset.step = String(Math.min(steps - 1, Math.floor(p * steps)));
            }

            painter.draw({
                a,
                b: nameB ? (scenes[nameB] ?? null) : null,
                t,
                quiet: quietRects(document, { left: 0, top: 0 }),
                time: now,
                animate: true,
                beam: (nameA === beamScene ? 1 - t : 0) + (nameB === beamScene ? t : 0),
            });
        };

        const start = () => {
            if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
        };
        const onVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(frame);
                frame = 0;
            } else start();
        };
        start();
        canvas.dataset.live = "";
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            cancelAnimationFrame(frame);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [scenes, beamScene]);

    return <canvas ref={ref} className="bc-stage" aria-hidden="true" />;
}
