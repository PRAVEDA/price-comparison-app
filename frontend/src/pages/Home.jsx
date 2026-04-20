import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchLocation } from "../services/api";
import "./Home.css";

function Home() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [selectedSourceObj, setSelectedSourceObj] = useState(null);
  const [selectedDestObj, setSelectedDestObj] = useState(null);

  const [showTransport, setShowTransport] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const transportRef = useRef(null);
  const navigate = useNavigate();

  const handleSourceChange = async (e) => {
    const value = e.target.value;
    setSource(value);
    setSelectedSourceObj(null);

    if (value.length < 2) return setSourceSuggestions([]);

    const results = await searchLocation(value);
    setSourceSuggestions(results.slice(0, 5));
  };

  const handleDestChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    setSelectedDestObj(null);

    if (value.length < 2) return setDestSuggestions([]);

    const results = await searchLocation(value);
    setDestSuggestions(results.slice(0, 5));
  };

  const handleSelectSource = (item) => {
    setSource(item.display_name);
    setSelectedSourceObj(item);
    setSourceSuggestions([]);
  };

  const handleSelectDest = (item) => {
    setDestination(item.display_name);
    setSelectedDestObj(item);
    setDestSuggestions([]);
  };

  const handleNext = () => {
    if (!source || !destination) {
      alert("Enter both locations");
      return;
    }

    setShowTransport(true);
    setTimeout(() => {
      transportRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleSearch = async () => {
    if (!selectedType) {
      alert("Select transport type");
      return;
    }

    const src = selectedSourceObj || (await searchLocation(source))[0];
    const dest = selectedDestObj || (await searchLocation(destination))[0];

    if (!src) {
      alert(`Pickup location "${source}" not found.\nTry selecting from the dropdown or use a different name.`);
      return;
    }

    if (!dest) {
      alert(`Dropoff location "${destination}" not found.\nTry selecting from the dropdown or use a different name.`);
      return;
    }

    navigate("/results", {
      state: {
        source: {
          ...src,
          lat: parseFloat(src.lat),
          lon: parseFloat(src.lon),
        },
        destination: {
          ...dest,
          lat: parseFloat(dest.lat),
          lon: parseFloat(dest.lon),
        },
        type: selectedType,
      },
    });
  };

  const transportOptions = [
    { type: "bike", label: "Bike", icon: "🏍️" },
    { type: "auto", label: "Auto", icon: "🛺" },
    { type: "car", label: "Car", icon: "🚗" },
    { type: "parcel", label: "Parcel", icon: "📦" },
  ];

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Header Section */}
        <div className="home-header">
          <h1 className="home-title">Compare Ride Prices</h1>
          <p className="home-subtitle">Find the best deals on your rides</p>
        </div>

        {/* Form Section */}
        <form className="home-form" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          {/* Location Inputs */}
          <div className="location-inputs">
            {/* Source Input */}
            <div className="location-input-group">
              <label htmlFor="source-input" className="location-label">📍 Pickup Location</label>
              <input
                id="source-input"
                type="text"
                className="location-input"
                placeholder="Enter pickup location"
                value={source}
                onChange={handleSourceChange}
                autoComplete="off"
              />
              {sourceSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {sourceSuggestions.map((item, i) => (
                    <li
                      key={i}
                      className="suggestion-item"
                      onClick={() => handleSelectSource(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && handleSelectSource(item)}
                    >
                      📍 {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Destination Input */}
            <div className="location-input-group">
              <label htmlFor="dest-input" className="location-label">📍 Destination</label>
              <input
                id="dest-input"
                type="text"
                className="location-input"
                placeholder="Enter destination"
                value={destination}
                onChange={handleDestChange}
                autoComplete="off"
              />
              {destSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {destSuggestions.map((item, i) => (
                    <li
                      key={i}
                      className="suggestion-item"
                      onClick={() => handleSelectDest(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && handleSelectDest(item)}
                    >
                      📍 {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Next Button */}
          <button type="button" className="next-button" onClick={handleNext}>
            Continue →
          </button>
        </form>

        {/* Transport Selection Section */}
        {showTransport && (
          <div className="transport-section" ref={transportRef}>
            <div className="transport-header">
              <h2 className="transport-title">Select Vehicle Type</h2>
              <p className="transport-subtitle">Choose your preferred ride</p>
            </div>

            <div className="transport-buttons">
              {transportOptions.map((option) => (
                <button
                  key={option.type}
                  className={`transport-btn ${selectedType === option.type ? "active" : ""}`}
                  onClick={() => setSelectedType(option.type)}
                  title={option.label}
                >
                  <span className="transport-icon">{option.icon}</span>
                  <span className="transport-label">{option.label}</span>
                </button>
              ))}
            </div>

            {/* Find Best Price Button */}
            <button className="compare-button" onClick={handleSearch}>
              Find Best Price ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;