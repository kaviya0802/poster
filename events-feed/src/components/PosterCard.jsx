// src/components/PosterCard.jsx
import React from "react";
import "./PosterCard.css";
import { templates } from "./PosterTemplates";
import { toast } from "react-toastify"; 
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

// ✅ Helper functions
function formatDateString(dateInput) {
  if (!dateInput) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }

  const dt = new Date(dateInput);
  if (!isNaN(dt)) {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return dateInput;
}

function formatTimeString(timeInput) {
  if (!timeInput) return "";
  const mm = timeInput.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (mm) {
    let h = parseInt(mm[1], 10);
    const minutes = mm[2];
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return minutes === "00" ? `${h} ${suffix}` : `${h}:${minutes} ${suffix}`;
  }
  return timeInput;
}

export default function PosterCard({ event, templateIndex }) {
  if (!event) return null;

  // ✅ Use the templateIndex passed from Events.jsx
  const template =
    templates && templates.length > 0
      ? templates[templateIndex ?? Math.floor(Math.random() * templates.length)]
      : {
          backgroundImage: "",
          textColor: "#000",
          accentColor: "#007bff",
        };

  const eventDate = formatDateString(event.date ?? event.event_date ?? "");
  const startTime = formatTimeString(event.startTime ?? event.start_time ?? "");
  const endTime = formatTimeString(event.endTime ?? event.end_time ?? "");

  const handleRegister = () => {
    toast.success(`Successfully registered for "${event.name ?? event.event_name}"!`);
  };

  return (
    <div
      className="poster-card"
      style={{ backgroundImage: `url(${template.backgroundImage})` }}
    >
      <h2 className="poster-title" style={{ color: template.textColor }}>
        {event.name ?? event.event_name}
      </h2>

      <p className="poster-organizer" style={{ color: template.textColor }}>
        Organizer: {event.organizer}
      </p>

      <p className="poster-category" style={{ color: template.textColor }}>
        Category: {event.category}
      </p>

      <p className="poster-description" style={{ color: template.textColor }}>
        {event.description}
      </p>

      <p className="poster-date" style={{ color: template.textColor }}>
        <FaCalendarAlt style={{ marginRight: "6px" }} /> {eventDate}
      </p>

      <p className="poster-time" style={{ color: template.textColor }}>
        <FaClock style={{ marginRight: "6px" }} /> {startTime}
        {endTime ? ` – ${endTime}` : ""}
      </p>

      <p className="poster-venue" style={{ color: template.textColor }}>
        <FaMapMarkerAlt style={{ marginRight: "6px" }} /> {event.venue}
      </p>

      <button
        className="register-button"
        style={{ backgroundColor: template.accentColor }}
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
}

