precision highp float;

uniform sampler2D u_env;
uniform float u_time;

varying vec3 vNormal;
varying vec3 vPosition;


vec2 directionToUV(vec3 dir)
{
    float longitude =
        atan(dir.z, dir.x);

    float latitude =
        asin(dir.y);

    float u =
        0.5 +
        longitude / (2.0 * 3.14159265);

    float v =
        0.5 -
        latitude / 3.14159265;

    return vec2(u,v);
}


void main()
{

    vec3 normal =
        normalize(vNormal);


    // camera looking down -Z
    vec3 viewDir =
        normalize(-vPosition);


    vec3 reflection =
        reflect(
            -viewDir,
            normal
        );


    vec2 uv =
        directionToUV(reflection);


    vec3 colour =
        texture2D(
            u_env,
            uv
        ).rgb;


    // chrome contrast
    colour =
        pow(
            colour,
            vec3(0.7)
        );


    gl_FragColor =
        vec4(
            colour,
            1.0
        );
}