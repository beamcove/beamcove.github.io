const ITEMS = [
    "Charting new horizons",
    "Better ways to work, live and play",
    "Adventure · Integrity · Balance",
    "The shipyard is open",
    "Built with craft and a little fun",
    "Dispatched from the cove",
];

/** A slow ticker of studio lines under the hero. Pauses on hover; still under reduced motion. */
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
