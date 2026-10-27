import { useEffect, useRef } from "react";

import { motionAllowed } from "@/app/utils/motion";

const SWEEP_MS = 3400; // one pass of the beam
const PAUSE_MS = 4200; // dark time between passes
const BAND = 96; // half-width of the beam, px
const SLANT = 0.4; // how far the beam leans
const POINTER_RADIUS = 120;

/**
 * A lighthouse over the splash's fitted dot grid: a beam sweeps across now and
 * then, and dots light up under the pointer. Drawn on a canvas that sits
 * exactly on the CSS dot grid (same pitch, margins and pixel nudge), so the lit
 * dots are the grid's own dots growing and taking on beam ink.
 * Must be a direct child of a `.bc-dotfield` surface.
 */
export function BeamDots() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const host = canvas?.parentElement;
        if (!canvas || !host || typeof ResizeObserver === "undefined") return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = 0;
        let h = 0;
        let dpr = 1;
        let size = 2;
        let color = "#0a6cbd";
        let xs: number[] = [];
        let ys: number[] = [];
        // the text block: dots under it stay dim so the copy always reads
        let quiet = { l: 0, t: 0, r: 0, b: 0 };

        const layout = () => {
            const cs = getComputedStyle(host);
            const pitch = parseFloat(cs.getPropertyValue("--dot-pitch")) || 16;
            size = parseFloat(cs.getPropertyValue("--dot-size")) || 2;
            const nudgeX = parseFloat(host.style.getPropertyValue("--dot-dx")) || 0;
            const nudgeY = parseFloat(host.style.getPropertyValue("--dot-dy")) || 0;
            color = cs.getPropertyValue("--beam").trim() || color;
            w = host.clientWidth;
            h = host.clientHeight;
            dpr = window.devicePixelRatio || 1;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            // Same maths as the .bc-dotfield::before layer: interior points only,
            // equal margins, whole pixels.
            const span = (len: number) => Math.floor(len / pitch) * pitch - 2 * pitch + size;
            const sw = span(w);
            const sh = span(h);
            const left = Math.floor((w - sw) / 2) + nudgeX;
            const top = Math.floor((h - sh) / 2) + nudgeY;
            xs = [];
            ys = [];
            for (let x = left; x <= left + sw - size + 0.01; x += pitch) xs.push(x);
            for (let y = top; y <= top + sh - size + 0.01; y += pitch) ys.push(y);
            const content = host.querySelector(".bc-splash-content");
            if (content) {
                const hr = host.getBoundingClientRect();
                const cr = content.getBoundingClientRect();
                const pad = 12;
                quiet = {
                    l: cr.left - hr.left - pad,
                    t: cr.top - hr.top - pad,
                    r: cr.right - hr.left + pad,
                    b: cr.bottom - hr.top + pad,
                };
            }
        };

        // ── state ──
        let raf = 0;
        let timer = 0;
        let visible = true;
        let sweepStart = -1;
        let pointerX = 0;
        let pointerY = 0;
        let pointerTarget = 0;
        let pointerLevel = 0;

        const snap = (v: number) => Math.round(v * dpr) / dpr;

        type Sweep = { x: number; strength: number };

        const draw = (sweep: Sweep | null) => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            if (sweep === null && pointerLevel < 0.01) return;
            ctx.fillStyle = color;
            for (const y of ys) {
                for (const x of xs) {
                    let lit = 0;
                    if (sweep !== null) {
                        const d = (x + y * SLANT - sweep.x) / BAND;
                        lit = sweep.strength * Math.exp(-d * d * 2.2);
                    }
                    if (pointerLevel > 0.01) {
                        const dist = Math.hypot(x - pointerX, y - pointerY) / POINTER_RADIUS;
                        if (dist < 1) lit = Math.max(lit, pointerLevel * (1 - dist) ** 2);
                    }
                    if (x > quiet.l && x < quiet.r && y > quiet.t && y < quiet.b) lit *= 0.3;
                    if (lit < 0.04) continue;
                    const s = snap(size + 3 * lit);
                    ctx.globalAlpha = Math.min(1, 0.2 + lit * 0.8);
                    ctx.fillRect(snap(x + size / 2 - s / 2), snap(y + size / 2 - s / 2), s, s);
                }
            }
            ctx.globalAlpha = 1;
        };

        // Even pace through the middle, gentle at both ends, and the beam fades in
        // and out so it never pops. It starts and ends well beyond the furthest
        // dot (the slant carries the beam past the right edge at the bottom).
        const ease = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;
        const sweepAt = (t: number): Sweep => {
            const from = -2.5 * BAND;
            const to = w + h * SLANT + 2.5 * BAND;
            const fade = Math.min(1, t / 0.2, (1 - t) / 0.2);
            return { x: from + ease(t) * (to - from), strength: fade * fade * (3 - 2 * fade) };
        };

        const tick = (now: number) => {
            raf = 0;
            let sweep: Sweep | null = null;
            if (sweepStart >= 0) {
                const t = (now - sweepStart) / SWEEP_MS;
                if (t >= 1) {
                    sweepStart = -1;
                    schedule(PAUSE_MS);
                } else {
                    sweep = sweepAt(t);
                }
            }
            pointerLevel += (pointerTarget - pointerLevel) * 0.14;
            draw(sweep);
            if (sweepStart >= 0 || Math.abs(pointerTarget - pointerLevel) > 0.01) kick();
        };
        const kick = () => {
            if (!raf) raf = requestAnimationFrame(tick);
        };
        const startSweep = () => {
            if (!visible || document.hidden) return schedule(PAUSE_MS);
            sweepStart = performance.now();
            kick();
        };
        const schedule = (ms: number) => {
            if (!motionAllowed()) return;
            window.clearTimeout(timer);
            timer = window.setTimeout(startSweep, ms);
        };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const r = host.getBoundingClientRect();
            pointerX = e.clientX - r.left;
            pointerY = e.clientY - r.top;
            pointerTarget = 1;
            if (sweepStart < 0) draw(null);
            kick();
        };
        const onLeave = () => {
            pointerTarget = 0;
            kick();
        };

        layout();
        const ro = new ResizeObserver(() => {
            layout();
            draw(null);
        });
        ro.observe(host);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? true;
        });
        io.observe(host);
        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);
        schedule(1500); // first pass once the hero has printed in

        return () => {
            cancelAnimationFrame(raf);
            window.clearTimeout(timer);
            ro.disconnect();
            io.disconnect();
            host.removeEventListener("pointermove", onMove);
            host.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return <canvas ref={ref} className="beam-dots" aria-hidden="true" />;
}
