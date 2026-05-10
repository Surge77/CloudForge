"use client";

import { useCallback, useEffect, useRef } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import {
  configureMonaco,
  defaultEditorOptions,
  getEditorLanguage,
} from "@/features/playground/libs/editor-config";
import type { TemplateFile } from "@/features/playground/libs/path-to-json";
import type { SuggestionEditor } from "@/features/playground/hooks/useAISuggestion";
import { useEditorSettings } from "@/features/playground/stores/editor-settings-store";

interface PlaygroundEditorProps {
  activeFile: TemplateFile | undefined;
  content: string;
  onContentChange: (value: string) => void;
  suggestion: string | null;
  suggestionLoading: boolean;
  suggestionPosition: { line: number; column: number } | null;
  onRejectSuggestion: (editor: SuggestionEditor | null) => void;
  onTriggerSuggestion: (type: string, editor: SuggestionEditor | null) => void;
}

interface Disposable {
  dispose: () => void;
}

interface CursorPositionEvent {
  position: {
    lineNumber: number;
    column: number;
  };
}

interface ModelContentChangedEvent {
  changes: { text: string }[];
}

type MonacoModel = NonNullable<ReturnType<SuggestionEditor["getModel"]>>;

type MonacoCodeEditor = SuggestionEditor & {
  updateOptions: (options: unknown) => void;
  addCommand: (
    keybinding: number,
    handler: () => void,
    context?: string
  ) => string | null;
  onDidChangeCursorPosition: (
    listener: (event: CursorPositionEvent) => void
  ) => Disposable;
  onDidChangeModelContent: (
    listener: (event: ModelContentChangedEvent) => void
  ) => Disposable;
  setPosition: (position: { lineNumber: number; column: number }) => void;
  getModel: () => MonacoModel | null;
};

