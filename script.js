// Fade-up on scroll
(function(){
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.fu').forEach(function(e){e.classList.add('in')});return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.fu').forEach(function(e){io.observe(e);});
})();

// Animated counters
function runCounters(){
  document.querySelectorAll('.counter').forEach(function(el){
    var target=parseInt(el.dataset.target)||0,prefix=el.dataset.prefix||'';
    var step=Math.ceil(target/110),cur=0;
    var t=setInterval(function(){
      cur=Math.min(cur+step,target);
      el.textContent=prefix+cur.toLocaleString('es-CO');
      if(cur>=target)clearInterval(t);
    },16);
  });
}
var heroObs=new IntersectionObserver(function(e){
  if(e[0].isIntersecting){runCounters();heroObs.disconnect();}
},{threshold:0.3});
heroObs.observe(document.getElementById('hero'));

// Auto-sliding carousels
function autoSlide(id,w,ms){
  var track=document.getElementById(id);
  if(!track)return;
  var orig=track.children.length;
  Array.from(track.children).forEach(function(s){track.appendChild(s.cloneNode(true));});
  var pos=0,gap=12,total=orig;
  setInterval(function(){
    pos++;
    if(pos>=total){
      track.style.transition='none';pos=0;
      track.style.transform='translateX(0)';
      track.getBoundingClientRect();
      track.style.transition='transform .5s cubic-bezier(.4,0,.2,1)';
    }
    track.style.transform='translateX(-'+(pos*(w+gap))+'px)';
  },ms);
}
document.addEventListener('DOMContentLoaded',function(){
  autoSlide('cert-track',200,3200);
  autoSlide('svc-track',270,2900);
});

// Testimonials dots
var ts=document.getElementById('test-slider');
var tdots=document.querySelectorAll('#tdots .dot');
if(ts&&tdots.length){
  ts.addEventListener('scroll',function(){
    var i=Math.round(ts.scrollLeft/ts.offsetWidth);
    tdots.forEach(function(d,j){d.classList.toggle('on',i===j);});
  },{passive:true});
  tdots.forEach(function(d,i){
    d.addEventListener('click',function(){
      ts.scrollTo({left:i*ts.offsetWidth,behavior:'smooth'});
    });
  });
}

// ── Video carousel ─────────────────────────────────────
var vidCur = 0, vidTotal = 10, vidTimer, vidPaused = false;

function goVid(n) {
  vidCur = ((n % vidTotal) + vidTotal) % vidTotal;
  var trk = document.getElementById('vid-trk');
  if (trk) trk.style.transform = 'translateX(-' + (vidCur * 100) + '%)';
  document.querySelectorAll('.vdot').forEach(function(d, i) { d.classList.toggle('vdot-on', i === vidCur); });
  resetVidTimer();
}

function moveVid(dir) { goVid(vidCur + dir); }

function resetVidTimer() {
  clearInterval(vidTimer);
  if (!vidPaused) vidTimer = setInterval(function() { goVid(vidCur + 1); }, 6000);
}
resetVidTimer();

// Swipe + pause on hover
(function() {
  var el = document.getElementById('vid-car');
  if (!el) return;
  var sx = 0;
  el.addEventListener('touchstart', function(e) {
    sx = e.touches[0].clientX;
    vidPaused = true; clearInterval(vidTimer);
  }, { passive: true });
  el.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) moveVid(dx < 0 ? 1 : -1);
    setTimeout(function() { vidPaused = false; resetVidTimer(); }, 4000);
  }, { passive: true });
  el.addEventListener('mouseenter', function() { vidPaused = true; clearInterval(vidTimer); });
  el.addEventListener('mouseleave', function() { vidPaused = false; resetVidTimer(); });
})();

// Certificate modal
function openModal(el){
  var img=el.querySelector('img');
  var title=el.dataset.title||'';
  var box=document.getElementById('modal-img');
  box.innerHTML='';
  if(img){var i=document.createElement('img');i.src=img.src;i.alt=title;box.appendChild(i);}
  document.getElementById('modal-title').textContent=title;
  document.getElementById('cert-modal').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeModal(){
  document.getElementById('cert-modal').classList.remove('on');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});

// Save contact vCard
document.getElementById('save-btn').addEventListener('click',function(){
  var v='BEGIN:VCARD\nVERSION:3.0\nFN:Germán Agudelo – QUIROMASAJES.GAP\nORG:QUIROMASAJES.GAP\nTEL;TYPE=CELL:+573213735117\nURL:https://www.instagram.com/quiromasajes1986\nNOTE:Quiropraxia\\, Masajes. Soacha y Bogotá D.C.\nEND:VCARD';
  var b=new Blob([v],{type:'text/vcard'});
  var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='german-quiromasajes.vcf';a.click();
});

