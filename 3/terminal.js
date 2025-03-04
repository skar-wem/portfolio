class Terminal {
     constructor() {
         this.terminalWindow = document.getElementById('terminal-window');
         this.terminalInput = document.getElementById('terminal-input');
         this.prompt = 'skar:~$';
         this.commandHistory = [];
         this.historyIndex = -1;
         this.commands = {
             'help': this.showHelp.bind(this),
             'about': this.showAbout.bind(this),
             'projects': this.showProjects.bind(this),
             'contact': this.showContact.bind(this),
             'skills': this.showSkills.bind(this),
             'clear': this.clearTerminal.bind(this),
             'bms': this.openBMS.bind(this),
             'coffee': this.brewCoffee.bind(this),
             'matrix': this.showMatrix.bind(this),
             'date': this.showDate.bind(this),
             'time': this.showTime.bind(this),
             'echo': this.echo.bind(this),
             'whoami': this.whoami.bind(this),
             'ls': this.listCommands.bind(this),
             'dance': this.dance.bind(this)
         };
         
         this.init();
     }
     
     init() {
         // Set up event listeners
         this.terminalInput.addEventListener('keydown', this.handleInput.bind(this));
         document.querySelector('.help-toggle').addEventListener('click', this.toggleHelp);
         
         // Copy command when clicking on help menu commands
         document.querySelectorAll('.help-content code').forEach(cmd => {
             cmd.addEventListener('click', () => {
               const command = cmd.textContent;
               this.terminalInput.value = command;
               this.terminalInput.focus();
           });
       });
       
       // Welcome message
       this.showWelcomeMessage();
       
       // Focus input on page load
       this.terminalInput.focus();
       
       // Focus input when clicking anywhere in terminal
       this.terminalWindow.addEventListener('click', () => {
           this.terminalInput.focus();
       });
       
       // Handle mobile keyboard issues
       window.addEventListener('resize', () => {
           if (document.activeElement === this.terminalInput) {
               setTimeout(() => {
                   this.terminalWindow.scrollTop = this.terminalWindow.scrollHeight;
               }, 100);
           }
       });
   }
   
   handleInput(e) {
       if (e.key === 'Enter') {
           const command = this.terminalInput.value.trim();
           
           if (command) {
               // Add command to history
               this.commandHistory.unshift(command);
               this.historyIndex = -1;
               
               // Display command in terminal
               this.appendCommandLine(command);
               
               // Process command
               this.processCommand(command);
               
               // Clear input
               this.terminalInput.value = '';
           }
       } else if (e.key === 'ArrowUp') {
           e.preventDefault();
           this.navigateHistory(1);
       } else if (e.key === 'ArrowDown') {
           e.preventDefault();
           this.navigateHistory(-1);
       } else if (e.key === 'Tab') {
           e.preventDefault();
           this.autocomplete();
       }
   }
   
   navigateHistory(direction) {
       const newIndex = this.historyIndex + direction;
       
       if (newIndex >= -1 && newIndex < this.commandHistory.length) {
           this.historyIndex = newIndex;
           
           if (this.historyIndex === -1) {
               this.terminalInput.value = '';
           } else {
               this.terminalInput.value = this.commandHistory[this.historyIndex];
               // Move cursor to end of input
               setTimeout(() => {
                   this.terminalInput.selectionStart = this.terminalInput.selectionEnd = this.terminalInput.value.length;
               }, 0);
           }
       }
   }
   
   autocomplete() {
       const input = this.terminalInput.value.trim();
       
       if (!input) return;
       
       const possibleCommands = Object.keys(this.commands).filter(cmd => 
           cmd.startsWith(input)
       );
       
       if (possibleCommands.length === 1) {
           this.terminalInput.value = possibleCommands[0];
       } else if (possibleCommands.length > 1) {
           this.appendOutput(`<div class="terminal-output">
               <p>Possible commands:</p>
               <ul>
                   ${possibleCommands.map(cmd => `<li>${cmd}</li>`).join('')}
               </ul>
           </div>`);
       }
   }
   
   processCommand(command) {
       const [cmd, ...args] = command.split(' ');
       const lowerCmd = cmd.toLowerCase();
       
       if (this.commands[lowerCmd]) {
           this.commands[lowerCmd](args);
       } else {
           this.appendOutput(`<div class="terminal-output error">
               <p>Command not found: ${this.escapeHtml(cmd)}</p>
               <p>Type 'help' to see available commands</p>
           </div>`);
       }
       
       // Scroll to bottom
       this.scrollToBottom();
   }
   
   appendCommandLine(command) {
       const line = document.createElement('div');
       line.className = 'terminal-line';
       line.innerHTML = `
           <span class="terminal-prompt">${this.prompt}</span>
           <span class="terminal-command">${this.escapeHtml(command)}</span>
       `;
       this.terminalWindow.appendChild(line);
   }
   
   appendOutput(html) {
       const output = document.createElement('div');
       output.innerHTML = html;
       this.terminalWindow.appendChild(output);
       this.scrollToBottom();
   }
   
   typeOutput(text, element, speed = 20) {
       return new Promise(resolve => {
           let i = 0;
           element.textContent = '';
           
           const typeInterval = setInterval(() => {
               if (i < text.length) {
                   element.textContent += text.charAt(i);
                   i++;
               } else {
                   clearInterval(typeInterval);
                   resolve();
               }
           }, speed);
       });
   }
   
   async typeWriterEffect(text, parentSelector, speed = 20) {
       const container = document.querySelector(parentSelector);
       if (!container) return;
       
       const element = document.createElement('p');
       element.classList.add('typing-text');
       container.appendChild(element);
       
       await this.typeOutput(text, element, speed);
       element.classList.remove('typing-text');
   }
   
   scrollToBottom() {
       this.terminalWindow.scrollTop = this.terminalWindow.scrollHeight;
   }
   
   clearTerminal() {
       this.terminalWindow.innerHTML = '';
   }
   
   escapeHtml(unsafe) {
       return unsafe
           .replace(/&/g, "&amp;")
           .replace(/</g, "&lt;")
           .replace(/>/g, "&gt;")
           .replace(/"/g, "&quot;")
           .replace(/'/g, "&#039;");
   }
   
   toggleHelp() {
       this.classList.toggle('active');
   }
   
   // Command functions
   showWelcomeMessage() {
       const skarAscii = `
 ███████╗██╗  ██╗ █████╗ ██████╗ 
 ██╔════╝██║ ██╔╝██╔══██╗██╔══██╗
 ███████╗█████╔╝ ███████║██████╔╝
 ╚════██║██╔═██╗ ██╔══██║██╔══██╗
 ███████║██║  ██╗██║  ██║██║  ██║
 ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
       `;
       
       this.appendOutput(`
           <div class="terminal-output">
               <div class="ascii-art">${skarAscii}</div>
               <p>Welcome to SKAR's terminal portfolio!</p>
               <p>Type <span class="success">'help'</span> to see available commands</p>
               <p>Last login: ${new Date().toLocaleString()}</p>
           </div>
       `);
   }
   
   showHelp() {
       this.appendOutput(`
           <div class="terminal-output">
               <h2>Available Commands:</h2>
               <ul>
                   <li><span class="success">help</span> - Show this help message</li>
                   <li><span class="success">about</span> - About me</li>
                   <li><span class="success">projects</span> - View my projects</li>
                   <li><span class="success">contact</span> - Contact information</li>
                   <li><span class="success">skills</span> - My technical skills</li>
                   <li><span class="success">clear</span> - Clear the terminal</li>
                   <li><span class="success">bms</span> - Open BMS project</li>
               </ul>
               <p>Try to discover some hidden commands! 🕵️‍♂️</p>
           </div>
       `);
   }
   
   showAbout() {
       this.appendOutput(`
           <div class="terminal-output">
               <h2>About Me</h2>
               <p>Hello! I'm SKAR, a developer and digital creator.</p>
               <p>I specialize in creating unique digital experiences and pushing the boundaries of web technology.</p>
               <p>My approach combines minimalist aesthetics with innovative interactions to create memorable user experiences.</p>
               <p>When I'm not coding, you'll find me exploring new technologies, experimenting with creative coding, or working on my personal projects.</p>
           </div>
       `);
   }
   
   showProjects() {
       this.appendOutput(`
           <div class="terminal-output">
               <h2>Projects</h2>
               
               <div class="project-card">
                   <h3>BMS Project</h3>
                   <p>An interactive digital experience with advanced features and unique interactions.</p>
                   <div class="project-tags">
                       <span class="project-tag">Web</span>
                       <span class="project-tag">Interactive</span>
                       <span class="project-tag">Creative</span>
                   </div>
                   <p><a href="https://skar.fun/bms/" target="_blank">View Project →</a></p>
               </div>
               
               <div class="project-card">
                   <h3>Terminal Portfolio</h3>
                   <p>This very website - a terminal-inspired portfolio with command-line interface.</p>
                   <div class="project-tags">
                       <span class="project-tag">JavaScript</span>
                       <span class="project-tag">CSS</span>
                       <span class="project-tag">UI/UX</span>
                   </div>
               </div>
               
               <div class="project-card">
                   <h3>Future Project</h3>
                   <p>Something amazing coming soon...</p>
                   <div class="project-tags">
                       <span class="project-tag">Coming Soon</span>
                   </div>
               </div>
           </div>
       `);
   }
   
   showContact() {
       this.appendOutput(`
           <div class="terminal-output">
               <h2>Contact Information</h2>
               <ul>
                   <li>Website: <a href="https://skar.fun" target="_blank">skar.fun</a></li>
                   <li>BMS Project: <a href="https://skar.fun/bms/" target="_blank">skar.fun/bms/</a></li>
                   <li>Email: contact@example.com</li>
                   <li>GitHub: <a href="#" target="_blank">github.com/skar</a></li>
               </ul>
               <p>Feel free to reach out for collaborations or just to say hello!</p>
           </div>
       `);
   }
   
   showSkills() {
       this.appendOutput(`
           <div class="terminal-output">
               <h2>Technical Skills</h2>
               
               <p><span class="success">Languages:</span> JavaScript, HTML, CSS, Python, TypeScript</p>
               <p><span class="success">Frameworks:</span> React, Node.js, Express, Vue.js</p>
               <p><span class="success">Tools:</span> Git, Webpack, Docker, AWS</p>
               <p><span class="success">Design:</span> Figma, Adobe Creative Suite, UI/UX</p>
               <p><span class="success">Other:</span> RESTful APIs, GraphQL, Responsive Design</p>
           </div>
       `);
   }
   
   openBMS() {
       this.appendOutput(`
           <div class="terminal-output">
               <p><span class="loading-indicator"></span> Opening BMS project...</p>
           </div>
       `);
       
       setTimeout(() => {
           window.open('https://skar.fun/bms/', '_blank');
           
           this.appendOutput(`
               <div class="terminal-output success">
                   <p>BMS project opened in a new tab!</p>
               </div>
           `);
       }, 1500);
   }
   
   // Easter egg commands
   brewCoffee() {
       const coffeeAscii = `
      ( (
       ) )
     .........
     |       |]
     \\       /
      \\     /
       \\___/
       `;
       
       this.appendOutput(`
           <div class="terminal-output">
               <p>Brewing coffee... ☕</p>
               <div class="ascii-art">${coffeeAscii}</div>
               <p class="success">Coffee ready! Productivity +100%</p>
           </div>
       `);
   }
   
   async showMatrix() {
       // Clear the terminal first
       this.clearTerminal();
       
       const matrixContainer = document.createElement('div');
       matrixContainer.className = 'terminal-output';
       this.terminalWindow.appendChild(matrixContainer);
       
       // Generate matrix characters
       for (let i = 0; i < 15; i++) {
           const line = document.createElement('div');
           line.className = 'matrix-line';
           let text = '';
           
           for (let j = 0; j < 50; j++) {
               text += String.fromCharCode(33 + Math.floor(Math.random() * 94));
           }
           
           line.textContent = text;
           matrixContainer.appendChild(line);
           
           // Add with delay
           await new Promise(resolve => setTimeout(resolve, 100));
       }
       
       setTimeout(() => {
           this.appendOutput(`
               <div class="terminal-output success">
                   <p>Wake up, SKAR...</p>
                   <p>The Matrix has you...</p>
                   <p>Follow the white rabbit.</p>
               </div>
           `);
           
           setTimeout(() => {
               this.appendCommandLine('clear');
               this.clearTerminal();
               this.showWelcomeMessage();
           }, 3000);
       }, 1500);
   }
   
   showDate() {
       const now = new Date();
       const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
       this.appendOutput(`
           <div class="terminal-output">
               <p>Current date: ${now.toLocaleDateString(undefined, options)}</p>
           </div>
       `);
   }
   
   showTime() {
       const now = new Date();
       this.appendOutput(`
           <div class="terminal-output">
               <p>Current time: ${now.toLocaleTimeString()}</p>
           </div>
       `);
   }
   
   echo(args) {
       if (args.length === 0) {
           this.appendOutput(`
               <div class="terminal-output error">
                   <p>Usage: echo [text]</p>
               </div>
           `);
           return;
       }
       
       const text = args.join(' ');
       this.appendOutput(`
           <div class="terminal-output">
               <p>${this.escapeHtml(text)}</p>
           </div>
       `);
   }
   
   whoami() {
       this.appendOutput(`
           <div class="terminal-output">
               <p>user: visitor</p>
               <p>session: ${Math.random().toString(36).substring(2, 10)}</p>
               <p>permissions: read-only</p>
           </div>
       `);
   }
   
   listCommands() {
       this.appendOutput(`
           <div class="terminal-output">
               <p>Available commands:</p>
               <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 5px;">
                    ${Object.keys(this.commands).map(cmd => 
                        `<span class="success">${cmd}</span>`).join('')}
                </div>
            </div>
        `);
    }
    
    dance() {
        const danceFrames = [
            `\\o/`,
            ` | `,
            `/ \\`,
            `_o_`,
            ` o `,
            `\\o/`
        ];
        
        let frameIndex = 0;
        const danceOutput = document.createElement('div');
        danceOutput.className = 'terminal-output';
        danceOutput.innerHTML = `<div class="ascii-art" id="dance-animation">${danceFrames[0]}</div>`;
        this.terminalWindow.appendChild(danceOutput);
        
        const danceAnimation = document.getElementById('dance-animation');
        
        const danceInterval = setInterval(() => {
            frameIndex = (frameIndex + 1) % danceFrames.length;
            danceAnimation.textContent = danceFrames[frameIndex];
        }, 200);
        
        // Stop after a few seconds
        setTimeout(() => {
            clearInterval(danceInterval);
            danceAnimation.textContent = '\\o/';
            this.appendOutput(`
                <div class="terminal-output success">
                    <p>Dance party over! That was fun!</p>
                </div>
            `);
        }, 5000);
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
});

// Add event listeners for help menu
document.addEventListener('DOMContentLoaded', () => {
    const helpToggle = document.querySelector('.help-toggle');
    const helpContent = document.querySelector('.help-content');
    
    helpToggle.addEventListener('click', () => {
        helpToggle.classList.toggle('active');
    });
    
    // Close help menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!helpToggle.contains(e.target) && !helpContent.contains(e.target)) {
            helpToggle.classList.remove('active');
        }
    });
    
    // Copy command when clicking on a command in help menu
    document.querySelectorAll('.help-content code').forEach(code => {
        code.addEventListener('click', () => {
            const command = code.textContent;
            const terminalInput = document.getElementById('terminal-input');
            terminalInput.value = command;
            terminalInput.focus();
            
            // Visual feedback
            code.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
            setTimeout(() => {
                code.style.backgroundColor = '';
            }, 300);
        });
    });
});

