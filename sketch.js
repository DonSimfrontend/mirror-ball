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

  const s = 100;
  const aspect = textureImage.width / textureImage.height;
  const cropU = aspect > 1 ? (1 - 1 / aspect) * 0.5 : 0;
  const cropV = aspect < 1 ? (1 - aspect) * 0.5 : 0;
  const u0 = cropU;
  const u1 = 1 - cropU;
  const v0 = cropV;
  const v1 = 1 - cropV;

  const faces = [
    [[-s,-s,s,u0,v0],[s,-s,s,u1,v0],[s,s,s,u1,v1],[-s,s,s,u0,v1]],
    [[s,-s,-s,u0,v0],[-s,-s,-s,u1,v0],[-s,s,-s,u1,v1],[s,s,-s,u0,v1]],
    [[s,-s,s,u0,v0],[s,-s,-s,u1,v0],[s,s,-s,u1,v1],[s,s,s,u0,v1]],
    [[-s,-s,-s,u0,v0],[-s,-s,s,u1,v0],[-s,s,s,u1,v1],[-s,s,-s,u0,v1]],
    [[-s,-s,-s,u0,v0],[s,-s,-s,u1,v0],[s,-s,s,u1,v1],[-s,-s,s,u0,v1]],
    [[-s,s,s,u0,v0],[s,s,s,u1,v0],[s,s,-s,u1,v1],[-s,s,-s,u0,v1]]
  ];

  for (const face of faces) {
    shader(neonShader);
    neonShader.setUniform('uTexture', textureImage);
    neonShader.setUniform('uTime', millis() / 1000.0);
    neonShader.setUniform('uResolution', [width, height]);
    beginShape();
    for (const v of face) vertex(v[0], v[1], v[2], v[3], v[4]);
    endShape(CLOSE);
  }

  resetShader();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
