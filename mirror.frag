precision mediump float;

uniform sampler2D u_texture;
uniform float u_time;
varying vec3 vNormal;

void main() {
    vec3 n = normalize(vNormal);

    float longitude = atan(n.z, n.x);
    float latitude = asin(clamp(n.y, -1.0, 1.0));

    vec2 uv;

    uv.x = longitude / (2.0 * 3.14159265) + 0.5;
    uv.y = latitude / 3.14159265 + 0.5;

    uv.y = 1.0 - uv.y;

    vec4 tex = texture2D(u_texture, uv);

    vec3 lightDir = normalize(vec3(-0.4, 0.6, 1.0));

    float light = dot(n, lightDir);
    light = clamp(light, 0.0, 1.0);

    float shading = mix(0.65, 1.0, light);

    vec3 color = vec3(0.0, 1.0, 0.0) * shading;

    // JAGGED LIGHTNING
    float jag =
        0.035 * sin(n.y * 18.0) +
        0.020 * sin(n.y * 41.0) +
        0.010 * sin(n.y * 83.0);

    float lightning = smoothstep(
        0.035,
        0.0,
        abs(n.x - jag)
    );

    float flicker = step(0.5, fract(u_time * 2.5));
lightning *= flicker;

color = mix(color, vec3(1.0), lightning);

    gl_FragColor = vec4(color, tex.a);
}