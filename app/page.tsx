'use client';
import React, { useState } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput>Type 'help' for commands.</TerminalOutput>,
  ]);

  // Function to handle terminal input and maintain history
  const handleTerminalInput = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();

    // Append input as a command line in the terminal
    setTerminalLineData((prev) => [
      ...prev,
      <TerminalOutput>{`> ${input}`}</TerminalOutput>,
    ]);

    // Process commands
    let output;
    switch (trimmedInput) {
      case 'help':
        output = 'Available commands: help, about, links, clear';
        break;
      case 'about':
        output = "Currently hosting Piñata Pitch, a startup pitch competition. \nI'm a versatile team player, a polyglot, fluent in French, Mandarin, even Python. \nCurrently Intern @Neuropoly, Polytechnique Montréal.";
        break;
        case 'links':
          output = (
            <>
              <a href="https://www.linkedin.com/in/kuan-yi-wang-443871319/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'blue' }}>
                LinkedIn
              </a>
              <br />
              <a href="https://github.com/AcastaPaloma" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'blue' }}>
                GitHub
              </a>
              <br />
              <a href="https://www.instagram.com/kuanus_/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'blue' }}>
                Instagram
              </a>
              <br />
              <a href="https://www.pinatapitch.tech" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'blue' }}>
                Piñata Pitch
              </a>
            </>
          );
          break;
      case 'clear':
        setTerminalLineData([<TerminalOutput>Available commands: help, about, links, clear</TerminalOutput>]);
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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-[60%] p-2">
        <div className="terminal-container w-[100%]">
          <Terminal
            name="K:\Coding\portfolio\portfolio "
            colorMode={ColorMode.Light}
            onInput={handleTerminalInput}
            startingInputValue={" "}

          >
            {terminalLineData}
          </Terminal>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
