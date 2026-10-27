import { createElement } from "react";
import type { IconNode } from "lucide";

/** Renders a Lucide icon (1.75px stroke, round caps, currentColor). */
export function Icon({ node, size = 16 }: { node: IconNode; size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {node.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
        </svg>
    );
}
