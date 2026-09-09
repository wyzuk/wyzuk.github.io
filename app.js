   WYZUK PORTFOLIO - HYPRLAND INTERACTIVE ENGINE

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingAnimation();
  initTerminalSimulator();
  initWaybarNavigation();
  initGitHubProfileFetch();
  initSystemUptimeTicker();
  initKeybindingsModal();
  initTabsAndSimulators();
  initShaderAndThemeToggle();
  initScrollAnimations();
});

   1. PARTICLES & ATMOSPHERIC CANVAS
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const particleCount = 40;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '#38bdf8' : '#818cf8';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#38bdf8';
          ctx.globalAlpha = (1 - dist / 120) * 0.15;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

   2. HERO TYPING SUBTITLE ANIMATION
function initTypingAnimation() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    "Arch Linux Kernel & Hyprland OS Architect",
    "Founder & Lead Designer @ amzad_studio",
    "Python Discord Bot & Automation Specialist",
    "Creator of yumemiro-os desktop distro"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeLoop() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 40;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      typeSpeed = 2200; // Hold at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(typeLoop, typeSpeed);
  }
  typeLoop();
}

   3. HYPRLAND INTERACTIVE TERMINAL SIMULATOR
function initTerminalSimulator() {
  const termBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');
  if (!termBody || !termInput) return;

  const commands = {
    help: `Available Hyprland terminal commands:
  • neofetch         : Display system info & specs
  • skills           : List core technical competencies
  • projects         : Overview of flagship creations
  • theme [preset]   : Switch UI theme (default, cyberpunk, twilight, emerald)
  • cat dotfiles     : Print hyprland.conf preview
  • sudo pacman -Syu: Perform simulated Arch Linux system update
  • clear            : Clear terminal output`,
    
    skills: `[SYSTEM SKILLS SUMMARY]
1. OS Customization : Arch Linux, Hyprland Compositor, Wayland Protocols, Eww/Waybar, SwayNC
2. Backend & Bots   : Python 3.12, Discord.py, AsyncIO, REST APIs, SQLite, Webhooks
3. UI/UX Design     : amzad_studio, Glassmorphism UI Systems, Vector Graphics, Figma`,
    
    projects: `[FEATURED REPOSITORIES]
• yumemiro-os  : Aesthetic Arch Linux desktop distribution based on Hyprland [★ 142]
• discord-bot  : High-performance async server management & automation bot framework [★ 89]
• amzad-themes : Curated Hyprland color schemes & window animation physics configs [★ 64]`,

    'cat dotfiles': `# Hyprland Window Compositor Config (~/.config/hypr/hyprland.conf)
monitor=,preferred,auto,1
general {
    gaps_in = 6
    gaps_out = 14
    border_size = 2
    col.active_border = rgba(38bdf8ff) rgba(818cf8ff) 45deg
    col.inactive_border = rgba(070b14aa)
    layout = dwindle
}
decoration {
    rounding = 12
    blur {
        enabled = true
        size = 8
        passes = 3
        new_optimizations = true
    }
}`
  };

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const inputVal = termInput.value.trim();
      termInput.value = '';
      if (!inputVal) return;

      appendTermLine(`wyzuk@yumemiro-os:~$ ${inputVal}`, 'term-prompt-line');
      processCommand(inputVal);
    }
  });

  function appendTermLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = `<span class="term-output">${escapeHtml(text)}</span>`;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function processCommand(cmdStr) {
    const lower = cmdStr.toLowerCase();
    
    if (lower === 'clear') {
      termBody.innerHTML = '';
      return;
    }

    if (lower === 'neofetch') {
      const neofetchEl = document.createElement('div');
      neofetchEl.className = 'term-line';
      neofetchEl.innerHTML = `
        <div class="term-output neofetch-output">
          <div class="arch-ascii">
       /\\
      /  \\
     / /\\ \\
    / /  \\ \\
   / /    \\ \\
  / /_/\\_\\ \\ \\
 /__________\\ \\
 \\____________\\
          </div>
          <div class="neofetch-info">
            <span><strong>OS:</strong> Arch Linux x86_64</span>
            <span><strong>Host:</strong> Wyzuk Desktop Custom</span>
            <span><strong>Kernel:</strong> 6.10.4-arch1-1</span>
            <span><strong>Uptime:</strong> 42 days, 13 hours</span>
            <span><strong>WM:</strong> Hyprland (Wayland)</span>
            <span><strong>Theme:</strong> yumemiro-os (Blue-Hour Glass)</span>
            <span><strong>Terminal:</strong> kitty v0.35.2</span>
            <span><strong>CPU:</strong> AMD Ryzen 9 7900X (24) @ 5.6GHz</span>
            <span><strong>Memory:</strong> 4.2 GiB / 32 GiB (13%)</span>
          </div>
        </div>
      `;
      termBody.appendChild(neofetchEl);
      termBody.scrollTop = termBody.scrollHeight;
      return;
    }

    if (lower.startsWith('theme ')) {
      const themeName = lower.split(' ')[1];
      if (['default', 'cyberpunk', 'twilight', 'emerald'].includes(themeName)) {
        document.body.setAttribute('data-theme', themeName);
        appendTermLine(`[SUCCESS] UI theme set to: ${themeName}`);
      } else {
        appendTermLine(`[ERROR] Unknown theme: ${themeName}. Choose: default, cyberpunk, twilight, emerald`);
      }
      return;
    }

    if (lower === 'sudo pacman -syu') {
      appendTermLine(':: Synchronizing package databases...');
      appendTermLine(':: Starting full system upgrade...');
      appendTermLine('resolving dependencies...');
      appendTermLine('Packages (3): hyprland-git-0.42.0  python-discord.py-2.4.0  yumemiro-dots-1.0');
      appendTermLine('Total Download Size:   48.2 MiB');
      appendTermLine('Total Installed Size: 184.6 MiB');
      appendTermLine('[====================================] 100% System up to date!');
      return;
    }

    if (commands[cmdStr]) {
      appendTermLine(commands[cmdStr]);
    } else {
      appendTermLine(`bash: command not found: ${cmdStr}. Type 'help' for commands.`);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

   4. WAYBAR WORKSPACE NAVIGATION & SCROLL TRACKER
function initWaybarNavigation() {
  const waybar = document.getElementById('waybar');
  const wsBtns = document.querySelectorAll('.ws-btn');
  const sections = [
    document.getElementById('hero'),
    document.getElementById('yumemiro'),
    document.getElementById('tech-stack'),
    document.getElementById('showcase'),
    document.getElementById('footer')
  ];

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      waybar.classList.add('scrolled');
    } else {
      waybar.classList.remove('scrolled');
    }

    let currentIdx = 0;
    const scrollPos = window.scrollY + 200;

    sections.forEach((sec, idx) => {
      if (sec && scrollPos >= sec.offsetTop) {
        currentIdx = idx;
      }
    });

    wsBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentIdx);
    });
  });

  wsBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

   5. LIVE GITHUB PROFILE API FETCHING WITH DYNAMIC FALLBACK
