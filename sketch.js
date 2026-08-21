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

  rotateY(frameCount * 0.015);

  shader(neonShader);
  neonShader.setUniform('uTexture', textureImage);
  neonShader.setUniform('uTime', millis() / 1000.0);
  neonShader.setUniform('uResolution', [width, height]);

  const s = 100;
  const aspect = textureImage.width / textureImage.height;
  const cropU = aspect > 1 ? (1 - 1 / aspect) * 0.5 : 0;
  const cropV = aspect < 1 ? (1 - aspect) * 0.5 : 0;
  const u0 = cropU;
  const u1 = 1 - cropU;
  const v0 = cropV;
  const v1 = 1 - cropV;

  // Every face is drawn as its own textured quad. The shader is
  // deliberately applied while the texture is explicitly bound.
  texture(textureImage);

  drawFace(-s, -s, s, s, -s, s, s, s, s, -s, s, s, u0, v0, u1, v1);
  drawFace(s, -s, -s, -s, -s, -s, -s, s, -s, s, s, -s, u0, v0, u1, v1);
  drawFace(s, -s, s, s, -s, -s, s, s, -s, s, s, s, u0, v0, u1, v1);
  drawFace(-s, -s, -s, -s, -s, s, -s, s, s, -s, s, -s, u0, v0, u1, v1);
  drawFace(-s, -s, -s, s, -s, -s, s, -s, s, -s, -s, s, u0, v0, u1, v1);
  drawFace(-s, s, s, s, s, s, s, s, -s, -s, s, -s, u0, v0, u1, v1);

  resetShader();
}

function drawFace(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, u0, v0, u1, v1) {
  beginShape();
  vertex(x1, y1, z1, u0, v0);
  vertex(x2, y2, z2, u1, v0);
  vertex(x3, y3, z3, u1, v1);
  vertex(x4, y4, z4, u0, v1);
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
