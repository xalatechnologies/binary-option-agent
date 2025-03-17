import type { Meta, StoryObj } from "@storybook/react";
import SignOut from "@/app/auth/signout/page";

const meta = {
  title: "Auth/SignOut",
  component: SignOut,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SignOut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Note: We can't directly control the loading state in stories since it's managed internally
// by the component. The user can see the loading state by interacting with the buttons. 