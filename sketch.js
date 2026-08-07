let shaderProgram;
let envTexture;

function preload() {
  shaderProgram = loadShader(
    "mirror.vert",
    "mirror.frag"
  );

  envTexture = loadImage("tim_new.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  noStroke();

  shader(shaderProgram);

  shaderProgram.setUniform(
    "u_env",
    envTexture
  );
}

function draw() {
  background(0);

  shaderProgram.setUniform(
    "u_time",
    millis() * 0.001
  );

  rotateY(millis() * 0.0002);

  sphere(
    200,
    64,
    64
  );
}

function windowResized() {
  resizeCanvas(
    windowWidth,
    windowHeight
  );
}