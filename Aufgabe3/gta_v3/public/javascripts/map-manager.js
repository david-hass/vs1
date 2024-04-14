// File origin: VS1LAB A2 

/**
 * A class to help using the MapQuest map service.
 */
// eslint-disable-next-line no-unused-vars
export class MapManager {
    #apiKey

    /**
     * Create a new MapManager instance
     * @param {string} apiKey Your MapQuest API Key
     */
    constructor(apiKey) {
        this.#apiKey = apiKey;
    }

    /**
     * Generate a MapQuest image URL for the specified parameters
     * @param {number} latitude The map center latitude
     * @param {number} longitude The map center longitude
     * @param {{latitude, longitude, name}[]} tags The map tags, defaults to just the current location
     * @param {number} zoom The map zoom, defaults to 11
     * @returns {string} URL of generated map
     */
    getMapUrl(latitude, longitude, tags = [], zoom = 15) {
        if (this.#apiKey === '') {
            console.log("No API key provided.");
            return "images/mapview.jpg";
        }

        const tagList = tags.reduce(
            (acc, tag) => acc += `|lonlat:${tag.longitude},${tag.latitude};type:material;color:#4c905a`
            , `lonlat:${longitude},${latitude};type:material;color:#ff0000`);

        const url =
            "https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth"
            + "&width=600"
            + "&height=400"
            + `&center=lonlat:${longitude},${latitude}`
            + `&zoom=${zoom}`
            + `&marker=${encodeURIComponent(tagList)}`
            + "&apiKey=cea0d0153a7444249aba237f37fedcdd"

        return url
    }
}
