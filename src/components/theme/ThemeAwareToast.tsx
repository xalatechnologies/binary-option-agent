"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "./ThemeProvider";

export function ThemeAwareToast() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === "dark" ? "dark" : "light"}
      toastStyle={{
        backgroundColor: "var(--card)",
        color: "var(--card-foreground)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
      }}
    />
  );
}
