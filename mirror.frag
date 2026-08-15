precision mediump float;

uniform sampler2D u_texture;
uniform float u_time;

varying vec3 vNormal;


// ------------------------------------------------------------
// Distance from point to line segment
// ------------------------------------------------------------

float distToLine(vec2 p, vec2 a, vec2 b) {

    vec2 pa = p - a;
    vec2 ba = b - a;

    float denom = max(dot(ba, ba), 0.000001);

    float h = clamp(
        dot(pa, ba) / denom,
        0.0,
        1.0
    );

    return length(pa - ba * h);
}


// ------------------------------------------------------------
// Main
// ------------------------------------------------------------

void main() {

    vec3 n = normalize(vNormal);


    // ============================================================
    // BLACK SPHERE
    // ============================================================

    vec3 color = vec3(0.0);


    // ============================================================
    // LIGHTNING COORDINATES
    //
    // The lightning is attached to the sphere surface through
    // the normal vector.
    // ============================================================

    vec2 p = vec2(n.x, n.y);


    // ============================================================
    // SINGLE LIGHTNING BOLT
    //
    // Fixed geometry.
    //
    // No branches.
    // ============================================================

    vec2 P0 = vec2( 0.00,  0.92);
    vec2 P1 = vec2(-0.04,  0.56);
    vec2 P2 = vec2(-0.13,  0.10);
    vec2 P3 = vec2( 0.02, -0.34);
    vec2 P4 = vec2(-0.04, -0.92);


    // ------------------------------------------------------------
    // Distance to each segment
    // ------------------------------------------------------------

    float d0 = distToLine(p, P0, P1);
    float d1 = distToLine(p, P1, P2);
    float d2 = distToLine(p, P2, P3);
    float d3 = distToLine(p, P3, P4);

    float boltDist = min(
        min(d0, d1),
        min(d2, d3)
    );


    // ============================================================
    // 13-FRAME LIGHTNING EVENT
    //
    // 30 FPS
    //
    // 13 frames = 0.433 seconds
    //
    // Then:
    //
    // 4 seconds completely dark
    //
    // Then the event repeats.
    // ============================================================

    float eventDuration = 13.0 / 30.0;

    float pauseDuration = 4.0;

    float cycleDuration =
        eventDuration + pauseDuration;

    float cycleTime =
        mod(u_time, cycleDuration);


    // ------------------------------------------------------------
    // frame = 0 means the 4-second dark interval
    // ------------------------------------------------------------

    int frame = 0;

    if (cycleTime < eventDuration) {

        frame =
            int(floor(cycleTime * 30.0)) + 1;

    }


    // ============================================================
    // FRAME PARAMETERS
    // ============================================================

    float coreWidth = 0.0;
    float coreBrightness = 0.0;
    float glow = 0.0;
    float cloudLight = 0.0;


    // ============================================================
    // FRAME 1
    //
    // Small atmospheric pre-flash
    // ============================================================

    if (frame == 1) {

        cloudLight = 0.15;

    }


    // ============================================================
    // FRAME 2
    //
    // Stronger atmospheric pre-flash
    // ============================================================

    if (frame == 2) {

        cloudLight = 0.45;

    }


    // ============================================================
    // FRAME 3
    //
    // FIRST RETURN STROKE
    // ============================================================

    if (frame == 3) {

        coreWidth = 0.030;
        coreBrightness = 1.00;
        glow = 1.00;
        cloudLight = 1.00;

    }


    // ============================================================
    // FRAME 4
    // ============================================================

    if (frame == 4) {

        coreWidth = 0.030;
        coreBrightness = 1.00;
        glow = 0.90;
        cloudLight = 0.90;

    }


    // ============================================================
    // FRAME 5
    // ============================================================

    if (frame == 5) {

        coreWidth = 0.029;
        coreBrightness = 0.95;
        glow = 0.80;
        cloudLight = 0.80;

    }


    // ============================================================
    // FRAME 6
    // ============================================================

    if (frame == 6) {

        coreWidth = 0.028;
        coreBrightness = 0.85;
        glow = 0.65;
        cloudLight = 0.65;

    }


    // ============================================================
    // FRAME 7
    // ============================================================

    if (frame == 7) {

        coreWidth = 0.027;
        coreBrightness = 0.70;
        glow = 0.50;
        cloudLight = 0.50;

    }


    // ============================================================
    // FRAME 8
    // ============================================================

    if (frame == 8) {

        coreWidth = 0.025;
        coreBrightness = 0.40;
        glow = 0.20;
        cloudLight = 0.30;

    }


    // ============================================================
    // FRAME 9
    //
    // COMPLETE DARK INTERVAL INSIDE THE STRIKE
    // ============================================================

    if (frame == 9) {

        coreWidth = 0.0;
        coreBrightness = 0.0;
        glow = 0.0;
        cloudLight = 0.0;

    }


    // ============================================================
    // FRAME 10
    //
    // SECOND RETURN STROKE
    // ============================================================

    if (frame == 10) {

        coreWidth = 0.029;
        coreBrightness = 0.90;
        glow = 0.80;
        cloudLight = 0.75;

    }


    // ============================================================
    // FRAME 11
    // ============================================================

    if (frame == 11) {

        coreWidth = 0.027;
        coreBrightness = 0.65;
        glow = 0.50;
        cloudLight = 0.50;

    }


    // ============================================================
    // FRAME 12
    //
    // THIN / DOTTED REMNANT
    // ============================================================

    if (frame == 12) {

        coreWidth = 0.010;
        coreBrightness = 0.25;
        glow = 0.0;
        cloudLight = 0.10;

    }


    // ============================================================
    // FRAME 13
    //
    // EXTINCTION
    // ============================================================

    if (frame == 13) {

        coreWidth = 0.0;
        coreBrightness = 0.0;
        glow = 0.0;
        cloudLight = 0.0;

    }


    // ============================================================
    // LIGHTNING CORE
    // ============================================================

    float core = 0.0;

    if (coreWidth > 0.0) {

        core = smoothstep(
            coreWidth,
            coreWidth * 0.18,
            boltDist
        );

        core *= coreBrightness;

    }


    // ============================================================
    // FRAME 12 BEADED / DOTTED REMNANT
    // ============================================================

    if (frame == 12) {

        float beadNoise =
            fract(
                sin(p.y * 137.31)
                * 43758.5453
            );

        float beadMask =
            step(0.55, beadNoise);

        core *= beadMask;

    }


    // ============================================================
    // SOFT LIGHTNING HALO
    // ============================================================

    float halo = 0.0;

    if (glow > 0.0) {

        halo =
            smoothstep(
                0.075,
                0.0,
                boltDist
            );

        halo *= glow;

    }


    // ============================================================
    // BROAD ATMOSPHERIC FLASH
    // ============================================================

    float atmosphere =
        smoothstep(
            1.15,
            0.0,
            distance(
                p,
                vec2(0.0, 0.25)
            )
        );

    atmosphere *= cloudLight;


    // ============================================================
    // LIGHTNING COLOURS
    // ============================================================

    vec3 white =
        vec3(1.0, 1.0, 1.0);

    vec3 blueGlow =
        vec3(0.55, 0.75, 1.0);

    vec3 atmosphericBlue =
        vec3(0.25, 0.38, 0.55);


    // ============================================================
    // COMPOSITE
    // ============================================================

    color +=
        white * core;

    color +=
        blueGlow *
        halo *
        0.75;

    color +=
        atmosphericBlue *
        atmosphere *
        0.45;


    // ============================================================
    // FINAL OUTPUT
    // ============================================================

    color =
        clamp(
            color,
            0.0,
            1.0
        );

    gl_FragColor =
        vec4(
            color,
            1.0
        );
}