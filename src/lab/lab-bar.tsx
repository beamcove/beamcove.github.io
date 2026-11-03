import { LAB_SITES, type LabSlug } from "@/lab/sites";
import { LAB_ROUTES, ROUTES } from "@/content/site";

/**
 * The lab's switcher, fixed to the bottom of every lab site: step to the
 * previous or next site, back to the lab index, or to the main site.
 */
export function LabBar({ current }: { current: LabSlug }) {
    const at = LAB_SITES.findIndex((site) => site.slug === current);
    const prev = LAB_SITES[(at - 1 + LAB_SITES.length) % LAB_SITES.length]!;
    const next = LAB_SITES[(at + 1) % LAB_SITES.length]!;
    return (
        <nav className="lab-bar" aria-label="Lab sites" data-theme="paper">
            <a className="lab-bar-step" href={prev.href} aria-label={`Previous: ${prev.name}`}>
                ◀
            </a>
            <a className="lab-bar-home" href={LAB_ROUTES.lab}>
                Lab
            </a>
            <span className="lab-bar-now">
                <span className="lab-bar-n">
                    {at + 1}/{LAB_SITES.length}
                </span>
                {LAB_SITES[at]!.name}
            </span>
            <a className="lab-bar-step" href={next.href} aria-label={`Next: ${next.name}`}>
                ▶
            </a>
            <a className="lab-bar-out" href={ROUTES.home}>
                beamcove.com
            </a>
        </nav>
    );
}
