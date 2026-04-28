import { useCallback, useState } from "react";
import type { Monaco } from "@monaco-editor/react";

interface EditorModel {
  getValue: () => string;
}

interface EditorPosition {
  lineNumber: number;
  column: number;
}

export interface SuggestionEditor {
  getModel: () => EditorModel | null;
  getPosition: () => EditorPosition | null;
  executeEdits: (
    source: string,
    edits: {
      range: unknown;
      text: string;
      forceMoveMarkers: boolean;
    }[]
  ) => boolean;
  deltaDecorations: (oldDecorations: string[], newDecorations: unknown[]) => string[];
  trigger: (source: string, handlerId: string, payload: unknown) => void;
}

interface AISuggestionsState {
  suggestion: string | null;
  isLoading: boolean;
  position: { line: number; column: number } | null;
  decoration: string[];
  isEnabled: boolean;
}

interface CodeSuggestionResponse {
  suggestion?: string;
}

interface UseAISuggestionsReturn extends AISuggestionsState {
  toggleEnabled: () => void;
  fetchSuggestion: (type: string, editor: SuggestionEditor | null) => Promise<void>;
  acceptSuggestion: (editor: SuggestionEditor | null, monaco: Monaco | null) => void;
  rejectSuggestion: (editor: SuggestionEditor | null) => void;
  clearSuggestion: (editor: SuggestionEditor | null) => void;
}

export const useAISuggestions = (): UseAISuggestionsReturn => {
  const [state, setState] = useState<AISuggestionsState>({
    suggestion: null,
    isLoading: false,
    position: null,
    decoration: [],
    isEnabled: true,
  });

  const toggleEnabled = useCallback(() => {
    setState((prev) => ({ ...prev, isEnabled: !prev.isEnabled }));
  }, []);

  const fetchSuggestion = useCallback(
    async (type: string, editor: SuggestionEditor | null) => {
      if (!state.isEnabled || !editor) return;

      const model = editor.getModel();
      const cursorPosition = editor.getPosition();

      if (!model || !cursorPosition) return;

      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch("/api/code-suggestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileContent: model.getValue(),
            cursorLine: cursorPosition.lineNumber - 1,
            cursorColumn: cursorPosition.column - 1,
            suggestionType: type,
          }),
        });

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = (await response.json()) as CodeSuggestionResponse;
        const suggestionText = data.suggestion?.trim();

        setState((prev) => ({
          ...prev,
          suggestion: suggestionText || null,
          position: suggestionText
            ? {
                line: cursorPosition.lineNumber,
                column: cursorPosition.column,
              }
            : null,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Error fetching code suggestion:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [state.isEnabled]
  );

  const acceptSuggestion = useCallback(
    (editor: SuggestionEditor | null, monaco: Monaco | null) => {
      setState((currentState) => {
        if (!currentState.suggestion || !currentState.position || !editor || !monaco) {
          return currentState;
        }

        const { line, column } = currentState.position;
        const sanitizedSuggestion = currentState.suggestion.replace(/^\d+:\s*/gm, "");

        editor.executeEdits("", [
          {
            range: new monaco.Range(line, column, line, column),
            text: sanitizedSuggestion,
            forceMoveMarkers: true,
          },
        ]);

        if (currentState.decoration.length > 0) {
          editor.deltaDecorations(currentState.decoration, []);
        }

        return {
          ...currentState,
          suggestion: null,
          position: null,
          decoration: [],
        };
      });
    },
    []
  );

  const rejectSuggestion = useCallback((editor: SuggestionEditor | null) => {
    setState((currentState) => {
      if (editor && currentState.decoration.length > 0) {
        editor.deltaDecorations(currentState.decoration, []);
      }
      return {
        ...currentState,
        suggestion: null,
        position: null,
        decoration: [],
      };
    });
  }, []);

  const clearSuggestion = useCallback((editor: SuggestionEditor | null) => {
    setState((currentState) => {
      if (editor && currentState.decoration.length > 0) {
        editor.deltaDecorations(currentState.decoration, []);
      }
      return {
        ...currentState,
        suggestion: null,
        position: null,
        decoration: [],
      };
    });
  }, []);

  return {
    ...state,
    toggleEnabled,
    fetchSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    clearSuggestion,
  };
};
