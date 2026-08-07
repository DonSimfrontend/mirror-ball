let shaderProgram;

function preload() {

  console.log("Loading shaders...");

  shaderProgram = loadShader(
    "mirror.vert",
    "mirror.frag",
    () => {
      console.log("SHADER LOAD OK");
    },
    (err) => {
      console.log("SHADER LOAD FAILED", err);
    }
  );

}

function setup() {

  createCanvas(
    windowWidth,
    windowHeight,
    WEBGL
  );

  noStroke();

}

function draw() {

  background(0);

  if (shaderProgram) {

    shader(shaderProgram);

    rotateY(frameCount * 0.01);
    rotateX(frameCount * 0.005);

    sphere(200, 64, 64);

    resetShader();

  }

}

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

}