"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FontFamily = "geist" | "jetbrains" | "firacode" | "consolas";

export const fontFamilyMap: Record<FontFamily, string> = {
  geist: "'Geist Mono', 'JetBrains Mono', monospace",
  jetbrains: "'JetBrains Mono', 'Fira Code', monospace",
  firacode: "'Fira Code', 'JetBrains Mono', monospace",
  consolas: "Consolas, 'Courier New', monospace",
};

export const fontFamilyLabels: Record<FontFamily, string> = {
  geist: "Geist Mono",
  jetbrains: "JetBrains Mono",
  firacode: "Fira Code",
  consolas: "Consolas",
};

export interface EditorSettings {
  // Font
  fontFamily: FontFamily;
  fontSize: number;
  lineHeight: number;
  fontLigatures: boolean;
  // Layout
  tabSize: number;
  wordWrap: "on" | "off";
  lineNumbers: "on" | "off" | "relative";
  minimap: boolean;
  stickyScroll: boolean;
  folding: boolean;
  // Formatting
  formatOnPaste: boolean;
  formatOnType: boolean;
  // Cursor
  cursorBlinking: "blink" | "smooth" | "phase" | "expand" | "solid";
  cursorStyle: "line" | "block" | "underline";
  cursorWidth: number;
  // Rendering
  renderWhitespace: "none" | "boundary" | "selection" | "trailing" | "all";
  bracketColorization: boolean;
  smoothScrolling: boolean;
  mouseWheelZoom: boolean;
  // Hover
  hoverDelay: number;
  // AI
  aiSuggestions: boolean;
  // Terminal
  terminalScrollback: number;
}

interface EditorSettingsStore extends EditorSettings {
  update: (settings: Partial<EditorSettings>) => void;
  reset: () => void;
}

const defaults: EditorSettings = {
  fontFamily: "geist",
  fontSize: 14,
  lineHeight: 20,
  fontLigatures: true,
  tabSize: 2,
  wordWrap: "on",
  lineNumbers: "on",
  minimap: false,
  stickyScroll: true,
  folding: true,
  formatOnPaste: true,
  formatOnType: true,
  cursorBlinking: "smooth",
  cursorStyle: "line",
  cursorWidth: 2,
  renderWhitespace: "selection",
  bracketColorization: true,
  smoothScrolling: true,
  mouseWheelZoom: true,
  hoverDelay: 300,
  aiSuggestions: true,
  terminalScrollback: 1000,
};

export const useEditorSettings = create<EditorSettingsStore>()(
  persist(
    (set) => ({
      ...defaults,
      update: (settings) => set((state) => ({ ...state, ...settings })),
      reset: () => set({ ...defaults }),
    }),
    { name: "cloudforge-editor-settings" }
  )
);
