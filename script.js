// ===== GUARDAR CONTACTO =====
document.getElementById('save-btn').addEventListener('click', function() {
  var vcard =
    'BEGIN:VCARD\n' +
    'VERSION:3.0\n' +
    'FN:Germán Agudelo – QUIROMASAJES.GAP\n' +
    'ORG:QUIROMASAJES.GAP\n' +
    'TEL;TYPE=CELL:+573213735117\n' +
    'URL:https://www.instagram.com/quiromasajes1986\n' +
    'NOTE:Quiropraxia, Masajes. Soacha y Bogotá D.C.\n' +
    'END:VCARD';
  var blob = new Blob([vcard], { type: 'text/vcard' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'german-quiromasajes.vcf';
  a.click();
  URL.revokeObjectURL(a.href);
});

// ===== MODALES GENÉRICOS DE LA TARJETA (servicios, casos, videos, certs, promo, cobertura, qr) =====
var qModalMap = {
  'btn-servicios': 'modal-servicios',
  'btn-casos': 'modal-casos',
  'btn-videos': 'modal-videos',
  'btn-certs': 'modal-certs',
  'btn-promo': 'modal-promo',
  'btn-cobertura': 'modal-cobertura',
  'qr-btn': 'modal-qr'
};

function openQModal(modalId) {
  var modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('on');
  document.body.style.overflow = 'hidden';
  if (modalId === 'modal-qr') generarQR();
}

function closeQModal(modal) {
  modal.classList.remove('on');
  document.body.style.overflow = '';
}

Object.keys(qModalMap).forEach(function(btnId) {
  var btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', function() {
    openQModal(qModalMap[btnId]);
  });
});

document.querySelectorAll('.q-modal-overlay').forEach(function(overlay) {
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeQModal(overlay);
  });
  var closeBtn = overlay.querySelector('.q-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() { closeQModal(overlay); });
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.q-modal-overlay.on').forEach(function(overlay) {
      closeQModal(overlay);
    });
    closeVid();
    closeCert();
  }
});

// ===== CÓDIGO QR =====
function generarQR() {
  var container = document.getElementById('qrcode-container');
  if (!container || container.dataset.done) return;
  if (typeof QRCode === 'undefined') return;
  container.innerHTML = '';
  new QRCode(container, {
    text: 'https://konfiozinc.github.io/quiromasajes-gap/',
    width: 180,
    height: 180,
    colorDark: '#071A2E',
    colorLight: '#ffffff'
  });
  container.dataset.done = '1';
}

var nativeShareBtn = document.getElementById('native-share-btn');
if (nativeShareBtn) {
  if (navigator.share) {
    nativeShareBtn.addEventListener('click', function() {
      navigator.share({
        title: 'Quiromasajes GAP · Germán Agudelo',
        text: 'Quiropraxia y masajes terapéuticos a domicilio en Soacha y Bogotá D.C.',
        url: 'https://konfiozinc.github.io/quiromasajes-gap/'
      }).catch(function() {});
    });
  } else {
    nativeShareBtn.addEventListener('click', function() {
      navigator.clipboard.writeText('https://konfiozinc.github.io/quiromasajes-gap/').then(function() {
        nativeShareBtn.innerHTML = '<i class="fas fa-check"></i> Link copiado';
      });
    });
  }
}

// ===== SLIDER FINITO (casos / videos) =====
function crearSliderFinito(containerId, trackId, dotId, autoTime) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var track = document.getElementById(trackId);
  if (!track) return;
  var slides = track.querySelectorAll('.vid-slide, .casos-slide');
  if (slides.length === 0) return;
  var total = slides.length;
  var index = 0;
  var timer;

  var dotsContainer = document.getElementById(dotId);
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.dataset.index = i;
      dot.addEventListener('click', function() {
        goTo(parseInt(this.dataset.index));
        resetAuto();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(i) {
    if (i < 0) i = 0;
    if (i >= total) i = total - 1;
    index = i;
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    var dots = dotsContainer.querySelectorAll('span');
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === index);
    });
  }

  function move(dir) {
    var nuevoIndex = index + dir;
    if (nuevoIndex < 0 || nuevoIndex >= total) return;
    goTo(nuevoIndex);
    resetAuto();
  }

  function resetAuto() {
    clearInterval(timer);
    if (autoTime > 0) {
      timer = setInterval(function() {
        var nuevoIndex = index + 1;
        if (nuevoIndex >= total) {
          clearInterval(timer);
          return;
        }
        goTo(nuevoIndex);
      }, autoTime);
    }
  }

  var moveFnName = containerId === 'casos-slider' ? 'moveCasos' : 'moveVid';
  window[moveFnName] = move;

  var startX = 0;
  container.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    clearInterval(timer);
  }, { passive: true });
  container.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      move(dx < 0 ? 1 : -1);
    } else {
      resetAuto();
    }
  }, { passive: true });

  resetAuto();
}

document.addEventListener('DOMContentLoaded', function() {
  crearSliderFinito('casos-slider', 'casos-track', 'casos-dots', 5000);
  // Auto-play del slider de videos DESACTIVADO: causaba que se abriera un video
  // distinto al señalado, por desincronización de posición (bug ya diagnosticado
  // en sesiones anteriores del proyecto).
  crearSliderFinito('vid-slider', 'vid-track', 'vid-dots', 0);
});

// ===== VIDEOS: REPRODUCCIÓN CON IFRAME DE GOOGLE DRIVE =====
window.openVid = function(el) {
  var driveId = el.dataset.drive;
  if (!driveId) {
    alert('No se pudo cargar el video. ID no encontrado.');
    return;
  }

  var videoFrame = document.getElementById('vid-player');
  var modalTitle = document.getElementById('vid-modal-title');

  videoFrame.src = '';
  var videoUrl = 'https://drive.google.com/file/d/' + driveId + '/preview';
  videoFrame.src = videoUrl;

  var label = el.querySelector('.vid-label') ? el.querySelector('.vid-label').textContent : 'Video';
  modalTitle.textContent = label;

  document.getElementById('vid-modal').classList.add('on');
  document.body.style.overflow = 'hidden';
  clearInterval(window._vidTimer);
};

window.closeVid = function() {
  var videoFrame = document.getElementById('vid-player');
  if (!videoFrame) return;
  videoFrame.src = '';
  document.getElementById('vid-modal').classList.remove('on');
  document.body.style.overflow = '';
};

// ===== CERTIFICADOS: MODAL DE IMAGEN AMPLIADA =====
var certModal = document.getElementById('cert-modal');
var certImg = document.getElementById('cert-img');
var certTitle = document.getElementById('cert-title');

window.openCert = function(el) {
  var img = el.querySelector('img');
  var title = el.dataset.title || 'Certificado';
  certImg.innerHTML = '<img src="' + img.src + '" alt="' + title + '" />';
  certTitle.textContent = title;
  certModal.classList.add('on');
  document.body.style.overflow = 'hidden';
};

window.closeCert = function() {
  if (!certModal) return;
  certModal.classList.remove('on');
  document.body.style.overflow = '';
};

// ===== PARTÍCULAS DE FONDO (paleta de marca, no interfieren con la tarjeta) =====
(function() {
  var canvas = document.getElementById('q-particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var colors = ['rgba(0,208,132,0.55)', 'rgba(26,95,122,0.5)', 'rgba(179,38,30,0.4)', 'rgba(255,255,255,0.25)'];
  var particles = [];
  var W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  var count = Math.min(60, Math.floor((W * H) / 22000));
  for (var i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.6,
      vy: -(Math.random() * 0.35 + 0.08),
      vx: (Math.random() - 0.5) * 0.15,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
})();
