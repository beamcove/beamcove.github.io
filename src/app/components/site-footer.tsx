import { AsciiWord } from "@/app/components/ascii-word";
import { BrandIcon } from "@/app/components/brand";
import { FOOTER_GROUPS, ROUTES, SITE, SOCIALS } from "@/content/site";

export function SiteFooter() {
    return (
        <footer className="site-footer">
            <div className="wrap">
                <div className="footer-top">
                    <div className="footer-brand">
                        <a className="wordmark" href={ROUTES.home}>
                            Beamcove
                        </a>
                        <p className="footer-tag">{SITE.summary}</p>
                        <ul className="footer-socials" aria-label="Beamcove elsewhere">
                            {SOCIALS.map((s) => (
                                <li key={s.name}>
                                    <a href={s.href} rel="noopener noreferrer" aria-label={s.label}>
                                        <BrandIcon name={s.name} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <nav aria-label="Footer" className="footer-cols">
                        {FOOTER_GROUPS.map((group) => (
                            <div key={group.title}>
                                <h2 className="footer-heading">{group.title}</h2>
                                <ul>
                                    {group.links.map((link) => (
                                        <li key={link.href}>
                                            <a href={link.href}>{link.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>
                <AsciiWord text="Beamcove" className="footer-wordmark" data-reveal="fill" />
                <p className="footer-bottom">
                    <span>
                        © {new Date().getFullYear()} {SITE.legalName} ·{" "}
                        <a href={ROUTES.privacy}>Privacy</a> · <a href={ROUTES.terms}>Terms</a>
                    </span>
                    <span>beamcove.com</span>
                </p>
            </div>
        </footer>
    );
}
