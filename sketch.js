let textureImage;

function preload() {
  textureImage = loadImage('888.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(20);

  rotateY(frameCount * 0.015);

  texture(textureImage);
  box(200);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
