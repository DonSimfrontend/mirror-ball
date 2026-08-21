let textureImage;
let neonShader;

function preload() {
  textureImage = loadImage('888.jpeg');
  neonShader = loadShader('neon.vert', 'neon.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  background(4, 4, 12);

  shader(neonShader);
  neonShader.setUniform('uTexture', textureImage);
  neonShader.setUniform('uTime', millis() / 1000.0);
  neonShader.setUniform('uResolution', [width, height]);

  rotateY(frameCount * 0.015);

  const s = 100;
  const aspect = textureImage.width / textureImage.height;
  const cropU = aspect > 1 ? (1 - 1 / aspect) * 0.5 : 0;
  const cropV = aspect < 1 ? (1 - aspect) * 0.5 : 0;
  const u0 = cropU;
  const u1 = 1 - cropU;
  const v0 = cropV;
  const v1 = 1 - cropV;

  beginShape();
  vertex(-s, -s,  s, u0, v0); vertex( s, -s,  s, u1, v0);
  vertex( s,  s,  s, u1, v1); vertex(-s,  s,  s, u0, v1);
  endShape(CLOSE);

  beginShape();
  vertex( s, -s, -s, u0, v0); vertex(-s, -s, -s, u1, v0);
  vertex(-s,  s, -s, u1, v1); vertex( s,  s, -s, u0, v1);
  endShape(CLOSE);

  beginShape();
  vertex( s, -s,  s, u0, v0); vertex( s, -s, -s, u1, v0);
  vertex( s,  s, -s, u1, v1); vertex( s,  s,  s, u0, v1);
  endShape(CLOSE);

  beginShape();
  vertex(-s, -s, -s, u0, v0); vertex(-s, -s,  s, u1, v0);
  vertex(-s,  s,  s, u1, v1); vertex(-s,  s, -s, u0, v1);
  endShape(CLOSE);

  beginShape();
  vertex(-s, -s, -s, u0, v0); vertex( s, -s, -s, u1, v0);
  vertex( s, -s,  s, u1, v1); vertex(-s, -s,  s, u0, v1);
  endShape(CLOSE);

  beginShape();
  vertex(-s,  s,  s, u0, v0); vertex( s,  s,  s, u1, v0);
  vertex( s,  s, -s, u1, v1); vertex(-s,  s, -s, u0, v1);
  endShape(CLOSE);

  resetShader();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
