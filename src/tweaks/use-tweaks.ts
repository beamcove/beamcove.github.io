import { useCallback, useState } from "react";

export type TweakValue = string | number | boolean | string[];
export type TweakValues = Record<string, TweakValue>;
export type SetTweak<T extends TweakValues> = (
    keyOrEdits: keyof T | Partial<T>,
    val?: T[keyof T],
) => void;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
export function useTweaks<T extends TweakValues>(defaults: T): [T, SetTweak<T>] {
    const [values, setValues] = useState(defaults);
    // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
    // useState-style call doesn't write a "[object Object]" key into the persisted
    // JSON block.
    const setTweak = useCallback<SetTweak<T>>((keyOrEdits, val) => {
        const edits =
            typeof keyOrEdits === "object" && keyOrEdits !== null
                ? keyOrEdits
                : ({ [keyOrEdits]: val } as Partial<T>);
        setValues((prev) => ({ ...prev, ...edits }));
        window.parent.postMessage({ type: "__edit_mode_set_keys", edits }, "*");
        // Same-window signal so in-page listeners (deck-stage rail thumbnails)
        // can react — the parent message only reaches the host, not peers.
        window.dispatchEvent(new CustomEvent("tweakchange", { detail: edits }));
    }, []);
    return [values, setTweak];
}
