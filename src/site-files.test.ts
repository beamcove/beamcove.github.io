import { ROUTES } from "@/content/site";

// The HTML shells and public/ files, read as text at test time.
const shells = import.meta.glob<string>(
    ["/index.html", "/404.html", "/*/index.html", "!/dist/**", "!/node_modules/**"],
    { query: "?raw", import: "default", eager: true },
);
const sitemap = Object.values(
    import.meta.glob<string>("/public/sitemap.xml", {
        query: "?raw",
        import: "default",
        eager: true,
    }),
)[0];

const robots = Object.values(
    import.meta.glob<string>("/public/robots.txt", {
        query: "?raw",
        import: "default",
        eager: true,
    }),
)[0];

/** "/about/index.html" → "/about/", "/index.html" → "/". */
const routeOf = (file: string) => file.replace(/index\.html$/, "");

describe("sitemap.xml", () => {
    it("lists every page", () => {
        for (const route of Object.values(ROUTES)) {
            expect(sitemap).toContain(`<loc>https://beamcove.com${route}</loc>`);
        }
    });
});

describe("robots.txt", () => {
    it("keeps the Internet Archive's crawlers out", () => {
        for (const bot of ["archive.org_bot", "ia_archiver"]) {
            expect(robots).toContain(`User-agent: ${bot}\nDisallow: /`);
        }
    });
});

describe.each(Object.entries(shells))("%s", (file, html) => {
    it("has a link preview image and a home-screen icon", () => {
        expect(html).toContain(
            'property="og:image" content="https://beamcove.com/assets/social-card.png"',
        );
        expect(html).toContain('name="twitter:card" content="summary_large_image"');
        expect(html).toContain('rel="apple-touch-icon" href="/assets/apple-touch-icon.png"');
    });

    if (file !== "/404.html") {
        it("is a known route with a matching canonical URL", () => {
            expect(Object.values(ROUTES) as string[]).toContain(routeOf(file));
            expect(html).toContain(`rel="canonical" href="https://beamcove.com${routeOf(file)}"`);
        });
    }
});
