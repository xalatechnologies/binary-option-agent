

// ---- File: SpeechToTextArea.tsx ----

import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faStop,
  faSpinner,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const CHAT_INPUT_HEIGHT = "40px";

interface SpeechToTextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (message: string) => Promise<void> | void;
  isLoading: boolean;
  minHeight?: string;
  placeholder?: string;
  shouldSubmitOnEnter?: boolean;
}

export interface SpeechToTextAreaRef {
  focus: () => void;
  clear: () => void;
}

export const SpeechToTextArea = forwardRef<
  SpeechToTextAreaRef,
  SpeechToTextInputProps
>(
  (
    {
      value,
      onChange,
      onSubmit,
      isLoading,
      minHeight = CHAT_INPUT_HEIGHT,
      placeholder = "Type your message...",
      shouldSubmitOnEnter = true,
    },
    ref,
  ) => {
    const [isRecording, setIsRecording] = useState(false);
    const [waveformActive, setWaveformActive] = useState(false);
    const [heights, setHeights] = useState<number[]>(new Array(20).fill(10));
    const [maxHeight, setMaxHeight] = useState(0);
    const [textareaHeight, setTextareaHeight] = useState(minHeight);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const startRecording = async () => {
      let stream = mediaStream;

      if (!stream || !stream.active || stream.getAudioTracks().length === 0) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setMediaStream(stream);
        } catch (error) {
          console.error("Microphone access denied:", error);
          toast.error("Microphone access is required to use voice recording.");
          return;
        }
      }

      setIsRecording(true);
      setWaveformActive(true);

      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];

      let mimeType = "";
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      if (!mimeType) {
        console.error("No supported MIME type found for MediaRecorder.");
        toast.error("Recording is not supported in this browser.");
        setIsRecording(false);
        setWaveformActive(false);
        return;
      }

      audioCtxRef.current = new AudioContext();
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateHeights = () => {
        analyser.getByteFrequencyData(dataArray);
        const maxFrequency = Math.max(...dataArray);
        setMaxHeight(maxFrequency);
        setHeights(Array.from(dataArray.slice(0, 20)));
        animationFrameIdRef.current = requestAnimationFrame(updateHeights);
      };
      updateHeights();

      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        console.log("Data available:", event.data.size);
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log("Recorder stopped");
        if (audioCtxRef.current) {
          await audioCtxRef.current.close();
          audioCtxRef.current = null;
        }
        if (animationFrameIdRef.current)
          cancelAnimationFrame(animationFrameIdRef.current);
        setIsRecording(false);
        setWaveformActive(false);

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log("Audio Blob size:", audioBlob.size);

        if (audioBlob.size === 0) {
          console.error("Audio Blob is empty.");
          toast.error("Recording failed. Please try again.");
          return;
        }

        const transcription = await fetchTranscription(audioBlob);
        if (transcription) {
          await submitTranscription(transcription);
        }
      };

      mediaRecorderRef.current.start();
    };

    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      }
    };

    const fetchTranscription = async (
      audioBlob: Blob,
    ): Promise<string | null> => {
      setIsTranscribing(true);
      try {
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        console.log("FormData file size:", audioBlob.size);

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          toast.error("Transcription failed.");
          return null;
        }

        const data = await response.json();
        return data.text.trim();
      } catch (error) {
        console.error("Transcription error:", error);
        toast.error("An error occurred during transcription.");
        return null;
      } finally {
        setIsTranscribing(false);
      }
    };

    const handleTextareaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      onChange(e);
      adjustTextareaHeight();
    };

    const adjustTextareaHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = CHAT_INPUT_HEIGHT;
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + "px";
        setTextareaHeight(`${Math.min(scrollHeight, 200)}px`);
      }
    };

    const handleSubmit = async (transcription?: string) => {
      if (onSubmit) {
        const messageToSubmit = transcription ?? value;
        if (messageToSubmit.trim()) {
          // Clear the text area
          onChange({
            target: { value: "" },
          } as React.ChangeEvent<HTMLTextAreaElement>);
          if (textareaRef.current) {
            textareaRef.current.value = "";
          }
          adjustTextareaHeight();
          await onSubmit(messageToSubmit);
        }
      }
    };

    const submitTranscription = async (transcription: string) => {
      if (onSubmit) {
        await handleSubmit(transcription);
      } else {
        // Set the text area value to the transcription
        if (textareaRef.current) {
          textareaRef.current.value = transcription;
          onChange({
            target: { value: transcription },
          } as React.ChangeEvent<HTMLTextAreaElement>);
          adjustTextareaHeight();
        }
      }
    };

    // Expose methods to the parent component
    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      clear: () => {
        if (textareaRef.current) {
          textareaRef.current.value = "";
          onChange({
            target: { value: "" },
          } as React.ChangeEvent<HTMLTextAreaElement>);
          adjustTextareaHeight();
        }
      },
    }));

    return (
      <div
        className="relative flex flex-col"
        style={{
          minHeight: minHeight,
        }}
      >
        <motion.div
          className={`${
            waveformActive
              ? "border-aurora-500/50 bg-gradient-to-r from-aurora-500/30 via-aurora-50/30 to-aurora-500/30 text-transparent"
              : ""
          } hide-scrollbar flex h-full w-full items-center overflow-hidden overflow-y-scroll rounded-2xl  border-aurora-100 bg-aurora-50/30 dark:border-sky-600/30 dark:bg-slate-700`}
          animate={{
            padding: waveformActive ? "1.5rem" : "0.375rem",
          }}
          transition={{ duration: 0.3 }}
        >
          <textarea
            ref={textareaRef}
            className={`${
              waveformActive
                ? "text-transparent"
                : "text-dark-blue dark:text-slate-100"
            } ${
              isLoading ? "opacity-50" : ""
            } hide-scrollbar transition-height m-0 flex-1 resize-none border-0 bg-transparent px-3 py-2 transition-colors focus:outline-none focus:ring-0 focus-visible:ring-0`}
            value={value}
            onChange={handleTextareaChange}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                (shouldSubmitOnEnter || e.shiftKey || e.ctrlKey || e.altKey)
              ) {
                e.preventDefault();
                void handleSubmit();
              }
            }}
            placeholder={waveformActive ? "" : placeholder}
            rows={1}
            style={{
              minHeight: waveformActive ? textareaHeight : minHeight,
            }}
            disabled={waveformActive}
          />
          <div className="hide-scrollbar mr-2 mt-auto flex flex-row space-x-4">
            <button
              type="button"
              className={`${
                waveformActive
                  ? "z-20 mr-5 text-blossom-500 hover:text-blossom-700"
                  : "text-aurora-500 hover:text-aurora-600"
              } transform text-xl dark:text-gray-300 dark:hover:text-gray-500`}
              onClick={isRecording ? stopRecording : startRecording}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              disabled={isTranscribing || isUploading}
            >
              {isTranscribing ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon
                  icon={isRecording ? faStop : faMicrophone}
                  size={isRecording ? "2x" : "1x"}
                />
              )}
            </button>
            {onSubmit && (
              <button
                type="button"
                className={`${
                  waveformActive ? "hidden" : ""
                } flex h-8 w-8 items-center justify-center rounded-full bg-aurora-500 text-white transition-colors hover:bg-aurora-600 focus-visible:outline-none disabled:bg-gray-300 dark:bg-sky-600 dark:hover:bg-sky-700 dark:disabled:bg-gray-600`}
                disabled={
                  !value.trim() || isLoading || waveformActive || isUploading
                }
                onClick={(e) => {
                  e.preventDefault();
                  void handleSubmit();
                }}
                aria-label="Send message - or use cmd + enter"
              >
                {/* Send button icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG path */}
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.3939 6.67973C11.7286 6.34499 12.2714 6.34499 12.6061 6.67973L16.4633 10.537C16.798 10.8717 16.798 11.4145 16.4633 11.7492C16.1286 12.084 15.5857 12.084 15.251 11.7492L12.8571 9.35534V16.7143C12.8571 17.1877 12.4734 17.5714 12 17.5714C11.5266 17.5714 11.1429 17.1877 11.1429 16.7143V9.35534L8.74902 11.7492C8.41428 12.084 7.87144 12.084 7.53669 11.7492C7.20195 11.4145 7.20195 10.8717 7.53669 10.537L11.3939 6.67973Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            )}
          </div>
          {waveformActive && (
            <div className="absolute left-1/2 top-5 flex -translate-x-1/2 transform justify-center">
              <div className="flex">
                {heights.map((height, index) => {
                  const centerIndex = heights.length / 2;
                  const distanceFromCenter = Math.abs(index - centerIndex);
                  const maxDistance = heights.length / 2;
                  const factor = 1 - distanceFromCenter / maxDistance;
                  const adjustedHeight =
                    index > 0 ? Math.round(height * factor * 1.3) : 0;
                  return (
                    <motion.div
                      key={index}
                      className={`w-1 rounded-full ${
                        adjustedHeight > 100
                          ? "bg-aurora-500"
                          : adjustedHeight > 50
                          ? "bg-aurora-500/80"
                          : "bg-aurora-500/40"
                      }`}
                      style={{
                        height: "50px",
                        transformOrigin: "center",
                        marginLeft: `${Math.max(
                          Math.round(maxHeight / 30),
                          6,
                        )}px`,
                      }}
                      animate={{
                        scaleY: Math.max(adjustedHeight, 20) / 128,
                      }}
                      transition={{
                        duration: 0.01,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  },
);

SpeechToTextArea.displayName = "SpeechToTextArea";

export default SpeechToTextArea;


// ---- File: tailwind.config.ts ----

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "bounce-fast": "bounce 0.5s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        meteor: "meteor 5s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        shimmer: "shimmer 4s infinite",
        backgroundPositionSpin:
          "background-position-spin 3000ms infinite alternate",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "background-position-spin": {
          "0%": { backgroundPosition: "top center" },
          "100%": { backgroundPosition: "bottom center" },
        },
        shimmer: {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shimmer-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shimmer-width)) 0",
          },
        },
      },
      colors: {
        beige: "#f8e8e0",
        "dark-beige": "#fcf3ed",
        "dark-blue": "#1D265D",
        "light-blue": "#00ACFF",
        "navy-blue": "#0044FF",
        "github-blue": "#4078c0",
        "github-green": "#1F883D",
        "github-light-green": "#2dba4e",
        "github-red": "#bd2c00",
        "github-orange": "#c9510c",
        "github-purple": "#6e5494",
        pink: "#ff7bff",
        orange: "#FFBA00",
        "base-black": "#191818",
        blueGray: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        coolGray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        trueGray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        warmGray: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
        green: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        primary: {
          50: "#F0F7FF",
          100: "#E0EFFF",
          200: "#B8DBFF",
          300: "#8FC7FF",
          400: "#66B3FF",
          500: "#3D9FFF",
          600: "#147AFF",
          700: "#0056D6",
          800: "#003E99",
          900: "#00265C",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        brandBlue: {
          DEFAULT: "#2962FF",
          50: "#E7F0FF",
          100: "#C2D8FF",
          200: "#9CC1FF",
          300: "#77A9FF",
          400: "#5192FF",
          500: "#2962FF",
          600: "#1E49C4",
          700: "#153388",
          800: "#0B1C4D",
          900: "#010711",
        },
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        brandGreen: {
          DEFAULT: "#3CCF91",
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#3CCF91",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        aurora: {
          50: "#E0F7FF",
          100: "#B8EEFF",
          200: "#8CE5FF",
          300: "#5EDBFF",
          400: "#36D2FF",
          500: "#00C8FF",
          600: "#00A3D9",
          700: "#007FB3",
          800: "#005C8C",
          900: "#003A66",
        },
        blossom: {
          50: "#FFF0F7",
          100: "#FFD6E8",
          200: "#FFADD2",
          300: "#FF85BC",
          400: "#FF5CA6",
          500: "#FF3390",
          600: "#FF0A7A",
          700: "#DB0064",
          800: "#B7004E",
          900: "#930038",
        },
        meadow: {
          50: "#F0FFF4",
          100: "#D6FFE3",
          200: "#ADFFCA",
          300: "#85FFB1",
          400: "#5CFF98",
          500: "#33FF7F",
          600: "#0AFF66",
          700: "#00DB52",
          800: "#00B743",
          900: "#009334",
        },
        sunset: {
          50: "#FFF7E0",
          100: "#FFEAB8",
          200: "#FFDD8C",
          300: "#FFD05E",
          400: "#FFC336",
          500: "#FFB600",
          600: "#D99B00",
          700: "#B38000",
          800: "#8C6500",
          900: "#664A00",
        },
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        done: "#28a745",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter var", "sans-serif"],
        display: ["Lexend", "sans-serif"],
        figtree: ["Figtree", "sans-serif"],
        crimson: ['"Crimson Text"', "serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;


// ---- File: init.sh ----

#!/usr/bin/env bash

set -e

APP_NAME="newco"

echo "🚀 Starting setup..."

# Remove any existing app directory
rm -rf $APP_NAME

# 1. Create Next.js TypeScript app with Tailwind, src directory, app router, and no ESLint
echo "🛠 Creating Next.js app..."
npx create-next-app@latest $APP_NAME --ts --tailwind --src-dir --app --no-eslint --use-npm

cd $APP_NAME

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install zod @tanstack/react-query @shadcn/ui prisma @prisma/client @next-auth/prisma-adapter next-auth resend @aws-sdk/client-s3 inngest @supabase/supabase-js

# Prisma init
echo "🗄 Initializing Prisma..."
npx prisma init

# Overwrite Prisma schema to support NextAuth
cat > prisma/schema.prisma <<EOF
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id             String    @id @default(cuid())
  name           String?
  email          String?   @unique
  emailVerified  DateTime?
  image          String?
  hashedPassword String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
}

model Account {
  id                String @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
EOF

# 3. Setup shadcn/ui
echo "🎨 Setting up shadcn/ui..."
npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input

# Ensure globals.css for Tailwind
cat > src/app/globals.css <<EOF
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# 4. Create directory structure and files
echo "📂 Creating directory structure..."

mkdir -p src/app/api/auth/[...nextauth]
mkdir -p src/app/api/upload
mkdir -p src/app/api/inngest
mkdir -p src/app/dashboard
mkdir -p src/components/ui
mkdir -p src/components/ClientProvider
mkdir -p src/lib/email/templates
mkdir -p src/lib/zod
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p prisma/migrations

# App layout (Server Component)
cat > src/app/layout.tsx <<EOF
import "./globals.css";
import React from "react";

export const metadata = {
  title: "$APP_NAME",
  description: "A Next.js Starter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

# ClientProvider Component (Client Component)
cat > src/components/ClientProvider/index.tsx <<EOF
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
EOF

# Main page
cat > src/app/page.tsx <<EOF
import React from "react";
import ClientProvider from "@/components/ClientProvider";

export default function Page() {
  return (
    <ClientProvider>
      <div className="p-4">
        <h1 className="text-xl font-bold">Welcome to $APP_NAME</h1>
        <p>Next.js + NextAuth + Prisma + and more...</p>
      </div>
    </ClientProvider>
  );
}
EOF

# Prisma db client
cat > src/lib/db.ts <<EOF
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
EOF

# NextAuth route and config
mkdir -p src/lib/auth
cat > src/app/api/auth/[...nextauth]/route.ts <<EOF
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
export const { GET, POST } = NextAuth(authOptions)
EOF

cat > src/lib/auth/index.ts <<EOF
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user = user
      }
      return session
    },
  },
}
EOF

# Zod schema
cat > src/lib/zod/userSchemas.ts <<EOF
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
EOF

# AWS S3 storage
cat > src/lib/storage.ts <<EOF
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(key: string, body: Buffer | Uint8Array | Blob | string) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: body
  }));
  return \`https://\${process.env.S3_BUCKET}.s3.amazonaws.com/\${key}\`;
}
EOF

# Upload route
cat > src/app/api/upload/route.ts <<EOF
import { NextResponse } from 'next/server'
import { uploadFile } from '@/lib/storage'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const url = await uploadFile(file.name, buffer)
  return NextResponse.json({ url })
}
EOF

# Inngest setup
cat > inngest.config.ts <<EOF
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "$APP_NAME" });
EOF

cat > src/lib/inngest.ts <<EOF
import { inngest } from "../../inngest.config";

export const userRegistered = inngest.createFunction(
  { name: "User Registered", id: "user/registered" },
  { event: "user/registered" },
  async ({ event, step }) => {
    // Handle the event
  },
);
EOF

cat > src/app/api/inngest/handler.ts <<EOF
import { serve } from "inngest/next";
import { inngest } from "@/../inngest.config";

const sendFn = inngest.createFunction(
  { name: "inngest/send", id: "inngest/send" },
  { event: "inngest/send" },
  async ({ event }) => {
    console.log("inngest/send", event);
  },
);

export const { POST, GET } = serve({
  client: inngest,
  functions: [sendFn],
});
EOF

# Resend email setup
cat > src/lib/email/sendEmail.ts <<EOF
import { Resend } from "resend";
import { createElement } from "react";
import { WelcomeEmail } from "./templates/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "no-reply@yourdomain.com",
    to,
    subject: "Welcome!",
    react: createElement(WelcomeEmail, { name }),
  });
}
EOF

cat > src/lib/email/templates/WelcomeEmail.tsx <<EOF
import React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>Thanks for joining us!</p>
    </div>
  );
}
EOF

# Example React Query hook
cat > src/hooks/useQueryHooks.ts <<EOF
import { useQuery } from "@tanstack/react-query";

export function useExampleQuery() {
  return useQuery({
    queryKey: ["example"],
    queryFn: async () => {
      return { data: "Hello from React Query" };
    },
  });
}
EOF

echo "⚠️ Note: Prisma migrate requires DATABASE_URL and NextAuth requires EMAIL settings. Set these in a .env file."
echo "Example .env:"
echo "DATABASE_URL='postgresql://...'"
echo "DIRECT_URL='postgresql://...'"
echo "RESEND_API_KEY='...'"
echo "EMAIL_SERVER='...' # SMTP info"
echo "EMAIL_FROM='no-reply@yourdomain.com'"
echo "AWS_ACCESS_KEY_ID='...'"
echo "AWS_SECRET_ACCESS_KEY='...'"
echo "AWS_REGION='...'"
echo "S3_BUCKET='...'"
echo
echo "Then run: npx prisma generate"
echo "Then run: npx prisma migrate dev"
echo "Start dev server: npm run dev"
echo "✅ Setup Complete!"


// ---- File: README.md ----

# A Note from Kevin

Hi! If you're at this repo, you've probably seen one of my AI coding videos and want to try some of those techniques yourself. If you have no clue what I'm talking about, here's a good video to show you my approach and how to best use this repo: https://youtu.be/gXmakVsIbF0

You can also just use this with your own techniques, that's cool too. 

You can follow the Getting Started instructions below to start using this stack right away. I've found that using a checklist of tasks in the .cursor-tasks.md file is a great way to make a lot of quick and effective progress with AI Coding. I personally use Cursor in Composer Agent mode with Sonnet 3.7, but feel free to use your AI coding tool of choice.

If you need to create the checklist, here are some good prompts to use to go from a high-level idea to a full checklist of stories and tasks: https://chatgpt.com/share/67be0a59-e484-800d-a078-346b2c29d727

You can also use the template in .cursor-template.xml to generate the task list for existing repos. I personally use RepoPrompt to convert the files into a pastable string, but repomix.com is a good option as well. 

# 🚀 Next.js Modern Stack Template

A Next.js template that combines commonly used tools and libraries for building full-stack web applications. This stack is specifically designed to be optimized for AI coding assistants like Cursor.

## 🎯 Overview

This template includes [Next.js 14](https://nextjs.org/) with the App Router, [Supabase](https://supabase.com) for the database, [Resend](https://resend.com) for transactional emails, and optional integrations with various AI providers and AWS services.

> ⚠️ **Note**: This is my personal template with tools that I personally have experience with and think are solid options for building modern full-stack web application. Your preferences very likely differ, so feel free to fork and modify it for your own use. I won't be accepting pull requests for additional features, but I'll be happy to help you out if you have any questions.

## ✨ Features

### 🏗️ Core Architecture

- [**Next.js 14**](https://nextjs.org/) - React framework with App Router
- [**TypeScript**](https://www.typescriptlang.org/) - Type safety throughout
- [**tRPC**](https://trpc.io/) - End-to-end type-safe APIs
- [**Prisma**](https://www.prisma.io/) - Database ORM and schema management
- [**NextAuth.js**](https://next-auth.js.org/) - Authentication with Prisma adapter
- [**Supabase**](https://supabase.com) - Postgres database with realtime and auth

### 🎨 UI & Styling

- [**Tailwind CSS**](https://tailwindcss.com/) - Utility-first CSS framework
- [**Framer Motion**](https://www.framer.com/motion/) - Animation library
- [**Lucide Icons**](https://lucide.dev/) - Icon set
- Dark mode with Tailwind CSS

### 🛠️ Development Tools

- [**Storybook**](https://storybook.js.org/) - Component development environment
- [**Geist Font**](https://vercel.com/font) - Typography by Vercel

### 🤖 AI & Background Jobs

- Multiple AI integrations available:
  - [OpenAI](https://openai.com) - GPT-4 and o-series models
  - [Anthropic](https://anthropic.com) - Sonnet-3.5
  - [Perplexity](https://perplexity.ai) - Web search models
  - [Groq](https://groq.com) - Fast inference
- [**Inngest**](https://www.inngest.com/) - Background jobs and scheduled tasks

### 🔧 Infrastructure & Services

- [**Resend**](https://resend.com) - Email delivery
- [**AWS S3**](https://aws.amazon.com/s3/) - File storage
- [**Supabase**](https://supabase.com) - Primary database
  (Note that I don't directly use the supabase client in this template, so you can switch out supabase with other database providers via the DATABASE_URL and DIRECT_URL environment variables.)

### 🔔 Additional Features

- [**react-toastify**](https://fkhadra.github.io/react-toastify/) - Toast notifications
- Utility functions for common operations
- TypeScript and ESLint configuration included

## 🚀 Getting Started

1. Fork this repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and configure your environment variables
4. Set up your database:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## 📁 Project Structure

- `app/` - Next.js app router pages and API routes
- `src/`
  - `components/` - UI components
  - `lib/` - Utilities and configurations
    - `api/` - tRPC routers
    - `utils/` - Shared utilities
  - `stories/` - Storybook files
- `prisma/` - Database schema

## 🚀 Deployment

This template is optimized for deployment on [Vercel](https://vercel.com).

### Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your database connection strings from Supabase:
   - Project Settings → Database
   - Copy both the URI (for `DATABASE_URL`) and Direct Connection (for `DIRECT_URL`)

### Vercel Setup

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Configure the following environment variables:
   - `DATABASE_URL` - Your Supabase database URL
   - `DIRECT_URL` - Your Supabase direct connection URL
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production URL (e.g., https://your-app.vercel.app)
   - Add any other variables from `.env.example` that you're using
5. Deploy!

### Post-Deployment

1. Run database migrations in the Vercel deployment:

```bash
npx vercel env pull .env.production.local  # Pull production env vars
npx prisma migrate deploy                  # Deploy migrations to production
```

2. Set up your custom domain in Vercel (optional):
   - Go to your project settings
   - Navigate to Domains
   - Add your domain and follow the DNS configuration instructions

## 📝 License

MIT License


// ---- File: aiClient.ts ----

/**
 * AI Client Library
 *
 * This module provides a unified interface for interacting with various AI models
 * including OpenAI, Perplexity, and Google's Gemini models.
 *
 * Primary Functions:
 *
 * 1. generateChatCompletion(messages, model = "O1", options = {})
 *    - Main function for general AI interactions
 *    - Automatically handles routing to appropriate AI provider
 *    - Use for standard chat completions, idea generation, etc.
 *    Example:
 *    ```typescript
 *    const response = await generateChatCompletion([
 *      { role: "user", content: "Generate a business idea" }
 *    ]);
 *    ```
 *
 * 2. generateGeminiWebResponse(messages, model, ground = true)
 *    - Specialized function for Gemini models with web grounding
 *    - Returns both response text and source links
 *    - Use when you need factual, web-grounded responses
 *    Example:
 *    ```typescript
 *    const { text, sourceLink } = await generateGeminiWebResponse([
 *      { role: "user", content: "What's new in AI?" }
 *    ], "GEMINI_FLASH_WEB", true);
 *    ```
 *
 * 3. parseJsonResponse(response)
 *    - Utility to parse JSON from AI responses
 *    - Handles both direct JSON and code block formats
 *    - Use when expecting structured data from AI
 *    Example:
 *    ```typescript
 *    const data = parseJsonResponse(aiResponse);
 *    ```
 *
 * Available Models:
 * - O1: Default model for most use cases
 * - SONNET: Claude 3.5 Sonnet for complex reasoning
 * - PERPLEXITY_SMALL/LARGE: For web-aware responses
 * - GEMINI_FLASH_WEB: For web-grounded responses
 * - GEMINI_FLASH_THINKING: For complex reasoning tasks
 */

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Custom type for Gemini API request
interface GeminiGroundedResponse {
  text: string;
  sourceLink?: string;
}

type AIClientType = {
  openai: OpenAI;
};

type AIClientResponse = {
  client: AIClientType[keyof AIClientType];
  type: keyof AIClientType;
};

export const AI_MODELS = {
  SONNET: "claude-3-5-sonnet-20241022",
  O1: "o1-2024-12-17",
  GPT_4O: "gpt-4o",
  GPT_4O_MINI: "gpt-4o-mini",
  PERPLEXITY_SMALL: "sonar",
  PERPLEXITY_LARGE: "sonar-pro",
  GEMINI_FLASH_WEB: "gemini-2.0-flash-exp",
  GEMINI_FLASH_THINKING: "gemini-2.0-flash-thinking-exp-01-21",
} as const;

export type AIModel = keyof typeof AI_MODELS;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function getClientForModel(model: AIModel): AIClientResponse {
  const modelId = AI_MODELS[model];

  if (modelId.includes("sonar")) {
    return { client: perplexity, type: "openai" };
  }

  return { client: openai, type: "openai" };
}

/**
 * Generates a response from Gemini models with optional web grounding.
 * @param messages Array of message objects with role and content
 * @param model The Gemini model to use
 * @param ground Whether to enable web grounding
 * @returns Promise with text response and optional source links
 */
export async function generateGeminiWebResponse(
  messages: Array<{ role: "user" | "system" | "assistant"; content: string }>,
  model: AIModel = "GEMINI_FLASH_WEB",
  ground = true,
): Promise<GeminiGroundedResponse> {
  const modelId = AI_MODELS[model];
  const geminiModel = genAI.getGenerativeModel({
    model: modelId,
    // @ts-ignore
    tools: ground ? [{ googleSearch: {} }] : undefined,
  });

  // Convert messages to Gemini format
  const prompt = messages.map((m) => m.content).join("\n");

  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  let sourceLink: string | undefined = undefined;
  if (
    ground &&
    response.candidates?.[0]?.groundingMetadata?.searchEntryPoint
      ?.renderedContent
  ) {
    sourceLink =
      response.candidates[0].groundingMetadata.searchEntryPoint.renderedContent;
  }

  return {
    text,
    sourceLink,
  };
}

export function parseJsonResponse(response: string): any {
  // First try parsing the response directly
  try {
    return JSON.parse(response);
  } catch (e) {
    // If direct parsing fails, look for code blocks
    const codeBlockRegex = /```(?:json|[^\n]*\n)?([\s\S]*?)```/;
    const match = response.match(codeBlockRegex);

    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch (innerError) {
        throw new Error("Failed to parse JSON from code block");
      }
    }

    throw new Error("No valid JSON found in response");
  }
}

export async function generateChatCompletion(
  messages: Array<{ role: "user" | "system" | "assistant"; content: string }>,
  model: AIModel = "O1",
  additionalOptions: Partial<OpenAI.ChatCompletionCreateParamsNonStreaming> = {},
): Promise<string> {
  try {
    const modelId = AI_MODELS[model];

    // Handle Gemini models directly
    if (modelId.includes("gemini")) {
      const geminiResp = await generateGeminiWebResponse(
        messages,
        model,
        false,
      );
      return geminiResp.text;
    }

    // Handle OpenAI and Perplexity models
    const { client } = getClientForModel(model);
    const options: OpenAI.ChatCompletionCreateParamsNonStreaming = {
      model: modelId,
      messages,
      ...additionalOptions,
    };

    const completion = await client.chat.completions.create(options);
    return completion.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error(
      `Error generating chat completion for model ${model}:`,
      error,
    );
    throw error;
  }
}


// ---- File: globals.css ----

@import url("https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

*,
*::before,
*::after {
  @apply m-0 box-border p-0;
}

html,
body {
  @apply min-h-full w-full;
}

body {
  @apply flex w-full flex-col bg-gradient-to-br from-blue-50 to-red-50 text-slate-900 dark:from-slate-900 dark:to-slate-800 dark:text-slate-100;
}

#__next {
  @apply flex h-full min-h-screen w-full;
}

.aspect-ratio-box {
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes blink {
  50% {
    opacity: 0.5;
  }
}
.blink {
  animation: blink 1s linear infinite;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.fade-in {
  animation: fade-in 0.5s ease-in-out;
}

.modal-overlay {
  background-color: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  background: #1f2937;
  border-radius: 0.5rem;
  padding: 1rem;
  outline: none;
  width: 90%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 47.4% 11.2%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 100% 50%;
    --destructive-foreground: 210 40% 98%;
    --ring: 215 20.2% 65.1%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
    --muted: 223 47% 11%;
    --muted-foreground: 215.4 16.3% 56.9%;
    --accent: 216 34% 17%;
    --accent-foreground: 210 40% 98%;
    --popover: 224 71% 4%;
    --popover-foreground: 215 20.2% 65.1%;
    --border: 216 34% 17%;
    --input: 216 34% 17%;
    --card: 224 71% 4%;
    --card-foreground: 213 31% 91%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 1.2%;
    --secondary: 222.2 47.4% 11.2%;
    --secondary-foreground: 210 40% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;
    --ring: 216 34% 17%;
  }
}

@layer base {
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(14deg);
  }
  40% {
    transform: rotate(-8deg);
  }
  60% {
    transform: rotate(14deg);
  }
  80% {
    transform: rotate(-4deg);
  }
  100% {
    transform: rotate(10deg);
  }
}

.animate-wave {
  animation: wave 1.5s infinite;
  transform-origin: 70% 70%;
}


// ---- File: .cursor-tasks.md ----

# Example Tasks for a "Hello, World!" Project

This file outlines a set of tasks for building a simple Next.js project. In this project, the user enters their name in a text box on the Home Page and is then greeted with "Hello, {name}" on a separate Greeting Page.

Here's an example prompt to use to generate this. Note that you'll first want to either provide a detailed set of notes / prd of exactly what to build, or have a two-step process where you have the AI create the spec, then proceed with this step:
Be sure to use an advanced thinking model with this, ideally "Deep Research" from OpenAI but o1-pro, o3-mini, flash-2-thinking, or (maybe?) DeepSeek R1 could work as well. 

``` txt
Create a very very very detailed markdown checklist of all of the stories for this project plan, with one-story-point tasks (with unchecked checkboxes) that break down each story. It is critically important that all of the details to implement this are in this list. Note that a very competent AI Coding Agent will be using this list to autonomously create this application, so be sure not to miss any details whatsoever, no matter how much time and thinking you must do to complete this very challenging but critically important task.
```

After you generate this task list, here is a prompt to use in cursor agent to kick this off (might be useful to put at the end of your cursorrules file as well?)
Probably helpful to just @include the cursor-tasks.md file as well. 
``` txt
Go through each story and task in the .cursor-tasks.md file. Find the next story to work on. Review each unfinished task, correct any issues or ask for clarifications (only if absolutely needed!). Then proceed to create or edit files to complete each task. After you complete all the tasks in the story, update the file to check off any completed tasks. Run builds and commits after each story. Run all safe commands without asking for approval. Continue with each task until you have finished the story, then stop and wait for me to review.
```

---

## 1. **Project Setup**

1. [ ] **Initialize the Next.js Project**
   - Use Create Next App to bootstrap the project.
   - Enable the App Router.
   - Configure Tailwind CSS for styling.
   - Set up TypeScript with strict mode.

2. [ ] **Configure Basic Routing**
   - Ensure the project has two main pages:
     - **Home Page** (`pages/index.tsx`) for user input.
     - **Greeting Page** (`pages/greeting.tsx`) to display the greeting.

---

## 2. **Home Page – Name Input**

1. [ ] **Create the Home Page (`pages/index.tsx`)**
   - Render a form containing:
     - A text input where the user enters their name.
     - A submit button labeled "Submit".
   - Use Tailwind CSS classes for styling (e.g., input borders, padding, and button colors).

2. [ ] **Implement Form Handling**
   - Use React’s `useState` hook to manage the input value.
   - Validate that the input is not empty before submission.
   - On form submission, navigate to the Greeting Page while passing the entered name (using query parameters or a simple state management solution).

---

## 3. **Greeting Page – Display the Message**

1. [ ] **Create the Greeting Page (`pages/greeting.tsx`)**
   - Retrieve the user's name from the query parameters or via a shared state.
   - Display a greeting message in the format: **"Hello, {name}"**.
   - Style the greeting message using Tailwind CSS (e.g., text size, color, and margin).

2. [ ] **Implement Navigation from Home Page**
   - Ensure that the Home Page form submission correctly routes to the Greeting Page with the user’s name attached.

---

## 4. **Basic Interactivity and Validation**

1. [ ] **Form Validation**
   - Prevent submission if the text input is empty.
   - Display a simple error message below the input (e.g., "Please enter your name.") when validation fails.

2. [ ] **Test the User Flow**
   - Manually test by entering a name and verifying that the Greeting Page shows the correct message.
   - Optionally, write unit tests for the form logic to ensure reliability.

---

## 5. **Documentation and Final Steps**

1. [ ] **Update the Project README**
   - Include instructions on how to install dependencies, run the development server, and build the project.
   - Provide a brief overview of the project’s purpose and structure.

2. [ ] **Final Review and Testing**
   - Ensure that all components render correctly and the navigation works as expected.
   - Test the app in both development and production modes to confirm proper behavior.


// ---- File: page.tsx ----

"use client";

import React, { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

function SignInContent() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("email", { email, callbackUrl });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 px-4">
      <Link
        href="/"
        className="group absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brandBlue-500 to-brandBlue-700 dark:from-brandBlue-400 dark:to-brandBlue-600">
              Welcome
            </span>
          </h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">
            Enter your email to sign in or create an account
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-neutral-800/50 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 shadow-sm dark:bg-neutral-800 focus:border-brandBlue-500 dark:focus:border-brandBlue-400 focus:ring-brandBlue-500 dark:focus:ring-brandBlue-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brandBlue-500 to-brandBlue-600 px-4 py-3 text-white shadow-lg shadow-brandBlue-500/20 transition-all hover:from-brandBlue-600 hover:to-brandBlue-700 hover:shadow-xl hover:shadow-brandBlue-500/30 focus:outline-none focus:ring-2 focus:ring-brandBlue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="h-5 w-5" />
              {isLoading ? "Sending link..." : "Sign in with Email"}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              By signing in, you agree to our{" "}
              <Link
                href="https://example.com/legal"
                className="font-medium text-brandBlue-600 dark:text-brandBlue-400 hover:text-brandBlue-500"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}


// ---- File: trpc.ts ----

/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getServerAuthSession, UserRole } from "../auth";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    session,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Session or user information is missing",
    });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

// /**
//  * Protected (authenticated) procedure
//  *
//  * If you want a query or mutation to ONLY be accessible to logged in admins, use this. It verifies
//  * the session is valid and guarantees `ctx.session.user` has admin privileges.
//  *
//  * @see https://trpc.io/docs/procedures
//  */
// export const adminProcedure = t.procedure.use(({ ctx, next }) => {
//   if (!ctx.session?.user?.isAdmin) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "Admin privileges required",
//     });
//   }

//   return next({
//     ctx: {
//       session: { ...ctx.session, user: ctx.session.user },
//     },
//   });
// });


// ---- File: package.json ----

{
  "name": "nextjs-template",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "vercel-build": "prisma generate && next build",
    "postinstall": "prisma generate",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.709.0",
    "@fortawesome/free-solid-svg-icons": "^6.7.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@google/generative-ai": "^0.21.0",
    "@next-auth/prisma-adapter": "^1.0.7",
    "@prisma/client": "^6.0.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@shadcn/ui": "^0.0.4",
    "@supabase/supabase-js": "^2.47.3",
    "@tailwindcss/typography": "^0.5.16",
    "@tanstack/react-query": "^5.25.0",
    "@trpc/client": "next",
    "@trpc/next": "next",
    "@trpc/react-query": "next",
    "@trpc/server": "next",
    "@types/react-datepicker": "^6.2.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^11.15.0",
    "groq-sdk": "^0.12.0",
    "inngest": "^3.27.5",
    "lucide-react": "^0.468.0",
    "next": "15.1.0",
    "next-auth": "^4.24.11",
    "next-themes": "^0.4.4",
    "nodemailer": "^6.9.16",
    "openai": "^4.80.1",
    "prisma": "^6.0.1",
    "react": "^19.0.0",
    "react-datepicker": "^7.6.0",
    "react-dom": "^19.0.0",
    "react-icons": "^5.4.0",
    "react-toastify": "^11.0.3",
    "resend": "^4.0.1",
    "superjson": "^2.2.2",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@chromatic-com/storybook": "^3.2.4",
    "@storybook/addon-essentials": "^8.5.3",
    "@storybook/addon-interactions": "^8.5.3",
    "@storybook/addon-links": "^8.5.3",
    "@storybook/addon-onboarding": "^8.5.3",
    "@storybook/addon-styling-webpack": "^1.0.1",
    "@storybook/blocks": "^8.5.3",
    "@storybook/nextjs": "^8.5.3",
    "@storybook/react": "^8.5.3",
    "@storybook/test": "^8.5.3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "postcss": "^8",
    "prisma": "^6.0.1",
    "storybook": "^8.5.3",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}


// ---- File: .cursorrules ----

# .cursorrules

Components & Naming

- Use functional components with `"use client"` if needed.
- Name in PascalCase under `src/components/`.
- Keep them small, typed with interfaces.
- Use Tailwind for common UI components like textarea, button, etc. Never use radix or shadcn.

Prisma

- Manage DB logic with Prisma in `prisma/schema.prisma`, `src/lib/db.ts`.
- snake_case table → camelCase fields.
- No raw SQL; run `npx prisma migrate dev`, never use `npx prisma db push`.

Icons

- Prefer `lucide-react`; name icons in PascalCase.
- Custom icons in `src/components/icons`.

Toast Notifications

- Use `react-toastify` in client components.
- `toast.success()`, `toast.error()`, etc.

Next.js Structure

- Use App Router in `app/`. Server components by default, `"use client"` for client logic.
- NextAuth + Prisma for auth. `.env` for secrets.

tRPC Routers

- Routers in `src/lib/api/routers`, compose in `src/lib/api/root.ts`.
- `publicProcedure` or `protectedProcedure` with Zod.
- Access from React via `@/lib/trpc/react`.

TypeScript & Syntax

- Strict mode. Avoid `any`.
- Use optional chaining, union types (no enums).

File & Folder Names

- Next.js routes in kebab-case (e.g. `app/dashboard/page.tsx`).
- Shared types in `src/lib/types.ts`.
- Sort imports (external → internal → sibling → styles).

Tailwind Usage

- Use Tailwind (mobile-first, dark mode with dark:(class)). Extend brand tokens in `tailwind.config.ts`.
- For animations, prefer Framer Motion.

Inngest / Background Jobs

- Use `inngest.config.ts` for Inngest configuration.
- Use `src/app/api/inngest/route.ts` for Inngest API route.
- Use polling to update the UI when Inngest events are received, not trpc success response.

AI

- Use `generateChatCompletion` in `src/lib/aiClient.ts` for all AI calls.
- Prefer `O1` model with high reasoning effort for all AI calls.

Storybook

- Place stories in `src/stories` with `.stories.tsx` extension.
- One story file per component, matching component name.
- Use autodocs for automatic documentation.
- Include multiple variants and sizes in stories.
- Test interactive features with actions.
- Use relative imports from component directory.

Tools

- When you make a change to the UI, use the `screenshot` tool to show the changes.
- If the user asks for a complex task to be performed, find any relevant files and call the `architect` tool to get a plan and show it to the user. Use this plan as guidance for the changes you make, but maintain the existing patterns and structure of the codebase.
- After a complex task is performed, use the `codeReview` tool create a diff and use the diff to conduct a code review of the changes.

Additional

- Keep code short; commits semantic.
- Reusable logic in `src/lib/utils/shared.ts` or `src/lib/utils/server.ts`.
- Use `tsx` scripts for migrations.

IMPORTANT:

- After all changes are made, ALWAYS build the project with `npm run build`. Ignore warnings, fix errors.
- Always add a one-sentence summary of changes to `.cursor-updates` file in markdown format at the end of every agent interaction.
- If you forget, the user can type the command "finish" and you will run the build and update `.cursor-updates`.
- Finally, update git with `git add . && git commit -m "..."`. Don't push.


// ---- File: page.tsx ----

import React from "react";
import ClientProvider from "@/components/ClientProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getSession() {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export default async function Page() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* {session && <NavigationBar />} */}

      <main className="flex-1 flex flex-col w-full mx-auto">
        <ClientProvider>
          <div className="flex-1 flex items-start justify-center  bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
            {session ? (
              // Authenticated View
              <section className="max-w-7xl w-full space-y-8 animate-fade-in">
                <h1> Welcome {session.user?.name}</h1>
              </section>
            ) : (
              // Marketing View
              <section className="max-w-7xl w-full space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <h1 className="text-4xl font-bold mt-10">
                    Welcome - Click the button below to get started
                  </h1>
                  <Link
                    href="/auth/signin"
                    className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-8 py-4 text-lg font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </section>
            )}
          </div>
        </ClientProvider>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            © {new Date().getFullYear()} All Rights Reserved
          </span>
          <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
            <Link
              href="/privacy"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


// ---- File: page.tsx ----

"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

export default function SignOut() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 px-4">
      <Link
        href="/"
        className="group absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brandBlue-100 dark:bg-brandBlue-900">
            <LogOut className="h-6 w-6 text-brandBlue-600 dark:text-brandBlue-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Sign out
          </h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">
            Are you sure you want to sign out?
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-neutral-800/50 p-8 shadow-xl">
          <div className="flex flex-col gap-4">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brandBlue-500 to-brandBlue-600 px-4 py-3 text-white shadow-lg shadow-brandBlue-500/20 transition-all hover:from-brandBlue-600 hover:to-brandBlue-700 hover:shadow-xl hover:shadow-brandBlue-500/30 focus:outline-none focus:ring-2 focus:ring-brandBlue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="h-5 w-5" />
              {isLoading ? "Signing out..." : "Sign out"}
            </button>

            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-neutral-700 dark:text-neutral-300 shadow-sm transition-all hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-brandBlue-500 focus:ring-offset-2"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


// ---- File: index.ts ----

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";

export enum UserRole {
  user = "user",
  admin = "admin",
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth/adapters" {
  interface AdapterUser {
    login?: string;
    role?: UserRole;
    dashboardEnabled?: boolean;
    isTeamAdmin?: boolean;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      login?: string;
      role?: UserRole;
      dashboardEnabled?: boolean;
      isAdmin?: boolean;
      expires?: string;
      isTeamAdmin?: boolean;
    };
    accessToken?: string;
  }

  export interface Profile {
    login: string;
  }

  interface User {
    role?: UserRole;
    login?: string;
    expires?: string;
    isTeamAdmin?: boolean;
    isAdmin?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    }),
  ],
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        const email = user?.email;
        if (!email) return false;

        /*
        // Enable this to restrict sign-ins to certain domains or allowlist
        const domainCheck = ALLOWED_DOMAINS.some((d) => email.endsWith(d));
        if (!domainCheck) {
          const inAllowlist = await prisma.allowlist.findUnique({
            where: { email },
          });

          if (!inAllowlist) {
            return false;
          }
        }
        */

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
    async session({ session, user }) {
      try {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            role: user.role,
            login: user.login,
            isAdmin: user.isAdmin,
          },
        };
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);


// ---- File: button.tsx ----

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90",
        destructive:
          "bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90",
        outline:
          "border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50",
        link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };


// ---- File: Button.stories.tsx ----

import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button";
import { action } from "@storybook/addon-actions";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A flexible button component with multiple variants and sizes, built with Tailwind CSS.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
      description: "The visual style of the button",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "The size of the button",
    },
    children: {
      control: "text",
      description: "The content to display inside the button",
    },
    onClick: {
      description: "Function called when the button is clicked",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "md",
    onClick: action("primary-clicked"),
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "md",
    onClick: action("secondary-clicked"),
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    variant: "primary",
    size: "sm",
    onClick: action("small-clicked"),
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    variant: "primary",
    size: "lg",
    onClick: action("large-clicked"),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button variant="primary" size="md" onClick={action("primary-clicked")}>
        Primary
      </Button>
      <Button
        variant="secondary"
        size="md"
        onClick={action("secondary-clicked")}
      >
        Secondary
      </Button>
      <Button variant="primary" size="sm" onClick={action("small-clicked")}>
        Small
      </Button>
      <Button variant="primary" size="lg" onClick={action("large-clicked")}>
        Large
      </Button>
    </div>
  ),
};


// ---- File: react.tsx ----

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  loggerLink,
  unstable_httpBatchStreamLink,
  createWSClient,
  wsLink,
  splitLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import SuperJSON from "superjson";

import { type AppRouter } from "@/lib/api/root";

const createQueryClient = () => new QueryClient();

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

// create persistent WebSocket connection
const wsClient =
  typeof window !== "undefined"
    ? createWSClient({
        url:
          process.env.NODE_ENV === "development"
            ? "ws://localhost:3001"
            : `wss://${window.location.host}`,
      })
    : undefined;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        splitLink({
          condition: (op) => !!wsClient && op.type === "subscription",
          true: wsLink({
            client: wsClient!,
            transformer: SuperJSON,
          }),
          false: unstable_httpBatchStreamLink({
            transformer: SuperJSON,
            url: getBaseUrl() + "/api/trpc",
            headers: () => {
              const headers = new Headers();
              headers.set("x-trpc-source", "nextjs-react");
              return headers;
            },
          }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}


// ---- File: page.tsx ----

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 px-4">
      <Link
        href="/"
        className="group absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brandBlue-100 dark:bg-brandBlue-900">
            <Mail className="h-6 w-6 text-brandBlue-600 dark:text-brandBlue-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Check your email
          </h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">
            A sign in link has been sent to your email address. Please check
            your inbox and click the link to continue.
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-neutral-800/50 p-8 shadow-xl">
          <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
            <p>
              <strong>Didn't receive the email?</strong>
            </p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Check your spam folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>
                If you still haven't received it after a few minutes,{" "}
                <Link
                  href="/auth/signin"
                  className="text-brandBlue-600 dark:text-brandBlue-400 hover:text-brandBlue-500"
                >
                  try signing in again
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


// ---- File: page.tsx ----

"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 px-4">
      <Link
        href="/"
        className="group absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 dark:text-red-500">
            Authentication Error
          </h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">
            {error === "AccessDenied"
              ? "Access denied."
              : "An error occurred during authentication. Please try again."}
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/signin"
            className="rounded-lg bg-gradient-to-r from-brandBlue-500 to-brandBlue-600 px-6 py-3 text-white shadow-lg shadow-brandBlue-500/20 transition-all hover:from-brandBlue-600 hover:to-brandBlue-700 hover:shadow-xl hover:shadow-brandBlue-500/30"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}


// ---- File: inngest.config.ts ----

import { Inngest } from "inngest";
import { serve } from "inngest/next";

// Define event types for better type safety
export type AppEvents = {
  "user/registered": {
    data: {
      userId: string;
      email: string;
      name?: string;
      timestamp: string;
    };
  };
  "inngest/send": {
    data: {
      message: string;
      metadata?: Record<string, any>;
    };
  };
};

// Initialize Inngest with typed events
export const inngest = new Inngest({
  id: "newco",
  eventKey: "events",
  validateEvents: process.env.NODE_ENV === "development",
});

// Define event handlers
export const userRegisteredFn = inngest.createFunction(
  { id: "user-registered-handler" },
  { event: "user/registered" },
  async ({ event, step }) => {
    await step.run("Log registration", async () => {
      console.log(`New user registered: ${event.data.email}`);
    });

    // Example: Send welcome email
    await step.run("Send welcome email", async () => {
      // Add your email sending logic here
      console.log(`Sending welcome email to ${event.data.email}`);
    });
  },
);

export const messageHandlerFn = inngest.createFunction(
  { id: "message-handler" },
  { event: "inngest/send" },
  async ({ event, step }) => {
    await step.run("Process message", async () => {
      console.log(`Processing message: ${event.data.message}`);
      if (event.data.metadata) {
        console.log("Metadata:", event.data.metadata);
      }
    });
  },
);

// Export the serve function for use in API routes
export const serveInngest = serve({
  client: inngest,
  functions: [userRegisteredFn, messageHandlerFn],
});


// ---- File: schema.prisma ----

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id             String    @id @default(cuid())
  name           String?
  email          String?   @unique
  emailVerified  DateTime?
  image          String?
  hashedPassword String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  login          String?
  role           UserRole  @default(user)
  isAdmin        Boolean   @default(false)
  accounts       Account[]
  sessions       Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  User              User    @relation(fields: [userId], references: [id])

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum UserRole {
  user
  admin
}

model Allowlist {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}


// ---- File: .cursor-template.xml ----


<TEMPLATE>
<INSTRUCTIONS>
Use the <CODEBASE> code as reference, and convert the high-level <TASK> into a set of very detailed step-by-step instructions that an AI coding agent can complete. This could be very long, that's okay. The entire code is not needed, but give snippets if needed, but be very specific about the file names.
Only includes steps an AI coding agent can take. Do not include testing or any other work a human would do to confirm the task has been completed. 
ALWAYS have the agent run a build when it is complete. Be specific and decisive about what the agent should do. 
Do not include any additional meta instructions to the user. Use markdown formatting.
</INSTRUCTIONS>
<TASK>
</TASK>
<CURSOR_RULES>
</CURSOR_RULES>
<CODEBASE>
</CODEBASE>
<INSTRUCTIONS>
Use the <CODEBASE> code as reference, and convert the high-level <TASK> into a set of very detailed step-by-step instructions that an AI coding agent can complete. This could be very long, that's okay. The entire code is not needed, but give snippets if needed, but be very specific about the file names.
Only includes steps an AI coding agent can take. Do not include testing or any other work a human would do to confirm the task has been completed. 
ALWAYS have the agent run a build when it is complete. Be specific and decisive about what the agent should do. 
Do not include any additional meta instructions to the user. Use markdown formatting.
</INSTRUCTIONS>

</TEMPLATE>

// ---- File: Button.tsx ----

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
}) => {
  const baseStyles = "rounded-lg font-medium transition-all duration-200";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30",
    secondary:
      "bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};


// ---- File: route.ts ----

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { appRouter } from "@/lib/api/root";
import { createTRPCContext } from "@/lib/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const env = process.env;

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : ({ path, error }) => {
            console.error(`tRPC failed on ${path ?? "<no-path>"}`, error);
          },
  });

