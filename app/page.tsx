'use client';
import React, { useState, useEffect } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';

export default function Home() {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput>Type 'help' to start.</TerminalOutput>,
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [currentInput, setCurrentInput] = useState<string>(''); // Tracks the input shown on the current line

  // Function to handle terminal input and maintain history
  const handleTerminalInput = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();

    // Append input to terminal and command history
    setTerminalLineData((prev) => [
      ...prev,
      <TerminalOutput>{`> ${input}`}</TerminalOutput>,
    ]);

    setCommandHistory((prev) => [...prev, input]);
    setHistoryIndex(null); // Reset history index
    setCurrentInput(''); // Clear input field after submission

    // Process commands
    let output;
    switch (trimmedInput) {
      case 'help':
        output = 'Available commands: help, about, links, clear';
        break;
      case 'about':
        output = (          
        <>
          Currently hosting Piñata Pitch, a startup pitch competition. 
          <br />I'm a versatile team player, a polyglot, fluent in French, Mandarin, even Python. 
          <br />Currently Intern @Neuropoly, Polytechnique Montréal. 
          <br />
          <a href="mailto:kuanyi.wang0906@gmail.com" style={{color: '#2bdfee'}}><u>Contact me @kuanyi.wang0906@gmail.com</u></a>

        </>
        )
        break;
      case 'links':
        output = (
          <>
            <a
              href="https://www.linkedin.com/in/kuan-yi-wang-443871319/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: '#2bdfee' }}
            >
              LinkedIn
            </a>
            <br />
            <a
              href="https://github.com/AcastaPaloma"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: '#2bdfee' }}
            >
              GitHub
            </a>
            <br />
            <a
              href="https://www.instagram.com/kuanus_/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: '#2bdfee' }}
            >
              Instagram
            </a>
            <br />
            <a
              href="https://www.pinatapitch.tech"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: '#2bdfee' }}
            >
              Piñata Pitch
            </a>
            <br />
            <a
              href="/resumeKYW.pdf"
              download="Kuan Yi Wang Resume"
              style={{ textDecoration: 'underline', color: '#2bdfee' }}
            >
              View my resume
            </a>
          </>
        );
        break;
      case 'clear':
        setTerminalLineData([
          <TerminalOutput>Available commands: help, about, links, clear</TerminalOutput>,
        ]);
        setCommandHistory([]);
        return;
      default:
        output = `Unknown command: '${input}'. Type 'help' for available commands.`;
    }

    // Append the command result
    setTerminalLineData((prev) => [
      ...prev,
      <TerminalOutput>{output}</TerminalOutput>,
    ]);
  };

  // Handle key events to detect the up arrow
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' && commandHistory.length > 0) {
      setHistoryIndex((prevIndex) => {
        const newIndex = prevIndex === null ? commandHistory.length - 1 : Math.max(prevIndex - 1, 0);
        setCurrentInput(commandHistory[newIndex]);
        return newIndex;
      });
    }
    if (event.key === 'ArrowDown' && commandHistory.length > 0) {
      setHistoryIndex((prevIndex) => {
        const newIndex = prevIndex === null ? commandHistory.length - 1 : Math.min(prevIndex + 1, commandHistory.length - 1);
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

  return (
          <Terminal
            name="K:\Coding\portfolio\Kuan Yi Wang "
            colorMode={ColorMode.Dark}
            onInput={(input) => {
              setCurrentInput(input); // Update current input value
              handleTerminalInput(input);
            }}
            height="80vh"
            startingInputValue={currentInput} // Set input to the current value
          >
            {terminalLineData}
          </Terminal>
  );
}
