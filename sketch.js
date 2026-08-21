let textureImage;

function preload() {
  textureImage = loadImage('888.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  background(20);

  rotateY(frameCount * 0.015);

  texture(textureImage);
  textureWrap(CLAMP, CLAMP);
  textureMode(NORMAL);

  const s = 100;
  const aspect = textureImage.width / textureImage.height;
  const uSpan = 1;
  const vSpan = 1;

  // Keep the source image's rectangular proportions on every face.
  // The image is fitted inside the square face without stretching.
  const cropU = aspect > 1 ? (1 - 1 / aspect) * 0.5 : 0;
  const cropV = aspect < 1 ? (1 - aspect) * 0.5 : 0;
  const u0 = cropU;
  const u1 = 1 - cropU;
  const v0 = cropV;
  const v1 = 1 - cropV;

  // Front
  beginShape();
  vertex(-s, -s,  s, u0, v0);
  vertex( s, -s,  s, u1, v0);
  vertex( s,  s,  s, u1, v1);
  vertex(-s,  s,  s, u0, v1);
  endShape(CLOSE);

  // Back
  beginShape();
  vertex( s, -s, -s, u0, v0);
  vertex(-s, -s, -s, u1, v0);
  vertex(-s,  s, -s, u1, v1);
  vertex( s,  s, -s, u0, v1);
  endShape(CLOSE);

  // Right
  beginShape();
  vertex( s, -s,  s, u0, v0);
  vertex( s, -s, -s, u1, v0);
  vertex( s,  s, -s, u1, v1);
  vertex( s,  s,  s, u0, v1);
  endShape(CLOSE);

  // Left
  beginShape();
  vertex(-s, -s, -s, u0, v0);
  vertex(-s, -s,  s, u1, v0);
  vertex(-s,  s,  s, u1, v1);
  vertex(-s,  s, -s, u0, v1);
  endShape(CLOSE);

  // Top
  beginShape();
  vertex(-s, -s, -s, u0, v0);
  vertex( s, -s, -s, u1, v0);
  vertex( s, -s,  s, u1, v1);
  vertex(-s, -s,  s, u0, v1);
  endShape(CLOSE);

  // Bottom
  beginShape();
  vertex(-s,  s,  s, u0, v0);
  vertex( s,  s,  s, u1, v0);
  vertex( s,  s, -s, u1, v1);
  vertex(-s,  s, -s, u0, v1);
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
