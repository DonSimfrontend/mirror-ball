precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
  vec2 uv = vTexCoord;
  vec3 source = texture2D(uTexture, uv).rgb;
  vec3 col = source * 1.08;

  vec2 px = 1.0 / uResolution;
  vec3 n1 = texture2D(uTexture, uv + vec2(px.x * 2.0, 0.0)).rgb;
  vec3 n2 = texture2D(uTexture, uv - vec2(px.x * 2.0, 0.0)).rgb;
  vec3 n3 = texture2D(uTexture, uv + vec2(0.0, px.y * 2.0)).rgb;
  vec3 n4 = texture2D(uTexture, uv - vec2(0.0, px.y * 2.0)).rgb;
  vec3 localMax = max(source, max(max(n1,n2), max(n3,n4)));

  float bright = dot(localMax, vec3(0.299, 0.587, 0.114));
  float detail = smoothstep(0.42, 0.82, bright);

  float redOrange = smoothstep(0.20, 0.58, source.r) * smoothstep(0.03, 0.40, source.r - source.b * 0.62);
  float blue = smoothstep(0.17, 0.58, source.b) * smoothstep(0.015, 0.30, source.b - source.r * 0.58);
  float selected = max(redOrange, blue);

  // Keep the strong 10x filament energy.
  vec3 filament = pow(max(source, 0.0), vec3(2.2));
  col += filament * detail * selected * 7.5;

  // Compress highlights by luminance so intense colour stays saturated instead of turning white.
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  float compressedLum = lum / (1.0 + max(lum - 0.55, 0.0) * 2.4);
  col *= compressedLum / max(lum, 0.0001);

  // Restore punch without restoring clipping.
  float newLum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(newLum), col, 1.35);

  // Sparse same-colour star twinkles.
  float seed = fract(sin(dot(uv, vec2(127.1, 311.7))) * 43758.5453);
  float starMask = step(0.985, seed) * selected * detail;
  float twinkle = 0.5 + 0.5 * sin(uTime * (1.4 + seed * 3.0) + seed * 40.0);
  col += source * starMask * pow(twinkle, 6.0) * 1.2;

  // Final gentle highlight knee.
  col = col / (1.0 + max(col - 0.9, 0.0));
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
