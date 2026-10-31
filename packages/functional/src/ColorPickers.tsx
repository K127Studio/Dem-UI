import { useState, type ReactNode } from "react";
import { Button } from "@dem-ui/base";
import { Modal } from "./Modal";
import { Switch } from "@dem-ui/base";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import { Label } from "@dem-ui/base";
import { Icon, useStyles, useUI } from "@dem-ui/foundation";

/**
 * Colour pickers for content the admin edits. They read and write Tailwind classes, the format the
 * content modules store: `text-blue-500/80 dark:text-white/100`. A class only has CSS if Tailwind
 * knows it: the default palette is safelisted in styles.css, a custom palette or hex needs
 * `@source inline(...)` in the project.
 */
export interface PaletteColor {
  /** The colour's name in Tailwind: "blue-500", "primary". */
  id: string;
  label: string;
  /** CSS value for the swatch. */
  swatch: string;
}

export const DEFAULT_PALETTE: PaletteColor[] = [
  { id: "primary", label: "Primary", swatch: "var(--ui-primary)" },
  { id: "secondary", label: "Secondary", swatch: "var(--ui-secondary)" },
  { id: "accent", label: "Accent", swatch: "var(--ui-accent)" },
  { id: "foreground", label: "Text", swatch: "var(--ui-foreground)" },
  { id: "background", label: "Background", swatch: "var(--ui-background)" },
  { id: "black", label: "Black", swatch: "#000000" },
  { id: "white", label: "White", swatch: "#ffffff" },
  { id: "neutral-500", label: "Gray", swatch: "#737373" },
  { id: "red-500", label: "Red", swatch: "#ef4444" },
  { id: "amber-500", label: "Amber", swatch: "#f59e0b" },
  { id: "green-500", label: "Green", swatch: "#22c55e" },
  { id: "blue-500", label: "Blue", swatch: "#3b82f6" },
  { id: "violet-500", label: "Violet", swatch: "#8b5cf6" },
];

interface Stop {
  /** A palette id, or a hex for a custom colour. */
  color: string;
  opacity: number;
}

type ColorMode = "light" | "dark";

const isHex = (color: string) => color.startsWith("#");
const toToken = ({ color, opacity }: Stop) => `${isHex(color) ? `[${color}]` : color}/${opacity}`;

