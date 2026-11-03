// Lab sites get the design system and a small shared base, but not the main
// site's page.css: each site styles itself from scratch.
import "@/design-system/tokens.css";
import "@/design-system/components.css";
import "@/lab/lab-base.css";

import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

export function mountLab(page: ReactNode) {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error('Mount node "#root" not found');
    createRoot(rootElement).render(<StrictMode>{page}</StrictMode>);
}
