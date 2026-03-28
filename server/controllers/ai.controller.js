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