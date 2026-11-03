import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeGrid, ThemePicker } from "@/app/components/theme-picker";
import { THEME_STORAGE_KEY, toTheme } from "@/app/utils/theme";

describe("ThemePicker", () => {
    beforeEach(() => {
        document.documentElement.dataset.theme = "signal";
    });

    it("picks a colour theme from the menu and remembers it", async () => {
        render(<ThemePicker />);
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "Color theme: Signal" }));
        await userEvent.click(screen.getByRole("menuitemradio", { name: "Phosphor" }));
        expect(document.documentElement.dataset.theme).toBe("phosphor");
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("phosphor");
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Color theme: Phosphor" })).toBeInTheDocument();
    });

    it("closes the menu on Escape", async () => {
        render(<ThemePicker />);
        await userEvent.click(screen.getByRole("button", { name: /color theme/i }));
        await userEvent.keyboard("{Escape}");
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("stays in step with the Design page's grid", async () => {
        render(
            <>
                <ThemePicker />
                <ThemeGrid />
            </>,
        );
        await userEvent.click(screen.getByRole("radio", { name: /paper/i }));
        expect(document.documentElement.dataset.theme).toBe("paper");
        expect(screen.getByRole("button", { name: "Color theme: Paper" })).toBeInTheDocument();
    });
});

describe("toTheme", () => {
    it("carries old light and dark choices over, and ignores unknown values", () => {
        expect(toTheme("dark")).toBe("signal");
        expect(toTheme("light")).toBe("paper");
        expect(toTheme("amber")).toBe("amber");
        expect(toTheme("sepia")).toBe("signal");
        expect(toTheme(null)).toBe("signal");
    });
});