// Add blinking cursor effect
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        #terminal-input {
            position: relative;
        }
        
        #terminal-input::after {
            content: '';
            position: absolute;
            right: -10px;
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
            height: 16px;
            background-color: var(--accent-color);
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Add custom context menu
document.addEventListener('DOMContentLoaded', () => {
    const terminalContainer = document.querySelector('.terminal-container');
    
    terminalContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // Create custom context menu
        const contextMenu = document.createElement('div');
        contextMenu.className = 'terminal-context-menu';
        contextMenu.style.position = 'absolute';
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.backgroundColor = 'var(--terminal-header)';
        contextMenu.style.border = '1px solid var(--terminal-border)';
        contextMenu.style.borderRadius = '4px';
        contextMenu.style.padding = '5px 0';
        contextMenu.style.zIndex = '1000';
        contextMenu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        
        // Add menu items
        const menuItems = [
            { text: 'Copy', command: 'copy' },
            { text: 'Paste', command: 'paste' },
            { text: 'Clear Terminal', command: 'clear' },
            { text: 'Help', command: 'help' }
        ];
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.textContent = item.text;
            menuItem.style.padding = '8px 15px';
            menuItem.style.cursor = 'pointer';
            menuItem.style.fontSize = '14px';
            menuItem.style.transition = 'background-color 0.2s ease';
            
            menuItem.addEventListener('mouseover', () => {
                menuItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            menuItem.addEventListener('mouseout', () => {
                menuItem.style.backgroundColor = '';
            });
            
            menuItem.addEventListener('click', () => {
                if (item.command === 'copy') {
                    const selection = window.getSelection().toString();
                    if (selection) {
                        navigator.clipboard.writeText(selection);
                    }
                } else if (item.command === 'paste') {
                    navigator.clipboard.readText().then(text => {
                        const terminalInput = document.getElementById('terminal-input');
                        terminalInput.value += text;
                        terminalInput.focus();
                    });
                } else {
                    const terminalInput = document.getElementById('terminal-input');
                    terminalInput.value = item.command;
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    });
                    terminalInput.dispatchEvent(enterEvent);
                }
                
                // Remove menu after action
                document.body.removeChild(contextMenu);
            });
            
            contextMenu.appendChild(menuItem);
        });
        
        document.body.appendChild(contextMenu);
        
        // Remove menu when clicking elsewhere
        const removeMenu = (e) => {
            if (!contextMenu.contains(e.target)) {
                if (document.body.contains(contextMenu)) {
                    document.body.removeChild(contextMenu);
                }
                document.removeEventListener('click', removeMenu);
            }
        };
        
        document.addEventListener('click', removeMenu);
    });
});

