import React, { useRef, useEffect, useState } from 'react';

// TypeScript declarations for Monaco Editor loaded from CDN
declare const window: any;

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Keep the onChange handler up-to-date in a ref to avoid re-running effects
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // This effect runs only once to initialize the editor
  useEffect(() => {
    // Prevent re-initialization
    if (editorInstance.current) {
      return;
    }

    let isDisposed = false;

    const initialize = () => {
      // Guard against the component being unmounted before initialization finishes
      if (isDisposed || !editorRef.current) return;

      const editor = window.monaco.editor.create(editorRef.current, {
        value: value,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
      });

      editor.onDidChangeModelContent(() => {
        onChangeRef.current(editor.getValue());
      });

      editorInstance.current = editor;
      setIsEditorReady(true);
    };

    const monacoInitialization = () => {
        if (typeof window.require === 'undefined') {
            // If loader is not available, do nothing.
            return;
        }
        window.require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        window.require(['vs/editor/editor.main'], initialize);
    };

    if (typeof window.require !== 'undefined') {
      monacoInitialization();
    } else {
      document.querySelector('script[src*="loader.min.js"]')?.addEventListener('load', monacoInitialization);
    }

    return () => {
      isDisposed = true;
      document.querySelector('script[src*="loader.min.js"]')?.removeEventListener('load', monacoInitialization);
      editorInstance.current?.dispose();
      editorInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures this runs only once on mount

  // This effect handles external updates to the `value` prop (e.g., from language change)
  useEffect(() => {
    if (editorInstance.current && editorInstance.current.getValue() !== value) {
      editorInstance.current.setValue(value);
    }
  }, [value]);

  // This effect handles language changes for syntax highlighting
  useEffect(() => {
    if (editorInstance.current && window.monaco) {
      window.monaco.editor.setModelLanguage(editorInstance.current.getModel(), language);
    }
  }, [language]);

  return (
    <div className="w-full h-full bg-gray-800 relative pt-12">
      {!isEditorReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
          <p>Loading Editor...</p>
        </div>
      )}
      <div ref={editorRef} className="w-full h-full" />
    </div>
  );
};

export default CodeEditor;