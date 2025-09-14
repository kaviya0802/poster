import React, { useState, useEffect } from "react";
import PosterCard from "../components/PosterCard";
import { ToastContainer } from "react-toastify";

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
          date: event.event_date,       // matches your db
          startTime: event.start_time,
          endTime: event.end_time,
          venue: event.venue,
          alumniId: event.alumni_id,
          createdAt: event.created_at
        }));
        setEvents(mappedEvents);
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
        events.map((event, index) => (
          <PosterCard key={event.id} event={event} index={index} />
        ))
      ) : (
        <p style={{ margin: "auto" }}>No events to display</p>
      )}
      <ToastContainer />
    </div>
  );
}
