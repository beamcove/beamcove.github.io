import { render, screen } from "@testing-library/react";

import { App } from "@/app/app";

describe("App", () => {
    it("renders the hero and every section", () => {
        render(<App />);
        expect(
            screen.getByRole("heading", { level: 1, name: /charting new horizons/i }),
        ).toBeInTheDocument();
        for (const name of [
            /many ships/i,
            /on the horizon/i,
            /adventure, integrity/i,
            /set sail/i,
        ]) {
            expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
        }
    });

    it("points every in-page link at a section that exists", () => {
        const { container } = render(<App />);
        const hrefs = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].map((a) =>
            a.getAttribute("href")!.slice(1),
        );
        for (const id of new Set(hrefs)) {
            expect(document.getElementById(id), `#${id}`).not.toBeNull();
        }
    });

    it("dates logbook entries the house way", () => {
        render(<App />);
        expect(screen.getByText("Oct 27, 2026")).toHaveAttribute("datetime", "2026-10-27");
    });
});
