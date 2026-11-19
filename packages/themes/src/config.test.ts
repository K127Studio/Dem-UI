import { defineConfig } from "@dem-ui/foundation";
import { expect, it } from "vitest";
import { editorial, industrial } from "./index";

// The checks here run in `npm run typecheck`: each @ts-expect-error must stay an error.
it("types fonts from the chosen theme and tokens from the contract", () => {
  const config = defineConfig({
    theme: industrial,
    fonts: { primary: "Michroma", secondary: "JetBrains Mono" },
    tokens: { primary: "#e8590c", "radius-control": "2px" },
  });
  defineConfig({ theme: editorial, fonts: { primary: "Gloock" } });
  defineConfig({ theme: editorial, fonts: { primary: "Fraunces Variable" } }); // family
  defineConfig({ theme: editorial, fonts: { primary: "Fraunces" } }); // label

  // @ts-expect-error: Gloock belongs to editorial, not industrial.
  defineConfig({ theme: industrial, fonts: { primary: "Gloock" } });
  // @ts-expect-error: not a token.
  defineConfig({ tokens: { primay: "#000" } });

  expect(config.theme).toBe(industrial);
});
