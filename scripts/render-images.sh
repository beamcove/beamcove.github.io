#!/bin/sh
# Renders the link preview image and the iOS home-screen icon from their HTML
# sources in scripts/, using headless Chrome against the dev server.
# Usage: npm run dev (in another terminal), then npm run social-card.
set -eu

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
BASE="${BASE:-http://localhost:5173}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/assets"

render() { # url width height out
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
        --virtual-time-budget=4000 --window-size="$2,$3" --screenshot="$4" "$1" 2>/dev/null
    echo "wrote $4"
}

render "$BASE/scripts/social-card.html" 1200 630 "$OUT/social-card.png"
render "$BASE/scripts/touch-icon.html" 180 180 "$OUT/apple-touch-icon.png"
