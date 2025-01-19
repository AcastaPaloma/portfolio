// page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import { executeCommand, getNextCommands } from './commands';

export default function Home() {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput>Welcome! Type 'help' to start.</TerminalOutput>,
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [availableCommands, setAvailableCommands] = useState<string[]>(['help']);

  const handleTerminalInput = (input: string) => {
    const trimmedInput = input.trim();

    // Add input to terminal display
    setTerminalLineData(prev => [
      ...prev,
      <TerminalOutput>{`> ${input}`}</TerminalOutput>
    ]);

    // Execute command and get result
    const result = executeCommand(trimmedInput);
    
    // Add command output to terminal
    setTerminalLineData(prev => [
      ...prev,
      <TerminalOutput>{result.content}</TerminalOutput>
    ]);

    // If it's a valid command, update available commands
    if (result.isValid) {
      setAvailableCommands(result.nextCommands || []);
      // Show available next commands
      setTerminalLineData(prev => [
        ...prev,
        <TerminalOutput>
          Next available commands: {result.nextCommands?.join(', ')}
        </TerminalOutput>
      ]);
    }

    // Update command history
    if (trimmedInput) {
      setCommandHistory(prev => [...prev, input]);
    }
    
    setHistoryIndex(null);
    setCurrentInput('');

    // Handle clear command
    if (trimmedInput === 'clear') {
      setTerminalLineData([
        <TerminalOutput>Type 'help' to start.</TerminalOutput>
      ]);
      setCommandHistory([]);
      setAvailableCommands(['help']);
    }
  };

  // ... rest of your existing key handling code ...

  return (
    <Terminal
      name="K:\Coding\portfolio\Kuan Yi Wang"
      colorMode={ColorMode.Dark}
      onInput={(input) => {
        setCurrentInput(input);
        handleTerminalInput(input);
      }}
      height="80vh"
      startingInputValue={currentInput}
    >
      {terminalLineData}
    </Terminal>
  );
}