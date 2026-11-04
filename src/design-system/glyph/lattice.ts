/**
 * The page grid: one 16px lattice for the whole document. Its dots are drawn
 * once, by CSS, on <html> (`background-position: 50% 0`), so they sit
 * horizontally centred (equal margins on any width) and anchored to the
 * document top. Every glyph field snaps its cells to the same lattice, so
 * art, ink blocks and dots always line up.
 *
 * In document coordinates, cell centres sit at
 *   x = pageWidth / 2 + CELL * k,   y = CELL / 2 + CELL * k.
 */
export const CELL = 16;

const mod = (a: number, n: number) => ((a % n) + n) % n;

/**
 * Where the first lattice cell starts inside an element, in its own CSS px:
 * a value in (-CELL, 0], so cells cover the element from its very edge.
 * `left`/`top` are the element's document position.
 */
export function latticeOffset(left: number, top: number, pageWidth: number, cell = CELL) {
    const x0 = pageWidth / 2 - cell / 2; // a cell's left edge, in document x
    const ox = mod(x0 - left, cell);
    const oy = mod(-top, cell);
    return { x: ox === 0 ? 0 : ox - cell, y: oy === 0 ? 0 : oy - cell };
}

/** The same offset for a live element, from its rect and the current scroll. */
/** Is an animation or transition moving this element (its translate or transform) right now? */
const moving = (e: Element) =>
    !!e
        .getAnimations?.()
        .some((a) =>
            ((a.effect as KeyframeEffect | null)?.getKeyframes?.() ?? []).some(
                (k) => "translate" in k || "transform" in k,
            ),
        );

/**
 * How far reveals have slid an element right now (its own or an ancestor's
 * `translate` or transform), so measurements can leave the slide out. Only
 * reveal motion counts: an element marked `data-reveal`, or one animating (the
 * first screen's copy rises in). A translate that's part of the layout, such as
 * centring with `translate: -50%`, stays in.
 */
export function slide(el: Element) {
    let x = 0;
    let y = 0;
    for (let e: Element | null = el; e && e !== document.documentElement; e = e.parentElement) {
        if (!e.hasAttribute("data-reveal") && !moving(e)) continue;
        const cs = getComputedStyle(e);
        if (cs.translate && cs.translate !== "none") {
            const [tx = "0", ty = "0"] = cs.translate.split(" ");
            x += parseFloat(tx) || 0;
            y += parseFloat(ty) || 0;
        }
        if (cs.transform && cs.transform !== "none") {
            const m = new DOMMatrixReadOnly(cs.transform);
            x += m.m41;
            y += m.m42;
        }
    }
    return { x, y };
}

/** Where an element sits in the document at rest (any slide-in left out). */
export function restingRect(el: Element) {
    const r = el.getBoundingClientRect();
    const s = slide(el);
    return { left: r.left - s.x, top: r.top - s.y, width: r.width, height: r.height };
}

export function elementLattice(el: Element) {
    const r = restingRect(el);
    const page = document.documentElement.clientWidth;
    return latticeOffset(r.left + window.scrollX, r.top + window.scrollY, page);
}
