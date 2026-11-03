// Beamcove design system — "Signal".
// CSS (tokens.css, then components.css) is imported once in src/app/mount.tsx.
export { Badge, type BadgeProps } from "./components/badge";
export { Button, type ButtonProps } from "./components/button";
export { Callout, type CalloutProps } from "./components/callout";
export { Card, type CardProps } from "./components/card";
export { Frame, type FrameProps } from "./components/frame";
export { GlyphField, type GlyphFieldProps } from "./components/glyph-field";
export { DotMeter, Meter, type DotMeterProps, type MeterProps } from "./components/meter";
export { ScrambleText, type ScrambleTextProps } from "./components/scramble-text";
export {
    SegmentedControl,
    type SegmentedControlProps,
    type SegmentedOption,
} from "./components/segmented";
export { Splash, type SplashProps } from "./components/splash";
export { Stat, type StatProps } from "./components/stat";
export { Switch, type SwitchProps } from "./components/switch";
export { TextField, type TextFieldProps } from "./components/text-field";
export { Window, type WindowProps } from "./components/window";
export {
    GLYPH_CHARS,
    INK_SLOTS,
    RAMPS,
    type GlyphComposition,
    type GlyphId,
    type InkBlock,
    type InkSlot,
    type RampName,
} from "./glyph/engine";
export { motionAllowed } from "./glyph/motion";
