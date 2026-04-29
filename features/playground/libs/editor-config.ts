import type { Monaco } from "@monaco-editor/react";

export const getEditorLanguage = (fileExtension: string): string => {
  const extension = fileExtension.toLowerCase();
  const languageMap: Record<string, string> = {
    // JavaScript/TypeScript
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mjs: "javascript",
    cjs: "javascript",
    
    // Web languages
    json: "json",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "scss",
    less: "less",
    
    // Markup/Documentation
    md: "markdown",
    markdown: "markdown",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    
    // Programming languages
    py: "python",
    python: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    sh: "shell",
    bash: "shell",
    sql: "sql",
    
    // Config files
    toml: "ini",
    ini: "ini",
    conf: "ini",
    dockerfile: "dockerfile",
  };
  
  return languageMap[extension] || "plaintext";
};

export const configureMonaco = (monaco: Monaco) => {
  monaco.editor.defineTheme("forge-console", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "77716A", fontStyle: "italic" },
      { token: "keyword", foreground: "FFB020", fontStyle: "bold" },
      { token: "keyword.control", foreground: "FFB020", fontStyle: "bold" },
      { token: "string", foreground: "F4A261" },
      { token: "string.quoted", foreground: "F4A261" },
      { token: "string.template", foreground: "F4A261" },
      { token: "number", foreground: "7DDC91" },
      { token: "entity.name.function", foreground: "FFD166" },
      { token: "support.function", foreground: "FFD166" },
      { token: "variable", foreground: "EDE5D8" },
      { token: "variable.parameter", foreground: "FFD6A5" },
      { token: "entity.name.type", foreground: "80ED99" },
      { token: "support.type", foreground: "80ED99" },
      { token: "storage.type", foreground: "FF8A3D" },
      { token: "entity.name.class", foreground: "80ED99" },
      { token: "constant", foreground: "FCA311" },
      { token: "keyword.operator", foreground: "E8E0D4" },
      { token: "punctuation", foreground: "E8E0D4" },
      { token: "tag", foreground: "FF7A2F" },
      { token: "attribute.name", foreground: "FFD166" },
      { token: "attribute.value", foreground: "F4A261" },
      { token: "key", foreground: "FFD166" },
      { token: "string.key", foreground: "FFD166" },
      { token: "invalid", foreground: "FF5C5C", fontStyle: "underline" },
      { token: "invalid.deprecated", foreground: "D4D4D4", fontStyle: "strikethrough" },
    ],
    colors: {
      "editor.background": "#0B0B0C",
      "editor.foreground": "#F4EFE7",
      "editorLineNumber.foreground": "#5F5A54",
      "editorLineNumber.activeForeground": "#FFB020",
      "editorCursor.foreground": "#FF5A1F",
      "editor.selectionBackground": "#FF5A1F33",
      "editor.selectionHighlightBackground": "#FFB02022",
      "editor.inactiveSelectionBackground": "#30241D",
      "editor.lineHighlightBackground": "#171311",
      "editor.lineHighlightBorder": "#2A211D",
      "editorGutter.background": "#0B0B0C",
      "editorGutter.modifiedBackground": "#FFB02088",
      "editorGutter.addedBackground": "#22C55E88",
      "editorGutter.deletedBackground": "#EF444488",
      "scrollbar.shadow": "#0008",
      "scrollbarSlider.background": "#FF5A1F33",
      "scrollbarSlider.hoverBackground": "#FF5A1F55",
      "scrollbarSlider.activeBackground": "#FF5A1F77",
      "minimap.background": "#111113",
      "minimap.selectionHighlight": "#FF5A1F55",
      "editor.findMatchBackground": "#FFB02066",
      "editor.findMatchHighlightBackground": "#FFB02033",
      "editor.findRangeHighlightBackground": "#22C55E30",
      "editor.wordHighlightBackground": "#FF5A1F20",
      "editor.wordHighlightStrongBackground": "#FF5A1F35",
      "editorBracketMatch.background": "#FF5A1F1A",
      "editorBracketMatch.border": "#FFB020",
      "editorIndentGuide.background": "#241D19",
      "editorIndentGuide.activeBackground": "#3B2B22",
      "editorRuler.foreground": "#00000000",
      "editorWhitespace.foreground": "#4B4540",
      "editorError.foreground": "#FF5C5C",
      "editorWarning.foreground": "#FFB020",
      "editorInfo.foreground": "#FF8A3D",
      "editorHint.foreground": "#F4EFE7",
      "editorSuggestWidget.background": "#111113",
      "editorSuggestWidget.border": "#3B2B22",
      "editorSuggestWidget.foreground": "#F4EFE7",
      "editorSuggestWidget.selectedBackground": "#2A211D",
      "editorHoverWidget.background": "#111113",
      "editorHoverWidget.border": "#3B2B22",
      "panel.background": "#0B0B0C",
      "panel.border": "#2A211D",
      "activityBar.background": "#0B0B0C",
      "activityBar.foreground": "#F4EFE7",
      "activityBar.border": "#2A211D",
      "sideBar.background": "#0B0B0C",
      "sideBar.foreground": "#F4EFE7",
      "sideBar.border": "#2A211D",
    },
  });

  monaco.editor.setTheme("forge-console");
  
  // Configure additional editor settings
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
  
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  // Set compiler options for better IntelliSense
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  });
};