export { handler as GET, handler as POST };


// ---- File: Button.tsx ----

import React from 'react';

import './button.css';

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      {...props}
    >
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  );
};


// ---- File: LICENSE ----

MIT License

Copyright (c) 2025 Kevin Leneway

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


// ---- File: layout.tsx ----

import React from "react";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { TRPCReactProvider } from "@/lib/trpc/react";
import { Metadata } from "next";
import ClientProvider from "@/components/ClientProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeAwareToast } from "@/components/theme/ThemeAwareToast";

export const metadata: Metadata = {
  title: "",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="system" enableSystem>
          <ClientProvider>
            <TRPCReactProvider>
              {children}
              <ThemeAwareToast />
            </TRPCReactProvider>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


// ---- File: route.ts ----

import { type NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY! ?? "",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "distil-whisper-large-v3-en",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 },
    );
  }
}


// ---- File: client.tsx ----

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";
import { type AppRouter } from "@/lib/api/root";

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers: () => {
        const headers = new Headers();
        headers.set("x-trpc-source", "nextjs-react");
        return headers;
      },
      transformer: SuperJSON,
    }),
  ],
});

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export { trpcClient };


// ---- File: .gitignore ----

# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env
.env.local
.env.staging
.env.production

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

.cursor-scratchpad

