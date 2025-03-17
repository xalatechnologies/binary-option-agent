import type { Meta, StoryObj } from "@storybook/react";
import AuthError from "@/app/auth/error/page";
import Verify from "@/app/auth/verify/page";
import { MockSessionProvider } from "@/components/providers/MockSessionProvider";

const meta = {
  title: "Auth/Errors",
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AuthError>;

export default meta;

export const Error: StoryObj<typeof AuthError> = {
  render: () => (
    <MockSessionProvider session={null}>
      <div className="min-h-screen bg-background">
        <AuthError />
      </div>
    </MockSessionProvider>
  ),
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/auth/error",
        query: {
          error: "AccessDenied",
        },
      },
    },
  },
};

export const Verification: StoryObj<typeof Verify> = {
  render: () => (
    <MockSessionProvider session={null}>
      <div className="min-h-screen bg-background">
        <Verify />
      </div>
    </MockSessionProvider>
  ),
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/auth/verify",
      },
    },
  },
}; 