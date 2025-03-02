let map = L.map("map").setView([10, 10], 2); 
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = [];

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".searchQuery").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            searchLocation();
        }
    });
});

function searchLocation() {
    const query = document.querySelector(".searchQuery").value.trim();
    if (query.length < 3) return;

    axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(response => {
            if (response.data && response.data.length > 0) {
                const location = response.data[0];
                const lat = parseFloat(location.lat);
                const lon = parseFloat(location.lon);
                map.setView([lat, lon], 13);
                findNearbyMosques(lat, lon);
            } else {
                showNoResults("No location found. Please try again.");
            }
        })
        .catch(error => console.error("Error fetching location:", error));
}

function findNearbyMosques(lat, lon) {
    axios.get(`https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="place_of_worship"](around:5000,${lat},${lon});out;`)
        .then(response => {
            const resultsList = document.querySelector(".mosque-list");
            resultsList.innerHTML = "";
            clearMarkers();

            if (response.data && response.data.elements.length > 0) {
                const mosques = response.data.elements.slice(0, 2); // Show only 2 mosques
                mosques.forEach((place, index) => {
                    const name = place.tags?.name || "Unknown Mosque";
                    const street = place.tags?.["addr:street"] || "Street not available";
                    const rating = index % 2 === 0 ? "★★★★★" : "★★★★☆"; // Manual rating
                    
                    const marker = L.marker([place.lat, place.lon]).addTo(map)
                        .bindPopup(`<b>${name}</b><br>${street}<br>Rating: ${rating}`);
                    markers.push(marker);

                    const mosqueCard = document.createElement("div");
                    mosqueCard.classList.add("mosque-card");

                    const mosqueName = document.createElement("h3");
                    mosqueName.textContent = name;
                    
                    const mosqueAddress = document.createElement("p");
                    mosqueAddress.classList.add("address");
                    mosqueAddress.textContent = street;
                    
                    const mosqueRating = document.createElement("div");
                    mosqueRating.classList.add("rating");
                    mosqueRating.textContent = rating;

                    mosqueCard.appendChild(mosqueName);
                    mosqueCard.appendChild(mosqueAddress);
                    mosqueCard.appendChild(mosqueRating);
                    resultsList.appendChild(mosqueCard);
                });
            } else {
                showNoResults("No mosques found nearby.");
            }
        })
        .catch(error => console.error("Error fetching mosques:", error));
}

function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

function showNoResults(message) {
    const resultsList = document.querySelector(".mosque-list");
    resultsList.innerHTML = `<p class='no-results'>${message}</p>`;
}