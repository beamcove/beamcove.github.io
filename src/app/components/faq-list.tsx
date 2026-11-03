export function FaqList({ items }: { items: { q: string; a: string }[] }) {
    return (
        <div className="faq" data-reveal>
            {items.map((item) => (
                <details key={item.q} className="faq-item">
                    <summary>
                        <span>{item.q}</span>
                        <span className="faq-toggle" aria-hidden="true" />
                    </summary>
                    <p className="muted">{item.a}</p>
                </details>
            ))}
        </div>
    );
}
