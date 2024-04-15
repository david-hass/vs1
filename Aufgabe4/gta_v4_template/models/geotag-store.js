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
    #nextId = 0;
    #state = {};

    addGeoTag(tag) {
        const newTag = { ...tag, id: this.#nextId }
        this.#state[this.#nextId] = newTag
        this.#nextId += 1
        return newTag
    }


    getGeoTag(id) {
        return this.#state[id]
    }

    updateGeoTag(id, tagUpdate) {
        const tag = this.#state[id]
        if (tag) {
            const updatedTag = { ...tag, ...tagUpdate, id }
            this.#state[id] = updatedTag
            return updatedTag
        }
    }

    removeGeoTag(id) {
        const deleteTag = this.#state[id]
        delete this.#state[id]
        return deleteTag
    }

    getGeoTags(loc, term, radius = 1) {
        let tags = Object.values(this.#state)

        if (loc.latitude && loc.longitude) {
            tags = tags.filter(t =>
                (+loc.latitude - +radius <= +t.latitude && +t.latitude <= +loc.latitude + +radius)
                && (+loc.longitude - +radius <= +t.longitude && +t.longitude <= +loc.longitude + +radius)
            )
        }
        if (term) {
            tags = tags.filter(t => t.name.includes(term) || t.hashtag.includes(term))
        }
        return tags
    }
}

module.exports = InMemoryGeoTagStore
