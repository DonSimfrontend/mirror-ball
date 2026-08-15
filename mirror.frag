precision mediump float;

varying vec3 vPosition;

void main() {

    vec3 p = normalize(vPosition);

    float PI = 3.14159265;

    // Spherical coordinates
    float longitude = atan(p.z, p.x);
    float latitude  = asin(clamp(p.y, -1.0, 1.0));

    // DOUBLE grid density
    float lonCount = 48.0;
    float latCount = 24.0;

    float u =
        (longitude / (2.0 * PI) + 0.5) * lonCount;

    float v =
        (latitude / PI + 0.5) * latCount;

    vec2 cell = fract(vec2(u, v));


    // --------------------------------------------------
    // THIN VERTICAL / HORIZONTAL LINES
    // --------------------------------------------------

    float lonDistance = abs(cell.x - 0.5);
    float latDistance = abs(cell.y - 0.5);

    float lonLine =
        1.0 - smoothstep(0.0, 0.012, lonDistance);

    float latLine =
        1.0 - smoothstep(0.0, 0.012, latDistance);


    // --------------------------------------------------
    // THIN DIAGONAL LINES
    // --------------------------------------------------

    float diagonalDistance =
        abs(cell.x - cell.y);

    float diagonalLine =
        1.0 - smoothstep(
            0.0,
            0.015,
            diagonalDistance
        );


    // Combine
    float lines =
        max(
            max(lonLine, latLine),
            diagonalLine
        );


    // --------------------------------------------------
    // COLOUR
    // --------------------------------------------------

    vec3 red =
        vec3(1.0, 0.0, 0.0);

    vec3 black =
        vec3(0.0);

    vec3 color =
        mix(red, black, lines);

    gl_FragColor =
        vec4(color, 1.0);
}