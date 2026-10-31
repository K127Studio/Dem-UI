import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaPage } from "./BaseElements";

export const AllMedia: StoryObj = { name: "Image, Figure, Video, Audio, Embed", render: () => <MediaPage /> };

const meta: Meta = { title: "Base/Media" };
export default meta;
