import { SITE } from "@/content/site";
import { Stat } from "@/design-system";

/** Founded, home port, crew: the company facts, shared by the landing and About. */
export function StudioFacts() {
    return (
        <div className="container stat-row" data-reveal>
            <Stat label="Founded" value="2026" caption={`${SITE.legalName}, since January`} />
            <Stat label="Home port" value="Georgia" caption="United States" />
            <Stat label="Crew" value={1} caption="Founder-operated, for now" />
        </div>
    );
}
