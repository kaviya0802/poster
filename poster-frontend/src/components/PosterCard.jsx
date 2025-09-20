import React from "react";
import "./PosterCard.css";
import { templates } from "./PosterTemplates";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaVideo, FaImage } from "react-icons/fa";

function formatDateString(dateInput) {
  if (!dateInput) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) return dateInput;
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

  const template =
    templates && templates.length > 0
      ? templates[templateIndex ?? Math.floor(Math.random() * templates.length)]
      : { backgroundImage: "", textColor: "#000", accentColor: "#007bff" };

  const eventDate = formatDateString(event.date ?? event.event_date ?? "");
  const startTime = formatTimeString(event.startTime ?? event.start_time ?? "");
  const endTime = formatTimeString(event.endTime ?? event.end_time ?? "");

  return (
    <div className="poster-card-wrapper">
      <div
        className={`poster-card ${template.backgroundImage ? "with-bg" : ""}`}
        style={{ backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : "none" }}
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

        {event.posterpath && (
          <p className="poster-posterpath" style={{ color: template.textColor }}>
            <FaImage className="icon" style={{ color: template.textColor }} />
            <a href={event.posterpath} target="_blank" rel="noopener noreferrer">
               Click here to view image
            </a>
          </p>
        )}

        {event.videopath && (
          <p className="poster-videopath" style={{ color: template.textColor }}>
            <FaVideo className="icon" style={{ color: template.textColor }} />
            <a href={event.videopath} target="_blank" rel="noopener noreferrer">
               Click here to watch video
            </a>
          </p>
        )}

        <p className="poster-date" style={{ color: template.textColor }}>
          <FaCalendarAlt className="icon" /> {eventDate}
        </p>

        <p className="poster-time" style={{ color: template.textColor }}>
          <FaClock className="icon" /> {startTime}
          {endTime ? ` – ${endTime}` : ""}
        </p>

        <p className="poster-venue" style={{ color: template.textColor }}>
          <FaMapMarkerAlt className="icon" /> {event.venue}
        </p>

        {event.contact && (
          <p className="poster-contact" style={{ color: template.textColor }}>
            <FaPhone className="icon" /> {event.contact}
          </p>
        )}
        {event.registration_link && (
  <div className="poster-registration">
    <button
      onClick={() => window.open(event.registration_link, "_blank")}
      style={{ backgroundColor: template.accentColor }}
    >
      Register
    </button>
  </div>
)}


        
      </div>
    </div>
  );
}
