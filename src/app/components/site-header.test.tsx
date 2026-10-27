import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SiteHeader } from "@/app/components/site-header";

describe("SiteHeader", () => {
    it("opens and closes the phone menu", async () => {
        render(<SiteHeader />);
        const toggle = screen.getByRole("button", { name: "Open menu" });
        expect(screen.queryByRole("navigation", { name: "Menu" })).not.toBeInTheDocument();

        await userEvent.click(toggle);
        expect(toggle).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByRole("navigation", { name: "Menu" })).toBeVisible();

        await userEvent.keyboard("{Escape}");
        expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
            "aria-expanded",
            "false",
        );
    });
});
