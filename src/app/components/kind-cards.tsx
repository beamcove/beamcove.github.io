import { SCENES } from "@/app/components/scenes";
import { KINDS } from "@/content/fleet";
import { Card, GlyphField, Shape } from "@/design-system";

/** The three kinds of work side by side, each with a strip of its own scene. */
export function KindCards() {
    return (
        <ul className="kind-cards">
            {KINDS.map((kind, i) => (
                <li key={kind.title}>
                    <Card
                        variant="art"
                        media={<GlyphField composition={SCENES[kind.art]} quiet={false} />}
                        eyebrow={
                            <>
                                <Shape name={kind.shape} ink={kind.ink} />
                                {String(i + 1).padStart(2, "0")}
                            </>
                        }
                        title={kind.title}
                    >
                        {kind.body}
                    </Card>
                </li>
            ))}
        </ul>
    );
}
