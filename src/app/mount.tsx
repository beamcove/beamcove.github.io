// Design system first (tokens declare the fonts), then the page layer on top.
import "@/design-system/tokens.css";
import "@/design-system/components.css";
import "@/app/styles/page.css";

import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

/** Every page entry calls this with its page component. */
export function mount(page: ReactNode) {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error('Mount node "#root" not found');
    createRoot(rootElement).render(<StrictMode>{page}</StrictMode>);
}
