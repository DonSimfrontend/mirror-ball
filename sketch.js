let textureImage;

// Slow orbit-like horizontal movement of the distant universe.
const orbitSpeed = 0.000018;

function preload() {
  textureImage = loadImage('888.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  background(0);

  // Fixed viewpoint: the viewer stands on the platform and looks forward.
  camera(0, 0, 0, 0, 0, -1, 0, 1, 0);

  const horizon = 0;
  const floorY = height * 0.5;

  // Distant universe: upper half only.
  const z = -700;
  const bgTop = -height * 0.5;
  const bgBottom = horizon;
  const bgH = bgBottom - bgTop;
  const imageAspect = textureImage.width / textureImage.height;
  const bgW = bgH * imageAspect;

  // Seamless left-to-right orbit-like motion.
  const offset = ((millis() * orbitSpeed) % 1.0) * bgW;
  const left = -bgW * 0.5 - offset;

  push();
  translate(0, (bgTop + bgBottom) * 0.5, z);
  texture(textureImage);
  drawBackgroundPanel(left, bgW, bgH);
  drawBackgroundPanel(left + bgW, bgW, bgH);
  pop();

  // Stationary 3D lookout platform filling the lower half.
  push();
  translate(0, floorY + height * 0.25, -320);
  rotateX(HALF_PI);
  fill(115, 115, 115);
  plane(width * 2.5, height * 2.5);
  pop();

  // Stationary horizon edge.
  push();
  translate(0, horizon, -500);
  fill(80, 80, 80);
  plane(width * 2.5, 4);
  pop();
}

function drawBackgroundPanel(x, w, h) {
  beginShape();
  vertex(x, -h * 0.5, 0, 0, 0);
  vertex(x + w, -h * 0.5, 0, 1, 0);
  vertex(x + w, h * 0.5, 0, 1, 1);
  vertex(x, h * 0.5, 0, 0, 1);
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
