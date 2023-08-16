'use strict';

var NetworkError = require('../NetworkError');
var once = require('../util/once');

/**
 * @class HtmlModelLoader
 * @implements ModelLoader
 * @classdesc
 *
 * A {@link Loader} for HTML models.
 *
 * @param {Stage} stage The stage which is going to request images to be loaded.
 */
function HtmlModelLoader(stage) {
  this._stage = stage;
}

/**
 * Loads an {@link Asset} from a 3D model file.
 * @param {string} url The 3D model URL.
 * @param {function(?Error, Asset)} done The callback.
 * @return {function()} A function to cancel loading.
 */
HtmlModelLoader.prototype.loadModel = function (url, done) {
  var self = this;

  done = once(done);

  fetch(url)
    .then(response => response.text())
    .then(data => {
      self._handleLoad(data, done);
    })
    .catch(error => {
      self._handleError(url, done);
    });

  function cancel() {
    done.apply(null, arguments);
  }

  return cancel;
};

HtmlModelLoader.prototype._handleLoad = function (data, done) {
  const positions = [];
  const indices = [];

  // Split the STL data into lines
  const lines = data.trim().split('\n');

  // Iterate through each line to extract positions and indices
  let vertexIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const parts = line.split(' ');

    if (parts[0] === 'vertex') {
      // Parse vertex position and add it to the positions array
      const vertex = line.trim().split(/\s+/).slice(1).map(parseFloat);

      const x = vertex[0];
      const z = vertex[1];
      const y = vertex[2];

      //positions.push(x, y, z);
      positions.push(z, y, x);
      //positions.push(-x, -y, -z);
      vertexIndex++;
    } else if (parts[0] === 'facet') {
      // Skip the facet normal line
      i++;
    } else if (parts[0] === 'endloop') {
      // Create face by adding vertex indices
      indices.push(vertexIndex - 3, vertexIndex - 2, vertexIndex - 1);
    }
  }

  done(null, { positions, indices });
};

HtmlModelLoader.prototype._handleError = function (url, done) {
  // TODO: is there any way to distinguish a network error from other
  // kinds of errors? For now we always return NetworkError since this
  // prevents images to be retried continuously while we are offline.
  done(new NetworkError('Network error: ' + url));
};

module.exports = HtmlModelLoader;