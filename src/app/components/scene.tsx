import { SCENES, type SceneName } from "@/app/components/scenes";
import { Screen, type ScreenProps } from "@/design-system";

/** A Screen bound to one of the site's scenes. */
export function Scene({
    name,
    ...rest
}: Omit<ScreenProps, "scene" | "field"> & { name: SceneName }) {
    return <Screen scene={name} field={SCENES[name]} {...rest} />;
}
