let textureImage;

// Slow, seamless left-to-right background orbit.
const scrollSpeed = 0.000018;

function preload() {
  textureImage = loadImage('888.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  imageMode(CENTER);
}

function draw() {
  background(0);

  // Fixed camera: we're sitting in the middle looking straight into depth.
  camera(0, 0, 0, 0, 0, -1, 0, 1, 0);

  // Put the background far behind the camera plane.
  const z = -700;
  const canvasAspect = width / height;
  const imageAspect = textureImage.width / textureImage.height;

  let h = height * 1.35;
  let w = h * imageAspect;

  // Make sure the background completely covers the viewport.
  if (w < width * 1.25) {
    w = width * 1.25;
    h = w / imageAspect;
  }

  // Continuous horizontal wrap: two copies guarantee no gap.
  const offset = ((millis() * scrollSpeed) % 1.0) * w;
  const left = -w * 0.5 - offset;
  const right = left + w;

  push();
  translate(0, 0, z);
  texture(textureImage);

  // Slightly larger than the viewport so the edges are never exposed.
  beginShape();
  vertex(left, -h * 0.5, 0, 0, 0);
  vertex(left + w, -h * 0.5, 0, 1, 0);
  vertex(left + w, h * 0.5, 0, 1, 1);
  vertex(left, h * 0.5, 0, 0, 1);
  endShape(CLOSE);

  beginShape();
  vertex(right, -h * 0.5, 0, 0, 0);
  vertex(right + w, -h * 0.5, 0, 1, 0);
  vertex(right + w, h * 0.5, 0, 1, 1);
  vertex(right, h * 0.5, 0, 0, 1);
  endShape(CLOSE);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
