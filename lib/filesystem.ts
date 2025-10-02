// Virtual File System for Terminal Portfolio
export interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: { [name: string]: FileSystemNode };
  permissions?: string;
  size?: number;
  modified?: Date;
}

export class VirtualFileSystem {
  private currentPath: string[] = [];
  private root: FileSystemNode;

  constructor() {
    this.root = this.initializeFileSystem();
  }

  private initializeFileSystem(): FileSystemNode {
    return {
      name: '',
      type: 'directory',
      children: {
        home: {
          name: 'home',
          type: 'directory',
          children: {
            kuan: {
              name: 'kuan',
              type: 'directory',
              children: {
                'about.txt': {
                  name: 'about.txt',
                  type: 'file',
                  content: `Hi! I'm Kuan Yi Wang 👋

I'm a versatile team player, a polyglot, fluent in French, Mandarin, and Python.
Currently hosting Piñata Pitch, Montreal's largest student tech pitch competition.
Currently Intern @Neuropoly, Polytechnique Montréal.

Contact: kuanyi.wang0906@gmail.com`,
                  size: 285,
                  modified: new Date()
                },
                'projects.txt': {
                  name: 'projects.txt',
                  type: 'file',
                  content: `🚀 My Projects:

1. Piñata Pitch - Montreal's largest student tech pitch competition
   Website: https://www.pinatapitch.tech

2. Neuropoly Research - Current internship work
   Focus: Neural networks and AI research

3. Portfolio Terminal - This website!
   A terminal-based portfolio experience

Type 'cat projects.txt' to view this again.`,
                  size: 320,
                  modified: new Date()
                },
                'contact.txt': {
                  name: 'contact.txt',
                  type: 'file',
                  content: `📫 Get in touch:

LinkedIn: https://www.linkedin.com/in/kuan-yi-wang-443871319/
GitHub: https://github.com/AcastaPaloma
Instagram: https://www.instagram.com/kuanus_/
Email: kuanyi.wang0906@gmail.com
Resume: /home/kuan/resume.pdf`,
                  size: 245,
                  modified: new Date()
                },
                'fun_facts.txt': {
                  name: 'fun_facts.txt',
                  type: 'file',
                  content: `🎯 Fun Facts About Kuan:

• I speak 3 languages fluently: English, French, and Mandarin
• I can code in Python, but I also speak "Python" to actual pythons (kidding! 🐍)
• Currently organizing Montreal's largest student tech pitch competition
• I love exploring new technologies and building cool stuff
• Montreal bagels > New York bagels (fight me!)
• I believe the best code is written with good coffee ☕
• Fun fact: This entire portfolio is a functional terminal!

Try exploring other directories to learn more about me!`,
                  size: 520,
                  modified: new Date()
                },
                'goals.txt': {
                  name: 'goals.txt',
                  type: 'file',
                  content: `🎯 My Goals & Aspirations:

Short-term:
- Complete my internship at Neuropoly with impact
- Successfully host Piñata Pitch 2025
- Graduate with honors
- Build more awesome projects like this portfolio

Long-term:
- Contribute to meaningful AI/ML research
- Start or join an innovative tech company
- Bridge the gap between research and practical applications
- Help other students pursue tech careers

Personal:
- Travel to all 7 continents (3 down, 4 to go!)
- Learn a 4th language (thinking Japanese 🇯🇵)
- Master the art of making perfect Montreal bagels`,
                  size: 645,
                  modified: new Date()
                },
                'quirks.txt': {
                  name: 'quirks.txt',
                  type: 'file',
                  content: `🤪 My Little Quirks:

• I organize my code files like Marie Kondo organizes closets
• I have strong opinions about terminal color schemes (dark mode forever!)
• I can't start coding without the perfect playlist
• I talk to my rubber duck more than I'd like to admit
• I collect vintage programming books (yes, physical books!)
• I have a weird fascination with terminal emulators
• I always use 'ls -la' instead of just 'ls' (old habits)
• I think Unix philosophy is life philosophy

P.S. This terminal portfolio is probably my biggest quirk yet!`,
                  size: 520,
                  modified: new Date()
                },
                'resume.pdf': {
                  name: 'resume.pdf',
                  type: 'file',
                  content: '[Binary PDF file - Download from /WANG_KUANYI.pdf]',
                  size: 2048000,
                  modified: new Date()
                },
                'images': {
                  name: 'images',
                  type: 'directory',
                  children: {
                    'README.txt': {
                      name: 'README.txt',
                      type: 'file',
                      content: `📸 Personal Images Collection

This directory contains some fun images and photos that represent me!

Available files:
- profile.jpg (coming soon!)
- montreal.jpg (my beautiful city)
- coding_setup.jpg (my workspace)
- piñata_pitch_event.jpg (our amazing event)

Note: In a real terminal, you'd use 'file' command to check image types,
but since this is a web terminal, we'll describe them instead! 😊`,
                      size: 420,
                      modified: new Date()
                    }
                  }
                }
              }
            }
          }
        },
        notes_for_kuan: {
          name: 'notes_for_kuan',
          type: 'directory',
          children: {
            'README.txt': {
              name: 'README.txt',
              type: 'file',
              content: `📝 Welcome to notes_for_kuan!

This is where visitors can leave messages for Kuan.

To create a new note:
1. Use 'touch filename.txt' to create a new file
2. Use 'nano filename.txt' to edit the file
3. Write your message (max 100,000 characters)
4. Save and provide your name (email optional)

Your note will be stored and Kuan will see it!

Examples:
  touch hello.txt
  nano hello.txt`,
              size: 420,
              modified: new Date()
            }
          }
        },
        portfolio: {
          name: 'portfolio',
          type: 'directory',
          children: {
            'skills.txt': {
              name: 'skills.txt',
              type: 'file',
              content: `💻 Technical Skills:

Languages: Python, JavaScript, TypeScript, C++, Java
Frameworks: React, Next.js, Node.js, Express
Databases: PostgreSQL, MongoDB, Supabase
Tools: Git, Docker, VS Code, Terminal
AI/ML: Neural Networks, Research at Neuropoly

🌐 Languages:
- English (Native)
- French (Fluent)
- Mandarin (Fluent)`,
              size: 340,
              modified: new Date()
            },
            'inspirations.txt': {
              name: 'inspirations.txt',
              type: 'file',
              content: `💡 What Inspires Me:

Technology & Innovation:
- The potential of AI to solve real-world problems
- Open source communities and collaborative development
- The intersection of research and practical applications

People & Experiences:
- Students who dare to pitch crazy ideas at Piñata Pitch
- Researchers at Neuropoly pushing boundaries
- Montreal's vibrant tech ecosystem
- The terminal hackers who inspired this portfolio!

Philosophy:
"Code is poetry, debugging is detective work, and shipping is art."
- Someone wise (probably me after too much coffee)

Fun fact: This portfolio was inspired by old-school terminals and
my love for command-line interfaces. Who needs fancy UIs? 😎`,
              size: 720,
              modified: new Date()
            },
            'random_thoughts.txt': {
              name: 'random_thoughts.txt',
              type: 'file',
              content: `🧠 Random Thoughts & Musings:

• Why do we call it "debugging" when bugs weren't even computer-related originally?
• The best debugging tool is still console.log() (fight me, debugger users!)
• Montreal winters make you appreciate indoor coding even more
• Terminal UIs are making a comeback and I'm here for it
• AI will change everything, but humans will still write the prompts
• The best code comments explain the "why", not the "what"
• Rubber duck debugging works even with imaginary ducks

Current mood: Building cool stuff and wondering why I chose to
make a portfolio in a terminal (but secretly loving every bit of it)`,
              size: 650,
              modified: new Date()
            },
            'experience.txt': {
              name: 'experience.txt',
              type: 'file',
              content: `🏢 Work Experience:

Current:
- Intern @Neuropoly, Polytechnique Montréal
  Working on neural network research and AI applications

Leadership:
- Host of Piñata Pitch
  Montreal's largest student tech pitch competition
  Organizing events, managing teams, connecting startups

Previous projects and internships available on LinkedIn!`,
              size: 385,
              modified: new Date()
            }
          }
        },
      }
    };
  }

