import { ROUTES } from "@/content/site";
import { PRERENDER, render } from "@/prerender";

describe("prerendering", () => {
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
