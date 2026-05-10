"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: "on" | "off";
  lineNumbers: "on" | "off" | "relative";
  minimap: boolean;
  fontLigatures: boolean;
  formatOnPaste: boolean;
  formatOnType: boolean;
  cursorBlinking: "blink" | "smooth" | "phase" | "expand" | "solid";
  cursorStyle: "line" | "block" | "underline";
  renderWhitespace: "none" | "boundary" | "selection" | "trailing" | "all";
  stickyScroll: boolean;
  aiSuggestions: boolean;
}

interface EditorSettingsStore extends EditorSettings {
  update: (settings: Partial<EditorSettings>) => void;
  reset: () => void;
}

const defaults: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: "on",
  lineNumbers: "on",
  minimap: false,
  fontLigatures: true,
  formatOnPaste: true,
  formatOnType: true,
  cursorBlinking: "smooth",
  cursorStyle: "line",
  renderWhitespace: "selection",
  stickyScroll: true,
  aiSuggestions: true,
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
