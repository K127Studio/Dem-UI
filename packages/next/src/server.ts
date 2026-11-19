import { cookies } from "next/headers";

/**
 * The colour mode saved by a provider with `colorMode`, read on the server so the first paint is
 * already right: `<DemProvider config={config} colorMode={{ defaultMode: await getColorMode() }}>`.
 * Reading cookies makes the route render per request.
 */
export async function getColorMode(name = "dem-ui-mode"): Promise<"light" | "dark" | undefined> {
  const value = (await cookies()).get(name)?.value;
  return value === "light" || value === "dark" ? value : undefined;
}
