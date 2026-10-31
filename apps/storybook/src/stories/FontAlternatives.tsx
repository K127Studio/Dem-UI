import { useState } from "react";
import { selectFonts, UIProvider, type FontChoice, type ThemeDefinition, type ThemeMode } from "@dem-ui/foundation";
import { Button } from "@dem-ui/base";
import { themes } from "@dem-ui/themes";

const SELECT = "w-full border border-border bg-surface p-2 text-sm text-foreground";

function FontList({ title, fonts, selected, onSelect }: { title: string; fonts: FontChoice[]; selected: string; onSelect: (family: string) => void }) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <label className="flex flex-col gap-1 text-xs font-semibold tracking-widest text-foreground uppercase">
        {title}
        <select className={SELECT} value={selected} onChange={(e) => onSelect(e.target.value)}>
          <option value="">Theme default</option>
          {fonts.map((font) => (
            <option key={font.family} value={font.family}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
      {fonts.map((font) => (
        <button
          key={font.family}
          type="button"
          aria-pressed={font.family === selected}
          onClick={() => onSelect(font.family === selected ? "" : font.family)}
          className={`cursor-pointer border-l-4 pl-3 text-left text-foreground ${font.family === selected ? "border-primary" : "border-transparent"}`}
        >
          <span className="block truncate text-2xl" style={{ fontFamily: `"${font.family}", ${font.fallback}` }}>
            {font.label}
          </span>
          <code className="block truncate font-mono text-xs text-foreground-muted">{font.package}</code>
        </button>
      ))}
    </div>
  );
}

function ThemeFonts({ theme, mode }: { theme: ThemeDefinition; mode: ThemeMode }) {
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const options = theme.fontOptions;
  if (!options) return null;
  return (
    <UIProvider theme={theme} mode={mode}>
      <section className="ui-page flex flex-col gap-6 p-6">
        <h2 className="font-mono text-sm text-foreground uppercase">{theme.meta?.label}</h2>
        <UIProvider overrides={{ tokens: selectFonts(theme, { primary, secondary }) }}>
          <div className="flex flex-col gap-3 text-foreground">
            <p className="font-display text-3xl break-words md:text-5xl [font-weight:var(--ui-heading-weight)] tracking-(--ui-heading-tracking)">Hamburgefonstiv</p>
            <p className="font-body text-lg">The quick brown fox jumps over the lazy dog. 0123456789</p>
            <Button className="w-fit">Button</Button>
          </div>
        </UIProvider>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FontList title="5 primary" fonts={options.primary} selected={primary} onSelect={setPrimary} />
          <FontList title="5 secondary" fonts={options.secondary} selected={secondary} onSelect={setSecondary} />
        </div>
      </section>
    </UIProvider>
  );
}

/** Every theme with its alternatives, on one page: click a font to try it. */
export function FontAlternativesPage({ mode }: { mode: ThemeMode }) {
  return (
    <div className="flex flex-col">
      {Object.values(themes).map((theme) => (
        <ThemeFonts key={theme.name} theme={theme} mode={mode} />
      ))}
    </div>
  );
}
