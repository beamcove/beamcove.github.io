import { ROUTES } from "@/content/site";
import { PRERENDER, render } from "@/prerender";

describe("prerendering", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it("leaves the debug-only pages out of a production build", async () => {
        vi.stubEnv("MODE", "production");
        vi.resetModules();
        const { PRERENDER: production } = await import("@/prerender");
        expect(Object.keys(production)).not.toContain("design/index.html");
        expect(Object.keys(PRERENDER)).toContain("design/index.html");
    });

    it("has an entry for every page", () => {
        const paths = Object.values(PRERENDER).map((p) => p.path);
        for (const route of Object.values(ROUTES)) expect(paths).toContain(route);
        expect(paths).toContain("/404.html");
    });

    it.each(Object.keys(PRERENDER))("renders %s to HTML with its one h1", (file) => {
        const html = render(file);
        expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    });
});
