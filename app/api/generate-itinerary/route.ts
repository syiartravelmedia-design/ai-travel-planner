import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { destination, days, budget, style } = await req.json();

    const prompt = `
Buat itinerary perjalanan ${days} hari ke ${destination}.

Budget total: Rp ${budget}
Style: ${style}

Format JSON:
[
  {
    "day": 1,
    "pagi": "",
    "siang": "",
    "sore": "",
    "malam": "",
    "transport": "",
    "estimasi": ""
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Kamu adalah expert travel planner profesional." },
        { role: "user", content: prompt }
      ],
    });

    const text = completion.choices[0].message?.content || "[]";

    return Response.json({
      itinerary: JSON.parse(text)
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal generate" }, { status: 500 });
  }
}
