'use strict';

// Create viewer.
var viewer = new Marzipano.Viewer(document.getElementById('pano'), {
  stage: {widthSegments: 200, heightSegments: 200}
});

// Create source.
var source = Marzipano.ImageUrlSource.fromString("panos/{f}.jpg");

// Create geometry.
var geometry = new Marzipano.CubeGeometry([{ tileSize: 2048, size: 2048 }]);

// Depth map.
var depthmap = "depthmap.stl";

// Create view.
var limiter = Marzipano.RectilinearView.limit.traditional(4096, 100 * Math.PI / 180);
var view = new Marzipano.RectilinearView({
  oz: 2.0,
  invertControl: true,
}, limiter);

// Create scene.
var scene = viewer.createScene({
  source: source,
  geometry: geometry,
  //depthmap: depthmap,
  view: view,
  pinFirstLevel: true
});

// Display scene.
scene.switchTo();
