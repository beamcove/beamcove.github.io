import { Plus } from "lucide";

import { Icon } from "@/app/components/icon";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
    return (
        <div className="faq" data-reveal>
            {items.map((item) => (
                <details key={item.q} className="faq-item">
                    <summary>
                        <span>{item.q}</span>
                        <Icon node={Plus} size={18} />
                    </summary>
                    <p className="muted">{item.a}</p>
                </details>
            ))}
        </div>
    );
}
