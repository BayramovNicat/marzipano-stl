import Pano from "./core/pano.js";
import Viewer from "./core/viewer.js";
import Scene from "./core/scene.js";
import Arrows from "./plugins/arrows.js";
import Navigation from "./plugins/navigation.js";

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
