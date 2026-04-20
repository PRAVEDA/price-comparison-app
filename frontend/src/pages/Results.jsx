import { useLocation } from "react-router-dom";
import MapView from "../components/MapView";
import "./Results.css";

function Results() {
  const location = useLocation();

  if (!location.state) return <h2>No data</h2>;

  const { source, destination, type } = location.state;

  const allRides = [
    {
      id: 4,
      app: "Uber",
      types: ["car", "bike", "auto"],
      price: 250,
      time: 6,
      website: "https://www.uber.com"
    },
    {
      id: 3,
      app: "Rapido",
      types: ["bike", "car", "auto"],
      price: 320,
      time: 9,
      website: "https://www.rapido.app"
    },
    {
      id: 2,
      app: "Namma Yatra",
      types: ["auto", "bike", "car"],
      price: 300,
      time: 5,
      website: "https://www.nammayatri.in"
    },
    {
      id: 1,
      app: "Ola",
      types: ["car", "bike", "auto"],
      price: 360,
      time: 8,
      website: "https://www.olarides.com"
    },
  ];

  const rides = allRides.filter(r => r.types.includes(type));
  const minPrice = Math.min(...rides.map(r => r.price));

  const handleBookNow = (ride) => {
    // Open the ride service website in a new tab
    window.open(ride.website, "_blank");
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Available Rides</h1>
        <p>Cheapest and fastest options for your journey</p>
      </div>

      <div className="results-content">
        {/* Map Section */}
        <div className="map-section">
          <div className="map-container">
            <MapView source={source} destination={destination} />
          </div>
          <div className="map-info">
            <div className="map-info-badge">ℹ️ Map View (Demo Mode)</div>
          </div>
        </div>

        {/* Rides Grid */}
        <div className="rides-grid">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className={`ride-card ${ride.price === minPrice ? "cheapest" : ""}`}
            >
              {/* Cheapest Badge */}
              {ride.price === minPrice && (
                <div className="cheapest-badge">✓ CHEAPEST</div>
              )}

              {/* Header */}
              <div className="ride-card-header">
                <h3 className="ride-app-name">{ride.app}</h3>
              </div>

              {/* Details */}
              <div className="ride-details">
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <span className="detail-text">{ride.time} mins away</span>
                  <span className="detail-label">ESTIMATED TIME</span>
                </div>
              </div>

              {/* Price */}
              <div className="ride-price-section">
                <span className="price-currency">₹</span>
                <span className="price-amount">{ride.price}</span>
                <span className="price-label">ESTIMATED PRICE</span>
              </div>

              {/* Book Button */}
              <button
                className="book-button"
                onClick={() => handleBookNow(ride)}
              >
                Book Now →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Results;