'use strict';

// Create viewer.
var viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create source.
// The indexes of the tiles are
// from 1 instead of 0. Hence, we cannot use ImageUrlSource.fromString()
// and must write a custom function to convert tiles into URLs.
var urlPrefix = "panos/38997312";
var tileUrl = function (f, z, x, y) {
  return urlPrefix + "/l" + z + "_" + f + "_" + y + "_" + x + ".jpg";
};
var source = new Marzipano.ImageUrlSource(function (tile) {
  return { url: tileUrl(tile.face, tile.z + 1, tile.x + 1, tile.y + 1) };
});

// Create geometry.
var geometry = new Marzipano.CubeGeometry([
  { tileSize: 512, size: 512 },
  { tileSize: 512, size: 1024 },
  { tileSize: 512, size: 2048 },
  { tileSize: 512, size: 4096 }
]);

// Depth map.
var depthmap = urlPrefix + "depthmap.jpg";

// Create view.
var limiter = Marzipano.RectilinearView.limit.traditional(4096, 100 * Math.PI / 180);
var view = new Marzipano.RectilinearView({
  // position: [0.0, 0.0, 2.0],
  // invertControl: true,
}, limiter);

// Create scene.
var scene = viewer.createScene({
  source: source,
  geometry: geometry,
  // depthmap: depthmap,
  view: view,
  pinFirstLevel: true
});

// Display scene.
scene.switchTo();

function goto(duration, x, y, z) {
  var tx = view.tx();
  var ty = view.ty();
  var tz = view.tz();
  var dx = x - tx;
  var dy = y - ty;
  var dz = z - tz;
  Marzipano.util.tween(duration, function (tweenVal) {
    view.setTx(tx + dx * tweenVal);
    view.setTy(ty + dy * tweenVal);
    view.setTz(tz + dz * tweenVal);
  }, function () { });
}

function addto(duration, x, y, z) {
  var ox = view.ox();
  var oy = view.oy();
  var oz = view.oz();
  var dx = x - ox;
  var dy = y - oy;
  var dz = z - oz;
  Marzipano.util.tween(duration, function (tweenVal) {
    view.setOx(ox + dx * tweenVal);
    view.setOy(oy + dy * tweenVal);
    view.setOz(oz + dz * tweenVal);
  }, function () { });
}

var viewUpElement = document.querySelector('#viewUp');
viewUpElement.addEventListener('click', function () {
  goto(1000, view.tx() + 0.2, 0.0, 0.0);
});
