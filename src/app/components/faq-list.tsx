/** Questions as disclosure rows: + opens, − closes. The first starts open. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
    return (
        <div className="faq">
            {items.map((item, i) => (
                <details key={item.q} className="faq-item" open={i === 0}>
                    <summary>
                        <h3 className="headline">{item.q}</h3>
                    </summary>
                    <p className="body-text">{item.a}</p>
                </details>
            ))}
        </div>
    );
}
