'use strict';

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;
var clearOwnProperties = require('../util/clearOwnProperties');

var WebGlCommon = require('./WebGlCommon');
var createConstantBuffers = WebGlCommon.createConstantBuffers;
var destroyConstantBuffers = WebGlCommon.destroyConstantBuffers;
var createShaderProgram = WebGlCommon.createShaderProgram;
var destroyShaderProgram = WebGlCommon.destroyShaderProgram;
var enableAttributes = WebGlCommon.enableAttributes;
var disableAttributes = WebGlCommon.disableAttributes;
var setViewport = WebGlCommon.setViewport;
var setupPixelEffectUniforms = WebGlCommon.setupPixelEffectUniforms;

var setDepth = WebGlCommon.setDepth;
var setTexture = WebGlCommon.setTexture;
var setDepthmapTexture = WebGlCommon.setDepthmapTexture;
var setDepthmapCubeTexture = WebGlCommon.setDepthmapCubeTexture;

var vertexSrc = require('../shaders/vertexCubeDepth');
var fragmentSrc = require('../shaders/fragmentCubeDepth');
var vertexSTLSrc = require('../shaders/vertexCubeDepthSTL');

// Initialize arrays for vertexIndices, vertexPositions, and textureCoords
var vertexIndices = [];
var vertexPositions = [];
var textureCoords = [];

var defaultWidthSegments = 40;
var defaultHeightSegments = 40;

function createVertexDatas(widthSegments, heightSegments) {

  // Loop through each row and column to generate vertices, texture coordinates, and indices
  for (var row = 0; row <= heightSegments; row++) {
    var v = row / heightSegments;
    for (var col = 0; col <= widthSegments; col++) {
      var u = col / widthSegments;

      // Calculate vertex positions
      var x = u - 0.5;
      var y = v - 0.5;
      var z = 0.0;
      vertexPositions.push(x, y, z);

      // Calculate texture coordinates
      textureCoords.push(u, v);

      // Calculate vertex indices
      if (row < heightSegments && col < widthSegments) {
        var a = row * (widthSegments + 1) + col;
        var b = a + 1;
        var c = (row + 1) * (widthSegments + 1) + col;
        var d = c + 1;
        vertexIndices.push(a, b, c, b, d, c);
      }
    }
  }
}

var attribList = ['aVertexPosition', 'aTextureCoord'];
var uniformList = [
  'uDepth', 'uOpacity', 'uSampler', 'uDepthmap', 'uProjMatrix', 'uViewMatrix',
  'uModelMatrix', 'uViewportMatrix', 'uColorOffset', 'uColorMatrix'
];



/**
 * @class WebGlCubeDepthRenderer
 * @implements Renderer
 * @classdesc
 *
 * A renderer for {@link CubeGeometry} and {@link RectilinearView} with depthmap, appropriate
 * for a {@link WebGlStage}.
 *
 * Most users do not need to instantiate this class. Renderers are created and
 * destroyed by {@link Stage} as necessary.
 */
function WebGlCubeDepthRenderer(gl, opts) {
  this.gl = gl;

  // The projection matrix positions the tiles in world space.
  // We compute it in Javascript because lack of precision in the vertex shader
  // causes seams to appear between adjacent tiles at large zoom levels.
  this.projMatrix = mat4.create();

  // TODO Why save this value here? the same question to the projMatrix.
  this.viewMatrix = mat4.create();

  // The viewport matrix responsible for viewport clamping.
  // See setViewport() for an explanation of how it works.
  this.viewportMatrix = mat4.create();

  // Translation and scale vectors for tiles.
  this.translateVector = vec3.create();
  this.scaleVector = vec3.create();

  var widthSegments = opts && opts.widthSegments ? opts.widthSegments : defaultWidthSegments;
  var heightSegments = opts && opts.heightSegments ? opts.heightSegments : defaultHeightSegments;
  createVertexDatas(widthSegments, heightSegments);
  
  this.constantBuffers = createConstantBuffers(gl, vertexIndices, vertexPositions, textureCoords);

  if (opts.layer.depthmapStore().sourceType() == 'stl') {
    this.shaderProgram = createShaderProgram(gl, vertexSTLSrc, fragmentSrc, attribList, uniformList);
  } else {
    this.shaderProgram = createShaderProgram(gl, vertexSrc, fragmentSrc, attribList, uniformList);
  }
}

