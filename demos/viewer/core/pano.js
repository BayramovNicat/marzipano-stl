import panoramasData from "../data/panoramas.js";

const panoramas = panoramasData;

function findPano(panoId) {
    return panoramas.find((panorama) => panorama.id === panoId);
}

export default {
    panoramas,
    findPano,
};