// ── Video modal (REPRODUCTOR NATIVO) ──────────────────
function openVid(slide) {
  var driveId = slide.dataset.drive;
  var title   = slide.dataset.title;
  var player  = document.getElementById('vid-player');
  var modal   = document.getElementById('vid-modal');
  var fallbackLink = document.getElementById('vid-fallback-link');

  // Construir URL de streaming directo
  var directUrl = 'https://drive.google.com/uc?export=download&id=' + driveId;
  var previewUrl = 'https://drive.google.com/file/d/' + driveId + '/preview';

  player.src = directUrl;
  player.load();

  document.getElementById('vid-modal-title').textContent = title;
  fallbackLink.href = previewUrl;
  fallbackLink.textContent = 'Abrir en Google Drive';

  modal.classList.add('on');
  document.body.style.overflow = 'hidden';
  vidPaused = true;
  clearInterval(vidTimer);

  // Intentar reproducción automática
  var playPromise = player.play();
  if (playPromise !== undefined) {
    playPromise.catch(function() { /* el usuario debe tocar play */ });
  }
}

function closeVid() {
  var player = document.getElementById('vid-player');
  player.pause();
  player.src = '';
  player.load();
  document.getElementById('vid-modal').classList.remove('on');
  document.body.style.overflow = '';
  vidPaused = false;
  resetVidTimer();
}

// ── Hero particles ─────────────────────────────────────
(function(){
  var cv=document.getElementById('hero-particles');
  if(!cv)return;
  var ctx=cv.getContext('2d');
  var hero=document.getElementById('hero');
  function resize(){cv.width=hero.offsetWidth;cv.height=hero.offsetHeight;}
  resize();
  var pts=Array.from({length:28},function(){return{
    x:Math.random()*cv.width,y:Math.random()*cv.height,
    r:Math.random()*1.8+.4,
    vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,
    a:Math.random()
  };});
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    pts.forEach(function(p){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>cv.width)p.vx*=-1;
      if(p.y<0||p.y>cv.height)p.vy*=-1;
      p.a=.4+.6*Math.sin(Date.now()/1800+p.x);
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+p.a.toFixed(2)+')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize',resize,{passive:true});
})();

// ── Calendly modal ─────────────────────────────────────
function openCalendly(){
  document.getElementById('cal-modal').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeCalendly(){
  document.getElementById('cal-modal').classList.remove('on');
  document.body.style.overflow='';
}

// ── QR Compartir ──────────────────────────────────────
var qrCodeInstance = null;

function openQR() {
  var modal = document.getElementById('qr-modal');
  var container = document.getElementById('qr-code-container');
  container.innerHTML = ''; // Limpiar

  // Obtener la URL actual
  var url = window.location.href;

  // Crear QR con logo integrado (usando la librería QRCode.js)
  qrCodeInstance = new QRCode(container, {
    text: url,
    width: 220,
    height: 220,
    colorDark: '#1A5F7A',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H // Alta corrección para incluir logo
  });

  // Esperar a que se dibuje y luego agregar el logo manualmente (overlay)
  setTimeout(function() {
    var canvas = container.querySelector('canvas');
    if (canvas) {
      var ctx = canvas.getContext('2d');
      var logo = new Image();
      logo.src = 'assets/icons/logo.webp'; // Ruta del logo
      logo.onload = function() {
        var size = 50; // Tamaño del logo
        var x = (canvas.width - size) / 2;
        var y = (canvas.height - size) / 2;
        // Fondo blanco para legibilidad
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2 + 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.drawImage(logo, x, y, size, size);
      };
      logo.onerror = function() {
        // Si no carga el logo, mostrar solo el QR
        console.warn('Logo no encontrado, solo QR');
      };
    }
  }, 300);

  modal.classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeQR() {
  document.getElementById('qr-modal').classList.remove('on');
  document.body.style.overflow = '';
  // Limpiar el QR para liberar memoria
  var container = document.getElementById('qr-code-container');
  container.innerHTML = '';
  qrCodeInstance = null;
}

function descargarQR() {
  var canvas = document.querySelector('#qr-code-container canvas');
  if (canvas) {
    var link = document.createElement('a');
    link.download = 'QR_QuiromasajesGAP.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } else {
    alert('Aún no se ha generado el código QR. Intenta de nuevo.');
  }
}

// Cerrar QR con Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeQR();
    closeVid();
    closeModal();
    closeCalendly();
  }
});

// ── FAQ accordion ────────────────────────────────────────
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(o) {
    if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-ic').textContent = '+'; }
  });
  item.classList.toggle('open', !wasOpen);
  btn.querySelector('.faq-ic').textContent = !wasOpen ? '×' : '+';
}
