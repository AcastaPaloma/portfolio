'use client';
import React, { useState } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput>K:\Coding\portfolio\portfolio Type 'help' for commands.</TerminalOutput>,
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
        output = "Throat Goat";
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
            </>
          );
          break;
      case 'clear':
        setTerminalLineData([]);
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
        <TypeAnimation
          sequence={[
            'Meet a student.',
            1000,
            'Meet an aspiring MedxTech Innovator.',
            1000,
            'Meet a polyglot.',
            1000,
            'Hi, my name is Kuan.',
            1000,
          ]}
          wrapper="span"
          speed={25}
          deletionSpeed={25}
          style={{ fontSize: '5em', display: 'inline-block', fontFamily: 'Roboto', color: 'var(--text-dark)' }}
          cursor={true}
          repeat={0}
        />
      </header>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-[60%] p-2">
        <div className="terminal-container w-[100%]">
          <Terminal
            name="Start hacking"
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
