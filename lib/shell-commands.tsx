import React from 'react';
import { VirtualFileSystem } from './filesystem';
import { SupabaseNotesService, promptForUserInfo, NoteSubmission } from './supabase-notes';

export interface CommandResult {
  output: React.ReactNode;
  error?: boolean;
}

export class ShellCommands {
  private fs: VirtualFileSystem;
  private supabaseService: SupabaseNotesService;
  private editorMode: {
    active: boolean;
    filename: string;
    content: string;
    onSave?: (filename: string, content: string) => Promise<void>;
  } = { active: false, filename: '', content: '' };

  constructor(filesystem: VirtualFileSystem) {
    this.fs = filesystem;
    this.supabaseService = new SupabaseNotesService();
  }

  async executeCommand(input: string): Promise<CommandResult> {
    const args = input.trim().split(/\s+/);
    const command = args[0].toLowerCase();
    const params = args.slice(1);

    // Handle editor mode
    if (this.editorMode.active) {
      return this.handleEditorInput(input);
    }

    try {
      switch (command) {
        case 'help':
          return this.help();
        case 'ls':
          return this.ls(params[0]);
        case 'cd':
          return this.cd(params[0] || '~');
        case 'pwd':
          return this.pwd();
        case 'cat':
          return this.cat(params[0]);
        case 'touch':
          return this.touch(params[0]);
        case 'mkdir':
          return this.mkdir(params[0]);
        case 'nano':
        case 'vim':
        case 'edit':
          return this.openEditor(params[0]);
        case 'tree':
          return this.tree(params[0]);
        case 'whoami':
          return this.whoami();
        case 'clear':
          return { output: 'clear' }; // Special command handled by terminal
        case 'about':
          return this.about();
        case 'links':
          return this.links();
        case 'projects':
          return this.projects();
        case 'skills':
          return this.skills();
        case 'contact':
          return this.contact();
        case 'welcome':
          return this.welcome();
        case 'tutorial':
          return this.tutorial();
        case 'examples':
          return this.examples();
        default:
          return {
            output: `Command not found: '${command}'. Type 'help' or 'ls' to get started.`,
            error: true
          };
      }
    } catch (error) {
      return {
        output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: true
      };
    }
  }

  private help(): CommandResult {
    const helpContent = React.createElement('div', null,
      React.createElement('div', { style: { marginLeft: '10px' } },
        React.createElement('div', null,
          React.createElement('span', { style: { color: '#98fb98' } }, 'Navigation:')
        ),
        React.createElement('div', { style: { marginLeft: '15px' } },
          React.createElement('div', null, React.createElement('code', null, 'pwd'), ' - Show current directory'),
          React.createElement('div', null, React.createElement('code', null, 'ls [path]'), ' - List directory contents'),
          React.createElement('div', null, React.createElement('code', null, 'cd [path]'), ' - Change directory (use ~ for home)'),
          React.createElement('div', null, React.createElement('code', null, 'tree [path]'), ' - Show directory tree')
        ),
        React.createElement('br'),
        React.createElement('div', null,
          React.createElement('span', { style: { color: '#98fb98' } }, 'File Operations:')
        ),
        React.createElement('div', { style: { marginLeft: '15px' } },
          React.createElement('div', null, React.createElement('code', null, 'cat [file]'), ' - Display file contents'),
          React.createElement('div', null, React.createElement('code', null, 'touch [file]'), ' - Create new file'),
          React.createElement('div', null, React.createElement('code', null, 'nano [file]'), ' - Edit file (also: vim, edit)'),
          React.createElement('div', null, React.createElement('code', null, 'mkdir [dir]'), ' - Create directory')
        ),
        React.createElement('br'),
        React.createElement('div', null,
          React.createElement('span', { style: { color: '#98fb98' } }, 'Portfolio:')
        ),
        React.createElement('div', { style: { marginLeft: '15px' } },
          React.createElement('div', null, React.createElement('code', null, 'about'), ' - About me'),
          React.createElement('div', null, React.createElement('code', null, 'links'), ' - My social links'),
          React.createElement('div', null, React.createElement('code', null, 'projects'), ' - My projects'),
          React.createElement('div', null, React.createElement('code', null, 'skills'), ' - Technical skills'),
          React.createElement('div', null, React.createElement('code', null, 'contact'), ' - Contact information')
        ),
        React.createElement('br'),
        React.createElement('div', { style: { color: '#98fb98', marginBottom: '10px' } }, 'Other:'),
        React.createElement('div', { style: { marginLeft: '15px' } },
          React.createElement('div', null, React.createElement('code', null, 'whoami'), ' - Current user info'),
          React.createElement('div', null, React.createElement('code', null, 'welcome'), ' - Show welcome message'),
          React.createElement('div', null, React.createElement('code', null, 'tutorial'), ' - Interactive tutorial'),
          React.createElement('div', null, React.createElement('code', null, 'examples'), ' - Usage examples'),
          React.createElement('div', null, React.createElement('code', null, 'clear'), ' - Clear terminal')
        ),
        React.createElement('br'),
        React.createElement('div', { style: { color: '#ffb347' } },
          'Navigate to /notes_for_kuan to leave me a message')
      )
    );

    return { output: helpContent };
  }