function readStop(token: string, prefix: string, palette: PaletteColor[]): Stop | null {
  if (!token.startsWith(prefix)) return null;
  const match = token.slice(prefix.length).match(/^(\[#[0-9a-fA-F]{3,8}\]|[a-z0-9-]+)(?:\/(\d+))?$/);
  if (!match) return null;
  const color = match[1].startsWith("[") ? match[1].slice(1, -1) : match[1];
  if (!isHex(color) && !palette.some((entry) => entry.id === color)) return null;
  return { color, opacity: match[2] ? Number(match[2]) : 100 };
}

const splitTokens = (value: string) => value.split(/\s+/).filter(Boolean);
const modePrefix = (mode: ColorMode) => (mode === "dark" ? "dark:" : "");

function swatchCss({ color, opacity }: Stop, palette: PaletteColor[]) {
  const css = isHex(color) ? color : (palette.find((entry) => entry.id === color)?.swatch ?? "transparent");
  return `color-mix(in srgb, ${css} ${opacity}%, transparent)`;
}

export function OpacitySlider({ label, value, onChange, min = 0, max = 100, step = 10, unit = "%" }: { label: ReactNode; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number; unit?: string }) {
  const s = useStyles("colorPicker");
  return (
    <label className={s("slider")}>
      <span className={s("sliderHead")}>
        {label}
        <span className={s("sliderValue")}>
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={s("sliderInput")}
      />
    </label>
  );
}

function ColorGrid({ stop, palette, onChange }: { stop: Stop; palette: PaletteColor[]; onChange: (stop: Stop) => void }) {
  const { labels } = useUI();
  const s = useStyles("colorPicker");
  const custom = isHex(stop.color);
  return (
    <div className={s("grid")}>
      {palette.map((entry) => (
        <button
          key={entry.id}
          type="button"
          title={entry.label}
          aria-label={entry.label}
          aria-pressed={stop.color === entry.id}
          onClick={() => onChange({ ...stop, color: entry.id })}
          className={s("swatch", stop.color === entry.id && s("swatchActive"))}
          style={{ background: entry.swatch }}
        />
      ))}
      <label
        title={labels.customColor}
        className={s("swatch", s("swatchCustom"), custom && s("swatchActive"))}
        style={custom ? { background: stop.color } : undefined}
      >
        <Icon name="palette" className="h-4 w-4" />
        <input
          type="color"
          aria-label={labels.customColor}
          value={custom && stop.color.length === 7 ? stop.color : "#000000"}
          onChange={(event) => onChange({ ...stop, color: event.target.value })}
          className="sr-only"
        />
      </label>
    </div>
  );
}

/** One tab per colour mode, opening on the mode the page is in. With a single mode, no tabs. */
function ModeTabs({ modes, children }: { modes: ColorMode[]; children: (mode: ColorMode) => ReactNode }) {
  const { labels, scope } = useUI();
  const s = useStyles("colorPicker");
  if (modes.length === 1) return <div className={s("section")}>{children(modes[0])}</div>;
  const current = scope["data-mode"] === "dark" ? "dark" : "light";
  return (
    <Tabs defaultValue={modes.includes(current) ? current : modes[0]}>
      <TabsList>
        {modes.map((mode) => (
          <TabsTrigger key={mode} value={mode}>
            {mode === "dark" ? labels.darkMode : labels.lightMode}
          </TabsTrigger>
        ))}
      </TabsList>
      {modes.map((mode) => (
        <TabsContent key={mode} value={mode}>
          <div className={s("section")}>{children(mode)}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function PickerShell({ label, swatches, buttonLabel, children, isOpen, setIsOpen }: { label: ReactNode; swatches: string[]; buttonLabel: ReactNode; children: ReactNode; isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const { labels } = useUI();
  const s = useStyles("colorPicker");
  return (
    <div className={s("root")}>
      <Label>{label}</Label>
      <Button type="button" variant="outline" fullWidth onClick={() => setIsOpen(true)}>
        <span className={s("preview")}>
          {swatches.map((background, index) => (
            <span key={index} className={s("previewDot")} style={{ background }} />
          ))}
        </span>
        {buttonLabel}
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
        <Modal.Header>{label}</Modal.Header>
        <Modal.Body>
          <div className={s("body")}>{children}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsOpen(false)}>{labels.done}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export interface GranularColorPickerProps {
  label: ReactNode;
  value?: string;
  onChange: (value: string) => void;
  palette?: PaletteColor[];
}

/** A text colour, with its opacity, for light and dark mode. Any other class in `value` is kept. */
export function GranularColorPicker({ label, value = "", onChange, palette = DEFAULT_PALETTE }: GranularColorPickerProps) {
  const { labels } = useUI();
  const [isOpen, setIsOpen] = useState(false);

  const tokens = splitTokens(value);
  const find = (mode: ColorMode) => {
    for (const token of tokens) {
      const stop = readStop(token, `${modePrefix(mode)}text-`, palette);
      if (stop) return { token, stop };
    }
    return null;
  };
  const light = find("light");
  const dark = find("dark");
  const stops: Record<ColorMode, Stop> = {
    light: light?.stop ?? { color: "foreground", opacity: 100 },
    dark: dark?.stop ?? { color: "foreground", opacity: 100 },
  };
  const others = tokens.filter((token) => token !== light?.token && token !== dark?.token);

  const update = (mode: ColorMode, stop: Stop) => {
    const next = { ...stops, [mode]: stop };
    onChange([...others, `text-${toToken(next.light)}`, `dark:text-${toToken(next.dark)}`].join(" "));
  };

  return (
    <PickerShell
      label={label}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      buttonLabel={labels.chooseColor}
      swatches={[swatchCss(stops.light, palette), swatchCss(stops.dark, palette)]}
    >
      <ModeTabs modes={["light", "dark"]}>
        {(mode) => (
          <>
            <ColorGrid stop={stops[mode]} palette={palette} onChange={(stop) => update(mode, stop)} />
            <OpacitySlider label={labels.opacity} min={10} value={stops[mode].opacity} onChange={(opacity) => update(mode, { ...stops[mode], opacity })} />
          </>
        )}
      </ModeTabs>
    </PickerShell>
  );
}

interface Background {
  kind: "solid" | "gradient";
  solid: Stop;
  direction: string;
  from: Stop;
  via: Stop | null;
  viaPosition: number;
  to: Stop;
}

const DIRECTIONS = ["t", "tr", "r", "br", "b", "bl", "l", "tl"];
const ANGLES: Record<string, string> = { t: "0deg", tr: "45deg", r: "90deg", br: "135deg", b: "180deg", bl: "225deg", l: "270deg", tl: "315deg" };
const ARROWS: Record<string, string> = { t: "↑", tr: "↗", r: "→", br: "↘", b: "↓", bl: "↙", l: "←", tl: "↖" };

function readBackground(tokens: string[], mode: ColorMode, palette: PaletteColor[]): { background: Background; used: string[] } {
  const pre = modePrefix(mode);
  const background: Background = {
    kind: "solid",
    solid: { color: "background", opacity: 100 },
    direction: "b",
    from: { color: "primary", opacity: 100 },
    via: null,
    viaPosition: 50,
    to: { color: "background", opacity: 100 },
  };
  const used: string[] = [];
  for (const token of tokens) {
    const direction = token.match(new RegExp(`^${pre}bg-(?:linear|gradient)-to-([a-z]+)$`));
    const viaPosition = token.match(new RegExp(`^${pre}via-\\[(\\d+)%\\]$`));
    if (token === `${pre}bg-none`) {
      used.push(token);
      continue;
    }
    if (direction) {
      background.kind = "gradient";
      background.direction = direction[1];
    } else if (viaPosition) {
      background.viaPosition = Number(viaPosition[1]);
    } else {
      const from = readStop(token, `${pre}from-`, palette);
      const via = readStop(token, `${pre}via-`, palette);
      const to = readStop(token, `${pre}to-`, palette);
      const solid = readStop(token, `${pre}bg-`, palette);
      if (from) background.from = from;
      else if (via) background.via = via;
      else if (to) background.to = to;
      else if (solid) background.solid = solid;
      else continue;
    }
    used.push(token);
  }
  return { background, used };
}

function writeBackground(background: Background, mode: ColorMode) {
  const pre = modePrefix(mode);
  // In dark mode a solid colour must also cancel a gradient set for light mode.
  if (background.kind === "solid") return [...(mode === "dark" ? ["dark:bg-none"] : []), `${pre}bg-${toToken(background.solid)}`];
  return [
    `${pre}bg-linear-to-${background.direction}`,
    `${pre}from-${toToken(background.from)}`,
    ...(background.via ? [`${pre}via-${toToken(background.via)}`, ...(background.viaPosition !== 50 ? [`${pre}via-[${background.viaPosition}%]`] : [])] : []),
    `${pre}to-${toToken(background.to)}`,
  ];
}

function backgroundCss(background: Background, palette: PaletteColor[]) {
  if (background.kind === "solid") return swatchCss(background.solid, palette);
  const stops = [
    `${swatchCss(background.from, palette)} 0%`,
    ...(background.via ? [`${swatchCss(background.via, palette)} ${background.viaPosition}%`] : []),
    `${swatchCss(background.to, palette)} 100%`,
  ];
  return `linear-gradient(${ANGLES[background.direction] ?? "180deg"}, ${stops.join(", ")})`;
}

function StopEditor({ label, stop, palette, onChange }: { label: ReactNode; stop: Stop; palette: PaletteColor[]; onChange: (stop: Stop) => void }) {
  const { labels } = useUI();
  const s = useStyles("colorPicker");
  return (
    <div className={s("stop")}>
      <span className={s("stopLabel")}>{label}</span>
      <ColorGrid stop={stop} palette={palette} onChange={onChange} />
      <OpacitySlider label={labels.opacity} value={stop.opacity} onChange={(opacity) => onChange({ ...stop, opacity })} />
    </div>
  );
}

function BackgroundEditor({ background, palette, onChange }: { background: Background; palette: PaletteColor[]; onChange: (background: Background) => void }) {
  const { labels } = useUI();
  const s = useStyles("colorPicker");
  return (
    <Tabs value={background.kind} onValueChange={(kind) => onChange({ ...background, kind: kind as Background["kind"] })} variant="enclosed">
      <TabsList>
        <TabsTrigger value="solid">{labels.solid}</TabsTrigger>
        <TabsTrigger value="gradient">{labels.gradient}</TabsTrigger>
      </TabsList>
      <TabsContent value="solid">
        <div className={s("stop")}>
          <ColorGrid stop={background.solid} palette={palette} onChange={(solid) => onChange({ ...background, solid })} />
          <OpacitySlider label={labels.opacity} value={background.solid.opacity} onChange={(opacity) => onChange({ ...background, solid: { ...background.solid, opacity } })} />
        </div>
      </TabsContent>
      <TabsContent value="gradient">
        <div className={s("gradient")}>
          <div className={s("gradientPreview")} style={{ background: backgroundCss(background, palette) }} />
          <div className={s("directions")} role="group" aria-label={labels.direction}>
            {DIRECTIONS.map((direction) => (
              <button
                key={direction}
                type="button"
                aria-pressed={background.direction === direction}
                onClick={() => onChange({ ...background, direction })}
                className={s("direction", background.direction === direction && s("directionActive"))}
              >
                {ARROWS[direction]}
              </button>
            ))}
          </div>
          <StopEditor label={labels.from} stop={background.from} palette={palette} onChange={(from) => onChange({ ...background, from })} />
          <Switch
            label={labels.useVia}
            checked={Boolean(background.via)}
            onChange={(on) => onChange({ ...background, via: on ? { color: "accent", opacity: 100 } : null })}
          />
          {background.via && (
            <>
              <StopEditor label={labels.via} stop={background.via} palette={palette} onChange={(via) => onChange({ ...background, via })} />
              <OpacitySlider label={labels.position} step={5} value={background.viaPosition} onChange={(viaPosition) => onChange({ ...background, viaPosition })} />
            </>
          )}
          <StopEditor label={labels.to} stop={background.to} palette={palette} onChange={(to) => onChange({ ...background, to })} />
        </div>
      </TabsContent>
    </Tabs>
  );
}

export interface GranularBgColorPickerProps extends GranularColorPickerProps {
  /** Edit one mode only, or both. Classes of the other mode are kept. */
  themeMode?: ColorMode | "both";
}

/** A solid or gradient background for light and dark mode. Any other class in `value` is kept. */
export function GranularBgColorPicker({ label, value = "", onChange, palette = DEFAULT_PALETTE, themeMode = "both" }: GranularBgColorPickerProps) {
  const { labels } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const tokens = splitTokens(value);
  const modes: ColorMode[] = themeMode === "both" ? ["light", "dark"] : [themeMode];

  const read = (mode: ColorMode) => readBackground(tokens, mode, palette);

  const update = (mode: ColorMode, background: Background) => {
    const current = read(mode);
    const kept = tokens.filter((token) => !current.used.includes(token));
    onChange([...kept, ...writeBackground(background, mode)].join(" "));
  };

  return (
    <PickerShell
      label={label}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      buttonLabel={labels.chooseBackground}
      swatches={modes.map((mode) => backgroundCss(read(mode).background, palette))}
    >
      <ModeTabs modes={modes}>
        {(mode) => <BackgroundEditor background={read(mode).background} palette={palette} onChange={(background) => update(mode, background)} />}
      </ModeTabs>
    </PickerShell>
  );
}
