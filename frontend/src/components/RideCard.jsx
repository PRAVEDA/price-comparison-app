function RideCard({ ride, isCheapest }) {
  return (
    <div style={{
      border: isCheapest ? "2px solid green" : "1px solid gray",
      margin: "10px",
      padding: "10px",
      borderRadius: "8px"
    }}>
      <h3>{ride.app}</h3>
      <p>Type: {ride.type}</p>
      <p>Price: ₹{ride.price}</p>

      {isCheapest && <p style={{ color: "green" }}>🔥 Cheapest</p>}
    </div>
  );
}

export default RideCard;