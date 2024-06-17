// File origin: VS1LAB A2
/* eslint-disable no-unused-vars */

import { LocationHelper } from "./location-helper.js";
import { MapManager } from "./map-manager.js";

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


let currentPage = 1;

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
async function updateLocation() {
    let resolve;
    const res = new Promise((r) => resolve = r)
    if (!document.querySelector("#tag-form-latitude").value || !document.querySelector("#discovery-form-longitude")) {
        LocationHelper.findLocation(({ latitude, longitude }) => {
            const url = new MapManager().getMapUrl(latitude, longitude)
            document.querySelector("#mapView").src = url
            document.querySelector("#tag-form-latitude").value = latitude
            document.querySelector("#tag-form-longitude").value = longitude
            document.querySelector("#discovery-form-latitude").value = latitude
            document.querySelector("#discovery-form-longitude").value = longitude
            resolve({ latitude, longitude })
        })
    }
    return res
}

function updateDiscoveryWidget({ latitude, longitude }, { tags = [], page, maxPages }) {
    const url = new MapManager().getMapUrl(latitude, longitude, tags)
    document.querySelector("#mapView").src = url
    const disRes = document.querySelector("#discoveryResults");
    disRes.innerHTML = ''
    tags.forEach(tag => {
        const li = document.createElement("li");
        li.innerHTML = `${tag.name} (${tag.latitude},${tag.longitude}) ${tag.hashtag}`
        disRes.appendChild(li);
    })
    document.querySelector('#discovery__pagination__inner').innerHTML = `<a>${page}/${maxPages}</a>`
}

async function jsonRequest(url, data, method = "POST") {
    const jsonData = data instanceof FormData ? Object.fromEntries(data.entries()) : data;

    if (method === "GET") {
        const queryParams = new URLSearchParams(data).toString();
        const res = await fetch(url + "?" + queryParams, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
        })
        return res.json()
    }
    else if (method === "POST") {
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        return res.json()
    }
    else { throw new Error("method not supported: " + method) }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", async () => {

    const loc = await updateLocation()
    let searchterm = ""

    jsonRequest("/api/geotags", { ...loc, page: currentPage }, "GET")
        .then(({ tags, page, maxPages }) => updateDiscoveryWidget(loc, { tags, page, maxPages }))


    document.querySelector("#discovery__pagination__prev").addEventListener("click", (e) => {
        jsonRequest("/api/geotags", { ...loc, searchterm, page: --currentPage }, "GET")
            .then(({ tags, page, maxPages }) => { currentPage = page; updateDiscoveryWidget(loc, { tags, page, maxPages }) })
    })
    document.querySelector("#discovery__pagination__next").addEventListener("click", (e) => {
        jsonRequest("/api/geotags", { ...loc, searchterm, page: ++currentPage }, "GET")
            .then(({ tags, page, maxPages }) => { currentPage = page; updateDiscoveryWidget(loc, { tags, page, maxPages }) })
    })

    document.querySelector("#tag-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        console.log(e.target, data, e)
        jsonRequest("/api/geotags", data)
            .then(() => jsonRequest("/api/geotags", data, "GET")
                .then((data) => updateDiscoveryWidget(loc, data)))
    })
    document.querySelector("#discoveryFilterForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        searchterm = data.get("searchterm")
        jsonRequest("/api/geotags", data, "GET")
            .then((data) => updateDiscoveryWidget(loc, data))
    })

});
