import { quietRects, quietSources } from "@/design-system/glyph/quiet";

// jsdom has no layout: each text node and element gets the boxes listed here, by id
const TEXT_LINES: Record<string, [number, number, number, number][]> = {
    // a centred title on two lines, inside an inline span (the hero's markup)
    title: [
        [190, 340, 1060, 76],
        [450, 416, 540, 76],
    ],
    // a paragraph whose text runs through a link
    para: [[100, 600, 400, 24]],
    link: [[500, 600, 60, 24]],
    tail: [[100, 624, 200, 24]],
    question: [[700, 300, 400, 24]],
    // a closed answer is not rendered: no boxes
    answer: [],
};
const ELEMENT_BOXES: Record<string, [number, number, number, number]> = {
    go: [100, 700, 160, 48],
};

function rects(list: [number, number, number, number][]) {
    return list.map(([x, y, w, h]) => new DOMRect(x, y, w, h)) as unknown as DOMRectList;
}

beforeAll(() => {
    Range.prototype.getClientRects = function (this: Range) {
        const id = (this.startContainer as Text).parentElement?.id ?? "";
        return rects(TEXT_LINES[id] ?? []);
    };
    Element.prototype.getClientRects = function (this: Element) {
        const box = ELEMENT_BOXES[this.id];
        return rects(box ? [box] : []);
    };
});

function page() {
    document.body.innerHTML = `
        <section id="root">
            <div data-quiet>
                <h1><span data-quiet id="title">Charting new horizons in the digital sea.</span></h1>
                <p><span id="para">We take the craft</span> <a id="link">seriously</a> <span id="tail">and fun.</span></p>
                <button id="go">See what we do</button>
            </div>
            <div data-quiet>
                <details><summary><span id="question">What is it?</span></summary><p id="answer">Answer.</p></details>
            </div>
        </section>`;
    return document.getElementById("root")!;
}

const box = (r: { l: number; t: number; r: number; b: number }) => [r.l, r.t, r.r - r.l, r.b - r.t];

describe("quiet zones", () => {
    it("cover every line of a title, whatever wraps it", () => {
        const zones = quietRects(page(), { left: 0, top: 0 }).map(box);
        // both lines, as one box: the hero's first line is no longer left out
        expect(zones).toContainEqual([190, 340, 1060, 152]);
    });

    it("join a paragraph's lines into one box, and keep a button as its own", () => {
        const zones = quietRects(page(), { left: 0, top: 0 }).map(box);
        expect(zones).toContainEqual([100, 600, 460, 48]);
        expect(zones).toContainEqual([100, 700, 160, 48]);
    });

    it("leave out what isn't shown (a closed answer)", () => {
        const zones = quietRects(page(), { left: 0, top: 0 }).map(box);
        expect(zones).toContainEqual([700, 300, 400, 24]);
        expect(zones).toHaveLength(4);
    });

    it("are relative to the canvas", () => {
        const zones = quietRects(page(), { left: 100, top: 300 }).map(box);
        expect(zones).toContainEqual([90, 40, 1060, 152]);
    });

    it("are watched through each marker, or the block around an inline one", () => {
        const sources = quietSources(page());
        expect(sources.map((e) => e.tagName)).toEqual(["DIV", "H1", "DIV"]);
    });
});
