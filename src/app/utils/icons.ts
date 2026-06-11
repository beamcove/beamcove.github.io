import {
    Anchor,
    ChevronDown,
    Clock,
    Compass,
    createIcons,
    Gem,
    Plus,
    Sparkles,
    Telescope,
} from "lucide";

// Only the icons actually referenced by `data-lucide` attributes in the
// markup — keeps the bundle to a handful of glyphs instead of the whole set.
const ICONS = { Anchor, ChevronDown, Clock, Compass, Gem, Plus, Sparkles, Telescope };

// re-stamp lucide icons after a React render
export function refreshIcons() {
    createIcons({ icons: ICONS });
}
