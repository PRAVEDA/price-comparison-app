import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect } from "react";

function Routing({ source, destination }) {
  const map = useMap();

  useEffect(() => {
    if (!source || !destination) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(source.lat, source.lon),
        L.latLng(destination.lat, destination.lon),
      ],
      show: false,
    }).addTo(map);

    return () => map.removeControl(control);
  }, [source, destination]);

  return null;
}

function MapView({ source, destination }) {
  return (
   <MapContainer
  center={[20, 78]}
  zoom={3}
  style={{ height: "320px", borderRadius: "16px" }}
>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[source.lat, source.lon]} />
      <Marker position={[destination.lat, destination.lon]} />

      <Routing source={source} destination={destination} />
    </MapContainer>
  );
}

export default MapView;