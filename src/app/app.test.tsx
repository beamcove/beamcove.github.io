import { render, screen } from "@testing-library/react";

import App from "@/app/app";

describe("App", () => {
    it("renders the landing page with the default tweak copy", () => {
        render(<App />);
        expect(
            screen.getByRole("heading", { level: 1, name: /charting new horizons/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: /the compass we steer by/i }),
        ).toBeInTheDocument();
    });
});
