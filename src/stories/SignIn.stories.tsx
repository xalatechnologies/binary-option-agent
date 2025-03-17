import type { Meta, StoryObj } from "@storybook/react";
import SignIn from "@/app/auth/signin/page";
import { MockSessionProvider } from "@/components/providers/MockSessionProvider";

const meta = {
  title: "Auth/SignIn",
  component: SignIn,
  decorators: [
    (Story) => (
      <MockSessionProvider session={null}>
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
        pathname: "/auth/signin",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  parameters: {
    mockData: [
      {
        url: "/api/auth/signin/email",
        method: "POST",
        status: 200,
        delay: 2000,
        response: {},
      },
    ],
  },
};

// Note: We can't directly control the loading state in stories since it's managed internally
// by the component. The user can see the loading state by interacting with the form. 