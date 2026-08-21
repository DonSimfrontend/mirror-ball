precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
  // The nebula remains completely fixed.
  vec2 uv = vTexCoord;
  vec3 source = texture2D(uTexture, uv).rgb;
  vec3 col = source;

  // Preserve deep, saturated colour instead of washing the image out.
  col = pow(max(col, 0.0), vec3(0.92));
  col = min(col * 1.12, 1.0);

  // Select saturated red/orange pixels.
  float redOrange = smoothstep(0.18, 0.55, source.r) *
                    smoothstep(0.04, 0.42, source.r - source.b * 0.60);

  // Select saturated blue/cyan pixels.
  float blue = smoothstep(0.15, 0.55, source.b) *
               smoothstep(0.015, 0.28, source.b - source.r * 0.55);

  float selected = max(redOrange, blue);

  // Individual twinkle field: different pixels brighten at different times.
  // This is deliberately based on UV position, so there is no scan line.
  float cellA = sin(dot(uv, vec2(173.31, 91.73)) + uTime * 2.7);
  float cellB = sin(dot(uv, vec2(47.17, 219.41)) - uTime * 3.9);
  float twinkleWave = 0.5 + 0.5 * (cellA * 0.65 + cellB * 0.35);
  float twinkle = smoothstep(0.62, 0.96, twinkleWave);

  // Keep the source colour and make selected pixels suddenly punch brighter.
  float sparkle = selected * (0.55 + twinkle * 1.65);
  col += source * sparkle;

  // Tiny colour-specific bloom, using the pixel's own colour.
  col += pow(max(source, 0.0), vec3(2.6)) * selected * (0.15 + twinkle * 0.55);

  // Saturation boost only where the chosen colours are present.
  float mx = max(col.r, max(col.g, col.b));
  float mn = min(col.r, min(col.g, col.b));
  float sat = mx - mn;
  col += (col - vec3(mn)) * selected * (0.20 + twinkle * 0.35) * sat;

  gl_FragColor = vec4(min(col, 1.0), 1.0);
}
