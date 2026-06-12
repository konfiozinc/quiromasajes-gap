/* ═══════════════════════════════════════════
   QUIROMASAJES.GAP — script.js
   ═══════════════════════════════════════════ */

// ── Scroll-triggered fade-up ──────────────
const fadeEls = document.querySelectorAll('.fade-up');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => io.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

// ── Testimonials slider dots ──────────────
const slider   = document.getElementById('test-slider');
const dots     = document.querySelectorAll('.slider-dot');
const cards    = document.querySelectorAll('.testimonial-card');

if (slider && dots.length) {
  const updateDots = () => {
    const idx = Math.round(slider.scrollLeft / slider.offsetWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  };
  slider.addEventListener('scroll', updateDots, { passive: true });
  updateDots();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      slider.scrollTo({ left: i * slider.offsetWidth, behavior: 'smooth' });
    });
  });
}

// ── Nav smooth scroll ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── vCard / Save contact ──────────────────
const saveBtn = document.getElementById('save-contact-btn');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Germán Agudelo – QUIROMASAJES.GAP',
      'ORG:QUIROMASAJES.GAP',
      'TEL;TYPE=CELL:+573213735117',
      'URL:https://www.instagram.com/quiromasajes1986',
      'NOTE:Quiropraxia\\, Quiromasajes y Terapias Complementarias. Servicio a domicilio en Soacha y Bogotá D.C.',
      'END:VCARD'
    ].join('\n');
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'german-quiromasajes.vcf';
    a.click();
    URL.revokeObjectURL(url);
  });
}

// ── FAQ accordion ──
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('open'));
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}

// ── Modal Certificaciones ──────────────
function openModal(el) {
  const title = el.getAttribute('data-title');
  const emoji = el.querySelector('.cert-emoji')?.textContent || '📜';
  const img   = el.querySelector('img');

  document.getElementById('cert-modal-title').textContent = title || '';
  const modalImg = document.getElementById('cert-modal-img');
  document.getElementById('cert-modal-emoji').textContent = emoji;

  if (img) {
    // If real image exists, show it
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = title;
    newImg.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:8px;';
    modalImg.innerHTML = '';
    modalImg.appendChild(newImg);
  } else {
    modalImg.innerHTML = `<span id="cert-modal-emoji" style="font-size:80px;">${emoji}</span>`;
  }

  document.getElementById('cert-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('cert-modal')) closeCertModal();
}
function closeCertModal() {
  document.getElementById('cert-modal').classList.remove('active');
  document.body.style.overflow = '';
}
// Close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertModal(); });

// ── Contador animado (trust block) ─────
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.getAttribute('data-target')) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = prefix + current.toLocaleString('es-CO');
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

// Trigger counters when trust section enters viewport
const trustSection = document.getElementById('trust');
if (trustSection && 'IntersectionObserver' in window) {
  let counted = false;
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !counted) {
        counted = true;
        animateCounters();
        counterObs.unobserve(trustSection);
      }
    });
  }, { threshold: 0.3 });
  counterObs.observe(trustSection);
}
