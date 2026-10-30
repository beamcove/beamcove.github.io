import type { CSSProperties } from "react";

import { ART } from "@/app/components/riso-compositions";
import { KINDS } from "@/content/fleet";

type Name = keyof typeof ART;
const NAMES = Object.keys(ART) as Name[];

/** The shapes of a composition (blooms aside). */
const shapes = (name: Name) => ART[name].filter((piece) => piece.shape !== "bloom");
const shapeInks = (name: Name) => new Set(shapes(name).map((piece) => piece.ink));

/** A card's art strip is 176px tall; boxes are measured from its top right. */
const STRIP_HEIGHT = 176;
function box(style: CSSProperties) {
    const { right, top, bottom, width, height } = style as Record<string, number>;
    const y = top ?? STRIP_HEIGHT - bottom! - height!;
    return { x1: right!, x2: right! + width!, y1: y, y2: y + height! };
}

describe("riso art", () => {
    it.each(NAMES)("%s prints its shapes in two different inks", (name) => {
        expect(shapeInks(name).size).toBe(2);
    });

    it.each(NAMES)("%s prints white first, under the inks that multiply over it", (name) => {
        const inks = shapes(name).map((piece) => piece.ink);
        const lastWhite = inks.lastIndexOf("white");
        const firstOther = inks.findIndex((ink) => ink !== "white");
        if (lastWhite >= 0) expect(lastWhite).toBeLessThan(firstOther);
    });

    it("never pairs red with yellow (the overlap barely shows)", () => {
        for (const name of NAMES) {
            const inks = shapeInks(name);
            expect(inks.has("red") && inks.has("yellow"), name).toBe(false);
        }
    });

    it("gives every kind card its own ink pair", () => {
        const pairs = KINDS.map((kind) => [...shapeInks(kind.art)].sort().join("+"));
        expect(new Set(pairs).size).toBe(pairs.length);
    });

    it.each(KINDS.map((kind) => kind.art))(
        "%s crosses its shapes a little, never one inside the other",
        (name) => {
            const [a, b] = shapes(name).map((piece) => box(piece.style));
            const crosses = a!.x1 < b!.x2 && b!.x1 < a!.x2 && a!.y1 < b!.y2 && b!.y1 < a!.y2;
            const inside = (p: typeof a, q: typeof a) =>
                p!.x1 >= q!.x1 && p!.x2 <= q!.x2 && p!.y1 >= q!.y1 && p!.y2 <= q!.y2;
            expect(crosses).toBe(true);
            expect(inside(a, b) || inside(b, a)).toBe(false);
        },
    );
});
