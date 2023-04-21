'use strict';

module.exports = [
  'attribute vec3 aVertexPosition;',
  'attribute vec2 aTextureCoord;',

  'uniform sampler2D uDepthmap;',
  'uniform float uDepth;',
  'uniform mat4 uViewportMatrix;',
  'uniform mat4 uProjMatrix;',
  'uniform mat4 uViewMatrix;',
  'uniform mat4 uModelMatrix;',

  'varying vec2 vTextureCoord;',

  `
  float i(in float a, in float b) {
    return b == 0.0 ? sign(a)*1.570796 : atan(a, b);
  }

  void main(void) {
    vec3 c = normalize(vec3(uModelMatrix * vec4(aVertexPosition, 1.0)));

    float x = (1.0 - i(-c.z, c.x)/3.141593)*0.5;
    float y = 0.5 - i(-c.y, sqrt(c.x*c.x + c.z*c.z))/3.141593;
    vec4 f = texture2D(uDepthmap, vec2(x, y));

    float j = (f.r*65536.0 + f.g*256.0 + f.b)/65793.0;
    vec3 b = c*(1.0 - j);
    
    vec3 a = vec3(uViewMatrix * vec4(b, 1));

    gl_Position = uViewportMatrix * uProjMatrix * vec4(a, 1.0);
    gl_Position.z = uDepth * gl_Position.w;
    vTextureCoord = aTextureCoord;
  }
  `
].join('\n');
