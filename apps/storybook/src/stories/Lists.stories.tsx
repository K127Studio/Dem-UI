import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "@dem-ui/base";
import { ListsPage } from "./BaseElements";

export const ListStory: StoryObj<typeof List> = {
  name: "List",
  render: (args) => <List {...args} />,
  args: { items: ["First", "Second", "Third"], isOrdered: false, isInline: false, spacing: "sm" },
  argTypes: {
    marker: { control: "select", options: ["disc", "circle", "square", "decimal", "alpha", "roman", "none"] },
    spacing: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
    items: { control: "object" },
  },
};

export const AllLists: StoryObj = { name: "All lists", render: () => <ListsPage /> };

const meta: Meta = { title: "Base/Lists" };
export default meta;
