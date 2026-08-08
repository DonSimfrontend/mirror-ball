let theShader;
let envTexture;


function preload() {
  theShader = loadShader("mirror.vert", "mirror.frag");
  envTexture = loadImage("lava_planet_equirect.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);

  noStroke();
}


function draw() {
  background(0);

  shader(theShader);

  theShader.setUniform("u_texture", envTexture);
  theShader.setUniform("u_time", millis() * 0.001);
  theShader.setUniform("u_resolution", [
    width,
    height
  ]);

  // Final rotation speed for this test
  rotateY(frameCount * 0.00055555);

  sphere(
    min(width, height) * 0.35,
    128,
    128
  );
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}