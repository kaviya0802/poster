// src/pages/Events.jsx
import React, { useState, useEffect } from "react";
import PosterCard from "../components/PosterCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Events.css";
import { templates } from "../components/PosterTemplates";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [templateOrder, setTemplateOrder] = useState([]);

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

          // ✅ Generate shuffled template indices ONCE per new event set
          if (mappedEvents.length !== templateOrder.length) {
            const templateCount = templates.length;
            const pool = [];
            while (pool.length < mappedEvents.length) {
              const shuffled = [...Array(templateCount).keys()].sort(
                () => Math.random() - 0.5
              );
              pool.push(...shuffled);
            }
            setTemplateOrder(pool.slice(0, mappedEvents.length));
          }
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

  // Split into rows of max 3 posters
  const rows = [];
  for (let i = 0; i < events.length; i += 3) {
    rows.push(events.slice(i, i + 3));
  }

  return (
    <div className="events-container">
      {/* Header */}
      <div className="events-header">
        <h1>Explore Our Exclusive Alumni Events</h1>
        <p>Connect, Learn, and Network with Industry Leaders</p>
        <hr />
      </div>

      {/* Event Feed */}
      {initialLoad && events.length === 0 ? (
        <p>Loading events...</p>
      ) : events.length > 0 ? (
        rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="poster-feed"
            style={{
              justifyContent:
                row.length === 1
                  ? "center"
                  : row.length === 2
                  ? "space-evenly"
                  : "flex-start",
            }}
          >
            {row.map((event, index) => (
              <PosterCard
                key={event.id}
                event={event}
                templateIndex={templateOrder[rowIndex * 3 + index]}
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
