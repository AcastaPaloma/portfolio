import React, { useState, useRef, useEffect } from 'react';

interface CustomTerminalProps {
  prompt: string;
  onCommand: (command: string) => void;
  children: React.ReactNode;
  height?: string;
  commandHistory?: string[];
}

export const CustomTerminal: React.FC<CustomTerminalProps> = ({
  prompt,
  onCommand,
  children,
  height = '100vh',
  commandHistory = []
}) => {
  const [currentInput, setCurrentInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Handle input submission and history navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCommand(currentInput);
      setCurrentInput('');
      setHistoryIndex(null);
    } else if (e.key === 'ArrowUp' && commandHistory.length > 0) {
      e.preventDefault();
      setHistoryIndex((prevIndex) => {
        const newIndex = prevIndex === null ? commandHistory.length - 1 : Math.max(prevIndex - 1, 0);
        setCurrentInput(commandHistory[newIndex]);
        return newIndex;
      });
    } else if (e.key === 'ArrowDown' && commandHistory.length > 0) {
      e.preventDefault();
      setHistoryIndex((prevIndex) => {
        if (prevIndex === null) return null;
        const newIndex = Math.min(prevIndex + 1, commandHistory.length - 1);
        if (newIndex === commandHistory.length - 1) {
          setCurrentInput('');
          return null;
        }
        setCurrentInput(commandHistory[newIndex]);
        return newIndex;
      });
    }
  };

  // Auto-focus and scroll to bottom
  useEffect(() => {
    inputRef.current?.focus();
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [children]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  return (
    <div
      ref={terminalRef}
      onClick={handleTerminalClick}
      style={{
        height,
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        fontSize: '14px',
        lineHeight: '1.2',
        padding: '20px',
        overflow: 'auto',
        cursor: 'text'
      }}
    >
      {/* Terminal content */}
      <div style={{ lineHeight: '1.2' }}>
        {children}
      </div>

      {/* Current input line */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#98fb98', whiteSpace: 'nowrap' }}>
          {prompt}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            flex: 1,
            marginLeft: '5px'
          }}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
};