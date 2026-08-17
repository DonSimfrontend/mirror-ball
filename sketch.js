// iPhone / GitHub Pages deployment test
// Simple red rotating sphere with latitude/longitude wireframe.

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  background(20);

  push();
  rotateY(frameCount * 500);
  rotateX(-0.12);

  // Solid red sphere.
  noStroke();
  ambientLight(180);
  directionalLight(255, 255, 255, 0, 0, -1);
  fill(190, 25, 25);
  sphere(200, 64, 32);

  // Latitude / longitude wireframe.
  stroke(255);
  strokeWeight(1);
  noFill();

  const r = 202;
  const longitudeCount = 24;
  const latitudeCount = 12;
  const steps = 64;

  // Longitudes.
  for (let j = 0; j < longitudeCount; j++) {
    const lon = TWO_PI * j / longitudeCount;
    beginShape();
    for (let i = 0; i <= steps; i++) {
      const lat = -HALF_PI + PI * i / steps;
      const x = r * cos(lat) * cos(lon);
      const y = r * sin(lat);
      const z = r * cos(lat) * sin(lon);
      vertex(x, y, z);
    }
    endShape();
  }

  // Latitudes.
  for (let j = 1; j < latitudeCount; j++) {
    const lat = -HALF_PI + PI * j / latitudeCount;
    const y = r * sin(lat);
    const ringRadius = r * cos(lat);

    beginShape();
    for (let i = 0; i <= steps; i++) {
      const lon = TWO_PI * i / steps;
      const x = ringRadius * cos(lon);
      const z = ringRadius * sin(lon);
      vertex(x, y, z);
    }
    endShape();
  }

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
