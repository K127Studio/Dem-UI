import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutPage } from "./BaseElements";

export const AllLayout: StoryObj = { name: "Box, landmarks, Container, Divider", render: () => <LayoutPage /> };

const meta: Meta = { title: "Base/Layout" };
export default meta;
