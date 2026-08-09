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

    float glow = smoothstep(0.08, 0.0, abs(n.x - jag));
    glow *= flicker;

    float jag2 =
        0.035 * sin(n.y * 16.0 + 1.3) +
        0.018 * sin(n.y * 37.0 + 0.7) +
        0.009 * sin(n.y * 71.0 + 2.1);

    float lightning2 = smoothstep(
        0.035,
        0.0,
        abs(n.x - (jag2 - 0.16))
    );
    lightning2 *= flicker;

    float glow2 = smoothstep(0.08, 0.0, abs(n.x - (jag2 - 0.16)));
    glow2 *= flicker;

    float highlight = clamp(lightning + 0.18 * glow * (1.0 - lightning), 0.0, 1.0);
    float highlight2 = clamp(lightning2 + 0.18 * glow2 * (1.0 - lightning2), 0.0, 1.0);
    highlight = max(highlight, highlight2);
    color = mix(color, vec3(1.0), highlight);

    gl_FragColor = vec4(color, tex.a);
}