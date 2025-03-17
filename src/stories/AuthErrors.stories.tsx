import type { Meta, StoryObj } from "@storybook/react";
import AuthError from "@/app/auth/error/page";
import Verify from "@/app/auth/verify/page";

const meta = {
  title: "Auth/Errors",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AuthError>;

export default meta;

export const Error: StoryObj<typeof AuthError> = {
  render: () => <AuthError />,
};

export const Verification: StoryObj<typeof Verify> = {
  render: () => <Verify />,
}; 