// Beamcove design system — "Signal": one page grid, art that belongs to its section, one voice.
// CSS (tokens.css, then components.css) is imported once in src/app/mount.tsx.
export { Badge, type BadgeProps } from "./components/badge";
export { Button, type ButtonProps } from "./components/button";
export { Callout, type CalloutProps } from "./components/callout";
export { ChapterRail } from "./components/chapter-rail";
export { Card, type CardProps } from "./components/card";
export { Frame, type FrameProps } from "./components/frame";
export { Field, type FieldProps, type Story, type StoryMoment } from "./components/field";
export { GlyphField, type GlyphFieldProps } from "./components/glyph-field";
export { Kicker } from "./components/kicker";
export { LitLine } from "./components/lit-line";
export { DotMeter, Meter, type DotMeterProps, type MeterProps } from "./components/meter";
export { Screen, type ScreenProps } from "./components/screen";
export { ScrambleText, type ScrambleTextProps } from "./components/scramble-text";
export {
    SegmentedControl,
    type SegmentedControlProps,
    type SegmentedOption,
} from "./components/segmented";
export {
    Face,
    Mark,
    Shape,
    ShapeCell,
    type FaceEyes,
    type FaceProps,
    type ShapeProps,
} from "./components/shape";
export { MARK, SHAPE_CHARS, type ShapeInk, type ShapeName } from "./components/shape-data";
export { Splash, type SplashProps } from "./components/splash";
export { Stat, type StatProps } from "./components/stat";
export { Switch, type SwitchProps } from "./components/switch";
export { useActiveChapter, type Chapter } from "./components/use-active-chapter";
export { TextField, type TextFieldProps } from "./components/text-field";
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
export { CELL, latticeOffset } from "./glyph/lattice";
export { motionAllowed } from "./glyph/motion";
