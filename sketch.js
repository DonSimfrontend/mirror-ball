let mirrorShader;
let envTexture;

function preload() {
  mirrorShader = loadShader(
    "mirror.vert",
    "mirror.frag"
  );

  envTexture = loadImage("tim_new.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  noStroke();

  pixelDensity(1);
}

function draw() {
  background(0);

  orbitControl();

  drawBall(-250, -150);
  drawBall(0, -150);
  drawBall(250, -150);

  drawBall(-250, 150);
  drawBall(0, 150);
  drawBall(250, 150);
}

function drawBall(x, y) {

  shader(mirrorShader);

  mirrorShader.setUniform(
    "u_envMap",
    envTexture
  );

  mirrorShader.setUniform(
    "u_time",
    millis() * 0.001
  );

  push();

  translate(x, y, 0);

  sphere(100, 96, 96);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}