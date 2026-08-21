precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
  // The nebula remains completely fixed.
  vec2 uv = vTexCoord;
  vec3 col = texture2D(uTexture, uv).rgb;

  // Preserve the existing image, then make its natural colours punchier.
  col = pow(max(col, 0.0), vec3(0.82));
  float luminance = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luminance), col, 1.7);

  // Select only the colour families the user asked for.
  // Red/orange: strong red, with green present for orange.
  float redOrange = smoothstep(0.18, 0.65, col.r) *
                    smoothstep(0.08, 0.55, col.r - col.b * 0.55);

  // Blue/cyan: blue dominant, allowing vivid cyan/blue nebula regions.
  float blue = smoothstep(0.16, 0.62, col.b) *
               smoothstep(0.02, 0.32, col.b - col.r * 0.55);

  // Keep unrelated pixels essentially untouched.
  float selected = max(redOrange, blue);

  // Gentle continuous pulse: there is NO moving scan line.
  float pulse = 0.88 + 0.12 * sin(uTime * 1.8);

  // Each selected pixel glows using its OWN original colour.
  vec3 selectedGlow = pow(max(col, 0.0), vec3(1.35));
  col += selectedGlow * selected * 0.85 * pulse;
  col *= 1.0 + selected * 0.42 * pulse;

  // Add a restrained colour-specific neon lift.
  col.r += redOrange * col.r * 0.30;
  col.g += redOrange * col.g * 0.18;
  col.b += blue * col.b * 0.40;

  gl_FragColor = vec4(min(col, 1.0), 1.0);
}
