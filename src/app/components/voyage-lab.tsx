import { useState, useSyncExternalStore } from "react";

import { MOTIF_INFO, MOTIFS, MOTIFS_ON, type Motif } from "@/app/components/voyage";
import { Button, Switch } from "@/design-system";

const KEY = "beamcove-voyage-lab";

function save() {
    try {
        localStorage.setItem(KEY, JSON.stringify(MOTIFS_ON));
    } catch {
        // storage blocked: the switches still work for this visit
    }
}

const noSubscribe = () => () => {};
const labRequested = () =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("lab");

function restore() {
    try {
        const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<
            Record<Motif, unknown>
        >;
        for (const m of MOTIFS) if (typeof saved[m] === "boolean") MOTIFS_ON[m] = saved[m];
    } catch {
        // nothing saved, or unreadable: every motif stays on
    }
}

/**
 * A small panel for trying the voyage's motifs one by one: open the home
 * page with `?lab`. Switches apply on the next frame and are remembered on
 * this device. Without `?lab` there is no panel and every motif is on.
 */
export function VoyageLab() {
    // read in the browser only: a prerendered page has no panel
    const open = useSyncExternalStore(noSubscribe, labRequested, () => false);
    const [on, setOn] = useState<Record<Motif, boolean>>(() => {
        if (labRequested()) restore();
        return { ...MOTIFS_ON };
    });

    if (!open) return null;
    const set = (next: Partial<Record<Motif, boolean>>) => {
        Object.assign(MOTIFS_ON, next);
        setOn({ ...MOTIFS_ON });
        save();
    };
    const all = (value: boolean) =>
        set(Object.fromEntries(MOTIFS.map((m) => [m, value])) as Record<Motif, boolean>);

    return (
        <aside className="voyage-lab" aria-label="Voyage lab">
            <p className="voyage-lab-title">Voyage lab</p>
            <ul>
                {MOTIFS.map((m) => (
                    <li key={m}>
                        <Switch
                            label={MOTIF_INFO[m].name}
                            checked={on[m]}
                            onChange={(value) => set({ [m]: value })}
                        />
                        <span className="voyage-lab-hint">{MOTIF_INFO[m].hint}</span>
                    </li>
                ))}
            </ul>
            <div className="voyage-lab-actions">
                <Button size="sm" variant="secondary" onClick={() => all(true)}>
                    All on
                </Button>
                <Button size="sm" variant="ghost" onClick={() => all(false)}>
                    All off
                </Button>
            </div>
        </aside>
    );
}
