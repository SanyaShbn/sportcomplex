import React, { useContext } from "react";
import CalendarGlobalContext from "../../context/CalendarGlobalContext";
export default function CreateEventButton() {
  const { setShowEventModal } = useContext(CalendarGlobalContext);
  return (
    <button
      onClick={() => setShowEventModal(true)}
      className="border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl"
    >
      <img alt="create_event" className="w-7 h-7" />
      <span className="pl-3 pr-7"> Create</span>
    </button>
  );
}