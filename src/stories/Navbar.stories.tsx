import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "@/components/Header";
import { MockSessionProvider } from "@/components/providers/MockSessionProvider";

const meta = {
  title: "Components/Navbar",
  component: Header,
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {
  decorators: [
    (Story) => (
      <MockSessionProvider session={null}>
        <Story />
      </MockSessionProvider>
    ),
  ],
};

export const LoggedIn: Story = {
  decorators: [
    (Story) => (
      <MockSessionProvider
        session={{
          user: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            image: null,
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }}
      >
        <Story />
      </MockSessionProvider>
    ),
  ],
}; 