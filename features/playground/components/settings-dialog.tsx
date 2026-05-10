"use client";

import {
  useEditorSettings,
  fontFamilyLabels,
  fontFamilyMap,
  type FontFamily,
} from "@/features/playground/stores/editor-settings-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Code2,
  RotateCcw,
  Palette,
  Keyboard,
  Terminal,
} from "lucide-react";
import { useTheme } from "next-themes";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingRow = ({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div className="min-w-0 flex-1">
      <Label className="text-sm font-medium">{label}</Label>
      {description && (
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const KEYBINDINGS = [
  { key: "Ctrl + S", action: "Save current file" },
  { key: "Ctrl + Shift + S", action: "Save all files" },
  { key: "Ctrl + Space", action: "Trigger AI suggestion" },
  { key: "Tab", action: "Accept AI suggestion" },
  { key: "Escape", action: "Reject AI suggestion" },
  { key: "Ctrl + /", action: "Toggle line comment" },
  { key: "Ctrl + Z", action: "Undo" },
  { key: "Ctrl + Shift + Z", action: "Redo" },
  { key: "Ctrl + F", action: "Find in file" },
  { key: "Ctrl + H", action: "Find and replace" },
  { key: "Alt + ↑ / ↓", action: "Move line up / down" },
  { key: "Ctrl + D", action: "Select next occurrence" },
  { key: "Ctrl + G", action: "Go to line" },
  { key: "Ctrl + P", action: "Go to file (Monaco)" },
  { key: "Ctrl + Shift + K", action: "Delete line" },
];

const FONT_PREVIEW_TEXT = "const fn = () => 0 !== 1 && x => x + 1;";

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const settings = useEditorSettings();
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border/80 px-6 py-4">
          <DialogTitle className="text-base font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="editor" className="flex h-[calc(85vh-73px)] flex-col">
          <TabsList className="h-auto shrink-0 justify-start gap-0 rounded-none border-b border-border/80 bg-transparent px-4 py-0">
            {[
              { value: "editor", icon: Code2, label: "Editor" },
              { value: "terminal", icon: Terminal, label: "Terminal" },
              { value: "ai", icon: Bot, label: "AI" },
              { value: "appearance", icon: Palette, label: "Appearance" },
              { value: "keybindings", icon: Keyboard, label: "Keybindings" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-1.5 rounded-none border-b-2 border-transparent px-3 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── EDITOR TAB ── */}
          <TabsContent value="editor" className="mt-0 flex-1 overflow-y-auto px-6">
            <div className="divide-y divide-border/50">

              {/* Font family */}
              <SettingRow label="Font Family" description="Monospace font used in the editor">
                <Select
                  value={settings.fontFamily}
                  onValueChange={(v) => settings.update({ fontFamily: v as FontFamily })}
                >
                  <SelectTrigger className="h-8 w-40 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(fontFamilyLabels) as FontFamily[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        <span style={{ fontFamily: fontFamilyMap[key] }}>
                          {fontFamilyLabels[key]}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>

              {/* Font preview */}
              <div className="py-3">
                <p className="mb-2 text-xs text-muted-foreground">Font preview</p>
                <div
                  className="rounded-md border border-border/60 bg-muted/30 px-4 py-3 text-sm text-foreground"
                  style={{ fontFamily: fontFamilyMap[settings.fontFamily], fontSize: settings.fontSize }}
                >
                  {FONT_PREVIEW_TEXT}
                </div>
              </div>

              {/* Font size */}
              <SettingRow label="Font Size" description={`${settings.fontSize}px`}>
                <div className="flex w-44 items-center gap-3">
                  <Slider
                    min={10} max={24} step={1}
                    value={[settings.fontSize]}
                    onValueChange={([v]) => settings.update({ fontSize: v })}
                    className="flex-1"
                  />
                  <span className="w-6 text-right font-code text-xs text-muted-foreground">{settings.fontSize}</span>
                </div>
              </SettingRow>

              {/* Line height */}
              <SettingRow label="Line Height" description={`${settings.lineHeight}px`}>
                <div className="flex w-44 items-center gap-3">
                  <Slider
                    min={16} max={30} step={1}
                    value={[settings.lineHeight]}
                    onValueChange={([v]) => settings.update({ lineHeight: v })}
                    className="flex-1"
                  />
                  <span className="w-6 text-right font-code text-xs text-muted-foreground">{settings.lineHeight}</span>
                </div>
              </SettingRow>

              {/* Tab size */}
              <SettingRow label="Tab Size" description="Spaces per indent level">
                <Select
                  value={String(settings.tabSize)}
                  onValueChange={(v) => settings.update({ tabSize: Number(v) })}
                >
                  <SelectTrigger className="h-8 w-20 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              {/* Word wrap */}
              <SettingRow label="Word Wrap" description="Wrap long lines at editor width">
                <Switch
                  checked={settings.wordWrap === "on"}
                  onCheckedChange={(v) => settings.update({ wordWrap: v ? "on" : "off" })}
                />
              </SettingRow>

              {/* Line numbers */}
              <SettingRow label="Line Numbers">
                <Select
                  value={settings.lineNumbers}
                  onValueChange={(v) => settings.update({ lineNumbers: v as "on" | "off" | "relative" })}
                >
                  <SelectTrigger className="h-8 w-24 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on">On</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="relative">Relative</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              {/* Minimap */}
              <SettingRow label="Minimap" description="File overview on scrollbar">
                <Switch
                  checked={settings.minimap}
                  onCheckedChange={(v) => settings.update({ minimap: v })}
                />
              </SettingRow>

              {/* Font ligatures */}
              <SettingRow label="Font Ligatures" description="Render coding ligatures (→ ≠ ===)">
                <Switch
                  checked={settings.fontLigatures}
                  onCheckedChange={(v) => settings.update({ fontLigatures: v })}
                />
              </SettingRow>

              {/* Cursor style */}
              <SettingRow label="Cursor Style">
                <Select
                  value={settings.cursorStyle}
                  onValueChange={(v) => settings.update({ cursorStyle: v as "line" | "block" | "underline" })}
                >
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line</SelectItem>
                    <SelectItem value="block">Block</SelectItem>
                    <SelectItem value="underline">Underline</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              {/* Cursor width */}
              <SettingRow label="Cursor Width" description={`${settings.cursorWidth}px (line cursor only)`}>
                <div className="flex w-44 items-center gap-3">
                  <Slider
                    min={1} max={5} step={1}
                    value={[settings.cursorWidth]}
                    onValueChange={([v]) => settings.update({ cursorWidth: v })}
                    className="flex-1"
                  />
                  <span className="w-4 text-right font-code text-xs text-muted-foreground">{settings.cursorWidth}</span>
                </div>
              </SettingRow>

              {/* Cursor blinking */}
              <SettingRow label="Cursor Animation">
                <Select
                  value={settings.cursorBlinking}
                  onValueChange={(v) => settings.update({ cursorBlinking: v as EditorSettings["cursorBlinking"] })}
                >
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["blink", "smooth", "phase", "expand", "solid"].map((v) => (
                      <SelectItem key={v} value={v} className="capitalize">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>

              {/* Render whitespace */}
              <SettingRow label="Render Whitespace" description="Show whitespace characters">
                <Select
                  value={settings.renderWhitespace}
                  onValueChange={(v) => settings.update({ renderWhitespace: v as EditorSettings["renderWhitespace"] })}
                >
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["none", "selection", "boundary", "trailing", "all"].map((v) => (
                      <SelectItem key={v} value={v} className="capitalize">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>

              {/* Format on paste */}
              <SettingRow label="Format on Paste">
                <Switch
                  checked={settings.formatOnPaste}
                  onCheckedChange={(v) => settings.update({ formatOnPaste: v })}
                />
              </SettingRow>

              {/* Format on type */}
              <SettingRow label="Format on Type">
                <Switch
                  checked={settings.formatOnType}
                  onCheckedChange={(v) => settings.update({ formatOnType: v })}
                />
              </SettingRow>

              {/* Folding */}
              <SettingRow label="Code Folding" description="Collapse regions and functions">
                <Switch
                  checked={settings.folding}
                  onCheckedChange={(v) => settings.update({ folding: v })}
                />
              </SettingRow>

              {/* Bracket colorization */}
              <SettingRow label="Bracket Colorization" description="Color-match bracket pairs">
                <Switch
                  checked={settings.bracketColorization}
                  onCheckedChange={(v) => settings.update({ bracketColorization: v })}
                />
              </SettingRow>

              {/* Sticky scroll */}
              <SettingRow label="Sticky Scroll" description="Pin scope headers while scrolling">
                <Switch
                  checked={settings.stickyScroll}
                  onCheckedChange={(v) => settings.update({ stickyScroll: v })}
                />
              </SettingRow>

              {/* Smooth scrolling */}
              <SettingRow label="Smooth Scrolling" description="Animate scroll movements">
                <Switch
                  checked={settings.smoothScrolling}
                  onCheckedChange={(v) => settings.update({ smoothScrolling: v })}
                />
              </SettingRow>

              {/* Mouse wheel zoom */}
              <SettingRow label="Mouse Wheel Zoom" description="Ctrl + scroll to zoom font size">
                <Switch
                  checked={settings.mouseWheelZoom}
                  onCheckedChange={(v) => settings.update({ mouseWheelZoom: v })}
                />
              </SettingRow>

              {/* Hover delay */}
              <SettingRow label="Hover Tooltip Delay" description={`${settings.hoverDelay}ms before tooltip appears`}>
                <div className="flex w-44 items-center gap-3">
                  <Slider
                    min={100} max={1000} step={50}
                    value={[settings.hoverDelay]}
                    onValueChange={([v]) => settings.update({ hoverDelay: v })}
                    className="flex-1"
                  />
                  <span className="w-8 text-right font-code text-xs text-muted-foreground">{settings.hoverDelay}</span>
                </div>
              </SettingRow>

              <div className="py-4">
                <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={settings.reset}>
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset to defaults
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ── TERMINAL TAB ── */}
          <TabsContent value="terminal" className="mt-0 flex-1 overflow-y-auto px-6">
            <div className="divide-y divide-border/50">

              <SettingRow label="Font Size" description="Syncs with editor font size setting">
                <Badge variant="secondary" className="font-code text-xs">
                  {settings.fontSize}px
                </Badge>
              </SettingRow>

              <SettingRow label="Font Family" description="Syncs with editor font family setting">
                <Badge variant="secondary" className="font-code text-xs">
                  {fontFamilyLabels[settings.fontFamily]}
                </Badge>
              </SettingRow>

              <SettingRow
                label="Scrollback Lines"
                description={`Keep ${settings.terminalScrollback.toLocaleString()} lines of history`}
              >
                <div className="flex w-44 items-center gap-3">
                  <Slider
                    min={500} max={10000} step={500}
                    value={[settings.terminalScrollback]}
                    onValueChange={([v]) => settings.update({ terminalScrollback: v })}
                    className="flex-1"
                  />
                  <span className="w-10 text-right font-code text-xs text-muted-foreground">
                    {settings.terminalScrollback >= 1000
                      ? `${settings.terminalScrollback / 1000}k`
                      : settings.terminalScrollback}
                  </span>
                </div>
              </SettingRow>

              <SettingRow label="Theme" description="Follows app theme (dark/light)">
                <Badge variant="secondary" className="text-xs capitalize">
                  {theme ?? "dark"}
                </Badge>
              </SettingRow>

              <div className="py-4">
                <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    Terminal font and theme automatically follow editor settings. Change Font Family or Font Size in the Editor tab to update both panels simultaneously.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── AI TAB ── */}
          <TabsContent value="ai" className="mt-0 flex-1 overflow-y-auto px-6">
            <div className="divide-y divide-border/50">
              <SettingRow
                label="AI Inline Suggestions"
                description="Show code completions as you type (Tab to accept)"
              >
                <Switch
                  checked={settings.aiSuggestions}
                  onCheckedChange={(v) => settings.update({ aiSuggestions: v })}
                />
              </SettingRow>

              <div className="py-4 space-y-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Models</p>
                <div className="space-y-3">
                  {[
                    {
                      label: "Inline Suggestions",
                      desc: "Fast completions triggered as you type",
                      model: "llama-3.1-8b-instant",
                    },
                    {
                      label: "AI Chat Assistant",
                      desc: "Review, fix, optimize, and explain code",
                      model: "llama-3.3-70b-versatile",
                    },
                  ].map(({ label, desc, model }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="font-code text-xs">{model}</Badge>
                        <p className="mt-1 text-xs text-muted-foreground">via Groq</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-xs text-primary font-medium">Free tier active</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Powered by Groq cloud inference. No rate limits for normal usage.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── APPEARANCE TAB ── */}
          <TabsContent value="appearance" className="mt-0 flex-1 overflow-y-auto px-6">
            <div className="divide-y divide-border/50">
              <SettingRow label="Theme" description="Editor and UI color scheme">
                <div className="flex gap-2">
                  {(["dark", "light", "system"] as const).map((t) => (
                    <Button
                      key={t}
                      variant={theme === t ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-3 text-xs capitalize"
                      onClick={() => setTheme(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </SettingRow>

              <div className="py-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Editor Theme</p>
                <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Forge Console</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Custom dark — warm amber on deep black</p>
                  </div>
                  <Badge className="text-xs">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Additional editor themes coming soon.</p>
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Font</p>
                <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-4">
                  <p className="text-xs text-muted-foreground mb-2">{fontFamilyLabels[settings.fontFamily]} · {settings.fontSize}px · lh {settings.lineHeight}</p>
                  <p
                    className="text-sm text-foreground"
                    style={{ fontFamily: fontFamilyMap[settings.fontFamily], fontSize: settings.fontSize, lineHeight: `${settings.lineHeight}px` }}
                  >
                    {FONT_PREVIEW_TEXT}
                  </p>
                  <p
                    className="mt-1 text-sm text-muted-foreground"
                    style={{ fontFamily: fontFamilyMap[settings.fontFamily], fontSize: settings.fontSize, lineHeight: `${settings.lineHeight}px` }}
                  >
                    0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── KEYBINDINGS TAB ── */}
          <TabsContent value="keybindings" className="mt-0 flex-1 overflow-y-auto px-6">
            <div className="py-4 space-y-1">
              {KEYBINDINGS.map(({ key, action }) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 hover:bg-muted/40"
                >
                  <span className="text-sm text-muted-foreground">{action}</span>
                  <kbd className="font-code rounded border border-border/70 bg-muted px-2 py-1 text-xs">{key}</kbd>
                </div>
              ))}
              <Separator className="my-3" />
              <p className="px-3 text-xs text-muted-foreground">
                Monaco editor standard keybindings also apply.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Re-export type for use in other files
type EditorSettings = import("@/features/playground/stores/editor-settings-store").EditorSettings;
