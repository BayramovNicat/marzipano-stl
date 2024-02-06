import Viewer from "./viewer.js";

const IMG_HOST = "https://img.gothru.org/";

function getFaceCoordinates(face, face_width) {
    switch (face) {
        case "f":
            return { x1: 0, y1: 0, x2: face_width, y2: face_width };
        case "b":
            return {
                x1: face_width,
                y1: 0,
                x2: face_width * 2,
                y2: face_width,
            };
        case "u":
            return {
                x1: face_width * 2,
                y1: 0,
                x2: face_width * 3,
                y2: face_width,
            };
        case "d":
            return {
                x1: 0,
                y1: face_width,
                x2: face_width,
                y2: face_width * 2,
            };
        case "l":
            return {
                x1: face_width,
                y1: face_width,
                x2: face_width * 2,
                y2: face_width * 2,
            };
        case "r":
            return {
                x1: face_width * 2,
                y1: face_width,
                x2: face_width * 3,
                y2: face_width * 2,
            };
        default:
            throw new Error("Invalid face value");
    }
}

function tileUrl(face, z, x, y, image, version, multiplier) {
    const image_width = 6144 * multiplier;
    const face_width = image_width / 3;
    const faceCoordinates = getFaceCoordinates(face, face_width);
    const tile = Math.pow(2, z - 1);
    const tile_width = face_width / tile;
    const tileCoordinates = {
        x1: faceCoordinates.x1 + tile_width * (x - 1),
        y1: faceCoordinates.y1 + tile_width * (y - 1),
        x2: faceCoordinates.x1 + tile_width * x,
        y2: faceCoordinates.y1 + tile_width * y,
    };
    const resize = `&resize=512x512`;
    const quality = `save=optimize,progressive,qual:70`;
    const end = Viewer.RES_16K ? "&pad=bg:000016" : "";

    return `${IMG_HOST}cube/${image.replace(".jpg", `_${version}.jpg`)}?crop=${
        tileCoordinates.x1
    }x${tileCoordinates.y1}x${tileCoordinates.x2}x${
        tileCoordinates.y2
    }${resize}&${quality}${end}`;
}

function createImageUrlSource(pano) {
    const urlArr = pano.url.split("?");
    const image = urlArr[0];
    const version = parseInt(urlArr[1].split(":")[1]);
    const multiplier = Viewer.RES_16K ? 2 : 1;

    return new Marzipano.ImageUrlSource(
        (tile) => {
            if (tile.z === 0) {
                const mapY = "lfrbud".indexOf(tile.face) / 6;
                return {
                    url: `${IMG_HOST}cube/${image.replace(
                        ".jpg",
                        `_thumb_${version}.jpg`
                    )}?save=optimize,progressive,qual:70`,
                    rect: { x: 0, y: mapY, width: 1, height: 1 / 6 },
                };
            } else {
                return {
                    url: tileUrl(
                        tile.face,
                        tile.z,
                        tile.x + 1,
                        tile.y + 1,
                        image,
                        version,
                        multiplier
                    ),
                };
            }
        },
        { concurrency: 10 }
    );
}

const scenes = [];
function findSceneById(id) {
    return scenes.find((item) => item.id === id)?.scene;
}
function addScene(pano) {
    const scene = Viewer.getViewer().createScene({
        source: createImageUrlSource(pano),
        geometry: Viewer.GEOMETRY,
        view: Viewer.VIEW,
        pinFirstLevel: true,
    });

    scenes.push({
        id: pano.id,
        scene: scene,
    });

    return scene;
}

function loadScene(pano) {
    const existingScene = findSceneById(pano.id);
    if (existingScene) return existingScene;

    return addScene(pano);
}

export default {
    loadScene,
};
