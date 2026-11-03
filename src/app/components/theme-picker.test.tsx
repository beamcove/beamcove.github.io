import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeGrid, ThemePicker } from "@/app/components/theme-picker";
import { THEME_STORAGE_KEY, toTheme } from "@/app/utils/theme";

describe("ThemePicker", () => {
    beforeEach(() => {
        document.documentElement.dataset.theme = "paper";
    });

    it("picks a colour theme from the menu and remembers it", async () => {
        render(<ThemePicker />);
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "Color theme: Paper" }));
        await userEvent.click(screen.getByRole("menuitemradio", { name: "Graphite" }));
        expect(document.documentElement.dataset.theme).toBe("graphite");
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("graphite");
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Color theme: Graphite" })).toBeInTheDocument();
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
        await userEvent.click(screen.getByRole("radio", { name: /midnight/i }));
        expect(document.documentElement.dataset.theme).toBe("midnight");
        expect(screen.getByRole("button", { name: "Color theme: Midnight" })).toBeInTheDocument();
    });
});

describe("toTheme", () => {
    it("carries older choices over, and ignores unknown values", () => {
        expect(toTheme("dark")).toBe("graphite");
        expect(toTheme("light")).toBe("paper");
        expect(toTheme("signal")).toBe("graphite");
        expect(toTheme("ultraviolet")).toBe("midnight");
        expect(toTheme("phosphor")).toBe("phosphor");
        expect(toTheme("sepia")).toBe("paper");
        expect(toTheme(null)).toBe("paper");
    });
});
