import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function LocationPickerMap({ onLocationSelect, onClose }) {
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [currentAddress, setCurrentAddress] = useState("Click on map to select location");
    const [mapCenter, setMapCenter] = useState([20, 78]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");

    // Get user's current location on component mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapCenter([latitude, longitude]);
                    setSelectedPosition([latitude, longitude]);
                    reverseGeocode(latitude, longitude);
                    setLoading(false);
                },
                (error) => {
                    console.log("Geolocation error:", error);
                    setLoading(false);
                }
            );
        } else {
            setLoading(false);
        }
    }, []);

    // Reverse geocode coordinates to get address
    const reverseGeocode = async (lat, lon) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await res.json();
            const address = data.address?.city || data.address?.town || data.name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
            setCurrentAddress(address);
        } catch (error) {
            console.error("Error reverse geocoding:", error);
            setCurrentAddress(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        }
    };

    // Handle search for location
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) return;

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`
            );
            const results = await res.json();

            if (results.length > 0) {
                const { lat, lon } = results[0];
                const newLat = parseFloat(lat);
                const newLon = parseFloat(lon);
                setMapCenter([newLat, newLon]);
                setSelectedPosition([newLat, newLon]);
                reverseGeocode(newLat, newLon);
                setSearchInput("");
            } else {
                alert("Location not found");
            }
        } catch (error) {
            console.error("Search error:", error);
            alert("Error searching location");
        }
    };

    function LocationMarker() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setSelectedPosition([lat, lng]);
                reverseGeocode(lat, lng);
            },
            moveend(e) {
                const center = e.target.getCenter();
                if (selectedPosition === null) {
                    reverseGeocode(center.lat, center.lng);
                }
            },
        });

        return selectedPosition === null ? null : (
            <Marker position={selectedPosition} />
        );
    }

    const handleConfirm = async () => {
        if (!selectedPosition) {
            alert("Please click on the map to select a location");
            return;
        }

        const [lat, lon] = selectedPosition;

        onLocationSelect({
            display_name: currentAddress,
            lat: lat.toString(),
            lon: lon.toString(),
        });
    };

    return (
        <div className="location-picker-modal">
            <div className="location-picker-overlay" onClick={onClose}></div>
            <div className="location-picker-content">
                <div className="location-picker-header">
                    <h2>Select Location on Map</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="location-picker-search">
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="🔍 Search location..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">Search</button>
                    </form>
                </div>

                <div className="location-picker-map">
                    {loading ? (
                        <div className="map-loading">Loading your location...</div>
                    ) : (
                        <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }} key={`${mapCenter[0]}-${mapCenter[1]}`}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationMarker />
                        </MapContainer>
                    )}
                </div>

                <div className="location-picker-address">
                    <p className="address-label">📍 Selected Address:</p>
                    <p className="address-text">{currentAddress}</p>
                </div>

                <div className="location-picker-footer">
                    <p>💡 Click on the map or search to select a location</p>
                    <div className="location-picker-buttons">
                        <button className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button
                            className="btn-confirm"
                            onClick={handleConfirm}
                            disabled={!selectedPosition}
                        >
                            Confirm Location
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LocationPickerMap;