  getCurrentPath(): string {
    return this.currentPath.length === 0 ? '/' : '/' + this.currentPath.join('/');
  }

  getCurrentNode(): FileSystemNode {
    let current = this.root;
    for (const segment of this.currentPath) {
      if (current.children && current.children[segment]) {
        current = current.children[segment];
      } else {
        throw new Error(`Path not found: ${this.getCurrentPath()}`);
      }
    }
    return current;
  }

  listDirectory(path?: string): FileSystemNode[] {
    let targetNode: FileSystemNode;

    if (path) {
      targetNode = this.getNodeByPath(path);
    } else {
      targetNode = this.getCurrentNode();
    }

    if (targetNode.type !== 'directory') {
      throw new Error('Not a directory');
    }

    return Object.values(targetNode.children || {});
  }

  changeDirectory(path: string): string {
    if (path === '/') {
      this.currentPath = [];
      return this.getCurrentPath();
    }

    if (path === '..') {
      if (this.currentPath.length > 0) {
        this.currentPath.pop();
      }
      return this.getCurrentPath();
    }

    if (path === '.') {
      return this.getCurrentPath();
    }

    if (path === '~') {
      this.currentPath = ['home', 'kuan'];
      return this.getCurrentPath();
    }

    // Handle absolute paths
    if (path.startsWith('/')) {
      const segments = path.split('/').filter(s => s.length > 0);
      let current = this.root;

      for (const segment of segments) {
        if (current.children && current.children[segment] && current.children[segment].type === 'directory') {
          current = current.children[segment];
        } else {
          throw new Error(`Directory not found: ${path}`);
        }
      }

      this.currentPath = segments;
      return this.getCurrentPath();
    }

    // Handle relative paths
    const segments = path.split('/').filter(s => s.length > 0);
    const newPath = [...this.currentPath];

    for (const segment of segments) {
      if (segment === '..') {
        if (newPath.length > 0) {
          newPath.pop();
        }
      } else if (segment !== '.') {
        let current = this.root;
        for (const pathSegment of [...newPath, segment]) {
          if (current.children && current.children[pathSegment]) {
            current = current.children[pathSegment];
          } else {
            throw new Error(`Directory not found: ${path}`);
          }
        }

        if (current.type !== 'directory') {
          throw new Error(`Not a directory: ${path}`);
        }

        newPath.push(segment);
      }
    }

    this.currentPath = newPath;
    return this.getCurrentPath();
  }

