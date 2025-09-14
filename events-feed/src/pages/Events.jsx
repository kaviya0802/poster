import React, { useState, useEffect } from "react";
import PosterCard from "../components/PosterCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { templates } from "../components/PosterTemplates";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  // Store template index per event to avoid repetition
  const [eventTemplates, setEventTemplates] = useState({});

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

        // ✅ Update only if different
        const isDifferent =
          JSON.stringify(mappedEvents) !== JSON.stringify(events);

        if (isDifferent) {
          setEvents(mappedEvents);

          // Assign templates without repetition
          const usedIndexes = [];
          const newEventTemplates = {};
          mappedEvents.forEach((e) => {
            let availableIndexes = templates
              .map((_, i) => i)
              .filter((i) => !usedIndexes.includes(i));

            if (availableIndexes.length === 0) {
              // reset if all templates used
              usedIndexes.length = 0;
              availableIndexes = templates.map((_, i) => i);
            }

            const randomIndex =
              availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
            usedIndexes.push(randomIndex);
            newEventTemplates[e.id] = randomIndex;
          });

          setEventTemplates(newEventTemplates);
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
        events.map((event) => (
          <PosterCard
            key={event.id}
            event={event}
            templateIndex={eventTemplates[event.id]}
          />
        ))
      ) : (
        <p style={{ margin: "auto" }}>No events to display</p>
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
