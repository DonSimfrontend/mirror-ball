precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord;

  // Animated cyberpunk-style spatial distortion.
  vec2 p = uv - 0.5;
  float r = length(p);
  float a = atan(p.y, p.x);
  a += 0.035 * sin(r * 28.0 - uTime * 1.8);
  a += 0.018 * sin(r * 75.0 + uTime * 3.2);
  p = vec2(cos(a), sin(a)) * r;
  uv = p + 0.5;

  float aberration = 0.004 + 0.012 * r;
  vec2 dir = normalize(p + vec2(0.0001));

  float red = texture2D(uTexture, uv + dir * aberration).r;
  float green = texture2D(uTexture, uv).g;
  float blue = texture2D(uTexture, uv - dir * aberration).b;
  vec3 col = vec3(red, green, blue);

  // Deep contrast and neon saturation.
  col = pow(max(col, 0.0), vec3(0.82));
  float luminance = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luminance), col, 1.65);
  col *= 1.35;

  // Electric cyan/magenta energy tint derived from the original image.
  float energy = smoothstep(0.25, 0.95, luminance);
  col += vec3(0.02, 0.08, 0.16) * energy;
  col += vec3(0.16, 0.01, 0.11) * smoothstep(0.65, 1.0, col.r);

  // Pulsing scan interference, deliberately subtle so texture detail survives.
  float scan = 0.97 + 0.03 * sin((uv.y * uResolution.y) * 0.16 + uTime * 5.0);
  col *= scan;

  // Hot neon edge bloom.
  float edge = smoothstep(0.22, 0.78, r);
  col += vec3(0.02, 0.12, 0.22) * edge * (0.55 + 0.45 * sin(uTime * 2.0));

  gl_FragColor = vec4(min(col, 1.0), 1.0);
}
