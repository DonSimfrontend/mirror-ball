// Tim texture experiment
// Extreme Y-axis sphere spin + visible grid + slow organic texture slip.

let timTexture;

const SPHERE_RADIUS = 200;
const DETAIL_X = 48;
const DETAIL_Y = 24;
const SPIN_SPEED = 500;

function preload() {
  timTexture = loadImage('TimNewGlobe.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  textureMode(NORMAL);
  textureWrap(REPEAT, REPEAT);
}

function draw() {
  background(20);

  push();

  // Pure Y-axis rotation. X and Z are locked.
  rotateY(frameCount * SPIN_SPEED);

  // Tim's image is wrapped around the sphere and given a slow,
  // organic UV drift so it appears to slip over the surface.
  drawTimSphere();

  // Keep the grid as a visual reference for the sphere's rotation.
  drawGrid();

  pop();
}

function drawTimSphere() {
  if (!timTexture) return;

  texture(timTexture);
  noStroke();

  const t = millis() * 0.001;

  for (let y = 0; y < DETAIL_Y; y++) {
    const v0 = y / DETAIL_Y;
    const v1 = (y + 1) / DETAIL_Y;

    const lat0 = -HALF_PI + PI * v0;
    const lat1 = -HALF_PI + PI * v1;

    for (let x = 0; x < DETAIL_X; x++) {
      const u0 = x / DETAIL_X;
      const u1 = (x + 1) / DETAIL_X;

      const lon0 = TWO_PI * u0;
      const lon1 = TWO_PI * u1;

      const p00 = spherePoint(lat0, lon0);
      const p10 = spherePoint(lat0, lon1);
      const p11 = spherePoint(lat1, lon1);
      const p01 = spherePoint(lat1, lon0);

      const uv00 = slippingUV(u0, v0, t);
      const uv10 = slippingUV(u1, v0, t);
      const uv11 = slippingUV(u1, v1, t);
      const uv01 = slippingUV(u0, v1, t);

      beginShape(TRIANGLES);

      vertex(p00.x, p00.y, p00.z, uv00.u, uv00.v);
      vertex(p10.x, p10.y, p10.z, uv10.u, uv10.v);
      vertex(p11.x, p11.y, p11.z, uv11.u, uv11.v);

      vertex(p00.x, p00.y, p00.z, uv00.u, uv00.v);
      vertex(p11.x, p11.y, p11.z, uv11.u, uv11.v);
      vertex(p01.x, p01.y, p01.z, uv01.u, uv01.v);

      endShape();
    }
  }
}

function spherePoint(lat, lon) {
  const c = cos(lat);
  return {
    x: SPHERE_RADIUS * c * cos(lon),
    y: SPHERE_RADIUS * sin(lat),
    z: SPHERE_RADIUS * c * sin(lon)
  };
}

function slippingUV(u, v, t) {
  // Slow sideways drift plus gentle waves at different scales.
  // REPEAT wrapping lets the picture continue seamlessly as it moves.
  const slide = t * 0.018;

  const waveU =
    0.025 * sin(TWO_PI * v * 2.0 + t * 0.65) +
    0.012 * sin(TWO_PI * v * 5.0 - t * 0.35);

  const waveV =
    0.018 * sin(TWO_PI * u * 3.0 + t * 0.50) +
    0.008 * sin(TWO_PI * u * 7.0 - t * 0.28);

  return {
    u: u + slide + waveU,
    v: 1.0 - v + waveV
  };
}

function drawGrid() {
  stroke(255);
  strokeWeight(1);
  noFill();

  const r = SPHERE_RADIUS + 2;
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
