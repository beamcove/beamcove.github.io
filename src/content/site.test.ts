import { DEBUG_ROUTES, FOOTER_GROUPS, NAV } from "@/content/site";

const links = () => [...NAV, ...FOOTER_GROUPS.flatMap((g) => g.links)].map((l) => l.href);
const debugOnly = Object.values(DEBUG_ROUTES) as string[];

describe("debug-only pages", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it("are linked from the menu and footer in a debug build", () => {
        // tests run as a debug build
        for (const route of debugOnly) expect(links()).toContain(route);
    });

    it("are linked from nowhere in a production build", async () => {
        vi.stubEnv("MODE", "production");
        vi.resetModules();
        const site = await import("@/content/site");
        expect(site.DEBUG).toBe(false);
        const hrefs = [...site.NAV, ...site.FOOTER_GROUPS.flatMap((g) => g.links)].map(
            (l) => l.href,
        );
        for (const route of debugOnly) expect(hrefs).not.toContain(route);
    });
});
