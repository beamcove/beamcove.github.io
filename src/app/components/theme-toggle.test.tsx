import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeToggle } from "@/app/components/theme-toggle";
import { THEME_STORAGE_KEY } from "@/app/utils/theme";

describe("ThemeToggle", () => {
    beforeEach(() => {
        document.documentElement.dataset.theme = "light";
    });

    it("switches the theme and remembers the choice", async () => {
        render(<ThemeToggle />);
        await userEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
        expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeInTheDocument();
    });
});