  private ls(path?: string): CommandResult {
    try {
      const items = this.fs.listDirectory(path);

      if (items.length === 0) {
        return { output: 'Directory is empty.' };
      }

      const output = items.map(item => {
        const icon = item.type === 'directory' ? '📁' : '📄';
        const name = item.type === 'directory' ? item.name + '/' : item.name;
        const color = item.type === 'directory' ? '#2bdfee' : '#ffffff';
        const size = item.size ? this.formatSize(item.size) : '';

        return React.createElement('div', {
          key: item.name,
          style: { display: 'flex', justifyContent: 'space-between' }
        },
          React.createElement('span', { style: { color } }, `${icon} ${name}`),
          size && React.createElement('span', { style: { color: '#888' } }, size)
        );
      });

      return { output: React.createElement('div', null, ...output) };
    } catch (error) {
      return {
        output: `ls: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: true
      };
    }
  }

  private cd(path: string): CommandResult {
    try {
      const newPath = this.fs.changeDirectory(path);
      return { output: `Changed to: ${newPath}` };
    } catch (error) {
      return {
        output: `cd: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: true
      };
    }
  }

  private pwd(): CommandResult {
    return { output: this.fs.getCurrentPath() };
  }

  private cat(filename?: string): CommandResult {
    if (!filename) {
      return { output: 'cat: missing filename', error: true };
    }

    try {
      const content = this.fs.readFile(filename);

      // Handle special file types
      if (filename.endsWith('.pdf')) {
        return {
          output: React.createElement('div', null,
            React.createElement('div', null, `📄 PDF File: ${filename}`),
            React.createElement('div', { style: { color: '#ffb347' } }, 'This is a binary PDF file.'),
            React.createElement('a', {
              href: '/WANG_KUANYI.pdf',
              download: 'Kuan Yi Wang Resume',
              style: { color: '#2bdfee', textDecoration: 'underline' }
            }, 'Download Resume')
          )
        };
      }

      return {
        output: React.createElement('pre', {
          style: { whiteSpace: 'pre-wrap' }
        }, content)
      };
    } catch (error) {
      return {
        output: `cat: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: true
      };
    }
  }

  private touch(filename?: string): CommandResult {
    if (!filename) {
      return { output: 'touch: missing filename', error: true };
    }

    try {
      this.fs.createFile(filename);
      return { output: `Created file: ${filename}` };
    } catch (error) {
      return {
        output: `touch: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: true
      };
    }
  }

