# Dem UI

Themeable React and Tailwind v4 component system. Write the interface once, then change its look with a theme: tokens, recipes, default props, icons and fonts change while the components stay the same.

- **61 HTML elements as components**, with props such as `<List isOrdered />` and `<Paragraph isBold isItalic />`
- **Functional components**: Modal, Tabs, DataTable, filters, uploads with image optimization, colour pickers
- **Content modules** to render and edit blog posts from stored JSON
- **Admin UI**: shell, forms, login
- **6 themes**: Base, Neobrutalism, Industrial, Editorial, Dark Glass, Retro
- **Separate modules**: dark mode toggles, WebGL heroes

> Status: early. The packages are not on npm yet (`private: true`). They run in Storybook and in the example Next.js app, not yet in a production site.

## Getting started

```bash
npm install
npm run storybook
```

Storybook opens on http://localhost:6006 with every component, and a toolbar to change theme, colour mode and density.

| Command | What it does |
|---|---|
| `npm run storybook` | Starts Storybook |
| `npm run build` | Builds every package |
| `npm run build-storybook` | Builds the static Storybook |
| `npm run typecheck` | Checks the types of the whole repository |
| `npm test` | Runs the tests (Vitest, on the sources: no build needed) |
| `npm run check:themes` | Checks every theme's tokens and colour contrast |
| `npm run check:packages` | Checks what each package would publish, after `npm run build` |
| `npm run generate:tokens` | Regenerates the token types after a change to `tokens.json` |
| `npx changeset` | Describes a change for the changelog and the next release |
| `npm run example` | Starts the example Next.js app, after `npm run build` |
| `npm run example:build` | Builds the example Next.js app |

Needs Node 22.12 or newer. With an older global Node, `npm install` silently skips the native bindings of Vite and Storybook and Storybook will not start.

## Packages

| Package | Contents |
|---|---|
| `@dem-ui/core` | The wrapper: one install for foundation, base, functional, content and ui |
| `@dem-ui/next` | `DemProvider`, already wired to `next/link` and `next/image`; `/server` (`getColorMode`), `/plugin` (`withDemUI`) |
| `@dem-ui/cli` | `npx dem-ui init`: config file, stylesheet imports, install command |
| `@dem-ui/foundation` | Themes, tokens, `UIProvider`, `useStyles`, icon contract, `cn` |
| `@dem-ui/base` | The HTML elements as components, plus Button, Input, Select, Switch, Badge, Card |
| `@dem-ui/functional` | Modal, Tabs, Accordion, ConfirmModal, DeleteButton, DataTable, ImageDropzone, lists and filters, LocaleSwitch, colour pickers |
| `@dem-ui/content` | What renders a blog post: content modules, registry, renderer; `/editors` to edit them |
| `@dem-ui/ui` | Composed interfaces: AdminShell, forms, LoginForm |
| `@dem-ui/special-effects` | WebGL heroes: `/chrome-blob` needs `three`, `/grainient` needs `ogl`. Outside the wrapper |
| `@dem-ui/theme-*`, `@dem-ui/themes` | Base, Neobrutalism, Industrial, Editorial, Dark Glass, Retro, and all of them together |
| `@dem-ui/toggle-*`, `@dem-ui/toggles` | Dark mode toggles, one by one or together |
| `@dem-ui/icons-lucide`, `@dem-ui/flags` | Icon set, round flags |

Dependencies point one way: foundation, then base, then functional, then content and ui. All the default classes live in `packages/foundation/src/theme/recipes.ts`, so a theme can reach every component whichever packages an app installs.

## HTML elements

Written once, they follow every theme. Text inherits its colour from where it sits.

| Group | Components |
|---|---|
| Text | `Heading`, `Paragraph`, `Text`, `Strong`, `Em`, `Small`, `Mark`, `Del`, `Ins`, `Sub`, `Sup`, `Abbr`, `Cite`, `Q`, `Kbd`, `Samp`, `Time`, `Code`, `Blockquote`, `Address` |
| Links | `Link` |
| Lists | `List`, `ListItem`, `DescriptionList`, `DescriptionTerm`, `DescriptionDetails` |
| Media | `Image`, `Figure`, `Video`, `Audio`, `Embed` |
| Layout | `Box`, `Section`, `Article`, `Aside`, `Header`, `Footer`, `Main`, `Nav`, `Container`, `Divider` |
| Tables | `Table`, `TableCaption`, `TableHead`, `TableBody`, `TableFoot`, `TableRow`, `TableHeaderCell`, `TableCell` |
| Forms | `Form`, `Fieldset`, `Legend`, `Checkbox`, `Radio`, `RadioGroup`, `Textarea`, `NativeSelect`, `Range`, `Progress`, `Meter`, `Details` |

```tsx
<List isOrdered marker="roman" items={["One", "Two"]} />
<Paragraph size="lg" isItalic isBold>Text</Paragraph>
```

