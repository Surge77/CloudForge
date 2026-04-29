"use client";

import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import { SearchAddon } from "xterm-addon-search";
import "xterm/css/xterm.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WebContainer } from "@webcontainer/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TerminalProps {
  className?: string;
  theme?: "dark" | "light";
  webContainerInstance?: WebContainer | null;
  quickCommands?: {
    label: string;
    command: string;
  }[];
  onClose?: () => void;
}

interface TerminalProcess {
  output: ReadableStream<string>;
  exit: Promise<number>;
  kill: () => void;
}

type TerminalProfile = "bash" | "sh" | "node" | "npm" | "powershell";

interface TerminalSession {
  id: string;
  profile: TerminalProfile;
  name: string;
  history: string[];
}

const terminalProfiles: {
  id: TerminalProfile;
  label: string;
  description: string;
}[] = [
  {
    id: "bash",
    label: "bash",
    description: "Default WebContainer command mode",
  },
  {
    id: "sh",
    label: "sh",
    description: "POSIX shell command mode",
  },
  {
    id: "node",
    label: "node",
    description: "Run JavaScript snippets with node -e",
  },
  {
    id: "npm",
    label: "npm",
    description: "Run npm commands quickly",
  },
  {
    id: "powershell",
    label: "PowerShell",
    description: "Listed for parity; unavailable in WebContainer",
  },
];

const getPrompt = (profile: TerminalProfile) => {
  switch (profile) {
    case "node":
      return "node> ";
    case "npm":
      return "npm> ";
    case "powershell":
      return "PS> ";
    case "sh":
      return "sh$ ";
    default:
      return "$ ";
  }
};

const createSession = (profile: TerminalProfile, index: number): TerminalSession => ({
  id: `${profile}-${Date.now()}-${index}`,
  profile,
  name: index === 1 ? terminalProfiles.find((item) => item.id === profile)?.label || profile : `${terminalProfiles.find((item) => item.id === profile)?.label || profile} ${index}`,
  history: [],
});

// Define the methods that will be exposed through the ref
export interface TerminalRef {
  writeToTerminal: (data: string) => void;
  clearTerminal: () => void;
  focusTerminal: () => void;
  runCommand: (command: string) => void;
}

