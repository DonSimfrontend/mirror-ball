precision mediump float;

attribute vec3 aPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vPosition;

void main() {
    vec4 position =
        uModelViewMatrix *
        vec4(aPosition, 1.0);

    vPosition = aPosition;

    gl_Position =
        uProjectionMatrix *
        position;
}