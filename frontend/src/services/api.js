export const searchLocation = async (query) => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    // Try backend first
    const res = await fetch(
      `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        console.log("✅ Results from backend:", data.length);
        return data;
      }
    }
  } catch (error) {
    console.log("⚠️ Backend unavailable, using direct API...");
  }

  // Fallback: Direct Nominatim API call
  try {
    const encodedQuery = encodeURIComponent(query);
    const directRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}`,
      {
        headers: {
          'Accept': 'application/json',
          'Referer': window.location.origin
        }
      }
    );

    if (directRes.ok) {
      const data = await directRes.json();
      console.log("✅ Results from Nominatim:", data.length);
      return Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error("❌ All location APIs failed:", error);
  }

  return [];
};