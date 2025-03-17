import type { Meta, StoryObj } from "@storybook/react";
import Sidebar from "@/components/Sidebar";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Note: We can't directly control the collapsed state in stories since it's managed internally
// by the component. The user can interact with the collapse button in Storybook to see both states. 