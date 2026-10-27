import { useState } from "react";
import { Moon, Sun } from "lucide";

import { Icon } from "@/app/components/icon";
import { applyTheme, readTheme, type Theme } from "@/app/utils/theme";
import { Button } from "@/design-system";

/** Light by default; a visitor's choice is saved and restored by index.html. */
export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(readTheme);
    const next: Theme = theme === "dark" ? "light" : "dark";
    return (
        <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label={`Switch to ${next} theme`}
            onClick={() => {
                applyTheme(next);
                setTheme(next);
            }}
        >
            <Icon node={theme === "dark" ? Sun : Moon} />
        </Button>
    );
}
