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
  `,

  'void main(void) {',

  `
    mat4 flipMatrix = mat4(
      vec4(-1.0, 0.0, 0.0, 0.0),
      vec4(0.0, 1.0, 0.0, 0.0),
      vec4(0.0, 0.0, 1.0, 0.0),
      vec4(0.0, 0.0, 0.0, 1.0)
    );

    float sh = 0.0, ch = 0.0;
    vec3 ds = vec3(1.0, 0.0, -1.0);

    vec3 a = vec3(flipMatrix * uModelMatrix * vec4(aVertexPosition, 1.0)),
      g = normalize(a),
      b = g,
      c = normalize(a);

    vec2 h;
    h.x = (1.0 - i(-c.z, -c.x)/3.141593)*0.5,
    h.y = 0.5 - i(-c.y, sqrt(c.x*c.x + c.z*c.z))/3.141593;
    vec4 f = texture2D(uDepthmap, h);

    float j = (f.r*65536.0 + f.g*256.0 + f.b)/65793.0,
      d = ds.x,
      k = ds.y;
      
    if (ds.z > 0.0) {
      b = 100.0*d*b*(1.0/max(pow(j, ds.z) - k/10.0, 0.01)/length(b));
    } else { 
      float l = 1.0, m = 0.0;
      if (d < 0.0) {
        d = -d,
        l = -1.0,
        m = 1.0;
      }
      b = b*(d - (pow(j, -ds.z)*l + m) * (d - k*d));
    }

    a = vec3(flipMatrix * uViewMatrix * vec4(b, 1)),
    g = normalize(a);

    vec2 e = vec2(a.x, a.z);
    e = e/max(1.0, length(e));
    vec3 p = vec3(e.x, clamp(a.y * inversesqrt(1.0 + a.x*a.x + a.z*a.z), -30.0, 30.0), e.y);
    b = mix(a, mix(g, p, ch), sh);
    vec4 q = vec4(b, 1);

    gl_Position = uProjMatrix * q,
    vTextureCoord = aTextureCoord;
  `,

  // `
  //   //vec3 a = vec3(uModelMatrix * vec4(aVertexPosition, 1.0));
  //   gl_Position = uViewportMatrix * uProjMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
  // `,

  // '  gl_Position = uViewportMatrix * uProjMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);',
  // '  vTextureCoord = aTextureCoord;',
  '}'
].join('\n');
