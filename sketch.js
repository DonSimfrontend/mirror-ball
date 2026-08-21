const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
let offset = 0;
let last = performance.now();
const speed = 54; // 3x the previous 18 px/s

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
}

function showMessage(text) {
  document.body.innerHTML = '';
  const message = document.createElement('div');
  message.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#111;color:white;font:16px monospace;padding:24px;text-align:center;';
  message.textContent = text;
  document.body.appendChild(message);
}

function draw(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  offset += speed * dt;

  const w = canvas.width;
  const h = canvas.height;
  const horizon = h * 0.50;
  const skyH = horizon;

  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = '#020308';
  ctx.fillRect(0, 0, w, horizon);

  const scale = skyH / img.naturalHeight;
  const imageW = img.naturalWidth * scale;
  const tileW = imageW * 2;
  const phase = offset % tileW;
  const start = -phase - tileW;

  for (let px = start; px < w + tileW; px += tileW) {
    ctx.drawImage(img, px, 0, imageW, skyH);
    ctx.save();
    ctx.translate(px + imageW * 2, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, imageW, skyH);
    ctx.restore();
  }

  const floor = ctx.createLinearGradient(0, horizon, 0, h);
  floor.addColorStop(0, '#8a8a8a');
  floor.addColorStop(0.18, '#666');
  floor.addColorStop(1, '#303030');
  ctx.fillStyle = floor;
  ctx.fillRect(0, horizon, w, h - horizon);

  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.lineWidth = 1;
  const vanishingX = w * 0.5;
  const vanishingY = horizon;
  for (let i = -10; i <= 10; i++) {
    const bottomX = vanishingX + i * w * 0.11;
    ctx.beginPath();
    ctx.moveTo(vanishingX, vanishingY);
    ctx.lineTo(bottomX, h);
    ctx.stroke();
  }

  ctx.fillStyle = '#505050';
  ctx.fillRect(0, horizon, w, 3);

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
document.body.style.background = '#111';
document.body.appendChild(canvas);
resize();

img.onload = () => requestAnimationFrame(draw);
img.onerror = () => showMessage('Could not load 888.jpeg');
img.src = '888.jpeg';