Text elements share `size`, `weight`, `align`, `isBold`, `isItalic`, `isUnderline`, `isStrikethrough`, `isUppercase`, `isTruncated`, `isMuted`, `isMono` and `colorClassName`.

## Using it with Next.js

```bash
npm install @dem-ui/next @dem-ui/theme-neobrutalism
```

```css
/* app/globals.css */
@import "tailwindcss";
@import "@dem-ui/next/styles.css";
@import "@dem-ui/theme-neobrutalism/theme.css";
```

```tsx
// app/layout.tsx: a Server Component, no "use client" needed
import { DemProvider } from "@dem-ui/next";
import neobrutalism from "@dem-ui/theme-neobrutalism";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DemProvider theme={neobrutalism}>{children}</DemProvider>
      </body>
    </html>
  );
}
```

That is all the wiring: `next/link` and `next/image` are already connected, and `transpilePackages` is not needed. `apps/next-example` is a working app (`npm run build`, then `npm run example`).

With next-intl, pass the `Link` of your own routing once: `<DemProvider theme={theme} Link={Link}>`.

In a Server Component:

- Use `ModalHeader`, `ModalBody`, `ModalFooter` and `GridHeroPanel`: `Modal.Header` cannot be read there.
- Import `cn` from `@dem-ui/core/utils`. Other helpers such as `selectFonts` belong in client files.
- Functions cannot cross to the client, so anything with `onClick` or `onChange` goes in a `"use client"` file, as with any React library.

For remote images, add the hosts to `images.remotePatterns` in `next.config`. With `next/font`, skip the theme's fonts and assign the variable: `--ui-font-display: var(--font-abril);`.

## A config file

Project settings can live in one file, as with `tailwind.config`. `npx dem-ui init` creates it, adds the stylesheet imports and prints the install command and the layout code (`--theme`, `--dry-run`, `--install`, `--force`). Or write it by hand and import it once in the layout:

```ts
// dem-ui.config.ts
"use client"; // lets components such as icons or a router Link reach the provider
import { defineConfig } from "@dem-ui/next"; // or "@dem-ui/core"
import industrial from "@dem-ui/theme-industrial";

export default defineConfig({
  theme: industrial,
  mode: "dark",
  density: "compact",
  fonts: { primary: "Michroma", secondary: "JetBrains Mono" }, // from the theme's fontOptions
  tokens: { primary: "#e8590c", "radius-control": "2px" },
  recipes: { button: { slots: { root: "tracking-widest" } } },
  defaults: { input: { size: "md" } },
  icons: { close: MyCloseIcon },
  labels: { close: "Chiudi", cancel: "Annulla" },
});
```

```tsx
// app/layout.tsx
import config from "../dem-ui.config";

<DemProvider config={config}>{children}</DemProvider>;
```

- `UIProvider` takes the same `config`.
- `extends: sharedConfig` starts from another config, such as a brand shared by several apps. The later one wins.
- Props of the provider win over the config: `<DemProvider config={config} mode="light">`.
- Fonts in `fonts` still need their CSS: import `fonts-alternatives.css` or the `@fontsource` packages you keep.
- Token names and the theme's fonts are typed: `tokens: { primay: ... }` or a font the theme does not offer is a type error.
- In development the console warns about a chosen font that the theme does not offer, or that no stylesheet loads.
- The file is imported, so it works the same in Next.js, Vite and any React app. `apps/next-example/dem-ui.config.ts` is a working one.
- In Next.js the import can go: with `withDemUI` in `next.config.mjs`, `DemProvider` loads the file by itself.

  ```js
  // next.config.mjs
  import { withDemUI } from "@dem-ui/next/plugin";

  export default withDemUI({ /* your Next config */ }); // or withDemUI(config, { config: "ui/dem.ts" })
  ```

## Using it without Next.js

Requires React 19 and Tailwind v4.

```css
@import "tailwindcss";
@import "@dem-ui/core/styles.css";
@import "@dem-ui/theme-neobrutalism/theme.css";
```

```tsx
import { UIProvider } from "@dem-ui/core";
import neobrutalism from "@dem-ui/theme-neobrutalism";

<UIProvider theme={neobrutalism} isPage Link={RouterLink}>
  {children}
</UIProvider>;
```

Without `Link` and `Image` it uses `<a>` and `<img>`.

## Overriding, from weakest to strongest

