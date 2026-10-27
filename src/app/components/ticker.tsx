const ITEMS = [
    "Charting new horizons",
    "BC-001 Caskade is in the shipyard",
    "Apps, tools and other bounties",
    "BC-002 is on the drawing board",
    "Built with craft and a little fun",
    "Dispatched from the cove",
];

/** A slow ticker of fleet news under the hero. Pauses on hover; still under reduced motion. */
export function Ticker() {
    return (
        <div className="ticker">
            <div className="ticker-track">
                {[0, 1].map((copy) => (
                    <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>
                        {ITEMS.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
}
