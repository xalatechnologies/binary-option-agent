import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

interface ThemePreviewProps {
  theme: "light" | "dark";
}

const ThemePreview = ({ theme }: ThemePreviewProps) => {
  return (
    <ThemeProvider defaultTheme={theme} enableSystem={false}>
      <div className="p-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Theme Preview: {theme}</h2>
            <p className="text-muted-foreground">
              This is a preview of the {theme} theme with various UI elements.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-border/40 bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Card Example</h3>
              <p className="text-muted-foreground">
                This is a card component using theme variables.
              </p>
            </div>

            <div className="flex gap-4">
              <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                Primary Button
              </button>
              <button className="inline-flex h-10 items-center justify-center rounded-md border border-border/40 bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                Secondary Button
              </button>
            </div>

            <div className="flex gap-4">
              <div className="rounded-md bg-destructive/10 p-3 text-destructive">
                Error Message
              </div>
              <div className="rounded-md bg-green-500/10 p-3 text-green-500">
                Success Message
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

const meta = {
  title: "Theme/Preview",
  component: ThemePreview,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ThemePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    theme: "light",
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
  },
}; 