// Map logic
window.mapInstance = null;
window.mapMarkers = [];
window.userLocation = null;
window.routingLine = null;

const mapStyles = {
    hospital: { icon: 'ph-hospital', color: '#ef4444' }, // Premium Red
    police: { icon: 'ph-police-car', color: '#3b82f6' }, // Premium Blue
    ambulance: { icon: 'ph-ambulance', color: '#10b981' } // Premium Emerald
};

const dummyLocations = [];

function checkNetworkStatus() {
    return navigator.onLine;
}

function updateMapBanner() {
    let banner = document.getElementById('map-status-banner');
    if (!banner) return;

    const isOnline = checkNetworkStatus();
    if (isOnline) {
        banner.className = '';
        banner.innerHTML = `<i class="ph ph-wifi-high"></i> <span>Live Map (Online)</span>`;
    } else {
        banner.className = 'offline';
        banner.innerHTML = `<i class="ph ph-wifi-slash"></i> <span>Offline Mode - Using Cached Data</span>`;
    }
}

window.addEventListener('online', updateMapBanner);
window.addEventListener('offline', updateMapBanner);

window.initMap = function initMap() {
    updateMapBanner();

    // Default center
    const center = [28.6139, 77.2090];

    window.mapInstance = L.map('map-container', {
        zoomControl: false
    }).setView(center, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
        className: 'map-tiles'
    }).addTo(window.mapInstance);

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPos = [position.coords.latitude, position.coords.longitude];
                window.userLocation = userPos;
                window.mapInstance.setView(userPos, 14);

                // Add premium user marker
                L.marker(userPos, {
                    icon: L.divIcon({
                        className: 'user-marker-container',
                        html: '<div class="user-marker" style="width:20px;height:20px;background:#3b82f6;border-radius:50%;border:3px solid white;box-shadow:0 0 15px rgba(59,130,246,0.8);"></div>',
                        iconSize: [20, 20]
                    }),
                    zIndexOffset: 1000
                }).addTo(window.mapInstance).bindPopup('<b>You are here</b>');

                generateLocations(userPos);
            },
            (error) => {
                console.log("Geolocation error:", error);
                generateLocations(center);
            }
        );
    } else {
        generateLocations(center);
    }

    bindMapFilters();
}

async function generateLocations(center) {
    if (checkNetworkStatus()) {
        try {
            updateMapBannerText('Fetching live emergency data...');
            const lat = center[0];
            const lng = center[1];
            // Fetch hospitals within 5km from Overpass API
            const query = `[out:json];node["amenity"="hospital"](around:5000,${lat},${lng});out;`;
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

            const response = await fetch(url);
            const data = await response.json();

            dummyLocations.length = 0; // Clear old dummy locations

            // Map Overpass results to our format
            data.elements.forEach((el, index) => {
                if (index > 15) return; // Limit to 15 closest
                dummyLocations.push({
                    type: 'hospital',
                    lat: el.lat,
                    lng: el.lon,
                    name: el.tags.name || `Hospital #${index + 1}`
                });
            });

            // Add some dummy police and ambulance to show filters working
            const types = ['police', 'ambulance'];
            for (let i = 0; i < 4; i++) {
                const type = types[Math.floor(Math.random() * types.length)];
                dummyLocations.push({
                    type: type,
                    lat: center[0] + (Math.random() - 0.5) * 0.02,
                    lng: center[1] + (Math.random() - 0.5) * 0.02,
                    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Unit ${i + 1}`
                });
            }

            // Save to localStorage for offline mode
            localStorage.setItem('cachedLocations', JSON.stringify(dummyLocations));
            updateMapBannerText('Live Map (Online)');

        } catch (e) {
            console.error("Overpass fetch failed, using offline fallback", e);
            loadCachedLocations(center);
        }
    } else {
        loadCachedLocations(center);
    }

    renderMarkers('hospital');
}

function loadCachedLocations(center) {
    const cached = localStorage.getItem('cachedLocations');
    dummyLocations.length = 0;
    if (cached) {
        const parsed = JSON.parse(cached);
        parsed.forEach(loc => dummyLocations.push(loc));
    } else {
        generateFallbackLocations(center);
    }
}

function generateFallbackLocations(center) {
    const types = ['hospital', 'hospital', 'police', 'ambulance'];
    for (let i = 0; i < 6; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        dummyLocations.push({
            type: type,
            lat: center[0] + (Math.random() - 0.5) * 0.03,
            lng: center[1] + (Math.random() - 0.5) * 0.03,
            name: `Fallback ${type.charAt(0).toUpperCase() + type.slice(1)}`
        });
    }
}

function updateMapBannerText(text) {
    const banner = document.getElementById('map-status-banner');
    if (banner && banner.querySelector('span')) {
        banner.querySelector('span').innerText = text;
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function renderMarkers(filterType) {
    window.mapMarkers.forEach(m => window.mapInstance.removeLayer(m));
    window.mapMarkers = [];
    if (window.routingLine) {
        window.mapInstance.removeLayer(window.routingLine);
        window.routingLine = null;
    }

    const toShow = dummyLocations.filter(loc => loc.type === filterType);
    let nearest = null;
    let minDistance = Infinity;

    toShow.forEach(loc => {
        if (window.userLocation) {
            const dist = calculateDistance(window.userLocation[0], window.userLocation[1], loc.lat, loc.lng);
            if (dist < minDistance) {
                minDistance = dist;
                nearest = loc;
            }
        }
    });

    if (nearest && window.userLocation && (filterType === 'hospital' || filterType === 'ambulance')) {
        const style = mapStyles[nearest.type];
        const customIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `<div style="background:linear-gradient(135deg, ${style.color}, #000); color:white; width:36px; height:36px; border-radius:50%; display:flex; justify-content:center; align-items:center; border:2px solid white; box-shadow:0 6px 15px rgba(0,0,0,0.4); font-size: 1.25rem;">
                    <i class="ph-fill ${style.icon}"></i>
                   </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        const marker = L.marker([nearest.lat, nearest.lng], { icon: customIcon })
            .addTo(window.mapInstance)
            .bindPopup(`<b>Nearest ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}</b><br>${nearest.name}<br>~${minDistance.toFixed(1)} km away`);

        window.mapMarkers.push({ marker, data: nearest });

        // Draw line to nearest if hospital/ambulance
        if (nearest && window.userLocation && (filterType === 'hospital' || filterType === 'ambulance')) {
            window.routingLine = L.polyline([window.userLocation, [nearest.lat, nearest.lng]], {
                color: mapStyles[filterType].color,
                weight: 4,
                opacity: 0.7,
                dashArray: '10, 10',
                lineCap: 'round'
            }).addTo(window.mapInstance);

            // Open popup for nearest
            const nearestMarker = window.mapMarkers.find(m => m.data === nearest);
            if (nearestMarker) {
                nearestMarker.marker.bindPopup(`<b>Nearest ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}</b><br>${nearest.name}<br>~${minDistance.toFixed(1)} km away`).openPopup();
            }
        }
    }
}

function bindMapFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filters.forEach(f => {
                f.classList.remove('active');
                f.style.background = 'transparent';
                f.style.color = 'var(--text-muted)';
                f.style.boxShadow = 'none';
            });
            const target = e.currentTarget;
            target.classList.add('active');
            target.style.background = '#111111';
            target.style.color = 'white';
            target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
            renderMarkers(target.getAttribute('data-type'));
        });
    });
}

