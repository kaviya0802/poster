// src/components/PosterCard.jsx
import React from "react";
import "./PosterCard.css";
import { templates } from "./PosterTemplates";

function formatDateString(dateInput) {
  if (!dateInput) return "";
  // If ISO or contains time part, rely on Date
  try {
    // YYYY-MM-DD (no time)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const [y, m, d] = dateInput.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      return dt.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // try parsing as full ISO or other parseable string
    const dt = new Date(dateInput);
    if (!isNaN(dt)) {
      return dt.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return dateInput; // fallback: return raw
  } catch {
    return dateInput;
  }
}

function formatTimeString(timeInput) {
  if (!timeInput) return "";
  // normalize to string
  let t = String(timeInput).trim();

  // if it's a full ISO datetime, parse the time part
  if (t.includes("T") || t.endsWith("Z")) {
    const dt = new Date(t);
    if (!isNaN(dt)) {
      return dt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

  // if it's HH:MM or HH:MM:SS
  const mm = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (mm) {
    let h = parseInt(mm[1], 10);
    const minutes = mm[2];
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    // if minutes are "00", show "10 AM" rather than "10:00 AM"
    return minutes === "00" ? `${h} ${suffix}` : `${h}:${minutes} ${suffix}`;
  }

  // fallback: try to parse as Date
  const dt2 = new Date(t);
  if (!isNaN(dt2)) {
    return dt2.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return timeInput; // final fallback: raw input
}

export default function PosterCard({ event, index }) {
  if (!event) return null;

  // allow multiple possible field names (be tolerant)
  const template = templates[index % templates.length];

  const eventDateRaw = event.event_date ?? event.date ?? event.eventDate ?? "";
  const startRaw = event.start_time ?? event.startTime ?? event.start ?? "";
  const endRaw = event.end_time ?? event.endTime ?? event.end ?? "";

  const formattedDate = formatDateString(eventDateRaw);
  const formattedStart = formatTimeString(startRaw);
  const formattedEnd = formatTimeString(endRaw);

  return (
    <div
      className="poster-card"
      style={{
        background: template.background,
        color: template.textColor,
      }}
    >
      <div className="poster-content">
        <h2 className="poster-title">{event.event_name ?? event.name}</h2>

        <div className="poster-details">
          <p><strong>Organizer:</strong> {event.organizer}</p>
          <p><strong>Category:</strong> {event.category}</p>
          <p className="poster-description">{event.description}</p>

          {/* Emojis (real colorful emojis) */}
          <p className="poster-info">
            <span className="poster-emoji">📅</span>
            <span><strong>Date:</strong> {formattedDate}</span>
          </p>

          <p className="poster-info">
            <span className="poster-emoji">⏰</span>
            <span><strong>Time:</strong> {formattedStart}{formattedEnd ? ` – ${formattedEnd}` : ""}</span>
          </p>

          <p className="poster-info">
            <span className="poster-emoji">📍</span>
            <span><strong>Venue:</strong> {event.venue}</span>
          </p>
        </div>

        <button
          className="register-button"
          onClick={() => {
            // keep your existing toast or action
            // if you use react-toastify, call toast as before
            // toast.success(`Successfully registered for ${event.event_name}`);
          }}
          style={{ backgroundColor: template.accentColor, color: "#fff" }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
