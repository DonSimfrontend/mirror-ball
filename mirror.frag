precision mediump float;

uniform sampler2D u_texture;
uniform float u_time;

varying vec3 vPosition;


// --------------------------------------------------
// DISTANCE TO LINE SEGMENT
// --------------------------------------------------

float segmentDistance(
    vec2 p,
    vec2 a,
    vec2 b
) {

    vec2 pa = p - a;
    vec2 ba = b - a;

    float h =
        clamp(
            dot(pa, ba) /
            dot(ba, ba),
            0.0,
            1.0
        );

    return length(
        pa - ba * h
    );
}


void main() {

    // --------------------------------------------------
    // SPHERE POSITION
    // --------------------------------------------------

    vec3 p =
        normalize(
            vPosition
        );

    float PI =
        3.14159265;


    // --------------------------------------------------
    // SPHERICAL COORDINATES
    // --------------------------------------------------

    float longitude =
        atan(
            p.z,
            p.x
        );

    float latitude =
        asin(
            clamp(
                p.y,
                -1.0,
                1.0
            )
        );

    float u =
        longitude /
        (2.0 * PI)
        + 0.5;

    float v =
        latitude /
        PI
        + 0.5;


    // --------------------------------------------------
    // DELIBERATELY DISTORT TIM
    // --------------------------------------------------

    float distortedU =
        fract(
            u * 2.5
        );

    float distortedV =
        pow(
            clamp(
                v,
                0.0,
                1.0
            ),
            0.55
        );


    // Strong horizontal distortion

    distortedU +=
        sin(
            v *
            PI *
            6.0
        )
        * 0.12;


    // Pole distortion

    float poleWarp =
        abs(
            v - 0.5
        ) * 2.0;

    distortedU +=
        poleWarp *
        sin(
            v * 30.0
        )
        * 0.08;


    distortedU =
        fract(
            distortedU
        );


    vec2 textureUV =
        vec2(
            distortedU,
            distortedV
        );


    // --------------------------------------------------
    // SAMPLE TIM
    // --------------------------------------------------

    vec3 tim =
        texture2D(
            u_texture,
            textureUV
        ).rgb;


    // --------------------------------------------------
    // GRID
    // --------------------------------------------------

    float lonCount =
        48.0;

    float latCount =
        24.0;

    vec2 gridUV =
        vec2(
            u * lonCount,
            v * latCount
        );

    vec2 cell =
        fract(
            gridUV
        );


    // Vertical

    float lonDistance =
        abs(
            cell.x - 0.5
        );

    float lonLine =
        1.0 -
        smoothstep(
            0.0,
            0.012,
            lonDistance
        );


    // Horizontal

    float latDistance =
        abs(
            cell.y - 0.5
        );

    float latLine =
        1.0 -
        smoothstep(
            0.0,
            0.012,
            latDistance
        );


    // Diagonal

    float diagonalDistance =
        abs(
            cell.x -
            cell.y
        );

    float diagonalLine =
        1.0 -
        smoothstep(
            0.0,
            0.015,
            diagonalDistance
        );


    float grid =
        max(
            max(
                lonLine,
                latLine
            ),
            diagonalLine
        );


    // --------------------------------------------------
    // LIGHTNING BOLT
    // --------------------------------------------------

    vec2 P0 =
        vec2(
            0.505,
            0.94
        );

    vec2 P1 =
        vec2(
            0.475,
            0.84
        );

    vec2 P2 =
        vec2(
            0.515,
            0.75
        );

    vec2 P3 =
        vec2(
            0.480,
            0.65
        );

    vec2 P4 =
        vec2(
            0.525,
            0.54
        );

    vec2 P5 =
        vec2(
            0.485,
            0.43
        );

    vec2 P6 =
        vec2(
            0.520,
            0.32
        );

    vec2 P7 =
        vec2(
            0.478,
            0.21
        );

    vec2 P8 =
        vec2(
            0.505,
            0.08
        );


    float d =
        999.0;


    d =
        min(
            d,
            segmentDistance(
                vec2(u, v),
                P0,
                P1
            )
        );

    d =
        min(
            d,
            segmentDistance(
                vec2(u, v),
                P1,
                P2
            )
        );

    d =
        min(
            d,
            segmentDistance(
                vec2(u, v),
                P2,
                P3
            )
        );

    d =
        min(
            d,
            segmentDistance(
                vec2(u, v),
                P3,
                P4
            )
        );

    d =
        min(
            d,
            segmentDistance(
                vec2(u, v),
                P4,
                P5
            )
        );

    d =
        min(
            d,
            segmentDistance(
                vec2(u, v),
                P5,
                P6
            )
        );

    d =
        min(
            d,
            segmentDistance(
                vec2(u, v),
                P6,
                P7
            )
        );

    d =
        min(
            d,
            segmentDistance(
                vec2(u, v),
                P7,
                P8
            )
        );


    // --------------------------------------------------
    // LIGHTNING TIMING
    // --------------------------------------------------

    float cycle =
        mod(
            u_time,
            2.433333
        );

    float frame =
        cycle * 30.0;

    float lightning =
        0.0;


    if (
        frame >= 2.0 &&
        frame < 6.0
    ) {

        lightning = 1.0;

    }

    else if (
        frame >= 6.0 &&
        frame < 8.0
    ) {

        lightning = 0.65;

    }

    else if (
        frame >= 8.0 &&
        frame < 9.0
    ) {

        lightning = 0.25;

    }

    else if (
        frame >= 10.0 &&
        frame < 11.0
    ) {

        lightning = 1.0;

    }

    else if (
        frame >= 11.0 &&
        frame < 12.0
    ) {

        lightning = 0.45;

    }

    else if (
        frame >= 12.0 &&
        frame < 13.0
    ) {

        lightning = 0.12;

    }

    else {

        lightning = 0.0;
    }


    // --------------------------------------------------
    // LIGHTNING WIDTH — REDUCED
    // --------------------------------------------------

    float width =
        mix(
            0.030,
            0.090,
            lightning
        );


    float bolt =
        1.0 -
        smoothstep(
            0.0,
            width,
            d
        );

    bolt *=
        lightning;


    // --------------------------------------------------
    // TIM + BLACK GRID
    // --------------------------------------------------

    vec3 color =
        mix(
            tim,
            vec3(0.0),
            grid
        );


    // --------------------------------------------------
    // WHITE LIGHTNING
    // --------------------------------------------------

    color =
        mix(
            color,
            vec3(1.0),
            bolt
        );


    gl_FragColor =
        vec4(
            color,
            1.0
        );
}