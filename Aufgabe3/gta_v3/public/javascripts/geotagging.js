// File origin: VS1LAB A2
/* eslint-disable no-unused-vars */

import { LocationHelper } from "./location-helper.js";
import { MapManager } from "./map-manager.js";

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    if (!document.querySelector("#tag-form-latitude").value)
        LocationHelper.findLocation(({ latitude, longitude }) => {
            const tags = JSON.parse(document.querySelector("#mapView").dataset.tags ?? [])

            const url = new MapManager().getMapUrl(latitude, longitude, tags)
            document.querySelector("#mapView").src = url
            document.querySelector("#tag-form-latitude").value = latitude
            document.querySelector("#tag-form-longitude").value = longitude
            document.querySelector("#discovery-form-latitude").value = latitude
            document.querySelector("#discovery-form-longitude").value = longitude
        })
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation()
});
