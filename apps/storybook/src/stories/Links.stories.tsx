import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinksPage } from "./BaseElements";

export const AllLinks: StoryObj = { name: "Link", render: () => <LinksPage /> };

const meta: Meta = { title: "Base/Links" };
export default meta;
