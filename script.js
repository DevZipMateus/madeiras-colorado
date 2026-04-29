/* 1. SCROLL PROGRESS */
window.addEventListener('scroll', () => {
  const el = document.getElementById('scrollProgress');
  const max = document.body.scrollHeight - window.innerHeight;
  if (el && max > 0) el.style.width = (window.scrollY / max * 100) + '%';
});

/* 2. HEADER SCROLL */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 60);
});

/* 3. MOBILE MENU */
const menuToggle = document.getElementById('menuToggle');
const navMenu    = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  });
}

/* 4. HERO PARTICLES */
(function () {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: -Math.random() * 0.6 - 0.15,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,194,85,${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init();
  draw();
})();

/* 5. REVEALS (IntersectionObserver) */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* 6. COUNTERS */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target);
  const duration = 2000;
  const step     = target / (duration / 16);
  let current    = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* 7. TYPEWRITER (hero slogan) */
(function () {
  const el = document.querySelector('.hero-slogan');
  if (!el) return;
  const text = 'Força que vem da madeira, confiança que fica.';
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = '“' + text.slice(0, i) + (i < text.length ? '|' : '”');
      i++;
      setTimeout(type, 55);
    }
  }
  setTimeout(type, 900);
})();

/* 8. SPOTLIGHT em cards de produtos */
document.querySelectorAll('.produto-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(26,123,42,0.07), #fff 65%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* 9. RIPPLE em botões */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleAnim { to { width:220px; height:220px; opacity:0; } }`;
document.head.appendChild(rippleStyle);

document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', e => {
    const rect   = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      left:${e.clientX - rect.left}px;
      top:${e.clientY - rect.top}px;
      width:0; height:0;
      background:rgba(255,255,255,0.35);
      border-radius:50%;
      transform:translate(-50%,-50%);
      animation:rippleAnim .6s ease-out forwards;
      pointer-events:none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* 10. FORMULÁRIO — envia via WhatsApp */
const form = document.getElementById('contatoForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nome     = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email    = document.getElementById('email').value.trim();
    const msg      = document.getElementById('mensagem').value.trim();
    const text     = `Olá! Me chamo *${nome}*.\n📞 Telefone: ${telefone}${email ? '\n✉️ E-mail: ' + email : ''}\n\n💬 ${msg}`;
    window.open(`https://wa.me/5547996844967?text=${encodeURIComponent(text)}`, '_blank');
  });
}

/* 11. SMOOTH SCROLL com offset do header */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id     = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = (document.getElementById('header')?.offsetHeight || 76) + 8;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
