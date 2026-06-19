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
  crearSliderFinito('vid-slider', 'vid-track', 'vid-dots', 0);
});

// ===== VIDEOS: REPRODUCCIÓN CON IFRAME (CORREGIDO) =====
window.openVid = function(el) {
  var driveId = el.dataset.drive;
  if (!driveId) {
    alert('No se pudo cargar el video. ID no encontrado.');
    return;
  }

  var modalTitle = document.getElementById('vid-modal-title');
  var frameWrap = document.getElementById('vid-frame-wrap');

  // Limpiar el contenedor
  frameWrap.innerHTML = '';

  // Crear el iframe con la URL correcta para móviles
  var iframe = document.createElement('iframe');
  // Usar la URL de vista previa con el parámetro correcto para que funcione en móviles
  iframe.src = 'https://drive.google.com/file/d/' + driveId + '/preview?usp=drivesdk';
  iframe.allow = 'autoplay; fullscreen';
  iframe.allowFullscreen = true;
  iframe.frameborder = '0';
  iframe.loading = 'lazy';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';
  iframe.style.display = 'block';

  // Agregar el iframe al contenedor
  frameWrap.appendChild(iframe);

  var label = el.querySelector('.vid-label') ? el.querySelector('.vid-label').textContent : 'Video';
  modalTitle.textContent = label;

  document.getElementById('vid-modal').classList.add('on');
  document.body.style.overflow = 'hidden';

  clearInterval(window._vidTimer);
};

window.closeVid = function() {
  var frameWrap = document.getElementById('vid-frame-wrap');
  // Limpiar el iframe para detener la reproducción
  frameWrap.innerHTML = '';

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

// ===== BOTÓN QR + COMPARTIR =====
var qrModal = document.getElementById('qr-modal');
var pageUrl = window.location.href.split('#')[0].split('?')[0];

function buildQr() {
  var wrap = document.getElementById('qr-canvas-wrap');
  wrap.innerHTML = '';
  if (typeof QRCode === 'undefined') {
    wrap.innerHTML = '<p style="font-size:13px;color:var(--gris)">No se pudo generar el QR. Verifica tu conexión.</p>';
    return;
  }
  // Genera el QR en alta corrección de error (H) para poder cubrir el centro con el logo
  new QRCode(wrap, {
    text: pageUrl,
    width: 220,
    height: 220,
    colorDark: '#0E3D50',
    colorLight: '#FFFFFF',
    correctLevel: QRCode.CorrectLevel.H
  });

  // Espera a que la librería pinte el <img>/<canvas> y le superpone el logo
  setTimeout(function() {
    var qrImg = wrap.querySelector('img, canvas');
    if (!qrImg) return;

    var size = 220;
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');

    var qrSource = new Image();
    qrSource.crossOrigin = 'anonymous';
    qrSource.onload = function() {
      ctx.drawImage(qrSource, 0, 0, size, size);

      var logo = new Image();
      logo.crossOrigin = 'anonymous';
      logo.onload = function() {
        var logoSize = size * 0.22;
        var pos = (size - logoSize) / 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, logoSize / 2 + 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, logoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logo, pos, pos, logoSize, logoSize);
        ctx.restore();

        wrap.innerHTML = '';
        wrap.appendChild(canvas);
      };
      logo.src = 'assets/icons/logo.webp';
    };
    qrSource.src = qrImg.src || qrImg.toDataURL();
  }, 120);
}

window.closeQr = function() {
  qrModal.classList.remove('on');
  document.body.style.overflow = '';
};

document.getElementById('qr-btn').addEventListener('click', function() {
  buildQr();
  qrModal.classList.add('on');
  document.body.style.overflow = 'hidden';
});

document.getElementById('qr-share-native').addEventListener('click', function() {
  if (navigator.share) {
    navigator.share({
      title: 'QUIROMASAJES.GAP',
      text: 'Quiropraxia y masajes terapéuticos a domicilio en Soacha y Bogotá D.C.',
      url: pageUrl
    }).catch(function() {});
  } else {
    navigator.clipboard.writeText(pageUrl).then(function() {
      var btn = document.getElementById('qr-share-native');
      var original = btn.textContent;
      btn.textContent = '¡Enlace copiado!';
      setTimeout(function() { btn.textContent = original; }, 2000);
    });
  }
});
