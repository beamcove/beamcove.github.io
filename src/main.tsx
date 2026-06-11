// CSS import order replicates the old index.html <link> order — the cascade
// depends on it (colors/type system → ink backgrounds → kit → page overrides).
import "@/app/styles/colors-and-type.css";
import "@/app/styles/ink.css";
import "@/app/styles/kit.css";
import "@/app/styles/page.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/app/app";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Mount node "#root" not found');

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
