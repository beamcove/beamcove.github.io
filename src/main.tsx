// Design system first (tokens declare the fonts), then the page layer on top.
import "@/design-system/tokens.css";
import "@/design-system/components.css";
import "@/app/styles/page.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app/app";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Mount node "#root" not found');

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
