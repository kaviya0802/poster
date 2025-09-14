// src/pages/Events.jsx
import React, { useState, useEffect } from "react";
import PosterCard from "../components/PosterCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true); // ✅ for first load only

  // Fetch events from backend
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

        // ✅ Update only if data actually changed
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
    fetchEvents(); // load once at start
    const interval = setInterval(fetchEvents, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [events]); // keep watching events for updates

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
      {initialLoad && events.length === 0 ? (
        <p style={{ margin: "auto" }}>Loading events...</p>
      ) : events.length > 0 ? (
        events.map((event) => <PosterCard key={event.id} event={event} />)
      ) : (
        <p style={{ margin: "auto" }}>No events to display</p>
      )}

      {/* ToastContainer */}
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
