import { ArrowRight } from "lucide";

import { Icon } from "@/app/components/icon";

/** “Read more” link from a landing abstract to its full page. */
export function MoreLink({ href, children }: { href: string; children: string }) {
    return (
        <a className="more-link" href={href}>
            {children}
            <Icon node={ArrowRight} />
        </a>
    );
}
