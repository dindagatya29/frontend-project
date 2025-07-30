"use client";

import { useState, useEffect } from "react";
import NewProjectModal from "@/components/new-project-modal";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [customEvents, setCustomEvents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  // Fetch custom events dari backend
  const fetchCustomEvents = async () => {
    try {
      const res = await fetch("https://nexapro.web.id/api/custom-events");
      const data = await res.json();
      if (Array.isArray(data.data)) setCustomEvents(data.data);
    } catch {
      setCustomEvents([]);
    }
  };

  // Inisialisasi Google API client
  // Hapus seluruh import, variabel, dan logic Google Calendar
  // delete import { gapi } from "gapi-script";
  // delete const GOOGLE_API_KEY, GOOGLE_CLIENT_ID, CALENDAR_ID, SCOPES;
  // delete export const pushEventToGoogleCalendar;

  // Fetch event dari Google Calendar
  // Hapus seluruh import, variabel, dan logic Google Calendar
  // delete import { gapi } from "gapi-script";
  // delete const GOOGLE_API_KEY, GOOGLE_CLIENT_ID, CALENDAR_ID, SCOPES;
  // delete export const pushEventToGoogleCalendar;


useEffect(() => {
  const fetchProjectsTasks = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        fetch("https://nexapro.web.id/api/projects"),
        fetch("https://nexapro.web.id/api/tasks"),
      ]);
      const projectsData = await projectsRes.json();
      const tasksData = await tasksRes.json();

      setProjects(projectsData.data || []);
      setTasks(tasksData.data || []);
    } catch {
      setProjects([]);
      setTasks([]);
    }
  };
  fetchProjectsTasks();
}, []);

