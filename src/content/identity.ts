/**
 * Company identity. No imports, so vite.config.ts can read it too: the HTML
 * pages get the tagline and summary from here at build time (see siteCopy).
 * Change the tagline here and it updates everywhere; then re-render the
 * social card PNG with `npm run social-card`.
 */
export const SITE = {
    name: "Beamcove",
    url: "https://beamcove.com",
    legalName: "Beamcove LLC",
    founder: "Yoan Dubuc",
    tagline: "Charting new horizons in the digital sea.",
    /** Short boilerplate: the brand kit and the home page's meta description. */
    summary: "Beamcove is a technology company that turns curiosity into useful things.",
    email: "hello@beamcove.com",
    /** Effective date of the privacy policy and terms (ISO). */
    legalUpdated: "2026-10-27",
};
