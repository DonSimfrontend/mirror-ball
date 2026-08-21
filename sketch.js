let textureImage;

function preload() {
  textureImage = loadImage('888.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(20);

  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.015);

  texture(textureImage);
  box(200);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
