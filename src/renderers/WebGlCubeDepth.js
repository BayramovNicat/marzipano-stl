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
var setDepthmapTexture = WebGlCommon.setDepthmapTexture

var vertexSrc = require('../shaders/vertexCubeDepth');
var fragmentSrc = require('../shaders/fragmentCubeDepth');

/*
var vertexIndices = [
  0, 1, 2, 0, 2, 3, // front
  4, 5, 6, 4, 6, 7, // back
  8, 9, 10, 8, 10, 11, // top
  12, 13, 14, 12, 14, 15, // bottom
  16, 17, 18, 16, 18, 19, // right
  20, 21, 22, 20, 22, 23, // left
];
var vertexPositions = [
  // Front face
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
  // Back face
  -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
  // Top face
  -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
  // Bottom face
  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
  // Right face
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
  // Left face
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
];
var textureCoords = [
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,   // Front face.
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,   // Back face.
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,   // Top face.
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,   // Bottom face.
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,   // Right face.
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,   // Left face.
];
*/

//var vertexIndices = [0, 1, 2, 0, 2, 3];
//var vertexPositions = [-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 0.0];
//var textureCoords = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];

// var vertexIndices = [
//   0, 1, 2, 0, 2, 3,
//   4, 5, 6, 4, 6, 7,
//   8, 9, 10, 8, 10, 11,
//   12, 13, 14, 12, 14, 15,
// ];
// var vertexPositions = [
//   -0.5, -0.5, 0.0, 0.0, -0.5, 0.0, 0.0, 0.0, 0.0, -0.5, 0.0, 0.0,
//   0.0, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0,
//   0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.5, 0.0,
//   -0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, -0.5, 0.5, 0.0,
// ];
// var textureCoords = [
//   0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.0, 0.5,
//   0.5, 0.0, 1.0, 0.0, 1.0, 0.5, 0.5, 0.5,
//   0.5, 0.5, 1.0, 0.5, 1.0, 1.0, 0.5, 1.0,
//   0.0, 0.5, 0.5, 0.5, 0.5, 1.0, 0.0, 1.0,
// ];

// var vertexIndices = [];
// var vertexPositions = [];
// var textureCoords = [];

// // Define the number of segments in width and height
// var numSegmentsWidth = 10;
// var numSegmentsHeight = 10;

// // Calculate the width and height of each segment
// var segmentWidth = 1.0 / numSegmentsWidth;
// var segmentHeight = 1.0 / numSegmentsHeight;

// // Loop through each segment in height and width
// for (var i = 0; i < numSegmentsHeight; i++) {
//   for (var j = 0; j < numSegmentsWidth; j++) {
//     // Calculate the vertex positions and texture coordinates for this segment
//     var x1 = -0.5 + j * segmentWidth;
//     var y1 = -0.5 + i * segmentHeight;
//     var x2 = -0.5 + (j + 1) * segmentWidth;
//     var y2 = -0.5 + (i + 1) * segmentHeight;
//     var z = 0.0;
    
//     var pos = [
//       x1, y1, z,
//       x2, y1, z,
//       x2, y2, z,
//       x1, y2, z
//     ];
//     vertexPositions.push(...pos);

//     // Add the vertex indices for this segment
//     var baseIndex = i * (numSegmentsWidth + 1) + j;
//     var indices = [
//       baseIndex, baseIndex + 1, baseIndex + numSegmentsWidth + 2,
//       baseIndex, baseIndex + numSegmentsWidth + 2, baseIndex + numSegmentsWidth + 1
//     ];
//     vertexIndices.push(...indices);

//     // Add the texture coordinates for this segment
//     var texCoords = [
//       j * segmentWidth, i * segmentHeight,
//       (j + 1) * segmentWidth, i * segmentHeight,
//       (j + 1) * segmentWidth, (i + 1) * segmentHeight,
//       j * segmentWidth, (i + 1) * segmentHeight
//     ];
//     textureCoords.push(...texCoords);
//   }
// }
// console.log(vertexIndices);
// console.log(vertexPositions);
// console.log(textureCoords);

// Define the number of segments for width and height
const widthSegments = 200;
const heightSegments = 200;

// Initialize arrays for vertexIndices, vertexPositions, and textureCoords
const vertexIndices = [];
const vertexPositions = [];
const textureCoords = [];

// Loop through each row and column to generate vertices, texture coordinates, and indices
for (let row = 0; row <= heightSegments; row++) {
  const v = row / heightSegments;
  for (let col = 0; col <= widthSegments; col++) {
    const u = col / widthSegments;

    // Calculate vertex positions
    const x = u - 0.5;
    const y = v - 0.5;
    const z = 0.0;
    vertexPositions.push(x, y, z);

    // Calculate texture coordinates
    textureCoords.push(u, v);

    // Calculate vertex indices
    if (row < heightSegments && col < widthSegments) {
      const a = row * (widthSegments + 1) + col;
      const b = a + 1;
      const c = (row + 1) * (widthSegments + 1) + col;
      const d = c + 1;
      vertexIndices.push(a, b, c, b, d, c);
    }
  }
}

var attribList = ['aVertexPosition', 'aTextureCoord'];
var uniformList = [
  'uDepth', 'uOpacity', 'uSampler', 'uDepthmap', 'uProjMatrix', 'uViewMatrix', 'uModelMatrix', 'uViewportMatrix',
  'uColorOffset', 'uColorMatrix'
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
function WebGlCubeDepthRenderer(gl) {
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

  this.constantBuffers = createConstantBuffers(gl, vertexIndices, vertexPositions, textureCoords);

  this.shaderProgram = createShaderProgram(gl, vertexSrc, fragmentSrc, attribList, uniformList);
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
  mat4.rotateX(modelMatrix, modelMatrix, tile.rotX());
  mat4.rotateY(modelMatrix, modelMatrix, tile.rotY());
  mat4.translate(modelMatrix, modelMatrix, translateVector);
  mat4.scale(modelMatrix, modelMatrix, scaleVector);

  gl.uniformMatrix4fv(shaderProgram.uModelMatrix, false, modelMatrix);

  // Depth, Texture, DepthmapTexture.
  setDepth(gl, shaderProgram, layerZ, tile.z);
  setTexture(gl, shaderProgram, texture);
  setDepthmapTexture(gl, shaderProgram, layer.depthmapStore().texture())

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, constantBuffers.vertexIndices);
  gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_SHORT, 0);
};

module.exports = WebGlCubeDepthRenderer;