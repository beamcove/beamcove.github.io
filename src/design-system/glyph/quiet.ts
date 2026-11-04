import { slide } from "./lattice";
import type { Rect } from "./painter";

/**
 * The quiet zones: where a field keeps its art clear so copy reads cleanly.
 *
 * Inside every `[data-quiet]` element (`"soft"` only thins the glyphs, and
 * `"fixed"` furniture is handled per frame), what counts is the content itself,
 * not the marker's own box, which may be a loose wrapper or an inline span
 * that reports only part of its lines:
 * - text: the line boxes of its words, joined per paragraph or heading (so a
 *   ragged right edge doesn't let glyphs into the gaps);
 * - anything drawn as a box: controls, images and icons, and elements with a
 *   background or border (buttons, fields, cards, rows with a rule).
 * Hidden content (a closed answer) has no boxes, so it isn't quiet. Reveal
 * slides are left out, so a zone sits where the copy comes to rest.
 */

// drawn as boxes whatever their style
const BOX_TAGS = new Set(["BUTTON", "INPUT", "TEXTAREA", "SELECT", "IMG", "VIDEO", "HR", "svg"]);

/** Does a `::before` or `::after` draw something (a rule beside a kicker, a cue's line)? */
const hasPseudo = (el: Element) =>
    ["::before", "::after"].some((p) => {
        const content = getComputedStyle(el, p).content;
        return content !== "none" && content !== "normal";
    });

/** Is this element drawn as a box (a control, an image, a background or border, or ornaments)? */
function drawnAsBox(el: Element, style: CSSStyleDeclaration) {
    if (BOX_TAGS.has(el.tagName)) return true;
    if (hasPseudo(el)) return true;
    const bg = style.backgroundColor;
    if (bg && bg !== "transparent" && !bg.endsWith(", 0)")) return true;
    return ["Top", "Right", "Bottom", "Left"].some(
        (side) =>
            parseFloat(style.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0 &&
            style.getPropertyValue(`border-${side.toLowerCase()}-style`) !== "none",
    );
}

/** The boxes of what's inside `el`: one per paragraph or heading of text, and one per drawn box. */
export function contentBoxes(el: Element): DOMRect[] {
    const display = new Map<Element, string>();
    const styleOf = (e: Element) => getComputedStyle(e);
    const blockOf = (node: Node) => {
        // the nearest ancestor (up to `el`) that isn't laid out inline: the text's paragraph
        let e = node.parentElement;
        while (e && e !== el) {
            let d = display.get(e);
            if (d === undefined) {
                d = styleOf(e).display;
                display.set(e, d);
            }
            if (!d.startsWith("inline") && d !== "contents") return e;
            e = e.parentElement;
        }
        return el;
    };

    const groups = new Map<Element, DOMRect>();
    const boxes: DOMRect[] = [];
    const range = document.createRange();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    for (let node: Node | null = walker.currentNode; node; node = walker.nextNode()) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (!node.textContent?.trim()) continue;
            range.selectNodeContents(node);
            const key = blockOf(node);
            for (const line of range.getClientRects()) {
                if (!line.width || !line.height) continue;
                const had = groups.get(key);
                groups.set(key, had ? union(had, line) : DOMRect.fromRect(line));
            }
        } else {
            const e = node as Element;
            const style = styleOf(e);
            if (style.display === "none" || style.visibility === "hidden") continue;
            if (!drawnAsBox(e, style)) continue;
            for (const r of e.getClientRects()) if (r.width && r.height) boxes.push(r);
        }
    }
    return [...groups.values(), ...boxes];
}

function union(a: DOMRect, b: DOMRect) {
    const l = Math.min(a.left, b.left);
    const t = Math.min(a.top, b.top);
    return new DOMRect(l, t, Math.max(a.right, b.right) - l, Math.max(a.bottom, b.bottom) - t);
}

/** The quiet zones under `root`, relative to `origin`'s top left (at rest). */
export function quietRects(root: ParentNode, origin: { left: number; top: number }): Rect[] {
    const out: Rect[] = [];
    for (const el of root.querySelectorAll<HTMLElement>('[data-quiet]:not([data-quiet="fixed"])')) {
        const soft = el.dataset.quiet === "soft";
        const s = slide(el);
        for (const r of contentBoxes(el)) {
            out.push({
                l: r.left - s.x - origin.left,
                t: r.top - s.y - origin.top,
                r: r.right - s.x - origin.left,
                b: r.bottom - s.y - origin.top,
                soft,
            });
        }
    }
    // a box inside another adds nothing
    return out.filter(
        (a, i) =>
            !out.some(
                (b, j) =>
                    j !== i &&
                    b.l <= a.l &&
                    b.t <= a.t &&
                    b.r >= a.r &&
                    b.b >= a.b &&
                    (!b.soft || a.soft) &&
                    (j < i || b.l !== a.l || b.t !== a.t || b.r !== a.r || b.b !== a.b),
            ),
    );
}

/** The elements whose size moves the quiet zones: the markers (or, if inline, their block). */
export function quietSources(root: ParentNode): Element[] {
    return [...root.querySelectorAll<HTMLElement>('[data-quiet]:not([data-quiet="fixed"])')].map(
        (el) => (getComputedStyle(el).display.startsWith("inline") ? (el.parentElement ?? el) : el),
    );
}
