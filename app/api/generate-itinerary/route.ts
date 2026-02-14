import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { destination, days, budget, style } = await req.json();

    // SAFE MODE
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        itinerary: [
          {
            day: 1,
            pagi: "Demo Mode Aktif",
            siang: "API key belum dikonfigurasi",
            sore: "Website berhasil dideploy",
            malam: "AI akan aktif setelah API key ditambahkan",
            transport: "-",
            estimasi: "-"
          }
        ]
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
Buat itinerary perjalanan ${days} hari ke ${destination}.
Budget total: Rp ${budget}
Gaya perjalanan: ${style}

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
      temperature: 0.7,
    });

    const text = completion.choices[0].message?.content || "[]";

    return Response.json({
      itinerary: JSON.parse(text)
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Gagal generate itinerary" }, { status: 500 });
  }
}
