import type { Meta, StoryObj } from "@storybook/react";
import Sidebar from "@/components/Sidebar";

interface LayoutProps {
  isMobile?: boolean;
}

const Layout = ({ isMobile = false }: LayoutProps) => {
  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${isMobile ? "max-w-sm mx-auto" : ""}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex items-center gap-2 font-semibold">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>Trading Agent</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {!isMobile && <Sidebar />}
        <main className="flex-1 container max-w-screen-2xl py-6">
          <div className="rounded-lg border border-border/40 bg-card p-8">
            <h1 className="text-2xl font-bold mb-4">Welcome to Trading Agent</h1>
            <p className="text-muted-foreground">
              This is a sample content area to demonstrate the layout structure.
            </p>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card py-6">
        <div className="container max-w-screen-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Trading Agent. All rights reserved.
          </p>
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

const meta = {
  title: "Components/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    isMobile: false,
  },
};

export const Mobile: Story = {
  args: {
    isMobile: true,
  },
}; 