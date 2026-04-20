const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/api/search", async (req, res) => {
  const query = req.query.q;

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});