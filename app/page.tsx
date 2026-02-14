"use client";

import { useState } from "react";
import jsPDF from "jspdf";

export default function Home() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [style, setStyle] = useState("");
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateItinerary = async () => {
    if (!destination || !days) {
      alert("Mohon isi destinasi dan jumlah hari.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/generate-itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, days, budget, style }),
    });

    const data = await res.json();
    setItinerary(data.itinerary || []);
    setLoading(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text(`ITINERARY PERJALANAN`, 10, y);
    y += 10;

    itinerary.forEach((item) => {
      doc.setFontSize(12);
      doc.text(`Hari ${item.day}`, 10, y);
      y += 6;

      const lines = [
        `Pagi: ${item.pagi}`,
        `Siang: ${item.siang}`,
        `Sore: ${item.sore}`,
        `Malam: ${item.malam}`,
        `Transport: ${item.transport}`,
        `Estimasi: ${item.estimasi}`,
      ];

      lines.forEach((line) => {
        const split = doc.splitTextToSize(line, 180);
        doc.text(split, 10, y);
        y += split.length * 6;
      });

      y += 6;
    });

    doc.save(`Itinerary-${destination}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ✈️ AI Travel Planner
          </h1>
          <p className="text-gray-600">
            Buat itinerary perjalanan otomatis dalam hitungan detik
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FORM CARD */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">
              Detail Perjalanan
            </h2>

            <div className="space-y-4">
              <input
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Destinasi"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />

              <input
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Jumlah Hari"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />

              <input
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Budget (Rp)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />

              <input
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Gaya Perjalanan (Santai, Premium, Backpacker)"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />

              <button
                onClick={generateItinerary}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold"
              >
                {loading ? "Generating..." : "Generate Itinerary"}
              </button>

              <button
                onClick={exportPDF}
                disabled={!itinerary.length}
                className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-900 transition font-semibold disabled:opacity-50"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* RESULT CARD */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">
              Hasil Itinerary
            </h2>

            {itinerary.length === 0 ? (
              <p className="text-gray-500">
                Belum ada itinerary. Silakan generate terlebih dahulu.
              </p>
            ) : (
              <div className="space-y-6">
                {itinerary.map((item, i) => (
                  <div
                    key={i}
                    className="border rounded-xl p-4 bg-gray-50"
                  >
                    <h3 className="font-bold text-indigo-600 mb-2">
                      Hari {item.day}
                    </h3>
                    <p><strong>Pagi:</strong> {item.pagi}</p>
                    <p><strong>Siang:</strong> {item.siang}</p>
                    <p><strong>Sore:</strong> {item.sore}</p>
                    <p><strong>Malam:</strong> {item.malam}</p>
                    <p><strong>Transport:</strong> {item.transport}</p>
                    <p><strong>Estimasi:</strong> {item.estimasi}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
