import type { Meta, StoryObj } from "@storybook/react-vite";
import { TablesPage } from "./BaseElements";

export const AllTables: StoryObj = { name: "Table", render: () => <TablesPage /> };

const meta: Meta = { title: "Base/Tables" };
export default meta;
