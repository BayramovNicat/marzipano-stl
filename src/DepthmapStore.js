'use strict';

var eventEmitter = require('minimal-event-emitter');
var clearOwnProperties = require('./util/clearOwnProperties');

/**
 * @class DepthmapStore
 * @classdesc
 *
 * A DepthmapStore maintains a cache of depthmap data used to render a {@link Layer}.
 *
 * Multiple layers belonging to the same underlying {@link WebGlStage} may
 * share the same DepthmapStore. Layers belonging to distinct {@link WebGlStage}
 * instances may not do so due to restrictions on the use of textures across
 * stages.
 *
 * @param {string} source The underlying source url.
 * @param {Stage} stage The underlying stage.
 * @param {Object} opts Options.
 */
function DepthmapStore(source, stage, opts) {

  var self = this;

  opts = opts || {};

  self._source = source;
  self._stage = stage;

  self._asset = null;
  self._texture = null;
  self._cubeTexture = null;

  // TODO Other types of depthmap.
  self._sourceType = source.split('.').pop();
  if (self._sourceType == 'stl') {
    // Load STL file.
    stage.loadModel(source, function(err, { positions, indices }) {
      if (err) {
        return;
      }

      // Make 3D model as depth cube texture.
      self.createCubeTexture(self._stage._gl, positions, indices);

    });
  } else {
    stage.loadImage(source, null, function (err, asset) {
      if (err) {
        return;
      }

      stage.createTexture(null, asset, function (err, _tile, asset, texture) {
        if (err) {
          return;
        }

        self._asset = asset;
        self._texture = texture;
      });
    });
  }
}

eventEmitter(DepthmapStore);


/**
 * Destructor.
 */
DepthmapStore.prototype.destroy = function () {

  var gl = this._stage._gl;
  var asset = this._asset;
  var texture = this._texture;
  var cubeTexture = this._cubeTexture;

  // Destroy asset.
  if (asset) {
    asset.destroy();
  }

  // Destroy texture.
  if (texture) {
    texture.destroy();
  }

  // Destroy cube texture.
  if (cubeTexture) {
    gl.deleteTexture(cubeTexture);
  }

  clearOwnProperties(this);
};