WebGlCubeDepthRenderer.prototype.destroy = function () {
  destroyConstantBuffers(this.gl, this.constantBuffers);
  destroyShaderProgram(this.gl, this.shaderProgram);
  clearOwnProperties(this);
};

WebGlCubeDepthRenderer.prototype.startLayer = function (layer, rect) {
  var gl = this.gl;
  var shaderProgram = this.shaderProgram;
  var constantBuffers = this.constantBuffers;
  var viewportMatrix = this.viewportMatrix;

  gl.useProgram(shaderProgram);

  enableAttributes(gl, shaderProgram);

  setViewport(gl, layer, rect, viewportMatrix);
  gl.uniformMatrix4fv(shaderProgram.uViewportMatrix, false, viewportMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, constantBuffers.vertexPositions);
  gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, gl.FALSE, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, constantBuffers.textureCoords);
  gl.vertexAttribPointer(shaderProgram.aTextureCoord, 2, gl.FLOAT, gl.FALSE, 0, 0);

  setupPixelEffectUniforms(gl, layer.effects(), {
    opacity: shaderProgram.uOpacity,
    colorOffset: shaderProgram.uColorOffset,
    colorMatrix: shaderProgram.uColorMatrix
  });
};

WebGlCubeDepthRenderer.prototype.endLayer = function (layer, rect) {
  var gl = this.gl;
  var shaderProgram = this.shaderProgram;
  disableAttributes(gl, shaderProgram);
};

WebGlCubeDepthRenderer.prototype.renderTile = function (tile, texture, layer, layerZ) {
  var gl = this.gl;
  var shaderProgram = this.shaderProgram;
  var constantBuffers = this.constantBuffers;
  var projMatrix = this.projMatrix;
  var viewMatrix = this.viewMatrix;
  var translateVector = this.translateVector;
  var scaleVector = this.scaleVector;

  mat4.copy(projMatrix, layer.view().projection());
  gl.uniformMatrix4fv(shaderProgram.uProjMatrix, false, projMatrix);

  mat4.copy(viewMatrix, layer.view().viewMatrix());
  gl.uniformMatrix4fv(shaderProgram.uViewMatrix, false, viewMatrix);

  // Generate ModelMatrix.
  // TODO Cache the matrix in the tile object?
  translateVector[0] = tile.centerX();
  translateVector[1] = tile.centerY();
  translateVector[2] = -0.5;

  scaleVector[0] = tile.scaleX();
  scaleVector[1] = tile.scaleY();
  scaleVector[2] = 1.0;

  var modelMatrix = mat4.create();
  if (layer.depthmapStore().sourceType() != 'stl') {
    mat4.rotateY(modelMatrix, modelMatrix, -Math.PI / 2);
  }
  mat4.rotateX(modelMatrix, modelMatrix, tile.rotX());
  mat4.rotateY(modelMatrix, modelMatrix, tile.rotY());
  mat4.translate(modelMatrix, modelMatrix, translateVector);
  mat4.scale(modelMatrix, modelMatrix, scaleVector);

  gl.uniformMatrix4fv(shaderProgram.uModelMatrix, false, modelMatrix);

  // Depth, Texture.
  setDepth(gl, shaderProgram, layerZ, tile.z);
  setTexture(gl, shaderProgram, texture);

  // DepthmapTexture.
  var depthmapStore = layer.depthmapStore();
  if (depthmapStore.sourceType() == 'stl') {
    setDepthmapCubeTexture(gl, shaderProgram, depthmapStore.cubeTexture());
  } else {
    setDepthmapTexture(gl, shaderProgram, depthmapStore.texture());
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, constantBuffers.vertexIndices);
  gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_SHORT, 0);
};

module.exports = WebGlCubeDepthRenderer;