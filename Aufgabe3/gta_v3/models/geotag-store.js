// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */

class InMemoryGeoTagStore {
    #state;

    constructor(tags = []) {
        this.#state = tags
    }



    addGeoTag(tag) {
        this.#state.push(tag)
    }

    removeGeoTag(tagName) {
        const tagI = this.#state.findIndex(({ name }) => name === tagName)
        if (tagI) {
            this.#state = this.#state.toSpliced(tagI, 1)
        }
    }

    getNearbyGeoTags({ latitude, longitude }, radius = 20) {
        const a = this.#state.filter(t =>
            (+latitude - radius <= t.latitude && t.latitude <= +latitude + radius)
            && (+longitude - radius <= t.longitude && t.longitude <= +longitude + radius)
        )
        console.log(a)
        return a
    };

    searchNearbyGeoTags(loc, term, radius = 20) {
        return this.getNearbyGeoTags(loc, radius).filter(t => t.name.includes(term) || t.hashtag.includes(term))
    }

}

module.exports = InMemoryGeoTagStore
