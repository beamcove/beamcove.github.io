import { Scene } from "@/app/components/scene";
import { MISSION, VISION } from "@/content/values";
import { LitLine } from "@/design-system";

/** Mission, then vision: each a single sentence that lights up word by word as it comes into view. */
export function Manifesto() {
    return (
        <section aria-label="Mission and vision">
            <Scene name="mission" as="div">
                <div className="statement" data-quiet>
                    <h3 className="kicker-plain">Our mission</h3>
                    <LitLine text={MISSION} />
                </div>
            </Scene>
            <Scene name="vision" as="div">
                <div className="statement statement-big" data-quiet>
                    <h3 className="kicker-plain">Our vision</h3>
                    <LitLine text={VISION} />
                    <p className="body-text">
                        That’s the whole plan. The rest is details, and we like details.
                    </p>
                </div>
            </Scene>
        </section>
    );
}
