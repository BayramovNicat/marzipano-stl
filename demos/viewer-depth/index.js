import Pano from "../viewer/core/pano.js";
import Viewer from "../viewer/core/viewer.js";
import Scene from "../viewer/core/scene.js";
import Arrows from "../viewer/plugins/arrows.js";
import Navigation from "../viewer/plugins/navigation.js";

import panoramasData from "./data/panoramas.js";
Pano.loadPanos(panoramasData);

// Create view.
const limiter = Marzipano.RectilinearView.limit.traditional(
    4096,
    (100 * Math.PI) / 180
);
const view = new Marzipano.RectilinearView(
    {
        oz: 2.0,
        invertControl: true,
    },
    limiter
);
Viewer.view = view;

// Depth map.
// const depthmap = "depthmap.stl";

// Create geometry.
Viewer.geometry = new Marzipano.CubeGeometry([{ tileSize: 4096, size: 4096 }]);

Scene.createScene = (pano) => {
    const { geometry, view } = Viewer;
    const source = Scene.createImageUrlSource(pano, true);

    return Viewer.getViewer().createScene({
        source,
        geometry,
        view,
        depthmap: `./data/${pano.sequence}.stl`,
        pinFirstLevel: true,
    });
};

// Viewer
Viewer.setViewer(document.querySelector("#pano"));
const viewer = Viewer.getViewer();

// Listeners
function panoListener() {
    Arrows.removeArrows();
    Viewer.getActivePano().links.forEach((i) => {
        Arrows.createArrow(i);
        Scene.loadScene(Pano.findPano(i.id));
    });
    Navigation.cameraReset();
}
function angleListener() {
    const yaw = (viewer.scene().view().yaw() * 180) / Math.PI;
    Viewer.setAngle(yaw + Viewer.getActivePano().north_angle);
    Arrows.rotateArrows();
}
setTimeout(() => {
    viewer.__events.viewChange.push(angleListener);
    viewer.__events.sceneChange.push(panoListener);
});

// Arrow click
const goToPano = (panoId) => {
    Viewer.setActivePano(Pano.findPano(panoId));
    Scene.loadScene(Viewer.getActivePano()).switchTo();
};
Arrows.setArrowClick((link) => {
    Navigation.cameraForward(link);
    goToPano(link.id);
});

// Init first pano
const fov = 180;
setTimeout(() => {
    goToPano(Pano.panoramas[0].id);
    viewer
        .scene()
        .view()
        .setFov((fov * Math.PI) / 180);
}, 10);
