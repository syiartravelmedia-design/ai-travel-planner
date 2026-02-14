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

    doc.text(`ITINERARY ${destination}`, 10, y);
    y += 10;

    itinerary.forEach((item) => {
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
        y += split.length * 5;
      });

      y += 5;
    });

    doc.save(`Itinerary-${destination}.pdf`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>AI Travel Planner</h1>

      <input placeholder="Destinasi" onChange={(e) => setDestination(e.target.value)} /><br /><br />
      <input placeholder="Jumlah Hari" onChange={(e) => setDays(e.target.value)} /><br /><br />
      <input placeholder="Budget" onChange={(e) => setBudget(e.target.value)} /><br /><br />
      <input placeholder="Gaya" onChange={(e) => setStyle(e.target.value)} /><br /><br />

      <button onClick={generateItinerary}>
        {loading ? "Generating..." : "Generate"}
      </button>

      <button onClick={exportPDF} disabled={!itinerary.length}>
        Export PDF
      </button>

      <hr /><br />

      {itinerary.map((item, i) => (
        <div key={i}>
          <h3>Hari {item.day}</h3>
          <p>Pagi: {item.pagi}</p>
          <p>Siang: {item.siang}</p>
          <p>Sore: {item.sore}</p>
          <p>Malam: {item.malam}</p>
          <p>Transport: {item.transport}</p>
          <p>Estimasi: {item.estimasi}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