export const PlaygroundEditor = ({
  activeFile,
  content,
  onContentChange,
  suggestion,
  suggestionLoading,
  suggestionPosition,
  onRejectSuggestion,
  onTriggerSuggestion,
}: PlaygroundEditorProps) => {
  const editorSettings = useEditorSettings();
  const editorRef = useRef<MonacoCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const inlineCompletionProviderRef = useRef<Disposable | null>(null);
  const cursorDisposableRef = useRef<Disposable | null>(null);
  const contentDisposableRef = useRef<Disposable | null>(null);
  const suggestionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const currentSuggestionRef = useRef<{
    text: string;
    position: { line: number; column: number };
  } | null>(null);
  const isAcceptingSuggestionRef = useRef(false);
  const suggestionAcceptedRef = useRef(false);

  const clearCurrentSuggestion = useCallback(() => {
    currentSuggestionRef.current = null;
    suggestionAcceptedRef.current = false;
    editorRef.current?.trigger("ai", "editor.action.inlineSuggest.hide", null);
  }, []);

  const acceptCurrentSuggestion = useCallback(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const currentSuggestion = currentSuggestionRef.current;

    if (!editor || !monaco || !currentSuggestion) return false;
    if (isAcceptingSuggestionRef.current || suggestionAcceptedRef.current) {
      return false;
    }

    isAcceptingSuggestionRef.current = true;
    suggestionAcceptedRef.current = true;

    try {
      const currentPosition = editor.getPosition();
      const suggestionPos = currentSuggestion.position;

      if (
        !currentPosition ||
        currentPosition.lineNumber !== suggestionPos.line ||
        currentPosition.column < suggestionPos.column ||
        currentPosition.column > suggestionPos.column + 5
      ) {
        return false;
      }

      const cleanSuggestionText = currentSuggestion.text.replace(/\r/g, "");
      const range = new monaco.Range(
        suggestionPos.line,
        suggestionPos.column,
        suggestionPos.line,
        suggestionPos.column
      );

      const success = editor.executeEdits("ai-suggestion-accept", [
        {
          range,
          text: cleanSuggestionText,
          forceMoveMarkers: true,
        },
      ]);

      if (!success) return false;

      const lines = cleanSuggestionText.split("\n");
      const endLine = suggestionPos.line + lines.length - 1;
      const endColumn =
        lines.length === 1
          ? suggestionPos.column + cleanSuggestionText.length
          : lines[lines.length - 1].length + 1;

      editor.setPosition({ lineNumber: endLine, column: endColumn });
      clearCurrentSuggestion();
      onRejectSuggestion(editor);
      return true;
    } finally {
      isAcceptingSuggestionRef.current = false;
      setTimeout(() => {
        suggestionAcceptedRef.current = false;
      }, 1000);
    }
  }, [clearCurrentSuggestion, onRejectSuggestion]);

  const hasActiveSuggestionAtPosition = useCallback(() => {
    const editor = editorRef.current;
    const suggestion = currentSuggestionRef.current;
    if (!editor || !suggestion) return false;

    const position = editor.getPosition();
    if (!position) return false;

    return (
      position.lineNumber === suggestion.position.line &&
      position.column >= suggestion.position.column &&
      position.column <= suggestion.position.column + 2
    );
  }, []);

  const createInlineCompletionProvider = useCallback(
    (monaco: Monaco): Parameters<
      typeof monaco.languages.registerInlineCompletionsProvider
    >[1] => {
      const provider: Parameters<
        typeof monaco.languages.registerInlineCompletionsProvider
      >[1] & { disposeInlineCompletions?: () => void } = {
        provideInlineCompletions: (
          _model: unknown,
          position: { lineNumber: number; column: number }
        ) => {
          if (
            isAcceptingSuggestionRef.current ||
            suggestionAcceptedRef.current ||
            !suggestion ||
            !suggestionPosition
          ) {
            return { items: [] };
          }

          const isPositionMatch =
            position.lineNumber === suggestionPosition.line &&
            position.column >= suggestionPosition.column &&
            position.column <= suggestionPosition.column + 2;

          if (!isPositionMatch) {
            return { items: [] };
          }

          const cleanSuggestion = suggestion.replace(/\r/g, "");
          currentSuggestionRef.current = {
            text: cleanSuggestion,
            position: suggestionPosition,
          };

          return {
            items: [
              {
                insertText: cleanSuggestion,
                range: new monaco.Range(
                  suggestionPosition.line,
                  suggestionPosition.column,
                  suggestionPosition.line,
                  suggestionPosition.column
                ),
              },
            ],
          };
        },
        freeInlineCompletions: () => {},
        disposeInlineCompletions: () => {},
      };

      return provider;
    },
    [suggestion, suggestionPosition]
  );

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    if (isAcceptingSuggestionRef.current || suggestionAcceptedRef.current) {
      return;
    }

    inlineCompletionProviderRef.current?.dispose();
    inlineCompletionProviderRef.current = null;
    currentSuggestionRef.current = null;

    if (suggestion && suggestionPosition) {
      const language = getEditorLanguage(activeFile?.fileExtension || "");
      const provider = createInlineCompletionProvider(monaco);
      inlineCompletionProviderRef.current =
        monaco.languages.registerInlineCompletionsProvider(language, provider);

      setTimeout(() => {
        if (
          editorRef.current &&
          !isAcceptingSuggestionRef.current &&
          !suggestionAcceptedRef.current
        ) {
          editorRef.current.trigger(
            "ai",
            "editor.action.inlineSuggest.trigger",
            null
          );
        }
      }, 50);
    }

    return () => {
      inlineCompletionProviderRef.current?.dispose();
      inlineCompletionProviderRef.current = null;
    };
  }, [
    suggestion,
    suggestionPosition,
    activeFile,
    createInlineCompletionProvider,
  ]);

  const updateEditorLanguage = useCallback(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!activeFile || !monaco || !editor) return;

    const model = editor.getModel();
    if (!model) return;

    const language = getEditorLanguage(activeFile.fileExtension || "");
    monaco.editor.setModelLanguage(
      model as Parameters<typeof monaco.editor.setModelLanguage>[0],
      language
    );
  }, [activeFile]);

  const handleEditorDidMount = (
    editor: MonacoCodeEditor,
    monaco: Monaco
  ) => {
    const typedEditor = editor as MonacoCodeEditor;
    editorRef.current = typedEditor;
    monacoRef.current = monaco;

    typedEditor.updateOptions({
      ...defaultEditorOptions,
      fontSize: editorSettings.fontSize,
      tabSize: editorSettings.tabSize,
      wordWrap: editorSettings.wordWrap,
      lineNumbers: editorSettings.lineNumbers,
      minimap: { enabled: editorSettings.minimap },
      fontLigatures: editorSettings.fontLigatures,
      formatOnPaste: editorSettings.formatOnPaste,
      formatOnType: editorSettings.formatOnType,
      cursorBlinking: editorSettings.cursorBlinking,
      cursorStyle: editorSettings.cursorStyle,
      renderWhitespace: editorSettings.renderWhitespace,
      stickyScroll: { enabled: editorSettings.stickyScroll },
      inlineSuggest: {
        enabled: true,
        mode: "prefix",
        suppressSuggestions: false,
      },
      suggest: {
        preview: false,
        showInlineDetails: false,
        insertMode: "replace",
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      cursorSmoothCaretAnimation: "on",
    });

    configureMonaco(monaco);

    typedEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      onTriggerSuggestion("completion", typedEditor);
    });

    typedEditor.addCommand(
      monaco.KeyCode.Tab,
      () => {
        if (isAcceptingSuggestionRef.current) return;

        if (suggestionAcceptedRef.current) {
          typedEditor.trigger("keyboard", "tab", null);
          return;
        }

        if (currentSuggestionRef.current && hasActiveSuggestionAtPosition()) {
          if (acceptCurrentSuggestion()) return;
        }

        typedEditor.trigger("keyboard", "tab", null);
      },
      "editorTextFocus && !editorReadonly && !suggestWidgetVisible"
    );

    typedEditor.addCommand(monaco.KeyCode.Escape, () => {
      if (currentSuggestionRef.current) {
        onRejectSuggestion(typedEditor);
        clearCurrentSuggestion();
      }
    });

    cursorDisposableRef.current = typedEditor.onDidChangeCursorPosition((e) => {
      if (isAcceptingSuggestionRef.current) return;

      const newPosition = e.position;

      if (currentSuggestionRef.current && !suggestionAcceptedRef.current) {
        const suggestionPos = currentSuggestionRef.current.position;

        if (
          newPosition.lineNumber !== suggestionPos.line ||
          newPosition.column < suggestionPos.column ||
          newPosition.column > suggestionPos.column + 10
        ) {
          clearCurrentSuggestion();
          onRejectSuggestion(typedEditor);
        }
      }

      if (!currentSuggestionRef.current && !suggestionLoading && editorSettings.aiSuggestions) {
        if (suggestionTimeoutRef.current) {
          clearTimeout(suggestionTimeoutRef.current);
        }

        suggestionTimeoutRef.current = setTimeout(() => {
          onTriggerSuggestion("completion", typedEditor);
        }, 300);
      }
    });

    contentDisposableRef.current = typedEditor.onDidChangeModelContent((e) => {
      if (isAcceptingSuggestionRef.current) return;

      if (
        currentSuggestionRef.current &&
        e.changes.length > 0 &&
        !suggestionAcceptedRef.current
      ) {
        const change = e.changes[0];
        const currentSuggestion = currentSuggestionRef.current.text;

        if (
          change.text === currentSuggestion ||
          change.text === currentSuggestion.replace(/\r/g, "")
        ) {
          return;
        }

        clearCurrentSuggestion();
      }

      if (e.changes.length > 0 && !suggestionAcceptedRef.current) {
        const change = e.changes[0];
        const triggerCharacters = new Set([
          "\n",
          "{",
          ".",
          "=",
          "(",
          ",",
          ":",
          ";",
        ]);

        if (triggerCharacters.has(change.text)) {
          setTimeout(() => {
            if (
              editorRef.current &&
              !currentSuggestionRef.current &&
              !suggestionLoading
            ) {
              onTriggerSuggestion("completion", editorRef.current);
            }
          }, 100);
        }
      }
    });

    updateEditorLanguage();
  };

  useEffect(() => {
    updateEditorLanguage();
  }, [updateEditorLanguage]);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.updateOptions({
      fontSize: editorSettings.fontSize,
      tabSize: editorSettings.tabSize,
      wordWrap: editorSettings.wordWrap,
      lineNumbers: editorSettings.lineNumbers,
      minimap: { enabled: editorSettings.minimap },
      fontLigatures: editorSettings.fontLigatures,
      formatOnPaste: editorSettings.formatOnPaste,
      formatOnType: editorSettings.formatOnType,
      cursorBlinking: editorSettings.cursorBlinking,
      cursorStyle: editorSettings.cursorStyle,
      renderWhitespace: editorSettings.renderWhitespace,
      stickyScroll: { enabled: editorSettings.stickyScroll },
    });
  }, [editorSettings]);

  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      inlineCompletionProviderRef.current?.dispose();
      cursorDisposableRef.current?.dispose();
      contentDisposableRef.current?.dispose();
    };
  }, []);

  return (
    <div className="h-full relative">
      {suggestionLoading && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          AI thinking...
        </div>
      )}

      {currentSuggestionRef.current && !suggestionLoading && (
        <div className="absolute top-2 right-2 z-10 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded text-xs text-emerald-500 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          Press Tab to accept
        </div>
      )}

      <Editor
        height="100%"
        value={content}
        onChange={(value) => onContentChange(value || "")}
        onMount={handleEditorDidMount}
        language={
          activeFile ? getEditorLanguage(activeFile.fileExtension || "") : "plaintext"
        }
        options={defaultEditorOptions}
      />
    </div>
  );
};