function initGitHubProfileFetch() {
  const avatarImg = document.getElementById('github-avatar');
  const repoCountEl = document.getElementById('github-repos-count');
  const followersCountEl = document.getElementById('github-followers-count');

  if (avatarImg && !avatarImg.src) {
    avatarImg.src = 'https://github.com/wyzuk.png';
  }

  fetch('https://api.github.com/users/wyzuk')
    .then(res => {
      if (!res.ok) throw new Error('API Rate limit or user not found');
      return res.json();
    })
    .then(data => {
      if (data.avatar_url && avatarImg) {
        avatarImg.src = data.avatar_url;
      }
      if (data.public_repos !== undefined && repoCountEl) {
        repoCountEl.textContent = data.public_repos;
      }
      if (data.followers !== undefined && followersCountEl) {
        followersCountEl.textContent = data.followers;
      }
    })
    .catch(err => {
      console.log('GitHub API fetch fallback engaged:', err);
      if (repoCountEl) repoCountEl.textContent = '14';
      if (followersCountEl) followersCountEl.textContent = '48';
    });
}

   6. LIVE SYSTEM UPTIME & MONITOR TICKER
function initSystemUptimeTicker() {
  const uptimeEl = document.getElementById('uptime-counter');
  const waybarTimeEl = document.getElementById('waybar-time');
  const waybarCpuEl = document.getElementById('waybar-cpu');
  const waybarRamEl = document.getElementById('waybar-ram');

  let secondsUptime = 3662224; // Simulated baseline

  setInterval(() => {
    secondsUptime++;
    const days = Math.floor(secondsUptime / (3600 * 24));
    const hours = Math.floor((secondsUptime % (3600 * 24)) / 3600);
    const mins = Math.floor((secondsUptime % 3600) / 60);
    const secs = secondsUptime % 60;

    if (uptimeEl) {
      uptimeEl.textContent = `${days}d ${hours}h ${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (waybarTimeEl) waybarTimeEl.textContent = timeStr;

    if (waybarCpuEl && Math.random() > 0.6) {
      const cpu = (Math.random() * 3 + 1.2).toFixed(1);
      waybarCpuEl.textContent = `${cpu}%`;
    }
    if (waybarRamEl && Math.random() > 0.7) {
      const ram = (Math.random() * 0.08 + 0.42).toFixed(2);
      waybarRamEl.textContent = `${ram} GiB`;
    }
  }, 1000);
}

   7. KEYBINDINGS CHEAT SHEET MODAL
function initKeybindingsModal() {
  const modal = document.getElementById('keybindings-modal');
  const triggerBtn = document.getElementById('open-kbd-btn');
  const closeBtn = document.getElementById('close-kbd-btn');

  if (!modal || !triggerBtn || !closeBtn) return;

  triggerBtn.addEventListener('click', () => {
    modal.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

   8. TABS & SIMULATOR CONTROLS
function initTabsAndSimulators() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content-block');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.style.display = 'block';
    });
  });

  const botCmdBtns = document.querySelectorAll('.bot-cmd-pill');
  const botResponseTitle = document.getElementById('bot-response-title');
  const botResponseDesc = document.getElementById('bot-response-desc');

  const botResponses = {
    music: {
      title: "🎵 Playing: Lofi Chill (Blue Hour Mix)",
      desc: "Requested by @wyzuk | Bitrate: 320kbps | Equalizer: Hypr-Bass Boosted | Duration: 3:45 / 42:00"
    },
    auto: {
      title: "🛡️ Server Defense Status: SECURE",
      desc: "Anti-Spam Active | Auto-Raid Mitigation Enabled | 0 Suspicious Accounts Detected in last 24h"
    },
    stats: {
      title: "📊 Server Analytics Summary",
      desc: "Active Members: 1,420 | Messages Today: 18,940 | Voice Channels: 12 Active | Bot Uptime: 99.98%"
    }
  };

  botCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmdKey = btn.getAttribute('data-cmd');
      botCmdBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (botResponses[cmdKey] && botResponseTitle && botResponseDesc) {
        botResponseTitle.textContent = botResponses[cmdKey].title;
        botResponseDesc.textContent = botResponses[cmdKey].desc;
      }
    });
  });
}

   9. THEME & SHADER PRESET TOGGLER
function initShaderAndThemeToggle() {
  const shaderBtn = document.getElementById('shader-btn');
  const themes = ['default', 'cyberpunk', 'twilight', 'emerald'];
  let currentIdx = 0;

  if (shaderBtn) {
    shaderBtn.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % themes.length;
      const nextTheme = themes[currentIdx];
      document.body.setAttribute('data-theme', nextTheme);

      shaderBtn.style.color = '#38bdf8';
      setTimeout(() => {
        shaderBtn.style.color = '';
      }, 500);
    });
  }
}

   10. INTERSECTION OBSERVER SCROLL REVEAL ANIMATIONS
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.tech-card, .showcase-panel, .flagship-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
