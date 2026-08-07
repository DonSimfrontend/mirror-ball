#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_envMap;
uniform float u_time;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {

    vec3 normal = normalize(vNormal);

    vec3 viewDir = normalize(-vPosition);

    vec3 reflectDir = reflect(-viewDir, normal);


    // Animate reflection direction
    float angle = u_time * 0.25;

    float c = cos(angle);
    float s = sin(angle);

    reflectDir = vec3(
        c * reflectDir.x - s * reflectDir.z,
        reflectDir.y,
        s * reflectDir.x + c * reflectDir.z
    );


    // Convert reflection vector to spherical UV

    float u = 0.5 + atan(reflectDir.z, reflectDir.x) / (2.0 * 3.14159265);

    float v = 0.5 - asin(reflectDir.y) / 3.14159265;


    vec3 env = texture2D(
        u_envMap,
        vec2(u, v)
    ).rgb;


    // Fresnel rim

    float fresnel = pow(
        1.0 - dot(viewDir, normal),
        3.0
    );


    env *= 0.65;
    env += fresnel * 0.8;


    gl_FragColor = vec4(env, 1.0);
}