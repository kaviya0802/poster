// src/pages/Events.jsx
import React, { useState, useEffect } from "react";
import PosterCard from "../components/PosterCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { templates } from "../components/PosterTemplates"; // import templates here

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => {
        const mappedEvents = data.map((event) => ({
          id: event.event_id,
          name: event.event_name,
          organizer: event.organizer,
          category: event.category,
          description: event.description,
          date: event.event_date,
          startTime: event.start_time,
          endTime: event.end_time,
          venue: event.venue,
        }));

        // 🔹 Shuffle templates so order changes each time
        const shuffledTemplates = [...templates].sort(() => Math.random() - 0.5);

        // 🔹 Assign templates in order without repeating until all are used
        const withTemplates = mappedEvents.map((event, index) => ({
          ...event,
          template: shuffledTemplates[index % shuffledTemplates.length],
        }));

        setEvents(withTemplates);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflowX: "auto",
        padding: "20px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      {events.length > 0 ? (
        events.map((event) => (
          <PosterCard key={event.id} event={event} />
        ))
      ) : (
        <p style={{ margin: "auto" }}>No events to display</p>
      )}

      {/* ToastContainer only once at top-right */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}


