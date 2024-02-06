import Viewer from "../core/viewer.js";

const DISTANCE = 0.2;

const delta = {
    x: 0,
    y: 0,
    z: 0,
};

function deltaByAngle(angle, radius) {
    const angleInRadians = (angle * Math.PI) / 180;
    const x = Number((radius * Math.cos(angleInRadians)).toFixed(2));
    const y = Number((radius * Math.sin(angleInRadians)).toFixed(2));
    delta.x = x;
    delta.y = 0;
    delta.z = y;
}

function goto(duration, x, y, z) {
    const { VIEW } = Viewer;

    const tx = 0,
        ty = 0,
        tz = 0,
        dx = x - tx,
        dy = y - ty,
        dz = z - tz;

    Marzipano.util.tween(
        duration,
        (tweenVal) => {
            VIEW.setTx(tx + dx * tweenVal);
            VIEW.setTy(ty + dy * tweenVal);
            VIEW.setTz(tz + dz * tweenVal);
        },
        () => {}
    );
}

function cameraForward(link) {
    const arrowAngle =
        link.angle -
        Viewer.getAngle() +
        Viewer.getActivePano().north_angle -
        90 +
        (Viewer.getViewer().view().yaw() * 180) / Math.PI;
    deltaByAngle(arrowAngle, DISTANCE);
    goto(500, delta.x, delta.y, delta.z);
}

function cameraReset() {
    setTimeout(() => {
        goto(0, 0, 0, 0);
        delta.x = 0;
        delta.y = 0;
        delta.z = 0;
    }, 501);
}

export default {
    cameraForward,
    cameraReset,
};
