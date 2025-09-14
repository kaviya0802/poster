// src/pages/Events.jsx
import React, { useState, useEffect } from "react";
import PosterCard from "../components/PosterCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchEvents = () => {
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

        const isDifferent =
          JSON.stringify(mappedEvents) !== JSON.stringify(events);

        if (isDifferent) {
          setEvents(mappedEvents);
        }

        if (initialLoad) setInitialLoad(false);
      })
      .catch((err) => console.error("Error fetching events:", err));
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, [events]);

  // Split events into rows of max 3 posters
  const rows = [];
  for (let i = 0; i < events.length; i += 3) {
    rows.push(events.slice(i, i + 3));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        gap: "40px", // vertical space between rows
      }}
    >
      {initialLoad && events.length === 0 ? (
        <p>Loading events...</p>
      ) : events.length > 0 ? (
        rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              justifyContent:
                row.length === 1
                  ? "center"
                  : row.length === 2
                  ? "space-evenly"
                  : "flex-start",
              gap: "20px", // horizontal space between posters
              width: "100%",
              maxWidth: "1300px", // 3 posters per row
            }}
          >
            {row.map((event, index) => (
              <PosterCard
                key={event.id}
                event={event}
                templateIndex={rowIndex * 3 + index}
              />
            ))}
          </div>
        ))
      ) : (
        <p>No events to display</p>
      )}

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
