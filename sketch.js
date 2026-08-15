let shaderProgram;
let timTexture;

function preload() {
  timTexture = loadImage('tim_new.png');
  shaderProgram = loadShader('mirror.vert', 'mirror.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  shader(shaderProgram);
}

function draw() {
  background(30);

  shaderProgram.setUniform('u_time', millis() / 1000.0);
  shaderProgram.setUniform('u_texture', timTexture);

  push();

  rotateY(frameCount * 0.01);

  sphere(200, 96, 48);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}