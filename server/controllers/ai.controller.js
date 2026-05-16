import axios from "axios";

export const generateItinerary = async (req, res) => {
  try {
    const { destination, numDays, budget, travelStyle, interests } = req.body;

    if (!numDays || Number(numDays) < 1) {
      return res.status(400).json({ message: "numDays must be at least 1" });
    }

    const days = Math.min(Number(numDays), 30);
    const cityName = destination?.city || destination?.name || "the destination";
    const countryName = destination?.country || "";

    const interestList =
      Array.isArray(interests) && interests.length > 0
        ? interests.join(", ")
        : "general sightseeing";

    const prompt = `You are an expert travel planner. Create a detailed ${days}-day travel itinerary for a trip to ${cityName}${countryName ? ", " + countryName : ""}.

Trip details:
- Duration: ${days} days
- Budget: ${budget ? "₹" + budget : "moderate"}
- Travel Style: ${travelStyle || "balanced"}
- Interests: ${interestList}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, just raw JSON):
{
  "days": [
    {
      "dayNumber": 1,
      "activities": [
        { "name": "Activity name", "time": "09:00", "type": "sightseeing" },
        { "name": "Activity name", "time": "12:00", "type": "food" },
        { "name": "Activity name", "time": "15:00", "type": "culture" },
        { "name": "Activity name", "time": "19:00", "type": "dining" }
      ]
    }
  ]
}

Types can be: sightseeing, food, adventure, shopping, relaxation, culture, dining, transport.
Include 4-6 activities per day. Times should be in HH:MM 24-hour format. Keep activity names concise (under 60 chars).`;

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      }
    );

    const rawText = geminiRes.data.candidates[0]?.content?.parts[0]?.text || "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("=== AI ITINERARY ERROR ===");
    console.error("Status:", err?.response?.status);
    console.error("Error:", JSON.stringify(err?.response?.data, null, 2));

    if (err instanceof SyntaxError) {
      return res.status(500).json({ message: "AI returned invalid JSON. Please try again." });
    }

    return res.status(500).json({
      message: "Failed to generate itinerary",
      error: err.message,
      detail: err?.response?.data || null,
    });
  }
};

// ========================= PACKING LIST =========================
export const generatePackingList = async (req, res) => {
  try {
    const { destination, numDays, travelStyle, days: itineraryDays, startDate } = req.body;

    if (!destination) return res.status(400).json({ message: "destination is required" });

    const cityName    = destination?.city    || destination?.name || "the destination";
    const countryName = destination?.country || "";
    const tripDays    = Math.min(Number(numDays) || 3, 30);

    // Pull unique activity types from saved itinerary
    const activityTypes =
      itineraryDays && itineraryDays.length > 0
        ? [...new Set(itineraryDays.flatMap((d) => d.activities?.map((a) => a.type) || []))].join(", ")
        : "general sightseeing, dining";

    // Infer season from startDate
    let season = "unknown season";
    if (startDate) {
      const m = new Date(startDate).getMonth();
      if      (m >= 2  && m <= 4)  season = "spring";
      else if (m >= 5  && m <= 7)  season = "summer";
      else if (m >= 8  && m <= 10) season = "autumn";
      else                          season = "winter";
    }

    const prompt = `You are an expert travel packing assistant. Generate a smart personalised packing list.

Trip details:
- Destination: ${cityName}${countryName ? ", " + countryName : ""}
- Duration: ${tripDays} days
- Season: ${season}
- Travel style: ${travelStyle || "balanced"}
- Planned activities: ${activityTypes}

Return ONLY a valid JSON object (no markdown, no backticks, raw JSON only):
{
  "categories": [
    {
      "name": "Category name",
      "emoji": "single emoji",
      "items": [
        { "name": "Item name", "essential": true },
        { "name": "Item name", "essential": false }
      ]
    }
  ],
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Include these 6 categories (tailor everything to destination + season + activities):
1. Documents & Money
2. Clothing (exact count for ${tripDays} days, season-appropriate)
3. Toiletries & Health
4. Electronics & Gadgets
5. Bags & Accessories
6. Activity Gear (based on: ${activityTypes})

Rules:
- essential:true only for truly critical items (passport, money, medication)
- Include ${cityName}-specific items (e.g. walking shoes for hilly cities, rain gear for monsoon regions)
- Keep item names under 40 characters
- 3 smart packing tips specific to ${cityName}
- 6 to 12 items per category`;

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 3000 },
      }
    );

    const rawText = geminiRes.data.candidates[0]?.content?.parts[0]?.text || "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed  = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("=== PACKING LIST ERROR ===");
    console.error("Status:", err?.response?.status);
    console.error("Data:",   JSON.stringify(err?.response?.data, null, 2));
    console.error("Msg:",    err.message);
    if (err instanceof SyntaxError)
      return res.status(500).json({ message: "AI returned invalid JSON. Try again." });
    return res.status(500).json({
      message: "Failed to generate packing list",
      error: err.message,
      detail: err?.response?.data || null,
    });
  }
};