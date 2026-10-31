import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormsPage } from "./BaseElements";

export const AllForms: StoryObj = { name: "Form elements", render: () => <FormsPage /> };

const meta: Meta = { title: "Base/Forms" };
export default meta;
