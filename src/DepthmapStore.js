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

  // TODO Other types of depthmap.
  stage.loadImage(source, null, function (err, asset) {
    
    // TODO error.
    if (err) {
      return;
    }

    stage.createTexture(null, asset, function (err, _tile, asset, texture) {

      // TODO error.
      if (err) {
        return;
      }

      self._asset = asset;
      self._texture = texture;
    });
  });
}

eventEmitter(DepthmapStore);


/**
 * Destructor.
 */
DepthmapStore.prototype.destroy = function () {

  var asset = this._asset;
  var texture = this._texture;

  // Destroy asset.
  if (asset) {
    asset.destroy();
  }

  // Destroy texture.
  if (texture) {
    texture.destroy();
  }

  clearOwnProperties(this);
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
 * Return the depthmap texture {@link Source}.
 * @return {WTexture}
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


module.exports = DepthmapStore;
