precision mediump float;

uniform sampler2D u_texture;

varying vec3 vNormal;

void main() {

    vec3 n = normalize(vNormal);

    // Existing working spherical projection
    vec2 uv;

    uv.x = n.x * 0.25 + 0.5;
    uv.y = n.y * 0.5 + 0.5;

    uv.y = 1.0 - uv.y;

    vec4 tex = texture2D(u_texture, uv);


    // Soft sphere lighting
    vec3 lightDir = normalize(vec3(-0.4, 0.6, 1.0));

    float light = dot(n, lightDir);
    light = clamp(light, 0.0, 1.0);

    // Gentle lift, keep texture visible
    float shading = mix(0.65, 1.0, light);


    // Subtle edge highlight
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    float fresnel = 1.0 - abs(dot(n, viewDir));
    fresnel = pow(fresnel, 3.0);


    vec3 color = tex.rgb * shading;

    // tiny rim light
    color += vec3(1.0, 0.7, 0.3) * fresnel * 0.15;


    gl_FragColor = vec4(color, tex.a);

}