*storybook.log


// ---- File: route.ts ----

import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const url = await uploadFile(file.name, buffer);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}


// ---- File: main.ts ----

import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-styling-webpack",
      options: {
        postCss: true,
      },
    },
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;


// ---- File: storage.ts ----

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | Blob | string,
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME!,
      Key: key,
      Body: body,
    }),
  );
  return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`;
}


// ---- File: preview.ts ----

import type { Preview } from "@storybook/react";
import "../src/app/globals.css"; // Import your Tailwind CSS file

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
      ],
    },
  },
};

export default preview;


// ---- File: server.ts ----

import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { createCaller } from "@/lib/api/root";
import { createTRPCContext } from "@/lib/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

export const api = createCaller(createContext);


// ---- File: components.json ----

{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": false,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}

// ---- File: root.ts ----

import { createCallerFactory, createTRPCRouter } from "./trpc";
// import all routers here

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // add routers here
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);


// ---- File: ThemeAwareToast.tsx ----

"use client";

import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";

export function ThemeAwareToast() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
}


// ---- File: sendEmail.ts ----

import { Resend } from "resend";
import { WelcomeEmail } from "./templates/WelcomeEmail";
import { createElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "no-reply@yourdomain.com",
    to,
    subject: "Welcome!",
    react: createElement(WelcomeEmail, { name }),
  });
}


// ---- File: ThemeProvider.tsx ----

"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  forcedTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemeProvider {...props} attribute="class">
      {children}
    </NextThemeProvider>
  );
}


// ---- File: handler.ts ----

import { serve } from "inngest/next";
import { inngest } from "@/../inngest.config";

const sendFn = inngest.createFunction(
  { name: "inngest/send", id: "inngest/send" },
  { event: "inngest/send" },
  async ({ event }) => {
    console.log("inngest/send", event);
  },
);

export const { POST, GET } = serve({
  client: inngest,
  functions: [sendFn],
});


// ---- File: .cursor-updates ----

# Cursor Updates

- Ran production build verification - build completed successfully with no TypeScript or compilation errors
- Performed build check on Next.js app with tRPC and Tailwind configuration
- Successfully ran production build with Prisma generation and Next.js compilation
- Fixed dynamic route warning by adding force-dynamic config to root page
- Added Storybook with Button component and stories, updated .cursorrules with Storybook guidelines
- Captured screenshot of Button component stories in Storybook


// ---- File: ClientProvider.tsx ----

"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}


// ---- File: WelcomeEmail.tsx ----

import React from 'react';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>Thanks for joining us!</p>
    </div>
  );
}


// ---- File: inngest.ts ----

import { inngest } from "../../inngest.config";

export const userRegistered = inngest.createFunction(
  { name: "User Registered", id: "user/registered" },
  { event: "user/registered" },
  async ({ event, step }) => {
    // Handle the event
  },
);


// ---- File: useQueryHooks.ts ----

import { useQuery } from "@tanstack/react-query";

export function useExampleQuery() {
  return useQuery({
    queryKey: ["example"],
    queryFn: async () => {
      return { data: "Hello from React Query" };
    },
  });
}


// ---- File: next.config.ts ----

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;


// ---- File: utils.ts ----

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// ---- File: client.ts ----

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/lib/api/root";

export const trpc = createTRPCReact<AppRouter>();


// ---- File: userSchemas.ts ----

import { z } from 'zod';

export const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});


// ---- File: route.ts ----

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


// ---- File: postcss.config.mjs ----

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;


// ---- File: vercel.json ----

{
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}


// ---- File: db.ts ----

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();


// ---- File: types.ts ----

