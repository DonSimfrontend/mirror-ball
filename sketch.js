let textureImage;
let renderer;

function preload() {
  textureImage = loadImage('888.jpeg');
}

function setup() {
  renderer = createCanvas(windowWidth, windowHeight, WEBGL);

  // Use nearest-neighbour sampling to preserve the texture's native pixel detail.
  renderer.getTexture(textureImage).setInterpolation(NEAREST, NEAREST);
}

function draw() {
  background(20);

  rotateY(frameCount * 0.015);

  texture(textureImage);

  const s = 100;
  const u0 = 0;
  const v0 = 0;
  const u1 = textureImage.width;
  const v1 = textureImage.height;

  // Front: image upright
  beginShape();
  vertex(-s, -s,  s, u0, v0);
  vertex( s, -s,  s, u1, v0);
  vertex( s,  s,  s, u1, v1);
  vertex(-s,  s,  s, u0, v1);
  endShape(CLOSE);

  // Back: image upright
  beginShape();
  vertex( s, -s, -s, u0, v0);
  vertex(-s, -s, -s, u1, v0);
  vertex(-s,  s, -s, u1, v1);
  vertex( s,  s, -s, u0, v1);
  endShape(CLOSE);

  // Right: image upright
  beginShape();
  vertex( s, -s,  s, u0, v0);
  vertex( s, -s, -s, u1, v0);
  vertex( s,  s, -s, u1, v1);
  vertex( s,  s,  s, u0, v1);
  endShape(CLOSE);

  // Left: image upright
  beginShape();
  vertex(-s, -s, -s, u0, v0);
  vertex(-s, -s,  s, u1, v0);
  vertex(-s,  s,  s, u1, v1);
  vertex(-s,  s, -s, u0, v1);
  endShape(CLOSE);

  // Top: image upright relative to world Y
  beginShape();
  vertex(-s, -s, -s, u0, v0);
  vertex( s, -s, -s, u1, v0);
  vertex( s, -s,  s, u1, v1);
  vertex(-s, -s,  s, u0, v1);
  endShape(CLOSE);

  // Bottom: image upright relative to world Y
  beginShape();
  vertex(-s,  s,  s, u0, v0);
  vertex( s,  s,  s, u1, v1);
  vertex( s,  s, -s, u1, v1);
  vertex(-s,  s, -s, u0, v0);
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
