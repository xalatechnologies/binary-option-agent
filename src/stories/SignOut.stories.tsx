import type { Meta, StoryObj } from "@storybook/react";
import SignOut from "@/app/auth/signout/page";
import { MockSessionProvider } from "@/components/providers/MockSessionProvider";

const meta = {
  title: "Auth/SignOut",
  component: SignOut,
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
        <div className="min-h-screen bg-background">
          <Story />
        </div>
      </MockSessionProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/auth/signout",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SignOut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    mockData: [
      {
        url: "/api/auth/signout",
        method: "POST",
        status: 200,
        delay: 2000,
        response: {},
      },
    ],
  },
};

// Note: We can't directly control the loading state in stories since it's managed internally
// by the component. The user can see the loading state by interacting with the buttons. 