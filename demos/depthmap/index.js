'use strict';

// Create viewer.
var viewer = new Marzipano.Viewer(document.getElementById('pano'));

// Create source.
var source = Marzipano.ImageUrlSource.fromString("panos/{f}.jpg");

// Create geometry.
var geometry = new Marzipano.CubeGeometry([{ tileSize: 1250, size: 1250 }]);

// Depth map.
var depthmap = "depthmap.jpg";

// Create view.
var limiter = Marzipano.RectilinearView.limit.traditional(4096, 100 * Math.PI / 180);
//var view = new Marzipano.RectilinearView(null, limiter);
var view = new Marzipano.RectilinearView(null);

// Create scene.
var scene = viewer.createScene({
  source: source,
  geometry: geometry,
  depthmap: depthmap,
  view: view,
  pinFirstLevel: true
});

// Display scene.
scene.switchTo();
