// commands.ts
import React from 'react';

interface CommandOutput {
  content: React.ReactNode;
  nextCommands?: string[];
}

interface Command {
  description: string;
  execute: () => CommandOutput;
}

interface CommandRegistry {
  [key: string]: Command;
}

export const commands: CommandRegistry = {
  help: {
    description: 'Show available commands',
    execute: () => ({
      content: 'Available commands: help, about, links, email, projects, clear',
      nextCommands: ['about', 'links', 'email', 'projects']
    })
  },
  about: {
    description: 'Learn about me',
    execute: () => ({
      content: (
        <>
          Currently hosting Piñata Pitch, a startup pitch competition. 
          <br />I'm a versatile team player, a polyglot, fluent in French, Mandarin, even Python. 
          <br />Currently Intern @Neuropoly, Polytechnique Montréal.
        </>
      ),
      nextCommands: ['email', 'links', 'projects']
    })
  },
  email: {
    description: 'Get in touch',
    execute: () => ({
      content: (
        <a href="mailto:kuanyi.wang0906@gmail.com" style={{color: '#2bdfee'}}>
          <u>Contact me @kuanyi.wang0906@gmail.com</u>
        </a>
      ),
      nextCommands: ['links', 'about']
    })
  },
  links: {
    description: 'View my social links and resume',
    execute: () => ({
      content: (
        <>
          <a href="https://www.linkedin.com/in/kuan-yi-wang-443871319/" 
             target="_blank" 
             rel="noopener noreferrer" 
             style={{ textDecoration: 'underline', color: '#2bdfee' }}>
            LinkedIn
          </a>
          <br />
          <a href="https://github.com/AcastaPaloma" 
             target="_blank" 
             rel="noopener noreferrer" 
             style={{ textDecoration: 'underline', color: '#2bdfee' }}>
            GitHub
          </a>
          <br />
          <a href="/resumeKYW.pdf" 
             download="Kuan Yi Wang Resume" 
             style={{ textDecoration: 'underline', color: '#2bdfee' }}>
            View my resume
          </a>
        </>
      ),
      nextCommands: ['about', 'email', 'projects']
    })
  },
  projects: {
    description: 'View my projects',
    execute: () => ({
      content: (
        <>
          <a href="https://www.pinatapitch.tech" 
             target="_blank" 
             rel="noopener noreferrer" 
             style={{ textDecoration: 'underline', color: '#2bdfee' }}>
            Piñata Pitch
          </a>
          <br />
          Type 'pinatapitch' for more details
        </>
      ),
      nextCommands: ['pinatapitch', 'links', 'about']
    })
  },
  pinatapitch: {
    description: 'Learn more about Piñata Pitch',
    execute: () => ({
      content: 'Piñata Pitch is a startup pitch competition platform...',
      nextCommands: ['projects', 'links']
    })
  },
  clear: {
    description: 'Clear the terminal',
    execute: () => ({
      content: 'Terminal cleared',
      nextCommands: ['help', 'about', 'links']
    })
  }
};

export const getNextCommands = (currentCommand: string): string[] => {
  const command = commands[currentCommand];
  return command?.execute().nextCommands || Object.keys(commands);
};

export const executeCommand = (input: string): CommandOutput & { isValid: boolean } => {
  const command = commands[input.toLowerCase()];
  if (!command) {
    return {
      content: `Unknown command: '${input}'. Type 'help' for available commands.`,
      nextCommands: ['help'],
      isValid: false
    };
  }
  return { ...command.execute(), isValid: true };
};