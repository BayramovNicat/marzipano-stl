class Pano {
    panoramas = [];

    loadPanos(panos) {
        this.panoramas = panos;
    }

    findPano(panoId) {
        return this.panoramas.find((panorama) => panorama.id === panoId);
    }
}

export default new Pano();