export const defaultEditorOptions = {
  // Font settings
  fontSize: 14,
  fontFamily: "'Geist Mono', 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
  fontLigatures: true,
  fontWeight: "400",
  
  // Layout
  minimap: { 
    enabled: false
  },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },
  
  // Line settings
  lineNumbers: "on" as const,
  lineHeight: 20,
  renderLineHighlight: "all" as const,
  renderWhitespace: "selection" as const,
  
  // Indentation
  tabSize: 2,
  insertSpaces: true,
  detectIndentation: true,
  
  // Word wrapping
  wordWrap: "on" as const,
  wordWrapColumn: 120,
  wrappingIndent: "indent" as const,
  
  // Code folding
  folding: true,
  foldingHighlight: true,
  foldingStrategy: "indentation" as const,
  showFoldingControls: "mouseover" as const,
  
  // Scrolling
  smoothScrolling: true,
  mouseWheelZoom: true,
  fastScrollSensitivity: 5,
  
  // Selection
  multiCursorModifier: "ctrlCmd" as const,
  selectionHighlight: true,
  occurrencesHighlight: "singleFile" as const,
  
  // Suggestions
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: "on" as const,
  tabCompletion: "on" as const,
  wordBasedSuggestions: "matchingDocuments" as const,
  quickSuggestions: {
    other: true,
    comments: false,
    strings: false
  },
  
  // Formatting
  formatOnPaste: true,
  formatOnType: true,
  
  // Bracket matching
  matchBrackets: "always" as const,
  bracketPairColorization: {
    enabled: true
  },
  
  // Guides
  renderIndentGuides: true,
  highlightActiveIndentGuide: true,
  rulers: [],
  
  // Performance
  disableLayerHinting: false,
  disableMonospaceOptimizations: false,
  
  // Accessibility
  accessibilitySupport: "auto" as const,
  
  // Cursor
  cursorBlinking: "smooth" as const,
  cursorSmoothCaretAnimation: "on" as const,
  cursorStyle: "line" as const,
  cursorWidth: 2,
  
  // Find
  find: {
    addExtraSpaceOnTop: false,
    autoFindInSelection: "never" as const,
    seedSearchStringFromSelection: "always" as const
  },
  
  // Hover
  hover: {
    enabled: true,
    delay: 300,
    sticky: true
  },
  
  // Semantic highlighting
  "semanticHighlighting.enabled": true,
  
  // Sticky scroll
  stickyScroll: {
    enabled: true
  }
};
