import Image from "next/image";
import Link from "next/link";
import { UIProvider, type UIProviderProps } from "@dem-ui/foundation";

export type DemProviderProps = UIProviderProps;

/**
 * `UIProvider` for Next.js. It can sit directly in a server layout: `theme` crosses the boundary
 * because theme packages are client modules. It is the page by default, so `<body>` needs no class.
 * Pass `Link` only for a router of your own, such as the one next-intl creates for localized routes.
 */
export function DemProvider(props: DemProviderProps) {
  return <UIProvider isPage Link={Link} Image={Image} {...props} />;
}
