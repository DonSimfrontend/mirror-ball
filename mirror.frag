precision highp float;

uniform sampler2D u_env;
uniform float u_time;

varying vec3 vNormal;
varying vec3 vPosition;


vec2 directionToUV(vec3 dir)
{
    float longitude = atan(dir.z, dir.x);
    float latitude = asin(clamp(dir.y, -1.0, 1.0));

    float u = 0.5 + longitude / (2.0 * 3.14159265);
    float v = 0.5 - latitude / 3.14159265;

    return vec2(u, v);
}


void main()
{
    vec3 normal = normalize(vNormal);

    vec3 viewDir =
        normalize(-vPosition);


    vec3 reflection =
        reflect(
            -viewDir,
            normal
        );


    vec2 uv =
        directionToUV(reflection);


    vec3 env =
        texture2D(
            u_env,
            uv
        ).rgb;


    // make the reflection sharper
    env =
        pow(
            env,
            vec3(0.45)
        );


    // Fresnel reflection strength
    float fresnel =
        pow(
            1.0 - max(dot(viewDir, normal), 0.0),
            4.0
        );


    // chrome dark mirror base
    vec3 chrome =
        env * 1.35;


    chrome =
        mix(
            chrome * 0.25,
            chrome,
            fresnel
        );


    // bright reflective rim
    chrome += fresnel * 0.35;


    gl_FragColor =
        vec4(
            chrome,
            1.0
        );
}