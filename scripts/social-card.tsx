// Renders the social card (see social-card.html): the hero scene, still.
import "../src/design-system/tokens.css";
import "../src/design-system/components.css";

import { createRoot } from "react-dom/client";

import { SCENES } from "../src/app/components/scenes";
import { SITE } from "../src/content/identity";
import { Splash } from "../src/design-system";

const css = `
    body { background: var(--surface-page); }
    .card.bc-splash { position: absolute; inset: 32px; padding: 56px 64px; align-items: stretch; }
    .card .bc-splash-content { display: flex; flex-direction: column; justify-content: space-between; max-width: 620px; }
    .card .bc-splash-title { font-size: 66px; line-height: 66px; }
    .card .mark { display: flex; align-items: center; margin: 0; font-family: var(--font-display); font-size: 33px; line-height: 33px; }
    .card .mark .bc-cursor { width: 17px; height: 30px; margin-left: 4px; }
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
                Beamcove
                <span className="bc-cursor" aria-hidden="true" />
            </p>
        </Splash>
    </>,
);