// Gabung SEMUA events SETIAP KALI projects/tasks/customEvents berubah
useEffect(() => {
  const projectEvents = projects.map((p: any) => ({
    id: `project-${p.id}`,
    type: "deadline",
    title: p.name,
    date: p.due_date || p.dueDate,
    time: "09:00",
    color: "bg-red-500",
    description: `Project deadline: ${p.name}`,
  }));

  const taskEvents = tasks.map((t: any) => ({
    id: `task-${t.id}`,
    type: "task",
    title: t.title,
    date: t.due_date || t.dueDate,
    time: "10:00",
    color: "bg-green-500",
    description: t.description || "",
  }));

  setEvents([...projectEvents, ...taskEvents, ...customEvents]);
}, [projects, tasks, customEvents]);



  // Gabungkan project, task, dan custom events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          fetch("https://nexapro.web.id/api/projects"),
          fetch("https://nexapro.web.id/api/tasks"),
        ]);
        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();
        const projectEvents = (projectsData.data || []).map((p: any) => ({
          id: `project-${p.id}`,
          type: "deadline",
          title: p.name,
          date: p.due_date || p.dueDate,
          time: "09:00", // ✅ tambahkan default time
          color: "bg-red-500",
          description: `Project deadline: ${p.name}`,
        }));

        const taskEvents = (tasksData.data || []).map((t: any) => ({
          id: `task-${t.id}`,
          type: "task",
          title: t.title,
          date: t.due_date || t.dueDate,
          time: "10:00", // ✅ tambahkan default time
          color: "bg-green-500",
          description: t.description || "",
        }));

        setEvents([...projectEvents, ...taskEvents, ...customEvents]);
      } catch {
        setEvents([...customEvents]);
      }
    };
    fetchEvents();
  }, [customEvents]);

  // Hapus semua data mock dan gunakan fetch ke API backend jika tersedia

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "review":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
      case "deadline":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        );
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return events.filter((event) => event.date === dateString);
  };

  const formatTime = (time?: string) => {
    if (!time || typeof time !== "string" || !time.includes(":")) return "";
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  const navigateDay = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setDate(prev.getDate() - 1);
      } else {
        newDate.setDate(prev.getDate() + 1);
      }
      return newDate;
    });
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const getHourlySlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const today = new Date();

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={index}
                  className="h-32 border-r border-b border-gray-100"
                ></div>
              );
            }

            const dayEvents = getEventsForDate(day);
            const isToday = day.toDateString() === today.toDateString();
            const isSelected =
              selectedDate &&
              day.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`h-32 border-r border-b border-gray-100 p-2 cursor-pointer hover:bg-gray-50 ${
                  isSelected ? "bg-green-50" : ""
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isToday
                      ? "bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                      : "text-gray-900"
                  }`}
                >
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                      title={`${event.title} - ${formatTime(event.time)}`}
                    >
                      <div className="flex items-center space-x-1">
                        {getEventTypeIcon(event.type)}
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = getHourlySlots();

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
          <div className="p-3 text-center text-sm font-medium text-gray-700">
            Time
          </div>
          {weekDays.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div key={index} className="p-3 text-center">
                <div className="text-sm font-medium text-gray-700">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isToday
                      ? "bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1"
                      : "text-gray-900"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Week Grid */}
        <div className="max-h-96 overflow-y-auto">
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b border-gray-100"
            >
              <div className="p-2 text-xs text-gray-500 border-r border-gray-100">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDate(day).filter((event) => {
                  if (!event.time) return false; // skip
                  const eventHour = Number.parseInt(
                    event.time?.split(":")[0] || "0"
                  );
                  return eventHour === hour;
                });

                return (
                  <div
                    key={dayIndex}
                    className="p-1 border-r border-gray-100 min-h-[40px]"
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded text-white mb-1 ${event.color}`}
                        title={`${event.title} - ${formatTime(event.time)}`}
                      >
                        <div className="flex items-center space-x-1">
                          {getEventTypeIcon(event.type)}
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = getHourlySlots();
    const dayEvents = getEventsForDate(currentDate);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {hours.map((hour) => {
                const hourEvents = dayEvents.filter((event) => {
                  const eventHour = Number.parseInt(event.time.split(":")[0]);
                  return eventHour === hour;
                });

                return (
                  <div key={hour} className="flex border-b border-gray-100">
                    <div className="w-20 p-3 text-xs text-gray-500 border-r border-gray-100">
                      {hour === 0
                        ? "12 AM"
                        : hour < 12
                        ? `${hour} AM`
                        : hour === 12
                        ? "12 PM"
                        : `${hour - 12} PM`}
                    </div>
                    <div className="flex-1 p-3 min-h-[60px]">
                      {hourEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`p-3 rounded-lg mb-2 text-white ${event.color}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getEventTypeIcon(event.type)}
                              <span className="font-medium">{event.title}</span>
                            </div>
                            <span className="text-xs opacity-75">
                              {formatTime(event.time)}
                            </span>
                          </div>
                          <p className="text-sm opacity-90 mb-2">
                            {event.description}
                          </p>
                          <div className="flex items-center justify-between text-xs opacity-75">
                            <span>{event.project}</span>
                            {event.duration > 0 && (
                              <span>{event.duration} min</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Day Events List */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Today Events
              </h3>
              <p className="text-sm text-gray-600">
                {dayEvents.length} events scheduled
              </p>
            </div>
            <div className="p-4 space-y-3">
              {dayEvents.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto text-gray-400 mb-3"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  <p className="text-gray-500">No events scheduled for today</p>
                </div>
              ) : (
                dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1 ${event.color}`}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatTime(event.time)}</span>
                          {event.duration > 0 && (
                            <span>{event.duration} min</span>
                          )}
                        </div>
                        <div className="mt-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {event.project}
                          </span>
                        </div>
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="mt-2 flex items-center space-x-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-400"
                            >
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span className="text-xs text-gray-500">
                              {event.attendees.length} attendees
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getNavigationHandler = () => {
    switch (viewMode) {
      case "month":
        return navigateMonth;
      case "week":
        return navigateWeek;
      case "day":
        return navigateDay;
      default:
        return navigateMonth;
    }
  };

  const getDateDisplayText = () => {
    switch (viewMode) {
      case "month":
        return currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      case "week":
        const weekStart = getWeekDays(currentDate)[0];
        const weekEnd = getWeekDays(currentDate)[6];
        return `${weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${weekEnd.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "day":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      default:
        return "";
    }
  };

  // New Event Modal logic
  const handleAddCustomEvent = async (data: {
    name: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    progress: number;
  }) => {
    try {
      const res = await fetch("https://nexapro.web.id/api/custom-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.name,
          description: data.description,
          date: data.due_date,
          color: "bg-green-500",
          type: "custom",
        }),
      });
      if (!res.ok) throw new Error("Failed to save event");
      await fetchCustomEvents();
      setIsNewEventModalOpen(false);
    } catch {
      // error handling
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
          <p className="text-gray-600">Manage your schedule and events</p>
        </div>
        <button
          onClick={() => setIsNewEventModalOpen(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          <span>New Event</span>
        </button>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => getNavigationHandler()("prev")}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800 min-w-[200px] text-center">
              {getDateDisplayText()}
            </h2>
            <button
              onClick={() => getNavigationHandler()("next")}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("month")}
            className={`px-3 py-2 text-sm rounded-md ${
              viewMode === "month"
                ? "bg-green-100 text-green-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-3 py-2 text-sm rounded-md ${
              viewMode === "week"
                ? "bg-green-100 text-green-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode("day")}
            className={`px-3 py-2 text-sm rounded-md ${
              viewMode === "day"
                ? "bg-green-100 text-green-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === "month" && renderMonthView()}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "day" && renderDayView()}

      {/* New Event Modal */}
      <NewProjectModal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onSubmit={handleAddCustomEvent}
      />
    </div>
  );
}
