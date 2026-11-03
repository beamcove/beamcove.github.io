import { MISSION, VISION } from "@/content/values";

/** Mission and vision side by side, set large: the reading-page version of the manifesto. */
export function Statements() {
    return (
        <dl className="statements">
            <div>
                <dt className="kicker-plain">Our mission · what we do</dt>
                <dd className="statement-text">{MISSION}</dd>
            </div>
            <div>
                <dt className="kicker-plain">Our vision · where we’re going</dt>
                <dd className="statement-text">{VISION}</dd>
            </div>
        </dl>
    );
}