// Add responsive features
window.addEventListener('resize', () => {
    const terminalWindow = document.getElementById('terminal-window');
    if (terminalWindow) {
        terminalWindow.scrollTop = terminalWindow.scrollHeight;
    }
});

// Add theme toggle
document.addEventListener('DOMContentLoaded', () => {
    // Create theme toggle button
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.style.position = 'fixed';
    themeToggle.style.top = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.width = '30px';
    themeToggle.style.height = '30px';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.backgroundColor = 'var(--terminal-header)';
    themeToggle.style.display = 'flex';
    themeToggle.style.justifyContent = 'center';
    themeToggle.style.alignItems = 'center';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.zIndex = '100';
    themeToggle.style.fontSize = '14px';
    themeToggle.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(themeToggle);
    
    // Define themes
    const themes = {
        dark: {
            '--bg-color': '#0c0c0c',
            '--terminal-bg': '#121212',
            '--text-color': '#f0f0f0',
            '--accent-color': '#00ffff',
            '--success-color': '#33ff33',
            '--error-color': '#ff3366',
            '--prompt-color': '#00ffff',
            '--link-color': '#00ffff',
            '--terminal-header': '#2d2d2d',
            '--terminal-border': '#3a3a3a',
        },
        light: {
            '--bg-color': '#f0f0f0',
            '--terminal-bg': '#ffffff',
            '--text-color': '#121212',
            '--accent-color': '#0066ff',
            '--success-color': '#00aa00',
            '--error-color': '#dd0000',
            '--prompt-color': '#0066ff',
            '--link-color': '#0066ff',
            '--terminal-header': '#e0e0e0',
            '--terminal-border': '#cccccc',
        },
        retro: {
            '--bg-color': '#002b36',
            '--terminal-bg': '#073642',
            '--text-color': '#839496',
            '--accent-color': '#b58900',
            '--success-color': '#859900',
            '--error-color': '#dc322f',
            '--prompt-color': '#b58900',
            '--link-color': '#268bd2',
            '--terminal-header': '#073642',
            '--terminal-border': '#586e75',
        }
    };
    
    // Current theme
    let currentTheme = 'dark';
    
    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        if (currentTheme === 'dark') {
            currentTheme = 'light';
            themeToggle.innerHTML = '☀️';
        } else if (currentTheme === 'light') {
            currentTheme = 'retro';
            themeToggle.innerHTML = '🖥️';
        } else {
            currentTheme = 'dark';
            themeToggle.innerHTML = '🌙';
        }
        
        // Apply theme
        applyTheme(currentTheme);
    });
    
    // Apply theme function
    function applyTheme(theme) {
        const root = document.documentElement;
        
        for (const [property, value] of Object.entries(themes[theme])) {
            root.style.setProperty(property, value);
        }
    }
});