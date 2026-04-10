export async function POST(req) {
    try {
        const { distance, time, transportMode } = await req.json();

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000", // or your deployed URL
                "X-Title": "AI Route Finder"
            },
            body: JSON.stringify({
                // ✅ FREE MODEL
                model: "openrouter/free",
                messages: [
                    {
                        role: "user",
                        content: `Give a short, helpful travel insight in 1-2 lines.
                        Include tips if useful.
                        
                        Distance: ${distance} km
                        Time: ${time} minutes
                        Transport Mode: ${transportMode}`
                    },
                ],
            }),
        });

        const data = await res.json();

        console.log("AI RESPONSE:", data);

        // ❌ If API fails → fallback
        if (data.error || !data.choices) {
            return Response.json({
                insight: getFallbackInsight(distance, time, transportMode),
            });
        }

        // ✅ If AI works
        return Response.json({
            insight: data.choices[0].message.content,
        });

    } catch (err) {
        console.error(err);

        // ❌ If server crashes → fallback
        return Response.json({
            insight: "⚠️ Could not fetch AI insight",
        });
    }
}

function getFallbackInsight(distance, time, transportMode) {
    const hours = (time / 60).toFixed(1);

    if (transportMode === "car") {
        if (distance > 500) {
            return `🚗 Long drive (${distance} km). Consider rest stops and fuel planning.`;
        }
        return `🚗 Smooth drive. Estimated ${hours} hours travel time.`;
    }

    if (transportMode === "bike") {
        if (distance > 100) {
            return `🚴 Long bike ride. Not very practical for this distance.`;
        }
        return `🚴 Budget-friendly and efficient for short distances.`;
    }

    if (transportMode === "walk") {
        if (distance > 5) {
            return `🚶 Too far to walk comfortably. Consider another transport.`;
        }
        return `🚶 Healthy and eco-friendly option.`;
    }

    return "Smart route selected.";
}