import { useContext } from "react";

import { SceneTakeover } from "@/app/components/scene-takeover";
import { SCENES, type SceneName } from "@/app/components/scenes";
import { Voyage } from "@/app/components/voyage";
import { Screen, type ScreenProps } from "@/design-system";

/** A Screen bound to one of the site's scenes; it takes part in the takeover on the landing page. */
export function Scene({
    name,
    ...rest
}: Omit<ScreenProps, "scene" | "field"> & { name: SceneName }) {
    const takeover = useContext(SceneTakeover);
    const voyage = useContext(Voyage);
    return (
        <Screen
            scene={name}
            field={SCENES[name]}
            takeover={takeover}
            story={voyage?.story(name)}
            {...rest}
        />
    );
}
