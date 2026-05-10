"use client";

import { useEditorSettings } from "@/features/playground/stores/editor-settings-store";
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
import { Bot, Code2, RotateCcw, Palette, Keyboard } from "lucide-react";
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
  { key: "Ctrl + `", action: "Focus terminal" },
];

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const settings = useEditorSettings();
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b border-border/80 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="editor" className="flex h-[calc(80vh-73px)] flex-col">
          <TabsList className="h-auto shrink-0 justify-start gap-0 rounded-none border-b border-border/80 bg-transparent px-6 py-0">
            <TabsTrigger
              value="editor"
              className="gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Code2 className="h-3.5 w-3.5" />
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Bot className="h-3.5 w-3.5" />
              AI
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Palette className="h-3.5 w-3.5" />
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="keybindings"
              className="gap-2 rounded-none border-b-2 border-transparent px-4 py-2.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Keyboard className="h-3.5 w-3.5" />
              Keybindings
            </TabsTrigger>
          </TabsList>

          {/* Editor Tab */}
          <TabsContent value="editor" className="mt-0 flex-1 overflow-y-auto px-6">
            <div className="divide-y divide-border/50">
              <SettingRow
                label="Font Size"
                description={`Current: ${settings.fontSize}px`}
              >
                <div className="flex w-40 items-center gap-3">
                  <Slider
                    min={10}
                    max={24}
                    step={1}
                    value={[settings.fontSize]}
                    onValueChange={([value]) => settings.update({ fontSize: value })}
                    className="flex-1"
                  />
                  <span className="w-6 text-right font-code text-xs text-muted-foreground">
                    {settings.fontSize}
                  </span>
                </div>
              </SettingRow>

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

              <SettingRow label="Word Wrap" description="Wrap long lines at editor width">
                <Switch
                  checked={settings.wordWrap === "on"}
                  onCheckedChange={(v) => settings.update({ wordWrap: v ? "on" : "off" })}
                />
              </SettingRow>

              <SettingRow label="Line Numbers" description="Show line numbers in gutter">
                <Select
                  value={settings.lineNumbers}
                  onValueChange={(v) =>
                    settings.update({ lineNumbers: v as "on" | "off" | "relative" })
                  }
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

              <SettingRow label="Minimap" description="Show file overview on scrollbar">
                <Switch
                  checked={settings.minimap}
                  onCheckedChange={(v) => settings.update({ minimap: v })}
                />
              </SettingRow>

              <SettingRow label="Font Ligatures" description="Render coding ligatures (→ ≠ ===)">
                <Switch
                  checked={settings.fontLigatures}
                  onCheckedChange={(v) => settings.update({ fontLigatures: v })}
                />
              </SettingRow>

              <SettingRow label="Format on Paste" description="Auto-format pasted code">
                <Switch
                  checked={settings.formatOnPaste}
                  onCheckedChange={(v) => settings.update({ formatOnPaste: v })}
                />
              </SettingRow>

              <SettingRow label="Format on Type" description="Auto-format while typing">
                <Switch
                  checked={settings.formatOnType}
                  onCheckedChange={(v) => settings.update({ formatOnType: v })}
                />
              </SettingRow>

              <SettingRow label="Cursor Style">
                <Select
                  value={settings.cursorStyle}
                  onValueChange={(v) =>
                    settings.update({ cursorStyle: v as "line" | "block" | "underline" })
                  }
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

              <SettingRow label="Cursor Animation">
                <Select
                  value={settings.cursorBlinking}
                  onValueChange={(v) =>
                    settings.update({
                      cursorBlinking: v as "blink" | "smooth" | "phase" | "expand" | "solid",
                    })
                  }
                >
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blink">Blink</SelectItem>
                    <SelectItem value="smooth">Smooth</SelectItem>
                    <SelectItem value="phase">Phase</SelectItem>
                    <SelectItem value="expand">Expand</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              <SettingRow label="Render Whitespace" description="Show whitespace characters">
                <Select
                  value={settings.renderWhitespace}
                  onValueChange={(v) =>
                    settings.update({
                      renderWhitespace: v as "none" | "boundary" | "selection" | "trailing" | "all",
                    })
                  }
                >
                  <SelectTrigger className="h-8 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="selection">Selection</SelectItem>
                    <SelectItem value="boundary">Boundary</SelectItem>
                    <SelectItem value="trailing">Trailing</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>

              <SettingRow label="Sticky Scroll" description="Pin scope headers while scrolling">
                <Switch
                  checked={settings.stickyScroll}
                  onCheckedChange={(v) => settings.update({ stickyScroll: v })}
                />
              </SettingRow>

              <div className="py-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={settings.reset}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset to defaults
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* AI Tab */}
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Active Models
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">Inline Suggestions</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Fast completions triggered as you type
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="font-code text-xs">
                        llama-3.1-8b-instant
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">via Groq</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">AI Chat Assistant</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Review, fix, optimize, and explain code
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="font-code text-xs">
                        llama-3.3-70b-versatile
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">via Groq</p>
                    </div>
                  </div>
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

          {/* Appearance Tab */}
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
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Editor Theme
                </p>
                <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Forge Console</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Custom dark theme — warm amber on deep black
                    </p>
                  </div>
                  <Badge className="text-xs">Active</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Additional editor themes coming soon.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Keybindings Tab */}
          <TabsContent value="keybindings" className="mt-0 flex-1 overflow-y-auto px-6">
            <div className="py-4 space-y-1">
              {KEYBINDINGS.map(({ key, action }) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 hover:bg-muted/40"
                >
                  <span className="text-sm text-muted-foreground">{action}</span>
                  <kbd className="font-code rounded border border-border/70 bg-muted px-2 py-1 text-xs">
                    {key}
                  </kbd>
                </div>
              ))}
              <Separator className="my-3" />
              <p className="px-3 text-xs text-muted-foreground">
                Monaco editor standard keybindings also apply (Ctrl+G go to line, etc.)
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
