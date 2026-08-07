precision highp float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {

  vec4 position = uModelViewMatrix * vec4(aPosition, 1.0);

  vPosition = position.xyz;

  vNormal = normalize(
    uNormalMatrix * aNormal
  );

  gl_Position =
    uProjectionMatrix * position;

}