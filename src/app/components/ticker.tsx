const ITEMS = [
    "Now building",
    "The shipyard is open",
    "Shipping when it’s ready, not before",
    "Built with craft and a little fun",
    "Dispatched from the cove",
    "Lighthouse not to scale",
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
