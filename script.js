// ===== GUARDAR CONTACTO =====
document.querySelectorAll('#save-btn, #save-btn-bottom').forEach(function(btn) {
  btn.addEventListener('click', function() {
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
});

// ===== SLIDER FINITO =====
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
  crearSliderFinito('vid-slider', 'vid-track', 'vid-dots', 4000);
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

  // Limpiar src previo primero para evitar que quede el video anterior
  videoFrame.src = '';

  // URL de previsualización embebida de Drive (más confiable que el link de descarga)
  var videoUrl = 'https://drive.google.com/file/d/' + driveId + '/preview';
  videoFrame.src = videoUrl;

  var label = el.querySelector('.vid-label') ? el.querySelector('.vid-label').textContent : 'Video';
  modalTitle.textContent = label;

  // Mostrar modal
  document.getElementById('vid-modal').classList.add('on');
  document.body.style.overflow = 'hidden';

  // Pausar slider
  clearInterval(window._vidTimer);
};

window.closeVid = function() {
  var videoFrame = document.getElementById('vid-player');
  videoFrame.src = '';

  document.getElementById('vid-modal').classList.remove('on');
  document.body.style.overflow = '';

  // Reactivar slider
  var slider = document.getElementById('vid-slider');
  if (slider) {
    var dots = document.querySelectorAll('#vid-dots span');
    var total = dots.length;
    var current = 0;
    dots.forEach(function(d, i) {
      if (d.classList.contains('active')) current = i;
    });
    if (current < total - 1) {
      clearInterval(window._vidTimer);
      window._vidTimer = setInterval(function() {
        var newIndex = current + 1;
        if (newIndex >= total) {
          clearInterval(window._vidTimer);
          return;
        }
        var track = document.getElementById('vid-track');
        track.style.transform = 'translateX(-' + (newIndex * 100) + '%)';
        dots.forEach(function(d, i) {
          d.classList.toggle('active', i === newIndex);
        });
        current = newIndex;
      }, 4000);
    }
  }
};

// Cerrar modales con Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeVid();
    closeCert();
  }
});

// ===== CERTIFICADOS: MODAL =====
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
  certModal.classList.remove('on');
  document.body.style.overflow = '';
};

// ===== BOTÓN QR =====
document.getElementById('qr-btn').addEventListener('click', function(e) {
  e.preventDefault();
  alert('Código QR de la tarjeta digital Quiromasajes GAP');
});
// ===== EFECTO DE APARICIÓN AL HACER SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
  var secciones = document.querySelectorAll('.sec');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    secciones.forEach(function(sec) { observer.observe(sec); });
  } else {
    secciones.forEach(function(sec) { sec.classList.add('in-view'); });
  }
});
