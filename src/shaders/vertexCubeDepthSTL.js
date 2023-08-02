'use strict';

module.exports = [
  'attribute vec3 aVertexPosition;',
  'attribute vec2 aTextureCoord;',

  'uniform samplerCube uDepthmap;',
  'uniform float uDepth;',
  'uniform mat4 uViewportMatrix;',
  'uniform mat4 uProjMatrix;',
  'uniform mat4 uViewMatrix;',
  'uniform mat4 uModelMatrix;',

  'varying vec2 vTextureCoord;',

  `
  void main(void) {
    vec3 a = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
    vec3 b = normalize(a);

    vec4 e = textureCube(uDepthmap, a);

    float h = (e.r * 256.0 * 256.0 + e.g * 256.0 + e.b)/65025.0;
    b = b * 1.5 * (1.0 - h);
    a = vec3(uViewMatrix * vec4(b, 1));

    gl_Position = uViewportMatrix * uProjMatrix * vec4(a, 1.0);
    gl_Position.z = uDepth * gl_Position.w;
    vTextureCoord = aTextureCoord;
  }
  `
].join('\n');
