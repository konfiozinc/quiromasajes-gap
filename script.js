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

// ===== TABS =====
var tabs = document.querySelectorAll('.tab');
var panels = document.querySelectorAll('.panel');

tabs.forEach(function(tab) {
  tab.addEventListener('click', function() {
    var target = this.dataset.tab;
    tabs.forEach(function(t) { t.classList.remove('active'); });
    this.classList.add('active');
    panels.forEach(function(p) {
      p.classList.toggle('active', p.dataset.panel === target);
    });
  });
});

// ===== VIDEOS: ABRIR MODAL =====
var vidPlayer = document.getElementById('vid-player');
var vidModal = document.getElementById('vid-modal');
var vidTitle = document.getElementById('vid-modal-title');

window.openVid = function(el) {
  var driveId = el.dataset.drive;
  if (!driveId) return;
  var url = 'https://drive.google.com/file/d/' + driveId + '/preview';
  vidPlayer.src = url;
  var label = el.querySelector('.vid-label') ? el.querySelector('.vid-label').textContent : 'Video';
  vidTitle.textContent = label;
  vidModal.classList.add('on');
  document.body.style.overflow = 'hidden';
};

window.closeVid = function() {
  vidPlayer.src = '';
  vidModal.classList.remove('on');
  document.body.style.overflow = '';
};

// ===== QR =====
var qrModal = document.getElementById('qr-modal');
var qrImage = document.getElementById('qr-image');

document.getElementById('qr-btn').addEventListener('click', function() {
  var url = encodeURIComponent(window.location.href);
  var logoUrl = encodeURIComponent('https://konfiozinc.github.io/quiromasajes-gap/assets/icons/logo.webp');
  var qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + url + '&logo=' + logoUrl;
  qrImage.src = qrApiUrl;
  qrModal.classList.add('on');
  document.body.style.overflow = 'hidden';
});

window.closeQR = function() {
  qrModal.classList.remove('on');
  document.body.style.overflow = '';
};

// ===== CERTIFICADOS =====
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

// ===== CERRAR CON ESC =====
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeVid();
    closeCert();
    closeQR();
  }
});