1. The theme, through its `extends` chain.
2. CSS variables in the project: `[data-theme~="neobrutalism"] { --ui-primary: #ff0; }`. Theme values are in a layer, so unlayered CSS wins.
3. The config file, `config` on the provider (see [A config file](#a-config-file)).
4. `overrides` on `UIProvider`:

   ```tsx
   overrides={{
     tokens: { primary: "#924044", "on-primary": "#fff", "radius-control": "4px" },
     recipes: { button: { variants: { variant: { brand: "bg-rose-700 text-white" } } } },
     defaults: { card: { variant: "outline" } },
     icons: { close: MyCloseIcon },
   }}
   ```

5. Props on one instance: `classNames={{ trigger: "..." }}`, `className`.

Nested providers can change theme, mode or density for part of the app. Dialogs and dropdowns are portalled to `document.body` and keep the theme of the provider they came from.

Recipes merge with tailwind-merge, so `bg-rose-700` replaces `bg-primary` and the rest of the string stays.

## Writing a theme

```
packages/theme-x/
  tokens.css     [data-theme~="x"] { --ui-*: ... } inside @layer dem.theme
  fonts.css      @font-face or @fontsource imports
  src/index.ts   defineTheme({ name: "x", extends: base, recipes, defaults, icons, fonts, meta })
```

- The token list is `packages/foundation/styles/tokens.json`.
- `data-theme` holds the whole chain (`"x base"`), which is how `extends` reaches the CSS.
- A token set in the light block applies in dark mode too, unless the theme writes a `[data-theme~="x"][data-mode="dark"]` block.
- `npm run check:themes` checks every required token and the WCAG AA contrast of the colour pairs. Colours that are not 6-digit hex are skipped.
- Add the package to `apps/storybook/.storybook/` (`main.ts`, `storybook.css`) and to `packages/themes`.

## Font alternatives

Each theme has its own fonts, plus `fontOptions`: 5 primary and 5 secondary alternatives. They are optional peer dependencies, so nothing is installed or loaded until you choose.

```css
@import "@dem-ui/theme-editorial/fonts-alternatives.css"; /* or import only the @fontsource you keep */
```

```tsx
overrides={{ tokens: selectFonts(editorial, { primary: "Gloock", secondary: "Lora" }) }}
```

## Modules

A module is an independent package that any theme can use. Toggles share one contract, `ThemeToggleProps`, so they replace each other:

```tsx
import { useThemeMode } from "@dem-ui/foundation";
import { SeventiesToggle } from "@dem-ui/toggle-seventies";

// Anywhere under a provider with colorMode:
const { isDark, setIsDark } = useThemeMode();
<SeventiesToggle isDark={isDark} onChange={setIsDark} brand="Acme" />;
```

With `colorMode` (a prop of the provider, or `colorMode: true` in the config) the provider owns the mode, remembers it in localStorage and in a cookie, and `useThemeMode` changes it from any child. In Next.js, read the cookie on the server so the first paint already has the right mode, with no flash:

```tsx
// app/layout.tsx
import { getColorMode } from "@dem-ui/next/server";

<DemProvider config={config} colorMode={{ defaultMode: await getColorMode() }}>{children}</DemProvider>;
```

Reading the cookie renders the route per request. Without a provider, `useColorMode()` returns the same controls for you to pass as `mode`.

`SkeuomorphicToggle` and `PushButtonToggle` change look with a prop: `mode="skeuomorphism"` or `mode="neumorphism"`.

Import its CSS after `@dem-ui/core/styles.css`: `@import "@dem-ui/toggle-seventies/styles.css";`.

A module with heavy dependencies declares them as optional peers and has one entry per dependency, so a project installs only what it imports:

```bash
npm install three
```

```tsx
import { ChromeBlobHero } from "@dem-ui/special-effects/chrome-blob";
```

## Image optimization

```tsx
<ImageDropzone compressImage compressionRate={0.8} convertToWebp onUpload={upload} onChange={setUrl} />
```

`compressionRate` is the encoder quality, 0.1 to 1: lower is smaller. `convertToWebp` also works without `compressImage`. SVG and GIF go through untouched, and when optimizing fails the original file is used.

## Lists

`SearchSortFilter` (public) and `AdminListToolbar` (adds page size and bulk actions) are controlled: the project reads and writes the URL with its own router. Filters are declared as fields and applied once, when the dialog is confirmed. `Pagination` has the variants `simple`, `summary` and `numbered`.

## Icons

Components ask for icons by meaning, `<Icon name="close" />`, and the theme decides the drawing. A theme can provide part of the set and inherit the rest. Projects can add names:

```ts
declare module "@dem-ui/foundation" {
  interface IconRegistry { bottle: true }
}
```

## Boundaries

The packages hold no data logic. Storage, database, RBAC, router and URL sync stay in the project and arrive as props: `onUpload`, `onDelete`, `items`, `pathname`, `Link`.

Colour classes stored in a database are invisible to Tailwind's scanner, so a project still has to safelist them with `@source inline(...)`.

## License

MIT, see [LICENSE](LICENSE). Flags come from [circle-flags](https://github.com/HatScripts/circle-flags) (MIT). Fonts are installed from Fontsource under their own licences, mostly OFL.
