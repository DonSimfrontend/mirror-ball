precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vTexCoord;

void main() {
  // Fixed source: no UV movement, warping, scanning or broad lighting.
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

  float redOrange = smoothstep(0.20, 0.58, source.r) *
                    smoothstep(0.03, 0.40, source.r - source.b * 0.62);
  float blue = smoothstep(0.17, 0.58, source.b) *
               smoothstep(0.015, 0.30, source.b - source.r * 0.58);
  float selected = max(redOrange, blue);

  // 10x energy boost to the existing bright coloured filaments.
  vec3 filament = pow(max(source, 0.0), vec3(2.2));
  col += filament * detail * selected * 7.5;

  // Sparse star-like sparkles remain anchored to the image.
  float seed = fract(sin(dot(uv, vec2(127.1, 311.7))) * 43758.5453);
  float starMask = step(0.985, seed) * selected * detail;
  float twinkle = 0.5 + 0.5 * sin(uTime * (1.4 + seed * 3.0) + seed * 40.0);
  col += source * starMask * pow(twinkle, 6.0) * 1.8;

  // Keep colour saturated and prevent a white/grey wash.
  float mx = max(col.r, max(col.g, col.b));
  float mn = min(col.r, min(col.g, col.b));
  float chroma = mx - mn;
  col += (col - vec3(mn)) * selected * chroma * 0.18;

  gl_FragColor = vec4(min(col, 1.0), 1.0);
}
