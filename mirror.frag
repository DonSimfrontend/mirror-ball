precision mediump float;

uniform sampler2D u_texture;

varying vec3 vNormal;

void main() {

    vec3 n = normalize(vNormal);

    vec2 uv;

    uv.x = n.x * 0.25 + 0.5;
    uv.y = n.y * 0.5 + 0.5;

    uv.y = 1.0 - uv.y;

    vec4 tex = texture2D(u_texture, uv);

    gl_FragColor = tex;
}