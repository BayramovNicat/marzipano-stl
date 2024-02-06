const RES_16K = true;

function createView() {
    return new Marzipano.RectilinearView(
        null,
        Marzipano.RectilinearView.limit.traditional(8192, (120 * Math.PI) / 180)
    );
}

function createGeometry() {
    const geometryOptions = [
        { tileSize: 256, size: 256, fallbackOnly: true },
        { tileSize: 512, size: 512 },
        { tileSize: 512, size: 1024 },
        { tileSize: 512, size: 2048 },
    ];

    if (RES_16K) {
        geometryOptions.push({ tileSize: 512, size: 4096 });
    }

    return new Marzipano.CubeGeometry(geometryOptions);
}

let viewerInstance;
function setViewer(panoElement) {
    viewerInstance = new Marzipano.Viewer(panoElement, {
        stage: { progressive: true },
        controls: {
            scrollZoom: true,
        },
    });
}
function getViewer() {
    return viewerInstance;
}

let angle = 73;
function setAngle(newAngle) {
    angle = newAngle;
}
function getAngle() {
    return angle;
}

let activePano;
function setActivePano(pano) {
    activePano = pano;
}
function getActivePano() {
    return activePano;
}

export default {
    RES_16K,
    GEOMETRY: createGeometry(),
    VIEW: createView(),
    setViewer,
    getViewer,
    setAngle,
    getAngle,
    setActivePano,
    getActivePano,
};
