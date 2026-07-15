// CURSOR
const cursor = document.getElementById('cursor');
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
document.querySelectorAll('a,button,.project-card,.skill-card,.contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});
function animCursor() {
  curX += (mouseX - curX) * 0.15;
  curY += (mouseY - curY) * 0.15;
  cursor.style.left = curX + 'px';
  cursor.style.top = curY + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();
 
// SCROLL PROGRESS
const prog = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  prog.style.width = (p * 100) + '%';
});
 
// THEME TOGGLE
const themeBtn = document.getElementById('themeToggle');
let dark = true;
themeBtn.addEventListener('click', () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeBtn.textContent = dark ? '☀️' : '🌙';
});
 
// SCROLL REVEAL
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Animate skill bars
      e.target.querySelectorAll('.skill-card').forEach(c => c.classList.add('visible'));
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
 
// Skill card observer
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(c => skillObserver.observe(c));
 
// COUNTER ANIMATION
function animateCount(el) {
  const target = parseInt(el.dataset.count);
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current >= 1000 ? Math.round(current).toLocaleString() + '+' : Math.round(current) + (target > 10 ? '+' : '');
    if (current >= target) clearInterval(timer);
  }, 16);
}
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));
 
// SKILL TABS
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.skill-panel').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });
    const panel = document.getElementById('panel-' + tab);
    panel.style.display = 'grid';
    panel.classList.add('active');
    // Animate skill bars
    setTimeout(() => {
      panel.querySelectorAll('.skill-card').forEach(c => c.classList.add('visible'));
    }, 100);
  });
});
// Init first panel bars
setTimeout(() => {
  document.querySelectorAll('#panel-aiml .skill-card').forEach(c => c.classList.add('visible'));
}, 800);
 
// TERMINAL ANIMATION
const termLines = [
  { type: 'cmd', text: 'python train.py --model llm --epochs 10' },
  { type: 'out', text: '🔥 Loading Llama-3.1-8B with QLoRA...' },
  { type: 'out', text: '✅ Tokenizer ready. Dataset: 50K samples' },
  { type: 'out', text: '📊 Epoch 1/10 — Loss: 2.341 — GPU: 24GB' },
  { type: 'cmd', text: 'python rag_pipeline.py --query "What is RAG?"' },
  { type: 'out', text: '🔍 Retrieving from Pinecone (k=5)...' },
  { type: 'out', text: '⚡ Reranking with cross-encoder...' },
  { type: 'out', text: '🤖 Answer: RAG combines retrieval + generation' },
  { type: 'out', text: '⏱  Latency: 145ms | Tokens: 312 | Cost: $0.001' },
  { type: 'cmd', text: 'python evaluate.py --metric accuracy' },
  { type: 'out', text: '✅ Accuracy: 94.2% | F1: 0.937 | BLEU: 0.81' },
];
const termBody = document.getElementById('terminalBody');
termBody.innerHTML = '';
let lineIdx = 0;
function addTermLine() {
  if (lineIdx >= termLines.length) { lineIdx = 0; termBody.innerHTML = ''; }
  const l = termLines[lineIdx++];
  const div = document.createElement('div');
  if (l.type === 'cmd') {
    div.className = 't-line';
    div.innerHTML = `<span class="t-prompt">❯</span><span class="t-cmd"> ${l.text}</span>`;
  } else {
    div.innerHTML = `<span class="t-out">${l.text}</span>`;
  }
  termBody.appendChild(div);
  termBody.scrollTop = termBody.scrollHeight;
  const delay = l.type === 'cmd' ? 800 : 400;
  setTimeout(addTermLine, delay);
}
setTimeout(addTermLine, 1000);
 
// PARTICLE CANVAS
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
 
function Particle() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.vx = (Math.random() - 0.5) * 0.4;
  this.vy = (Math.random() - 0.5) * 0.4;
  this.size = Math.random() * 1.5 + 0.5;
  this.opacity = Math.random() * 0.4 + 0.1;
}
 
for (let i = 0; i < 80; i++) particles.push(new Particle());
 
let mouseP = { x: -1000, y: -1000 };
document.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseP.x = e.clientX - rect.left;
  mouseP.y = e.clientY - rect.top;
});
 
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const baseColor = isDark ? '99,102,241' : '79,70,229';
 
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
 
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${baseColor},${p.opacity})`;
    ctx.fill();
 
    // Connect nearby particles
    particles.forEach(p2 => {
      const dx = p.x - p2.x, dy = p.y - p2.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${baseColor},${0.08 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
 
    // React to mouse
    const dx = p.x - mouseP.x, dy = p.y - mouseP.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 120) {
      p.x += (dx/dist) * 1.5;
      p.y += (dy/dist) * 1.5;
    }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();
 
// HEATMAP
const heatmap = document.getElementById('heatmap');
const levels = [0,0,0,1,1,2,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,0,0,1,2,2,3,4,4,3,2,2,1,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,3,2,1,0,0,0,1,2,3,4,4,3,2,1,0,1,2,3,4,3,2,1,1,0,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,1,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,1,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,0,0,1,2,3,4,3,2,1,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,1,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,3,2,1,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,1,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,3,2,1,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,1,2,3,4,3,2,1,0,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,3,2,1,0,1,2,3,4,4,3,2,1,0,0,1,2,3,4,3,2,1,0,0,1,2,3,4];
levels.slice(0,364).forEach(l => {
  const cell = document.createElement('div');
  cell.className = 'hm-cell' + (l > 0 ? ' hm-' + l : '');
  cell.title = l > 0 ? `${l * 3} contributions` : 'No contributions';
  heatmap.appendChild(cell);
});
 
// SMOOTH NAV
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
 