  readFile(filename: string): string {
    const node = this.getNodeByPath(filename);

    if (node.type !== 'file') {
      throw new Error(`${filename} is not a file`);
    }

    return node.content || '';
  }

  createFile(filename: string, content: string = ''): void {
    const currentNode = this.getCurrentNode();

    if (currentNode.type !== 'directory') {
      throw new Error('Cannot create file: current location is not a directory');
    }

    if (!currentNode.children) {
      currentNode.children = {};
    }

    if (currentNode.children[filename]) {
      throw new Error(`File already exists: ${filename}`);
    }

    currentNode.children[filename] = {
      name: filename,
      type: 'file',
      content,
      size: content.length,
      modified: new Date()
    };
  }

  createDirectory(dirname: string): void {
    const currentNode = this.getCurrentNode();

    if (currentNode.type !== 'directory') {
      throw new Error('Cannot create directory: current location is not a directory');
    }

    if (!currentNode.children) {
      currentNode.children = {};
    }

    if (currentNode.children[dirname]) {
      throw new Error(`Directory already exists: ${dirname}`);
    }

    currentNode.children[dirname] = {
      name: dirname,
      type: 'directory',
      children: {},
      modified: new Date()
    };
  }

  private getNodeByPath(path: string): FileSystemNode {
    if (path.startsWith('/')) {
      // Absolute path
      const segments = path.split('/').filter(s => s.length > 0);
      let current = this.root;

      for (const segment of segments) {
        if (current.children && current.children[segment]) {
          current = current.children[segment];
        } else {
          throw new Error(`Path not found: ${path}`);
        }
      }

      return current;
    } else {
      // Relative path
      const currentNode = this.getCurrentNode();

      if (currentNode.children && currentNode.children[path]) {
        return currentNode.children[path];
      } else {
        throw new Error(`File not found: ${path}`);
      }
    }
  }

  fileExists(filename: string): boolean {
    try {
      this.getNodeByPath(filename);
      return true;
    } catch {
      return false;
    }
  }

  updateFileContent(filename: string, content: string): void {
    const node = this.getNodeByPath(filename);

    if (node.type !== 'file') {
      throw new Error(`${filename} is not a file`);
    }

    node.content = content;
    node.size = content.length;
    node.modified = new Date();
  }
}