// TODO Optimize the following functions.
function E(gl, a, b, c) {
  gl.texParameteri(a, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(a, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(a, gl.TEXTURE_MAG_FILTER, b);
  gl.texParameteri(a, gl.TEXTURE_MIN_FILTER, c ? gl.LINEAR : b)
}

function za() {
  var l = "undefined" !== typeof Float32Array ? new Float32Array(16) : Array(16);
  df(l);
  return l
}

function df(l) {
  l[0] = l[5] = l[10] = l[15] = 1;
  l[1] = l[2] = l[3] = l[4] = l[6] = l[7] = l[8] = l[9] = l[11] = l[12] = l[13] = l[14] = 0
}

function Rd(l, a, c, b, d, O, B, f, k, n, e, h, p, m, g, z, y) {
  l[0] = a;
  l[1] = c;
  l[2] = b;
  l[3] = d;
  l[4] = O;
  l[5] = B;
  l[6] = f;
  l[7] = k;
  l[8] = n;
  l[9] = e;
  l[10] = h;
  l[11] = p;
  l[12] = m;
  l[13] = g;
  l[14] = z;
  l[15] = y
}

function zd(l, a, c, b, d, O, B, f, k, n) {
  l[0] = a;
  l[1] = c;
  l[2] = b;
  l[3] = 0;
  l[4] = d;
  l[5] = O;
  l[6] = B;
  l[7] = 0;
  l[8] = f;
  l[9] = k;
  l[10] = n;
  l[11] = 0;
  l[12] = 0;
  l[13] = 0;
  l[14] = 0;
  l[15] = 1
}

function ye(l, a, c, b, d) {
  Rd(l, a, 0, 0, 0, 0, a, 0, 0, b, d, 1, 0, c * b, c * d, c, 1)
}

function Sb(l, a) {
  var c = a[0]
    , b = a[1]
    , d = a[2]
    , O = a[3]
    , B = a[4]
    , f = a[5]
    , k = a[6]
    , n = a[7]
    , e = a[8]
    , h = a[9]
    , p = a[10]
    , m = a[11]
    , g = a[12]
    , z = a[13]
    , y = a[14]
    , x = a[15]
    , A = l[0]
    , E = l[1]
    , C = l[2]
    , q = l[3];
  l[0] = A * c + E * B + C * e + q * g;
  l[1] = A * b + E * f + C * h + q * z;
  l[2] = A * d + E * k + C * p + q * y;
  l[3] = A * O + E * n + C * m + q * x;
  A = l[4];
  E = l[5];
  C = l[6];
  q = l[7];
  l[4] = A * c + E * B + C * e + q * g;
  l[5] = A * b + E * f + C * h + q * z;
  l[6] = A * d + E * k + C * p + q * y;
  l[7] = A * O + E * n + C * m + q * x;
  A = l[8];
  E = l[9];
  C = l[10];
  q = l[11];
  l[8] = A * c + E * B + C * e + q * g;
  l[9] = A * b + E * f + C * h + q * z;
  l[10] = A * d + E * k + C * p + q * y;
  l[11] = A * O + E * n + C * m + q * x;
  A = l[12];
  E = l[13];
  C = l[14];
  q = l[15];
  l[12] = A * c + E * B + C * e + q * g;
  l[13] = A * b + E * f + C * h + q * z;
  l[14] = A * d + E * k + C * p + q * y;
  l[15] = A * O + E * n + C * m + q * x;
}

function Gd(l, a, c, b) {

  const ia = 0.017453292519943295;

  var d, O, g;
  d = c * ia;
  c = Math.cos(d);
  O = Math.sin(d);
  d = -a * ia;
  a = Math.cos(d);
  g = Math.sin(d);
  d = -b * ia;
  b = Math.cos(d);
  d = Math.sin(d);
  zd(l, -g * b - a * O * d, -g * d + a * O * b, -a * c, -c * d, c * b, O, a * b - g * O * d, a * d + g * O * b, -g * c);
}

function Ad(l, a, c, b) {
  Rd(l, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, a, c, b, 1)
}

function se(l, a) {
  var c = l[0]
    , b = l[1]
    , d = l[2]
    , O = l[3]
    , g = l[4]
    , f = l[5]
    , k = l[6]
    , n = l[7]
    , e = l[8]
    , h = l[9]
    , p = l[10]
    , m = l[11]
    , I = l[12]
    , z = l[13]
    , y = l[14]
    , x = l[15]
    , A = a[0]
    , E = a[1]
    , C = a[2]
    , q = a[3]
    , v = a[4]
    , M = a[5]
    , u = a[6]
    , Q = a[7]
    , F = a[8]
    , aa = a[9]
    , U = a[10]
    , w = a[11]
    , yc = a[12]
    , Ha = a[13]
    , r = a[14]
    , J = a[15];
  l[0] = A * c + E * g + C * e + q * I;
  l[1] = A * b + E * f + C * h + q * z;
  l[2] = A * d + E * k + C * p + q * y;
  l[3] = A * O + E * n + C * m + q * x;
  l[4] = v * c + M * g + u * e + Q * I;
  l[5] = v * b + M * f + u * h + Q * z;
  l[6] = v * d + M * k + u * p + Q * y;
  l[7] = v * O + M * n + u * m + Q * x;
  l[8] = F * c + aa * g + U * e + w * I;
  l[9] = F * b + aa * f + U * h + w * z;
  l[10] = F * d + aa * k + U * p + w * y;
  l[11] = F * O + aa * n + U * m + w * x;
  l[12] = yc * c + Ha * g + r * e + J * I;
  l[13] = yc * b + Ha * f + r * h + J * z;
  l[14] = yc * d + Ha * k + r * p + J * y;
  l[15] = yc * O + Ha * n + r * m + J * x
}

function na(gl, program, verticesBuffer, indicesBuffer, verticesArray, indicesArray) {

  const size = 512;
  const e = [
    gl.TEXTURE_CUBE_MAP_POSITIVE_X,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y
  ];

  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  E(gl, gl.TEXTURE_CUBE_MAP, gl.NEAREST, false);
  for (let i = 0; i < 6; i++) {
    gl.texImage2D(e[i], 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  }
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

  var renderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);

  let h = [];
  for (let i = 0; i < 6; i++) {
    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, e[i], texture, 0);
    h.push(frameBuffer);
  }

  //e = da.useShader(b, 62);
  gl.useProgram(program);

  let t = za();
  let c = za();
  var k = za();

  var p = -1 / -99999.9;
  var m = 1 / (size / 2);

  Rd(c, m, 0, 0, 0, 0, -m, 0, 0, 0, 0, 100000.1 * p, 1, 0, 0, -(2e4 * p), 0);
  ye(k, size / 2, 0, 0, 0);
  Sb(k, c);

  const mp = gl.getUniformLocation(program, 'mp');
  gl.uniformMatrix4fv(mp, false, k);

  const viewPort = gl.getParameter(gl.VIEWPORT);
  gl.viewport(0, 0, size, size);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE_MINUS_SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  var p = { x: 0, y: 0, z: 0 };
  var G = verticesArray;
  var n = G.length;

  var q = 1e7;
  var m = 0;
  var H, r, u;

  for (c = 0; c < n; c += 3) {
    H = G[c];
    r = G[c + 1];
    u = G[c + 2];
    H = H * H + r * r + u * u;
    H < q && (q = H);
    H > m && (m = H);
  }

  Math.sqrt(q);
  m = Math.ceil(Math.sqrt(m) + /*p.length()*/ 0);
  //m *= /*a.farscale*/ 1;

  //gl.uniform1f(e.r, m);
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  const vx = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(vx);
  gl.vertexAttribPointer(vx, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.disable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  G = za();

  const mx = gl.getUniformLocation(program, 'mx');
  for (let i = 0; i < 6; i++) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, h[i]);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    Gd(t, i < 4 ? 90 * (i - 0) : 90, i == 5 ? 90 : i == 5 ? -90 : 0, 0);    // Rotation?
    Ad(G, -1 * p.z, 1 * p.y, 1 * p.x);
    se(t, G);
    
    gl.uniformMatrix4fv(mx, false, t);
    gl.drawElements(gl.TRIANGLES, indicesArray.length, gl.UNSIGNED_INT, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, null);
  }

  gl.enable(gl.CULL_FACE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(viewPort[0], viewPort[1], viewPort[2], viewPort[3]);
  gl.deleteRenderbuffer(renderBuffer);

  return texture;
}

/**
 * Make 3D model as depth cube texture..
 * @param {Array} positions 3D model positions.
 * @param {Array} indices 3D model indicies.
 */
DepthmapStore.prototype.createCubeTexture = function (gl, positions, indices) {

  // Define the vertex shader code
  const vertexShaderSource = `
    attribute vec3 a_position;
    uniform mat4 mx, mp;

    varying float w;

    void main() {
      vec4 v = mp * mx * vec4(a_position, 1.0);
      gl_Position = v;
      w = v.w;
    }
  `;

  // Define the fragment shader code
  const fragmentShaderSource = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
    #else
        precision mediump float;
    #endif

    varying float w;

    void main() {
      vec3 b;
      b.x = (gl_FragCoord.x-256.0)/255.5,
      b.y = (gl_FragCoord.y-256.0)/255.5,
      b.z = -1.0;

      float e = length(b);
      float c = 1.0 - w*e/15.0;
      c = c * 255.0 * 255.0 * 255.0;

      vec4 a;
      a.r = floor(c/256.0/256.0),
      a.g = floor((c-a.r*256.0*256.0)/256.0),
      a.b = floor(c-a.r*256.0*256.0-a.g*256.0),
      a /= 255.0,
      a.a = 1.0;

      gl_FragColor = a;
    }
  `;

  // Create and compile the shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  // Create the shader program and attach the shaders
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // Convert the vertices and indices to Float32Array and Uint32Array
  const verticesArray = new Float32Array(positions);
  const indicesArray = new Uint32Array(indices);

  // Create and bind the buffer for the rectangle vertices
  const verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesArray, gl.STATIC_DRAW);

  const indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesArray, gl.STATIC_DRAW);

  this._cubeTexture = na(gl,program, verticesBuffer, indicesBuffer, verticesArray, indicesArray);

  // Delete resources.
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  gl.deleteProgram(program);
  gl.deleteBuffer(verticesBuffer);
  gl.deleteBuffer(indicesBuffer);
};

/**
 * Return the underlying {@link Stage}.
 * @return {Stage}
 */
DepthmapStore.prototype.stage = function () {
  return this._stage;
};

/**
 * Return the underlying source.
 * @return {string}
 */
DepthmapStore.prototype.source = function () {
  return this._source;
};

/**
 * Return the underlying source type.
 * @return {string}
 */
DepthmapStore.prototype.sourceType = function () {
  return this._sourceType;
};

/**
 * Return the depthmap asset {@link Source}.
 * @return {Asset}
 */
DepthmapStore.prototype.asset = function () {
  return this._asset;
};

/**
 * Return the depthmap texture {@link WebGlTexture}.
 * @return {WebGlTexture}
 */
DepthmapStore.prototype.texture = function () {
  return this._texture;
};

/**
 * Return the depthmap cube texture.
 */
DepthmapStore.prototype.cubeTexture = function () {
  return this._cubeTexture;
};

module.exports = DepthmapStore;
