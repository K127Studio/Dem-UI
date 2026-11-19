# @dem-ui/cli

## 0.2.0

### Minor Changes

- 62c77d2: Add `dem-ui.config.ts`: `defineConfig`, the `config` prop of `UIProvider` and `DemProvider`, `withDemUI` to load it without an import in Next.js, and `npx dem-ui init` to create it. Token names and theme fonts are typed, and development builds warn about fonts that are not offered or not loaded. Providers can own the colour mode (`colorMode`, `useThemeMode`), saved in a cookie that `getColorMode` reads on the server so the first paint has the right mode. Industrial uses Konkhmer Sleokchher for headings, Retro Web uses Noto Serif Nyiakeng Puachue Hmong, and Editorial offers Gloock instead of Playfair Display.
