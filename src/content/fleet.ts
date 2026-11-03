import type { SceneName } from "@/app/components/scenes";
import type { InkSlot, ShapeName } from "@/design-system";

/**
 * The fleet is empty for now: no project is ready to be listed publicly.
 * When one is, add it here and give the fleet page a list again.
 */
/**
 * `art` names the kind's scene (see scenes.ts); `shape` is its symbol from the
 * mark (● ▲ ■), in the first ink of that scene.
 */
export const KINDS: {
    art: SceneName;
    shape: ShapeName;
    ink: InkSlot;
    title: string;
    body: string;
}[] = [
    {
        art: "work",
        shape: "square",
        ink: "a",
        title: "For work",
        body: "Tools that take work off your plate instead of adding to it, so there’s more time for the parts you enjoy.",
    },
    {
        art: "live",
        shape: "disc",
        ink: "b",
        title: "For everyday life",
        body: "Small things that make everyday life a little easier, or a little more interesting.",
    },
    {
        art: "play",
        shape: "tri",
        ink: "e",
        title: "For play",
        body: "New kinds of fun, made for the joy of finding them. No further justification needed.",
    },
];