  private mkdir(dirname?: string): CommandResult {
    if (!dirname) {
      return { output: 'mkdir: missing directory name', error: true };
    }

    try {
      this.fs.createDirectory(dirname);
      return { output: `Created directory: ${dirname}` };
    } catch (error) {
      return {
        output: `mkdir: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: true
      };
    }
  }

  private openEditor(filename?: string): CommandResult {
    if (!filename) {
      return { output: 'nano: missing filename', error: true };
    }

    // Check if we're in notes_for_kuan directory or trying to edit a file there
    const currentPath = this.fs.getCurrentPath();
    const isNotesDirectory = currentPath === '/notes_for_kuan' ||
                            currentPath.includes('notes_for_kuan');

    if (!this.fs.fileExists(filename)) {
      try {
        this.fs.createFile(filename);
      } catch (error) {
        return {
          output: `nano: ${error instanceof Error ? error.message : 'Unknown error'}`,
          error: true
        };
      }
    }

    let content = '';
    try {
      content = this.fs.readFile(filename);
    } catch (error) {
      // File doesn't exist, start with empty content
    }

    this.editorMode = {
      active: true,
      filename,
      content,
      onSave: isNotesDirectory ? this.saveNoteToSupabase.bind(this) : undefined
    };

    return {
      output: React.createElement('div', null,
        React.createElement('div', { style: { color: '#2bdfee' } }, `📝 Nano Editor - Editing: ${filename}`),
        React.createElement('div', { style: { color: '#ffb347', fontSize: '0.9em' } },
          isNotesDirectory ?
            'This will be saved as a note for Kuan! (Max 100,000 characters)' :
            'Type your content, then Ctrl+X to save and exit'
        ),
        React.createElement('div', {
          style: {
            border: '1px solid #444',
            margin: '10px 0',
            padding: '10px',
            backgroundColor: '#1a1a1a'
          }
        },
          React.createElement('pre', {
            style: { whiteSpace: 'pre-wrap', margin: 0 }
          }, content || '(empty file)')
        ),
        React.createElement('div', { style: { color: '#888', fontSize: '0.8em' } },
          'Commands: Type your content, then \'Ctrl+X\' to save and exit'
        )
      )
    };
  }

  private async handleEditorInput(input: string): Promise<CommandResult> {
    // Check for save and exit command
    if (input.toLowerCase() === 'ctrl+x' || input.toLowerCase() === ':wq' || input.toLowerCase() === ':x') {
      const { filename, content, onSave } = this.editorMode;

      if (onSave) {
        try {
          await onSave(filename, content);
        } catch (error) {
          this.editorMode = { active: false, filename: '', content: '' };
          return {
            output: `Error saving note: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error: true
          };
        }
      } else {
        // Regular file save
        if (content.length > 100000) {
          return {
            output: 'Error: Content exceeds maximum length of 100,000 characters.',
            error: true
          };
        }

        try {
          this.fs.updateFileContent(filename, content);
        } catch (error) {
          this.editorMode = { active: false, filename: '', content: '' };
          return {
            output: `Error saving file: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error: true
          };
        }
      }

      this.editorMode = { active: false, filename: '', content: '' };
      return { output: `File saved: ${filename}` };
    }

    // Add content to editor
    if (this.editorMode.content.length + input.length > 100000) {
      return {
        output: 'Error: Content would exceed maximum length of 100,000 characters.',
        error: true
      };
    }

    this.editorMode.content += (this.editorMode.content ? '\n' : '') + input;

    return {
      output: React.createElement('div', null,
        React.createElement('div', { style: { color: '#98fb98' } }, 'Content added. Current content:'),
        React.createElement('div', {
          style: {
            border: '1px solid #444',
            margin: '10px 0',
            padding: '10px',
            backgroundColor: '#1a1a1a'
          }
        },
          React.createElement('pre', {
            style: { whiteSpace: 'pre-wrap', margin: 0 }
          }, this.editorMode.content)
        ),
        React.createElement('div', { style: { color: '#888', fontSize: '0.8em' } },
          `Characters: ${this.editorMode.content.length}/100,000 | Type 'Ctrl+X' to save and exit`
        )
      )
    };
  }

  private async saveNoteToSupabase(filename: string, content: string): Promise<void> {
    try {
      // Get user information
      const userInfo = await promptForUserInfo();

      // Prepare note submission
      const noteSubmission: NoteSubmission = {
        filename,
        content,
        user_name: userInfo.name,
        user_email: userInfo.email
      };

      // Save to Supabase
      await this.supabaseService.saveNote(noteSubmission);

      // Also save to virtual filesystem for immediate display
      this.fs.updateFileContent(filename, content);

      console.log('Note saved successfully to Supabase');
    } catch (error) {
      console.error('Error saving note:', error);
      throw new Error(`Failed to save note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private tree(path?: string): CommandResult {
    // Simple tree implementation
    try {
      const startPath = path || this.fs.getCurrentPath();
      return { output: `Tree view for ${startPath} - (Feature coming soon!)` };
    } catch (error) {
      return {
        output: `tree: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: true
      };
    }
  }

  private whoami(): CommandResult {
    return { output: 'guest@kuan-portfolio' };
  }

  private about(): CommandResult {
    return {
      output: React.createElement('div', null,
        React.createElement('div', { style: { color: '#2bdfee', marginBottom: '10px' } }, '👋 About Kuan Yi Wang'),
        React.createElement('div', null, 'Currently hosting Piñata Pitch, Montreal\'s largest student tech pitch competition.'),
        React.createElement('div', null, 'I\'m a versatile team player, a polyglot, fluent in French, Mandarin, even Python.'),
        React.createElement('div', null, 'Currently Intern @Neuropoly, Polytechnique Montréal.'),
        React.createElement('br'),
        React.createElement('div', null,
          React.createElement('a', {
            href: 'mailto:kuanyi.wang0906@gmail.com',
            style: { color: '#2bdfee', textDecoration: 'underline' }
          }, 'Contact me @kuanyi.wang0906@gmail.com')
        ),
        React.createElement('br'),
        React.createElement('div', { style: { color: '#ffb347' } }, '💡 Try: cat /home/kuan/about.txt')
      )
    };
  }

  private links(): CommandResult {
    return {
      output: React.createElement('div', null,
        React.createElement('div', { style: { color: '#2bdfee', marginBottom: '10px' } }, '🔗 My Links'),
        React.createElement('div', null,
          React.createElement('a', {
            href: 'https://www.linkedin.com/in/kuan-yi-wang-443871319/',
            target: '_blank',
            rel: 'noopener noreferrer',
            style: { textDecoration: 'underline', color: '#2bdfee' }
          }, 'LinkedIn')
        ),
        React.createElement('div', null,
          React.createElement('a', {
            href: 'https://github.com/AcastaPaloma',
            target: '_blank',
            rel: 'noopener noreferrer',
            style: { textDecoration: 'underline', color: '#2bdfee' }
          }, 'GitHub')
        ),
        React.createElement('div', null,
          React.createElement('a', {
            href: 'https://www.instagram.com/kuanus_/',
            target: '_blank',
            rel: 'noopener noreferrer',
            style: { textDecoration: 'underline', color: '#2bdfee' }
          }, 'Instagram')
        ),
        React.createElement('div', null,
          React.createElement('a', {
            href: 'https://www.pinatapitch.tech',
            target: '_blank',
            rel: 'noopener noreferrer',
            style: { textDecoration: 'underline', color: '#2bdfee' }
          }, 'Piñata Pitch')
        ),
        React.createElement('div', null,
          React.createElement('a', {
            href: '/WANG_KUANYI.pdf',
            download: 'Kuan Yi Wang Resume',
            style: { textDecoration: 'underline', color: '#2bdfee' }
          }, 'Download Resume')
        )
      )
    };
  }

  private projects(): CommandResult {
    return {
      output: React.createElement('div', null,
        React.createElement('div', { style: { color: '#2bdfee', marginBottom: '10px' } }, '🚀 My Projects'),
        React.createElement('div', { style: { marginLeft: '10px' } },
          React.createElement('div', null, React.createElement('strong', null, '1. Piñata Pitch'), ' - Montreal\'s largest student tech pitch competition'),
          React.createElement('div', { style: { marginLeft: '15px', color: '#ffb347' } }, 'Website: https://www.pinatapitch.tech'),
          React.createElement('br'),
          React.createElement('div', null, React.createElement('strong', null, '2. Neuropoly Research'), ' - Current internship work'),
          React.createElement('div', { style: { marginLeft: '15px', color: '#ffb347' } }, 'Focus: Neural networks and AI research'),
          React.createElement('br'),
          React.createElement('div', null, React.createElement('strong', null, '3. Portfolio Terminal'), ' - This website!'),
          React.createElement('div', { style: { marginLeft: '15px', color: '#ffb347' } }, 'A terminal-based portfolio experience')
        ),
        React.createElement('br'),
        React.createElement('div', { style: { color: '#98fb98' } }, '💡 Try: cat /portfolio/experience.txt')
      )
    };
  }

  private skills(): CommandResult {
    return {
      output: React.createElement('div', null,
        React.createElement('div', { style: { color: '#2bdfee', marginBottom: '10px' } }, '💻 Technical Skills'),
        React.createElement('div', { style: { marginLeft: '10px' } },
          React.createElement('div', null,
            React.createElement('span', { style: { color: '#98fb98' } }, 'Languages:'),
            ' Python, JavaScript, TypeScript, C++, Java'
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: '#98fb98' } }, 'Frameworks:'),
            ' React, Next.js, Node.js, Express'
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: '#98fb98' } }, 'Databases:'),
            ' PostgreSQL, MongoDB, Supabase'
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: '#98fb98' } }, 'Tools:'),
            ' Git, Docker, VS Code, Terminal'
          ),
          React.createElement('div', null,
            React.createElement('span', { style: { color: '#98fb98' } }, 'AI/ML:'),
            ' Neural Networks, Research at Neuropoly'
          )
        ),
        React.createElement('br'),
        React.createElement('div', { style: { color: '#2bdfee' } }, '🌐 Human Languages'),
        React.createElement('div', { style: { marginLeft: '10px' } },
          React.createElement('div', null, 'English (Native), French (Fluent), Mandarin (Fluent)')
        ),
        React.createElement('br'),
        React.createElement('div', { style: { color: '#ffb347' } }, '💡 Try: cat /portfolio/skills.txt')
      )
    };
  }

  private contact(): CommandResult {
    return {
      output: React.createElement('div', null,
        React.createElement('div', { style: { color: '#2bdfee', marginBottom: '10px' } }, '📫 Contact Information'),
        React.createElement('div', null, 'Email: kuanyi.wang0906@gmail.com'),
        React.createElement('div', null, 'LinkedIn: https://www.linkedin.com/in/kuan-yi-wang-443871319/'),
        React.createElement('div', null, 'GitHub: https://github.com/AcastaPaloma'),
        React.createElement('div', null, 'Instagram: https://www.instagram.com/kuanus_/'),
        React.createElement('br'),
        React.createElement('div', { style: { color: '#ffb347' } }, '💡 Try: cat /home/kuan/contact.txt')
      )
    };
  }

  private welcome(): CommandResult {
    return {
      output: React.createElement('div', null,
        React.createElement('div', {
          style: { color: '#2bdfee', fontSize: '1.1em', marginBottom: '15px' }
        }, '✨ Seeking Summer 2026 tech internships. Dig into my portfolio!'),
      )
    };
  }

  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  isInEditorMode(): boolean {
    return this.editorMode.active;
  }

  getCurrentEditingFile(): string {
    return this.editorMode.filename;
  }

  private tutorial(): CommandResult {
    return {
      output: React.createElement('div', null,
        React.createElement('div', {
          style: { color: '#2bdfee', fontSize: '1.1em', marginBottom: '15px' }
        }, '🎓 Interactive Tutorial'),
        React.createElement('div', { style: { marginBottom: '10px' } },
          'Welcome to your terminal portfolio crash course! Let\'s learn the basics:'
        ),
        React.createElement('div', { style: { color: '#98fb98', marginBottom: '10px' } }, 'Lesson 1: Navigation'),
        React.createElement('div', { style: { marginLeft: '15px', marginBottom: '10px' } },
          React.createElement('div', null, '• Try: ', React.createElement('code', { style: { color: '#ffb347' } }, 'pwd'), ' (shows where you are)'),
          React.createElement('div', null, '• Try: ', React.createElement('code', { style: { color: '#ffb347' } }, 'ls'), ' (lists files and folders)'),
          React.createElement('div', null, '• Try: ', React.createElement('code', { style: { color: '#ffb347' } }, 'cd /home/kuan'), ' (change directory)')
        ),
        React.createElement('div', { style: { color: '#98fb98', marginBottom: '10px' } }, 'Lesson 2: Exploring Files'),
        React.createElement('div', { style: { marginLeft: '15px', marginBottom: '10px' } },
          React.createElement('div', null, '• Try: ', React.createElement('code', { style: { color: '#ffb347' } }, 'cat about.txt'), ' (read a file)'),
          React.createElement('div', null, '• Try: ', React.createElement('code', { style: { color: '#ffb347' } }, 'cat fun_facts.txt'), ' (more fun content!)')
        ),
        React.createElement('div', { style: { color: '#98fb98', marginBottom: '10px' } }, 'Lesson 3: Leave a Message'),
        React.createElement('div', { style: { marginLeft: '15px', marginBottom: '10px' } },
          React.createElement('div', null, '• Try: ', React.createElement('code', { style: { color: '#ffb347' } }, 'cd /notes_for_kuan')),
          React.createElement('div', null, '• Try: ', React.createElement('code', { style: { color: '#ffb347' } }, 'touch hello.txt')),
          React.createElement('div', null, '• Try: ', React.createElement('code', { style: { color: '#ffb347' } }, 'nano hello.txt'))
        ),
        React.createElement('div', { style: { color: '#ffb347' } },
          '🚀 Ready to explore? Type \'examples\' for more ideas!'
        )
      )
    };
  }

  private examples(): CommandResult {
    return {
      output: React.createElement('div', null,
        React.createElement('div', {
          style: { color: '#2bdfee', fontSize: '1.1em', marginBottom: '15px' }
        }, '💡 Example Commands & Workflows'),
        React.createElement('div', { style: { marginBottom: '15px' } },
          React.createElement('div', { style: { color: '#98fb98', marginBottom: '8px' } }, '🏠 Explore My Personal Space:'),
          React.createElement('div', { style: { marginLeft: '15px', fontFamily: 'monospace' } },
            React.createElement('div', null, 'cd /home/kuan'),
            React.createElement('div', null, 'ls'),
            React.createElement('div', null, 'cat quirks.txt'),
            React.createElement('div', null, 'cat goals.txt')
          )
        ),
        React.createElement('div', { style: { marginBottom: '15px' } },
          React.createElement('div', { style: { color: '#98fb98', marginBottom: '8px' } }, '💼 Check Out My Work:'),
          React.createElement('div', { style: { marginLeft: '15px', fontFamily: 'monospace' } },
            React.createElement('div', null, 'cd /portfolio'),
            React.createElement('div', null, 'ls'),
            React.createElement('div', null, 'cat skills.txt'),
            React.createElement('div', null, 'cat inspirations.txt')
          )
        ),
        React.createElement('div', { style: { marginBottom: '15px' } },
          React.createElement('div', { style: { color: '#98fb98', marginBottom: '8px' } }, '✍️ Leave Me a Note:'),
          React.createElement('div', { style: { marginLeft: '15px', fontFamily: 'monospace' } },
            React.createElement('div', null, 'cd /notes_for_kuan'),
            React.createElement('div', null, 'touch my_message.txt'),
            React.createElement('div', null, 'nano my_message.txt'),
            React.createElement('div', { style: { color: '#888', fontSize: '0.9em' } }, '# Write your message, then type "Ctrl+X"')
          )
        ),
        React.createElement('div', { style: { marginBottom: '15px' } },
          React.createElement('div', { style: { color: '#98fb98', marginBottom: '8px' } }, '🎯 Quick Portfolio Commands:'),
          React.createElement('div', { style: { marginLeft: '15px', fontFamily: 'monospace' } },
            React.createElement('div', null, 'about    # Quick bio'),
            React.createElement('div', null, 'links    # My social media'),
            React.createElement('div', null, 'projects # What I\'ve built'),
            React.createElement('div', null, 'skills   # Technical abilities'),
            React.createElement('div', null, 'contact  # Get in touch')
          )
        ),
        React.createElement('div', { style: { color: '#ffb347' } },
          '💭 Pro tip: Use arrow keys to navigate command history!'
        )
      )
    };
  }
}