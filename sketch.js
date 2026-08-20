function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(20);

  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.015);

  box(200);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