const TerminalComponent = forwardRef<TerminalRef, TerminalProps>(({
  className,
  theme = "dark",
  webContainerInstance,
  quickCommands = [],
  onClose,
}, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const searchAddon = useRef<SearchAddon | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const initialSession = React.useMemo(() => createSession("bash", 1), []);
  const [sessions, setSessions] = useState<TerminalSession[]>(() => [
    initialSession,
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>(
    initialSession.id
  );
  const connectionMessageWritten = useRef(false);
  const isConnected = Boolean(webContainerInstance);
  
  // Command line state
  const currentLine = useRef<string>("");
  const cursorPosition = useRef<number>(0);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const currentProcess = useRef<TerminalProcess | null>(null);
  const shellProcess = useRef<TerminalProcess | null>(null);
  const sessionCounter = useRef(1);
  const activeSessionRef = useRef<TerminalSession | null>(null);
  const executeCommandRef = useRef<(command: string) => void>(() => {});

  const activeSession = React.useMemo<TerminalSession>(() => {
    return (
      sessions.find((session) => session.id === activeSessionId) ||
      sessions[0] ||
      createSession("bash", 1)
    );
  }, [activeSessionId, sessions]);

  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  const terminalThemes = React.useMemo(() => ({
    dark: {
      background: "#090909",
      foreground: "#F4EFE7",
      cursor: "#FF5A1F",
      cursorAccent: "#090909",
      selection: "#FF5A1F33",
      black: "#111113",
      red: "#EF4444",
      green: "#22C55E",
      yellow: "#FFB020",
      blue: "#F97316",
      magenta: "#D97706",
      cyan: "#F59E0B",
      white: "#F4EFE7",
      brightBlack: "#44403C",
      brightRed: "#F87171",
      brightGreen: "#4ADE80",
      brightYellow: "#FFD166",
      brightBlue: "#FB923C",
      brightMagenta: "#F59E0B",
      brightCyan: "#FBBF24",
      brightWhite: "#FFFFFF",
    },
    light: {
      background: "#FFFFFF",
      foreground: "#18181B",
      cursor: "#18181B",
      cursorAccent: "#FFFFFF",
      selection: "#E4E4E7",
      black: "#18181B",
      red: "#DC2626",
      green: "#16A34A",
      yellow: "#CA8A04",
      blue: "#2563EB",
      magenta: "#9333EA",
      cyan: "#0891B2",
      white: "#F4F4F5",
      brightBlack: "#71717A",
      brightRed: "#EF4444",
      brightGreen: "#22C55E",
      brightYellow: "#EAB308",
      brightBlue: "#3B82F6",
      brightMagenta: "#A855F7",
      brightCyan: "#06B6D4",
      brightWhite: "#FAFAFA",
    },
  }), []);

  const writePrompt = useCallback(() => {
    if (term.current) {
      term.current.write(
        `\r\n${getPrompt(activeSessionRef.current?.profile || "bash")}`
      );
      currentLine.current = "";
      cursorPosition.current = 0;
    }
  }, []);

  const clearTerminal = useCallback(() => {
    if (term.current) {
      term.current.clear();
      term.current.writeln(`CloudForge Terminal / ${activeSession.name}`);
      writePrompt();
    }
  }, [activeSession.name, writePrompt]);

  const updateActiveSessionHistory = useCallback(
    (command: string) => {
      const sessionId = activeSessionRef.current?.id || activeSession.id;
      setSessions((currentSessions) =>
        currentSessions.map((session) =>
          session.id === sessionId
            ? { ...session, history: [...session.history, command] }
            : session
        )
      );
    },
    [activeSession.id]
  );

  const executeCommand = useCallback(async (command: string) => {
    if (!term.current) return;
    const session = activeSessionRef.current || activeSession;

    // Add to history
    if (command.trim() && commandHistory.current[commandHistory.current.length - 1] !== command) {
      commandHistory.current.push(command);
      updateActiveSessionHistory(command);
    }
    historyIndex.current = -1;

    try {
      // Handle built-in commands
      if (command.trim() === "clear") {
        term.current.clear();
        writePrompt();
        return;
      }

      if (command.trim() === "history") {
        commandHistory.current.forEach((cmd, index) => {
          term.current!.writeln(`  ${index + 1}  ${cmd}`);
        });
        writePrompt();
        return;
      }

      if (command.trim() === "help") {
        term.current.writeln("");
        term.current.writeln("Available commands:");
        term.current.writeln("  profiles          Show terminal profile notes");
        term.current.writeln("  bash / sh         WebContainer command profiles");
        term.current.writeln("  node              JavaScript snippet profile");
        term.current.writeln("  npm               NPM shortcut profile");
        term.current.writeln("  npm install       Install dependencies");
        term.current.writeln("  npm run dev       Start the template dev server");
        term.current.writeln("  node <file.js>    Run a JavaScript file");
        term.current.writeln("  ls                List files");
        term.current.writeln("  clear             Clear terminal");
        term.current.writeln("  history           Show command history");
        writePrompt();
        return;
      }

      if (command.trim() === "profiles") {
        term.current.writeln("");
        terminalProfiles.forEach((profile) => {
          term.current!.writeln(`  ${profile.label.padEnd(10)} ${profile.description}`);
        });
        writePrompt();
        return;
      }

      if (command.trim() === "") {
        writePrompt();
        return;
      }

      if (!webContainerInstance) {
        term.current.writeln("");
        term.current.writeln("WebContainer is still starting. Try again in a moment.");
        writePrompt();
        return;
      }

      if (session.profile === "powershell") {
        term.current.writeln("");
        term.current.writeln(
          "PowerShell is not available inside the browser WebContainer runtime."
        );
        term.current.writeln("Use bash, sh, node, or npm for this workspace.");
        writePrompt();
        return;
      }

      let cmd = "";
      let args: string[] = [];
      if (session.profile === "node") {
        cmd = "node";
        args = ["-e", command.trim()];
      } else if (
        session.profile === "npm" &&
        !command.trim().startsWith("npm ")
      ) {
        cmd = "npm";
        args = command.trim().split(/\s+/);
      } else if (session.profile === "npm") {
        const parts = command.trim().split(/\s+/);
        cmd = "npm";
        args = parts.slice(1);
      } else if (session.profile === "sh") {
        cmd = "sh";
        args = ["-c", command.trim()];
      } else {
        const parts = command.trim().split(/\s+/);
        cmd = parts[0];
        args = parts.slice(1);
      }

      // Execute in WebContainer
      term.current.writeln("");
      const process = await webContainerInstance.spawn(cmd, args, {
        terminal: {
          cols: term.current.cols,
          rows: term.current.rows,
        },
      });

      currentProcess.current = process as TerminalProcess;

      // Handle process output
      process.output.pipeTo(new WritableStream({
        write(data) {
          if (term.current) {
            term.current.write(data);
          }
        },
      }));

      // Wait for process to complete
      await process.exit;
      currentProcess.current = null;

      // Show new prompt
      writePrompt();

    } catch {
      if (term.current) {
      term.current.writeln(`\r\nCommand failed: ${command}`);
        writePrompt();
      }
      currentProcess.current = null;
    }
  }, [
    activeSession,
    updateActiveSessionHistory,
    webContainerInstance,
    writePrompt,
  ]);

  useEffect(() => {
    executeCommandRef.current = executeCommand;
  }, [executeCommand]);

  const handleTerminalInput = useCallback((data: string) => {
    if (!term.current) return;

    // Handle special characters
    switch (data) {
      case '\r': // Enter
        executeCommandRef.current(currentLine.current);
        break;
        
      case '\u007F': // Backspace
        if (cursorPosition.current > 0) {
          currentLine.current = 
            currentLine.current.slice(0, cursorPosition.current - 1) + 
            currentLine.current.slice(cursorPosition.current);
          cursorPosition.current--;
          
          // Update terminal display
          term.current.write('\b \b');
        }
        break;
        
      case '\u0003': // Ctrl+C
        if (currentProcess.current) {
          currentProcess.current.kill();
          currentProcess.current = null;
        }
        term.current.writeln("^C");
        writePrompt();
        break;
        
      case '\u001b[A': // Up arrow
        if (commandHistory.current.length > 0) {
          if (historyIndex.current === -1) {
            historyIndex.current = commandHistory.current.length - 1;
          } else if (historyIndex.current > 0) {
            historyIndex.current--;
          }
          
          // Clear current line and write history command
          const historyCommand = commandHistory.current[historyIndex.current];
          const prompt = getPrompt(activeSessionRef.current?.profile || "bash");
          term.current.write('\r' + prompt + ' '.repeat(currentLine.current.length) + '\r' + prompt);
          term.current.write(historyCommand);
          currentLine.current = historyCommand;
          cursorPosition.current = historyCommand.length;
        }
        break;
        
      case '\u001b[B': // Down arrow
        if (historyIndex.current !== -1) {
          if (historyIndex.current < commandHistory.current.length - 1) {
            historyIndex.current++;
            const historyCommand = commandHistory.current[historyIndex.current];
            const prompt = getPrompt(activeSessionRef.current?.profile || "bash");
            term.current.write('\r' + prompt + ' '.repeat(currentLine.current.length) + '\r' + prompt);
            term.current.write(historyCommand);
            currentLine.current = historyCommand;
            cursorPosition.current = historyCommand.length;
          } else {
            historyIndex.current = -1;
            const prompt = getPrompt(activeSessionRef.current?.profile || "bash");
            term.current.write('\r' + prompt + ' '.repeat(currentLine.current.length) + '\r' + prompt);
            currentLine.current = "";
            cursorPosition.current = 0;
          }
        }
        break;
        
      default:
        // Regular character input
        if (data >= ' ' || data === '\t') {
          currentLine.current = 
            currentLine.current.slice(0, cursorPosition.current) + 
            data + 
            currentLine.current.slice(cursorPosition.current);
          cursorPosition.current++;
          term.current.write(data);
        }
        break;
    }
  }, [writePrompt]);

  const initializeTerminal = useCallback(() => {
    if (!terminalRef.current || term.current) return;

    const terminal = new Terminal({
      cursorBlink: true,
      fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      letterSpacing: 0,
      theme: terminalThemes[theme],
      allowTransparency: false,
      convertEol: true,
      scrollback: 1000,
      tabStopWidth: 4,
    });

    // Add addons
    const fitAddonInstance = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    const searchAddonInstance = new SearchAddon();

    terminal.loadAddon(fitAddonInstance);
    terminal.loadAddon(webLinksAddon);
    terminal.loadAddon(searchAddonInstance);

    terminal.open(terminalRef.current);
    
    fitAddon.current = fitAddonInstance;
    searchAddon.current = searchAddonInstance;
    term.current = terminal;

    // Handle terminal input
    terminal.onData(handleTerminalInput);

    // Initial fit
    setTimeout(() => {
      fitAddonInstance.fit();
    }, 100);

    // Welcome message
    terminal.writeln(`CloudForge Terminal / ${activeSessionRef.current?.name || "bash"}`);
    terminal.writeln("Type 'help' for commands or 'profiles' for profile notes");
    writePrompt();

    return terminal;
  }, [
    theme,
    handleTerminalInput,
    writePrompt,
    terminalThemes,
  ]);

  const copyTerminalContent = useCallback(async () => {
    if (term.current) {
      const content = term.current.getSelection();
      if (content) {
        try {
          await navigator.clipboard.writeText(content);
        } catch (error) {
          console.error("Failed to copy to clipboard:", error);
        }
      }
    }
  }, []);

  const downloadTerminalLog = useCallback(() => {
    if (term.current) {
      const buffer = term.current.buffer.active;
      let content = "";
      
      for (let i = 0; i < buffer.length; i++) {
        const line = buffer.getLine(i);
        if (line) {
          content += line.translateToString(true) + "\n";
        }
      }

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `terminal-log-${new Date().toISOString().slice(0, 19)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  const searchInTerminal = useCallback((term: string) => {
    if (searchAddon.current && term) {
      searchAddon.current.findNext(term);
    }
  }, []);

  useEffect(() => {
    initializeTerminal();

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      if (fitAddon.current) {
        setTimeout(() => {
          fitAddon.current?.fit();
        }, 100);
      }
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    const activeCurrentProcess = currentProcess.current;
    const activeShellProcess = shellProcess.current;

    return () => {
      resizeObserver.disconnect();
      if (activeCurrentProcess) {
        activeCurrentProcess.kill();
      }
      if (activeShellProcess) {
        activeShellProcess.kill();
      }
      if (term.current) {
        term.current.dispose();
        term.current = null;
      }
    };
  }, [initializeTerminal]);

  useEffect(() => {
    if (webContainerInstance && term.current && !connectionMessageWritten.current) {
      connectionMessageWritten.current = true;
      term.current.writeln("Connected to WebContainer");
      term.current.writeln("Ready to execute commands");
      writePrompt();
    }
  }, [webContainerInstance, writePrompt]);

  const runCommandFromToolbar = useCallback(
    (command: string) => {
      if (!term.current) return;

      term.current.write(
        `\r${getPrompt(activeSessionRef.current?.profile || "bash")}${command}`
      );
      currentLine.current = command;
      cursorPosition.current = command.length;
      executeCommandRef.current(command);
      term.current.focus();
    },
    []
  );

  const switchSession = useCallback(
    (sessionId: string) => {
      const nextSession = sessions.find((session) => session.id === sessionId);
      if (!nextSession) return;

      setActiveSessionId(nextSession.id);
      activeSessionRef.current = nextSession;
      commandHistory.current = nextSession.history;
      historyIndex.current = -1;
      currentLine.current = "";
      cursorPosition.current = 0;

      if (term.current) {
        term.current.clear();
        term.current.writeln(`CloudForge Terminal / ${nextSession.name}`);
        term.current.writeln("Type 'help' for commands or 'profiles' for profile notes");
        term.current.write(`\r\n${getPrompt(nextSession.profile)}`);
        term.current.focus();
      }
    },
    [sessions]
  );

  const createTerminalSession = useCallback(
    (profile: TerminalProfile) => {
      sessionCounter.current += 1;
      const nextSession = createSession(profile, sessionCounter.current);
      setSessions((currentSessions) => [...currentSessions, nextSession]);
      setActiveSessionId(nextSession.id);
      activeSessionRef.current = nextSession;
      commandHistory.current = [];
      historyIndex.current = -1;
      currentLine.current = "";
      cursorPosition.current = 0;

      if (term.current) {
        term.current.clear();
        term.current.writeln(`CloudForge Terminal / ${nextSession.name}`);
        term.current.writeln("Type 'help' for commands or 'profiles' for profile notes");
        term.current.write(`\r\n${getPrompt(nextSession.profile)}`);
        term.current.focus();
      }
    },
    []
  );

  const closeSession = useCallback(
    (sessionId: string) => {
      const sessionToClose = sessions.find((session) => session.id === sessionId);
      if (!sessionToClose) return;

      const isActiveSession = sessionId === activeSession.id;
      if (isActiveSession && currentProcess.current) {
        currentProcess.current.kill();
        currentProcess.current = null;
      }

      if (sessions.length <= 1) {
        const replacementSession = createSession("bash", 1);
        sessionCounter.current = 1;
        setSessions([replacementSession]);
        setActiveSessionId(replacementSession.id);
        activeSessionRef.current = replacementSession;
        commandHistory.current = [];
        historyIndex.current = -1;
        currentLine.current = "";
        cursorPosition.current = 0;

        if (term.current) {
          term.current.clear();
          term.current.writeln(`CloudForge Terminal / ${replacementSession.name}`);
          term.current.writeln("Type 'help' for commands or 'profiles' for profile notes");
          term.current.write(`\r\n${getPrompt(replacementSession.profile)}`);
          term.current.focus();
        }
        return;
      }

      const closingIndex = sessions.findIndex((session) => session.id === sessionId);
      const remainingSessions = sessions.filter((session) => session.id !== sessionId);
      const nextSession =
        remainingSessions[Math.max(0, closingIndex - 1)] ||
        remainingSessions[0];

      setSessions(remainingSessions);

      if (isActiveSession && nextSession) {
        setActiveSessionId(nextSession.id);
        activeSessionRef.current = nextSession;
        commandHistory.current = nextSession.history;
        historyIndex.current = -1;
        currentLine.current = "";
        cursorPosition.current = 0;

        if (term.current) {
          term.current.clear();
          term.current.writeln(`CloudForge Terminal / ${nextSession.name}`);
          term.current.writeln("Type 'help' for commands or 'profiles' for profile notes");
          term.current.write(`\r\n${getPrompt(nextSession.profile)}`);
          term.current.focus();
        }
      }
    },
    [activeSession.id, sessions]
  );

  const closeActiveSession = useCallback(() => {
    closeSession(activeSession.id);
  }, [activeSession.id, closeSession]);

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    writeToTerminal: (data: string) => {
      if (term.current) {
        term.current.write(data);
      }
    },
    clearTerminal: () => {
      clearTerminal();
    },
    focusTerminal: () => {
      if (term.current) {
        term.current.focus();
      }
    },
    runCommand: runCommandFromToolbar,
  }));

  return (
    <div className={cn("flex flex-col h-full overflow-hidden rounded-lg border border-border/80 bg-background", className)}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 font-code text-xs"
              >
                {activeSession.name}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Terminal sessions</DropdownMenuLabel>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => switchSession(session.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      switchSession(session.id);
                    }
                  }}
                  className={cn(
                    "group flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    session.id === activeSession.id &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  {session.id === activeSession.id ? (
                    <Check className="h-4 w-4 shrink-0" />
                  ) : (
                    <span className="h-4 w-4 shrink-0" />
                  )}
                  <span className="min-w-0 flex-1 truncate font-code">
                    {session.name}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {session.profile}
                  </span>
                  <button
                    type="button"
                    aria-label={`Kill ${session.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      closeSession(session.id);
                    }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground opacity-0 transition hover:bg-destructive/15 hover:text-destructive focus:opacity-100 focus:outline-none group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={closeActiveSession}>
                <X className="h-4 w-4" />
                Kill current session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isConnected && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Connected</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                aria-label="Create terminal session"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>New terminal profile</DropdownMenuLabel>
              {terminalProfiles.map((profile) => (
                <DropdownMenuItem
                  key={profile.id}
                  onClick={() => createTerminalSession(profile.id)}
                >
                  <span className="font-code">{profile.label}</span>
                  <span className="ml-auto max-w-32 truncate text-xs text-muted-foreground">
                    {profile.id === "powershell" ? "unavailable" : "new"}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 font-code text-xs"
              >
                {activeSession.profile}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Switch current profile</DropdownMenuLabel>
              {terminalProfiles.map((profile) => (
                <DropdownMenuItem
                  key={profile.id}
                  onClick={() => {
                    const nextSession = {
                      ...activeSession,
                      profile: profile.id,
                      name: profile.label,
                    };
                    setSessions((currentSessions) =>
                      currentSessions.map((session) =>
                        session.id === activeSession.id
                          ? nextSession
                          : session
                      )
                    );
                    activeSessionRef.current = nextSession;
                    if (term.current) {
                      term.current.writeln(
                        `\r\nSwitched profile to ${profile.label}`
                      );
                      term.current.write(`\r\n${getPrompt(profile.id)}`);
                    }
                  }}
                >
                  {activeSession.profile === profile.id && (
                    <Check className="h-4 w-4" />
                  )}
                  <span className="font-code">{profile.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {profile.id === "powershell" ? "unavailable" : ""}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {quickCommands.map((quickCommand) => (
            <Button
              key={`${quickCommand.label}-${quickCommand.command}`}
              variant="outline"
              size="sm"
              onClick={() => runCommandFromToolbar(quickCommand.command)}
              className="h-6 px-2 font-code text-xs"
              disabled={!webContainerInstance}
            >
              {quickCommand.label}
            </Button>
          ))}

          {showSearch && (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchInTerminal(e.target.value);
                }}
                className="h-6 w-32 text-xs"
              />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="h-6 w-6 p-0"
          >
            <Search className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyTerminalContent}
            className="h-6 w-6 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadTerminalLog}
            className="h-6 w-6 p-0"
          >
            <Download className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTerminal}
            className="h-6 w-6 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={closeActiveSession}>
                Kill Current Session
              </DropdownMenuItem>
              {onClose && (
                <DropdownMenuItem onClick={onClose}>
                  Close Terminal Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={clearTerminal}>
                Clear Terminal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadTerminalLog}>
                Download Log
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {onClose && (
            <>
              <Separator orientation="vertical" className="mx-1 h-5" />
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
                aria-label="Close terminal panel"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 relative">
        <div 
          ref={terminalRef} 
          className="absolute inset-0 p-2"
          style={{ 
            background: terminalThemes[theme].background,
          }}
        />
      </div>
    </div>
  );
});

TerminalComponent.displayName = "TerminalComponent";

export default TerminalComponent;
