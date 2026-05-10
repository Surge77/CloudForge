"use client";

import React, { useRef } from "react";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TemplateFileTree } from "@/features/playground/components/playground-explorer";
import type {
  TemplateFile,
  TemplateFolder,
  TemplateItem,
} from "@/features/playground/libs/path-to-json";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  FolderOpen,
  AlertCircle,
  ArrowLeft,
  Bot,
  Monitor,
  MoreHorizontal,
  PanelRightClose,
  PanelRightOpen,
  Save,
  SaveAll,
  Terminal,
  X,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WebContainerPreview from "@/features/webcontainers/components/webcontainer-preview";
import TerminalComponent, {
  type TerminalRef,
} from "@/features/webcontainers/components/terminal";
import LoadingStep from "@/components/ui/loader";
import { PlaygroundEditor } from "@/features/playground/components/playground-editor";
import ToggleAI from "@/features/playground/components/toggle-ai";
import { AIChatSidePanel } from "@/features/ai-chat/components/ai-chat-sidepanel";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { useAISuggestions } from "@/features/playground/hooks/useAISuggestion";
import { useWebContainer } from "@/features/webcontainers/hooks/useWebContainer";
import { findFilePath } from "@/features/playground/libs";
import { getEditorLanguage } from "@/features/playground/libs/editor-config";
import { ConfirmationDialog } from "@/features/playground/components/dialogs/conformation-dialog";
import { SettingsDialog } from "@/features/playground/components/settings-dialog";
import { templateConfig } from "@/lib/template";

const MainPlaygroundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // UI state
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Custom hooks
  const { playgroundData, templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);
  const aiSuggestions = useAISuggestions();
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  const {
    isLoading: containerLoading,
    error: containerError,
    instance,
    writeFileSync,
  } = useWebContainer();

  const lastSyncedContent = useRef<Map<string, string>>(new Map());
  const terminalRef = useRef<TerminalRef>(null);

  // Set template data when playground loads
  React.useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  // Initialize zustand templateData from usePlayground only on first load
  React.useEffect(() => {
    if (templateData && !openFiles.length) {

      
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  // Create wrapper functions that pass saveTemplateData
  const wrappedHandleAddFile = useCallback(
    (newFile: TemplateFile, parentPath: string) => {
      return handleAddFile(
        newFile,
        parentPath,
        writeFileSync!,
        instance,
        saveTemplateData
      );
    },
    [handleAddFile, writeFileSync, instance, saveTemplateData]
  );

  const wrappedHandleAddFolder = useCallback(
    (newFolder: TemplateFolder, parentPath: string) => {
      return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
    },
    [handleAddFolder, instance, saveTemplateData]
  );

  const wrappedHandleDeleteFile = useCallback(
    (file: TemplateFile, parentPath: string) => {
      return handleDeleteFile(file, parentPath, saveTemplateData);
    },
    [handleDeleteFile, saveTemplateData]
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder: TemplateFolder, parentPath: string) => {
      return handleDeleteFolder(folder, parentPath, saveTemplateData);
    },
    [handleDeleteFolder, saveTemplateData]
  );

  const wrappedHandleRenameFile = useCallback(
    (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => {
      return handleRenameFile(
        file,
        newFilename,
        newExtension,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFile, saveTemplateData]
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
      return handleRenameFolder(
        folder,
        newFolderName,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFolder, saveTemplateData]
  );

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);
  const activeFileName = activeFile
    ? `${activeFile.filename}.${activeFile.fileExtension}`
    : undefined;
  const activeFileLanguage = activeFile
    ? getEditorLanguage(activeFile.fileExtension || "")
    : "plaintext";
  const activeFilePath =
    activeFile && templateData
      ? findFilePath(activeFile, templateData) ?? undefined
      : undefined;
  const currentTemplate = playgroundData?.template || "REACT";
  const runtimeConfig = templateConfig[currentTemplate];
  const runCurrentFileCommand =
    activeFile && activeFilePath
      ? activeFile.fileExtension.toLowerCase() === "js" ||
        activeFile.fileExtension.toLowerCase() === "mjs" ||
        activeFile.fileExtension.toLowerCase() === "cjs"
        ? `node ${activeFilePath}`
        : activeFile.fileExtension.toLowerCase() === "ts"
        ? `npx tsx ${activeFilePath}`
        : null
      : null;
  const terminalQuickCommands = [
    ...(runCurrentFileCommand
      ? [{ label: "Run File", command: runCurrentFileCommand }]
      : []),
    { label: "Install", command: runtimeConfig.installCommand.join(" ") },
    { label: "Start", command: runtimeConfig.startCommand.join(" ") },
  ];

  const handleFileSelect = (file: TemplateFile) => {
    openFile(file);
  };

  const handleSave = useCallback(
    async (fileId?: string) => {
      const targetFileId = fileId || activeFileId;
      if (!targetFileId) return;

      const fileToSave = openFiles.find((f) => f.id === targetFileId);
      if (!fileToSave) return;

      const latestTemplateData = useFileExplorer.getState().templateData;
      if (!latestTemplateData) return;

      try {
        const filePath = findFilePath(fileToSave, latestTemplateData);
        if (!filePath) {
          toast.error(
            `Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`
          );
          return;
        }

        // Update file content in template data (clone for immutability)
        const updatedTemplateData = JSON.parse(
          JSON.stringify(latestTemplateData)
        );
        const updateFileContent = (items: TemplateItem[]): TemplateItem[] =>
          items.map((item) => {
            if ("folderName" in item) {
              return { ...item, items: updateFileContent(item.items) };
            }

            if (
              item.filename === fileToSave.filename &&
              item.fileExtension === fileToSave.fileExtension
            ) {
              return { ...item, content: fileToSave.content };
            }
            return item;
          });
        updatedTemplateData.items = updateFileContent(
          updatedTemplateData.items
        );

        // Sync with WebContainer
        if (writeFileSync) {
          await writeFileSync(filePath, fileToSave.content);
          lastSyncedContent.current.set(fileToSave.id, fileToSave.content);
          if (instance && instance.fs) {
            await instance.fs.writeFile(filePath, fileToSave.content);
          }
        }

        // Use saveTemplateData to persist changes
        await saveTemplateData(updatedTemplateData);
        setTemplateData(updatedTemplateData);

        // Update open files
        const updatedOpenFiles = openFiles.map((f) =>
          f.id === targetFileId
            ? {
                ...f,
                content: fileToSave.content,
                originalContent: fileToSave.content,
                hasUnsavedChanges: false,
              }
            : f
        );
        setOpenFiles(updatedOpenFiles);

        toast.success(
          `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
      } catch (error) {
        console.error("Error saving file:", error);
        toast.error(
          `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
        throw error;
      }
    },
    [
      activeFileId,
      openFiles,
      writeFileSync,
      instance,
      saveTemplateData,
      setTemplateData,
      setOpenFiles,
    ]
  );

  const handleSaveAll = async () => {
    const unsavedFiles = openFiles.filter((f) => f.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      toast.info("No unsaved changes");
      return;
    }

    try {
      await Promise.all(unsavedFiles.map((f) => handleSave(f.id)));
      toast.success(`Saved ${unsavedFiles.length} file(s)`);
    } catch {
      toast.error("Failed to save some files");
    }
  };

  const handleInsertCodeFromAI = useCallback(
    (code: string, fileName?: string, position?: { line: number; column: number }) => {
      const targetFile =
        (fileName &&
          openFiles.find(
            (file) => `${file.filename}.${file.fileExtension}` === fileName
          )) ||
        activeFile;

      if (!targetFile) {
        toast.error("Open a file before inserting AI code");
        return;
      }

      const currentContent = targetFile.content || "";
      let nextContent = `${currentContent}${currentContent.endsWith("\n") ? "" : "\n"}${code}`;

      if (position) {
        const lines = currentContent.split("\n");
        const lineIndex = Math.max(0, Math.min(position.line - 1, lines.length - 1));
        const columnIndex = Math.max(
          0,
          Math.min(position.column - 1, lines[lineIndex]?.length ?? 0)
        );

        lines[lineIndex] = `${lines[lineIndex].slice(0, columnIndex)}${code}${lines[
          lineIndex
        ].slice(columnIndex)}`;
        nextContent = lines.join("\n");
      }

      updateFileContent(targetFile.id, nextContent);
      setActiveFileId(targetFile.id);
      toast.success(`Inserted AI code into ${targetFile.filename}.${targetFile.fileExtension}`);
    },
    [activeFile, openFiles, setActiveFileId, updateFileContent]
  );

  const handleRunCodeFromAI = useCallback((code: string, language: string) => {
    if (!terminalRef.current) {
      toast.error("Open the terminal first");
      return;
    }

    setIsTerminalVisible(true);

    const lang = language.toLowerCase();
    let command: string | null = null;

    if (lang === "javascript" || lang === "js") {
      const escaped = code.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
      command = `node -e "${escaped}"`;
    } else if (lang === "typescript" || lang === "ts") {
      const escaped = code.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
      command = `npx tsx -e "${escaped}"`;
    } else {
      navigator.clipboard.writeText(code).catch(() => {});
      toast.info("Code copied — paste in terminal to run");
      return;
    }

    setTimeout(() => {
      terminalRef.current?.runCommand(command!);
    }, 150);
  }, []);

  // Add event to save file by click ctrl + s
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // Error state
  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background p-4">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h2 className="mb-2 text-xl font-semibold text-destructive">
          Something went wrong
        </h2>
        <p className="mb-4 text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Try Again
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background p-4">
        <div className="forge-panel w-full max-w-md rounded-lg p-6">
          <h2 className="mb-6 text-center text-xl font-semibold">
            Loading Playground
          </h2>
          <div className="mb-8">
            <LoadingStep
              currentStep={1}
              step={1}
              label="Loading playground data"
            />
            <LoadingStep
              currentStep={2}
              step={2}
              label="Setting up environment"
            />
            <LoadingStep currentStep={3} step={3} label="Ready to code" />
          </div>
        </div>
      </div>
    );
  }

  // No template data
  if (!templateData) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background p-4">
        <FolderOpen className="mb-4 h-12 w-12 text-primary" />
        <h2 className="mb-2 text-xl font-semibold">
          No template data available
        </h2>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Template
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <>
        <TemplateFileTree
          data={templateData}
          onFileSelect={handleFileSelect}
          selectedFile={activeFile}
          title="File Explorer"
          onAddFile={wrappedHandleAddFile}
          onAddFolder={wrappedHandleAddFolder}
          onDeleteFile={wrappedHandleDeleteFile}
          onDeleteFolder={wrappedHandleDeleteFolder}
          onRenameFile={wrappedHandleRenameFile}
          onRenameFolder={wrappedHandleRenameFolder}
        />

        <SidebarInset className="min-h-0 overflow-hidden">
          <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border/80 bg-background/95 px-3 backdrop-blur-xl">
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" asChild className="h-8 px-2">
                    <Link href="/dashboard" aria-label="Open project explorer">
                      <span className="hidden text-sm text-muted-foreground md:inline">
                        Open Project Explorer
                      </span>
                      <ArrowLeft className="h-4 w-4 md:hidden" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open project explorer</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="mx-1 h-5" />
              <SidebarTrigger className="h-8 w-8" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => handleSave()}
                    disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    aria-label="Save current file"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save current file</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={handleSaveAll}
                    disabled={!hasUnsavedChanges}
                    aria-label="Save all files"
                  >
                    <SaveAll className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save all files</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="mx-1 h-5" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant={isPreviewVisible ? "default" : "ghost"}
                    onClick={() => setIsPreviewVisible((value) => !value)}
                    aria-label={isPreviewVisible ? "Close output panel" : "Open output panel"}
                  >
                    {isPreviewVisible ? (
                      <PanelRightClose className="h-4 w-4" />
                    ) : (
                      <PanelRightOpen className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isPreviewVisible ? "Close output" : "Open output"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant={isTerminalVisible ? "default" : "ghost"}
                    onClick={() => setIsTerminalVisible((value) => !value)}
                    aria-label={isTerminalVisible ? "Hide terminal" : "Show terminal"}
                  >
                    <Terminal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isTerminalVisible ? "Hide terminal" : "Show terminal"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant={isAIChatOpen ? "default" : "ghost"}
                    onClick={() => setIsAIChatOpen((value) => !value)}
                    aria-label={isAIChatOpen ? "Close AI assistant" : "Open AI assistant"}
                  >
                    <Bot className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isAIChatOpen ? "Close AI assistant" : "Open AI assistant"}
                </TooltipContent>
              </Tooltip>

              <div className="ml-1">
                <ToggleAI
                  isEnabled={aiSuggestions.isEnabled}
                  onToggle={aiSuggestions.toggleEnabled}
                  onOpenChat={() => setIsAIChatOpen(true)}
                  suggestionLoading={aiSuggestions.isLoading}
                />
              </div>
            </div>

            <div className="hidden min-w-0 flex-1 flex-col items-center px-3 text-center lg:flex">
              <h1 className="max-w-full truncate font-code text-xs font-medium">
                {playgroundData?.title || "Code Playground"}
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {openFiles.length} file(s) open
                {hasUnsavedChanges && " / unsaved changes"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant={isPreviewVisible ? "default" : "ghost"}
                    onClick={() => setIsPreviewVisible((value) => !value)}
                    aria-label={isPreviewVisible ? "Close output panel" : "Open output panel"}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isPreviewVisible ? "Close output panel" : "Open output panel"}
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-sm" variant="ghost" aria-label="More editor actions">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIsPreviewVisible((value) => !value)}
                  >
                    {isPreviewVisible ? "Close" : "Open"} Output
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsTerminalVisible((value) => !value)}
                  >
                    {isTerminalVisible ? "Hide" : "Show"} Terminal
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsAIChatOpen((value) => !value)}
                  >
                    {isAIChatOpen ? "Close" : "Open"} AI Assistant
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={closeAllFiles}>
                    Close All Files
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setIsSettingsOpen(true)}
                    aria-label="Open settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-hidden">
            {openFiles.length > 0 ? (
              <div className="h-full flex flex-col">
                {/* File Tabs */}
                <div className="border-b border-border/80 bg-muted/30">
                  <Tabs
                    value={activeFileId || ""}
                    onValueChange={setActiveFileId}
                  >
                    <div className="flex items-center justify-between px-4 py-2">
                      <TabsList className="h-8 bg-transparent p-0">
                        {openFiles.map((file) => (
                          <TabsTrigger
                            key={file.id}
                            value={file.id}
                            className="group relative h-8 rounded-md px-3 font-code text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              <span>
                                {file.filename}.{file.fileExtension}
                              </span>
                              {file.hasUnsavedChanges && (
                                <span className="h-2 w-2 rounded-full bg-primary" />
                              )}
                              <span
                                className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeFile(file.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </span>
                            </div>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {openFiles.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={closeAllFiles}
                          className="h-6 px-2 text-xs"
                        >
                          Close All
                        </Button>
                      )}
                    </div>
                  </Tabs>
                </div>

                {/* Editor, Output, AI, and Terminal */}
                <div className="min-h-0 flex-1">
                  {isTerminalVisible ? (
                    <ResizablePanelGroup direction="vertical" className="h-full">
                      <ResizablePanel defaultSize={68} minSize={35}>
                        <ResizablePanelGroup
                          direction="horizontal"
                          className="h-full"
                        >
                          <ResizablePanel
                            defaultSize={
                              isAIChatOpen
                                ? isPreviewVisible
                                  ? 42
                                  : 68
                                : isPreviewVisible
                                ? 52
                                : 100
                            }
                            minSize={28}
                          >
                            <PlaygroundEditor
                              activeFile={activeFile}
                              content={activeFile?.content || ""}
                              onContentChange={(value) =>
                                activeFileId &&
                                updateFileContent(activeFileId, value)
                              }
                              suggestion={aiSuggestions.suggestion}
                              suggestionLoading={aiSuggestions.isLoading}
                              suggestionPosition={aiSuggestions.position}
                              onRejectSuggestion={(editor) =>
                                aiSuggestions.rejectSuggestion(editor)
                              }
                              onTriggerSuggestion={(type, editor) =>
                                aiSuggestions.fetchSuggestion(type, editor)
                              }
                            />
                          </ResizablePanel>

                          {isPreviewVisible && (
                            <>
                              <ResizableHandle />
                              <ResizablePanel
                                defaultSize={isAIChatOpen ? 25 : 48}
                                minSize={20}
                              >
                                <WebContainerPreview
                                  templateData={templateData}
                                  template={currentTemplate}
                                  instance={instance}
                                  isLoading={containerLoading}
                                  error={containerError}
                                  terminalRef={terminalRef}
                                  onClose={() => setIsPreviewVisible(false)}
                                  forceResetup={false}
                                />
                              </ResizablePanel>
                            </>
                          )}

                          {isAIChatOpen && (
                            <>
                              <ResizableHandle />
                              <ResizablePanel
                                defaultSize={33}
                                minSize={28}
                                maxSize={48}
                              >
                                <AIChatSidePanel
                                  isOpen={isAIChatOpen}
                                  onClose={() => setIsAIChatOpen(false)}
                                  onInsertCode={handleInsertCodeFromAI}
                                  onRunCode={handleRunCodeFromAI}
                                  activeFileName={activeFileName}
                                  activeFileContent={activeFile?.content}
                                  activeFileLanguage={activeFileLanguage}
                                  theme="dark"
                                  variant="panel"
                                />
                              </ResizablePanel>
                            </>
                          )}
                        </ResizablePanelGroup>
                      </ResizablePanel>
                      <ResizableHandle />
                      <ResizablePanel defaultSize={32} minSize={18} maxSize={50}>
                        <TerminalComponent
                          ref={terminalRef}
                          webContainerInstance={instance}
                          theme="dark"
                          className="h-full rounded-none border-0"
                          quickCommands={terminalQuickCommands}
                          onClose={() => setIsTerminalVisible(false)}
                        />
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  ) : (
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="h-full"
                    >
                      <ResizablePanel
                        defaultSize={
                          isAIChatOpen
                            ? isPreviewVisible
                              ? 42
                              : 68
                            : isPreviewVisible
                            ? 52
                            : 100
                        }
                        minSize={28}
                      >
                        <PlaygroundEditor
                          activeFile={activeFile}
                          content={activeFile?.content || ""}
                          onContentChange={(value) =>
                            activeFileId &&
                            updateFileContent(activeFileId, value)
                          }
                          suggestion={aiSuggestions.suggestion}
                          suggestionLoading={aiSuggestions.isLoading}
                          suggestionPosition={aiSuggestions.position}
                          onRejectSuggestion={(editor) =>
                            aiSuggestions.rejectSuggestion(editor)
                          }
                          onTriggerSuggestion={(type, editor) =>
                            aiSuggestions.fetchSuggestion(type, editor)
                          }
                        />
                      </ResizablePanel>

                      {isPreviewVisible && (
                        <>
                          <ResizableHandle />
                          <ResizablePanel
                            defaultSize={isAIChatOpen ? 25 : 48}
                            minSize={20}
                          >
                            <WebContainerPreview
                              templateData={templateData}
                              template={currentTemplate}
                              instance={instance}
                              isLoading={containerLoading}
                              error={containerError}
                              terminalRef={terminalRef}
                              onClose={() => setIsPreviewVisible(false)}
                              forceResetup={false}
                            />
                          </ResizablePanel>
                        </>
                      )}

                      {isAIChatOpen && (
                        <>
                          <ResizableHandle />
                          <ResizablePanel
                            defaultSize={33}
                            minSize={28}
                            maxSize={48}
                          >
                            <AIChatSidePanel
                              isOpen={isAIChatOpen}
                              onClose={() => setIsAIChatOpen(false)}
                              onInsertCode={handleInsertCodeFromAI}
                              onRunCode={handleRunCodeFromAI}
                              activeFileName={activeFileName}
                              activeFileContent={activeFile?.content}
                              activeFileLanguage={activeFileLanguage}
                              theme="dark"
                              variant="panel"
                            />
                          </ResizablePanel>
                        </>
                      )}
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                  <FileText className="h-16 w-16 text-muted-foreground/50" />
                <div className="text-center">
                  <p className="text-lg font-medium">No files open</p>
                  <p className="text-sm text-muted-foreground">
                    Select a file from the sidebar to start editing
                  </p>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>

      <ConfirmationDialog
      isOpen={confirmationDialog.isOpen}
      title={confirmationDialog.title}
      description={confirmationDialog.description}
      onConfirm={confirmationDialog.onConfirm}
      onCancel={confirmationDialog.onCancel}
      setIsOpen={(open) => setConfirmationDialog((prev) => ({ ...prev, isOpen: open }))}
      />
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      </>
    </TooltipProvider>
  );
};

export default MainPlaygroundPage;
