import { render } from "@testing-library/react";

import { Face, Mark, MARK, Shape } from "@/design-system";

describe("the symbol set", () => {
    it("is decoration unless it has a label", () => {
        const { container, getByRole } = render(
            <>
                <Shape name="disc" />
                <Shape name="tri" label="Play" />
            </>,
        );
        expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
        expect(getByRole("img", { name: "Play" })).toBeTruthy();
    });

    it("draws the mark as ● ▲ ■, each in its own ink", () => {
        expect(MARK.map((m) => m.name)).toEqual(["disc", "tri", "square"]);
        expect(new Set(MARK.map((m) => m.ink)).size).toBe(3);
        const { container } = render(<Mark />);
        expect(container.querySelectorAll("svg > g")).toHaveLength(3);
    });

    it("draws a face as two eyes over a dash, on a 3×3 cell grid", () => {
        const { container } = render(<Face eyes="cross" size={32} />);
        const svg = container.querySelector("svg")!;
        expect(svg.getAttribute("width")).toBe("96");
        expect(svg.getAttribute("viewBox")).toBe("0 0 48 48");
        // two crosses and the mouth
        expect(svg.querySelectorAll("path")).toHaveLength(3);
    });
});
