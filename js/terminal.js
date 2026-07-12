/* A tiny fake terminal — mostly for fun, partly to show off some JS. */
function initTerminal() {
  const toggle = document.getElementById('terminalToggle');
  const panel = document.getElementById('terminalPanel');
  const closeBtn = document.getElementById('terminalClose');
  const body = document.getElementById('terminalBody');
  const input = document.getElementById('terminalInput');
  if (!toggle || !panel) return;

  function open() {
    panel.classList.add('open');
    setTimeout(() => input.focus(), 150);
  }
  function close() {
    panel.classList.remove('open');
  }

  toggle.addEventListener('click', () => {
    panel.classList.contains('open') ? close() : open();
  });
  closeBtn?.addEventListener('click', close);

  function print(html) {
    const p = document.createElement('p');
    p.innerHTML = html;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      close();
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  }

  const HELP = [
    'help', 'whoami', 'about', 'skills', 'projects', 'writing',
    'contact', 'resume', 'sudo hire savannah', 'konami', 'clear'
  ];

  function run(raw) {
    const command = raw.trim();
    if (!command) return;
    print(`<span class="t-echo">savannah@portfolio:~$ ${escapeHtml(command)}</span>`);

    const lower = command.toLowerCase();

    if (lower === 'clear') {
      body.innerHTML = '';
      return;
    }
    if (lower === 'help') {
      print(`Available commands:<br>${HELP.map((c) => `<span class="t-cmd">${c}</span>`).join(', ')}`);
      return;
    }
    if (lower === 'whoami') {
      print("savannah-soto — CE/EE student, professional debugger of breadboards <em>and</em> code.");
      return;
    }
    if (lower === 'about') {
      print('Computer & Electrical Engineering student who lives where hardware meets software. Scrolling you up there now...');
      scrollToSection('about');
      return;
    }
    if (lower === 'skills') {
      print('Python · C/C++ · Verilog · MATLAB · JavaScript · React · FPGA · KiCad · Oscilloscopes. Full list below ↓');
      scrollToSection('skills');
      return;
    }
    if (lower === 'projects') {
      print('Loading portfolio... jk, just scrolling you there.');
      scrollToSection('projects');
      return;
    }
    if (lower === 'writing' || lower === 'writings') {
      print('Taking you to the written works section.');
      scrollToSection('writing');
      return;
    }
    if (lower === 'contact') {
      print('Scrolling to contact — or just email me directly.');
      scrollToSection('contact');
      return;
    }
    if (lower === 'resume') {
      print('Downloading resume.pdf ...');
      document.querySelector('.resume-cta a')?.click();
      return;
    }
    if (lower === 'ls') {
      print('resume.pdf&nbsp;&nbsp;projects/&nbsp;&nbsp;writing/&nbsp;&nbsp;coffee.exe&nbsp;&nbsp;secrets.txt');
      return;
    }
    if (lower === 'konami') {
      print('Try the classic cheat code with your arrow keys: up up down down left right left right B A. You might like what happens.');
      return;
    }
    if (lower === 'sudo hire savannah') {
      print('[sudo] password for recruiter: ******** — access granted.<br>Initializing offer letter...');
      if (window.confettiBurst) window.confettiBurst();
      return;
    }
    print(`bash: command not found: ${escapeHtml(command)} — try <span class="t-cmd">help</span>`);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      run(input.value);
      input.value = '';
    }
  });
}
