'use client';
import React, { useState, useEffect } from 'react';
import { VirtualFileSystem } from '../lib/filesystem';
import { ShellCommands } from '../lib/shell-commands';
import { CustomTerminal } from '../components/CustomTerminal';

// Wrapper component to handle ReactNode content
const TerminalLine: React.FC<{ children: React.ReactNode; error?: boolean }> = ({ children, error }) => {
  return (
    <div style={error ? { color: '#ff6b6b' } : undefined}>
      {children}
    </div>
  );
};

export default function Home() {
  const [terminalLineData, setTerminalLineData] = useState<React.ReactNode[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [fs] = useState(() => new VirtualFileSystem());
  const [shell] = useState(() => new ShellCommands(fs));
  const [currentPath, setCurrentPath] = useState<string>('/');

  // Initialize terminal with welcome message
  useEffect(() => {
    const initializeTerminal = async () => {
      // Set initial path
      setCurrentPath(fs.getCurrentPath());

      const welcomeResult = await shell.executeCommand('welcome');
      setTerminalLineData([
        <TerminalLine key="welcome">{welcomeResult.output}</TerminalLine>,
        <TerminalLine key="help-tip">Type 'help' for available commands.</TerminalLine>
      ]);
    };

    initializeTerminal();
  }, [shell, fs]);

  // Function to handle terminal input and maintain history
  const handleTerminalInput = async (input: string) => {
    const trimmedInput = input.trim();

    // Get current prompt for this command
    const currentPath = fs.getCurrentPath();
    const user = 'guest@kuan-portfolio';
    const promptPrefix = `${user}:${currentPath}$`;

    console.log('Current Prompt:', promptPrefix);

    // Append input to terminal display with current path
    setTerminalLineData((prev) => [
      ...prev,
      <TerminalLine key={`input-${prev.length}`}>{`${promptPrefix} ${input}`}</TerminalLine>,
    ]);

    // Add to command history
    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(null);
    setCurrentInput('');

    // Handle special clear command
    if (trimmedInput.toLowerCase() === 'clear') {
      setTerminalLineData([
        <TerminalLine key="cleared">Terminal cleared. Type 'help' for available commands.</TerminalLine>
      ]);
      setCommandHistory([]);
      // Update prompt after clearing
      const newPath = fs.getCurrentPath();
      const user = 'guest@kuan-portfolio';
      setCurrentPath(newPath);
      setCurrentPrompt(`${user}:${newPath}$`);
      return;
    }

    // Execute command through shell
    try {
      const result = await shell.executeCommand(trimmedInput);

      // Handle command output
      const outputKey = `output-${Date.now()}`;

      setTerminalLineData((prev) => [
        ...prev,
        <TerminalLine key={outputKey} error={result.error}>
          {result.output}
        </TerminalLine>,
      ]);

      // Update prompt after command execution (especially for cd commands)
      const newPath = fs.getCurrentPath();
      const user = 'guest@kuan-portfolio';
      setCurrentPath(newPath);
      setCurrentPrompt(`${user}:${newPath}$`);

    } catch (error) {
      const errorKey = `error-${Date.now()}`;
      setTerminalLineData((prev) => [
        ...prev,
        <TerminalLine key={errorKey} error={true}>
          Error: {error instanceof Error ? error.message : 'Unknown error occurred'}
        </TerminalLine>,
      ]);
    }
  };

  // Handle key events for command history navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && commandHistory.length > 0) {
      event.preventDefault();
      setHistoryIndex((prevIndex) => {
        const newIndex = prevIndex === null ? commandHistory.length - 1 : Math.max(prevIndex - 1, 0);
        setCurrentInput(commandHistory[newIndex]);
        return newIndex;
      });
    }
    if (event.key === 'ArrowDown' && commandHistory.length > 0) {
      event.preventDefault();
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

  // Attach the keydown listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandHistory]);

  // Generate terminal prompt
  const getPrompt = () => {
    const currentPath = fs.getCurrentPath();
    const user = 'guest@kuan-portfolio';
    return `${user}:${currentPath}$`;
  };

  // State to track current prompt for updates
  const [currentPrompt, setCurrentPrompt] = useState(getPrompt());

  // Update prompt when path changes
  useEffect(() => {
    const newPrompt = getPrompt();
    setCurrentPrompt(newPrompt);
    console.log('Prompt updated to:', newPrompt);
  }, [currentPath]); // Update when current path changes

  return (
    <CustomTerminal
      prompt={currentPrompt}
      onCommand={handleTerminalInput}
      height="100vh"
      commandHistory={commandHistory}
    >
      {terminalLineData}
    </CustomTerminal>
  );
}
