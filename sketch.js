let theShader;

function preload() {
  theShader = loadShader("mirror.vert", "mirror.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  noStroke();
}

function draw() {
  background(30);

  shader(theShader);

  // 2× the previous speed
  rotateY(frameCount * 0.30);

  sphere(
    min(width, height) * 0.35,
    128,
    128
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}