// Renders the social card (see social-card.html): the hero scene, still.
import "../src/design-system/tokens.css";
import "../src/design-system/components.css";

import { createRoot } from "react-dom/client";

import { SCENES } from "../src/app/components/scenes";
import { SITE } from "../src/content/identity";
import { Mark, Splash } from "../src/design-system";

const css = `
    body { background: var(--surface-page); }
    .card.bc-splash { position: absolute; inset: 32px; padding: 56px 64px; align-items: stretch; }
    .card .bc-splash-content { display: flex; flex-direction: column; justify-content: space-between; max-width: 620px; }
    .card .bc-splash-title { font-size: 64px; line-height: 68px; }
    .card .mark { display: flex; align-items: center; gap: 16px; margin: 0; font-family: var(--font-pixel); font-size: 44px; line-height: 44px; }
`;

createRoot(document.getElementById("root")!).render(
    <>
        <style>{css}</style>
        <Splash className="card" field={SCENES.hero}>
            <div>
                <p className="bc-eyebrow">Technology company</p>
                <h1 className="bc-splash-title" style={{ marginTop: 16 }}>
                    {SITE.tagline}
                </h1>
            </div>
            <p className="mark">
                <Mark size={28} />
                Beamcove
            </p>
        </Splash>
    </>,
);
