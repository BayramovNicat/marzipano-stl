'use strict';

var WebGlBaseRenderer = require('./WebGlBase');
var inherits = require('../util/inherits');

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
function WebGlCubeDepthRenderer() {
  this.constructor.super_.apply(this, arguments);
}

inherits(WebGlCubeDepthRenderer, WebGlBaseRenderer);

module.exports = WebGlCubeDepthRenderer;