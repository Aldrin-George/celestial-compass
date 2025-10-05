import React, { useState, useEffect } from "react";
import CosmicFeature from "./components/CosmicFeature";
import ISSTracker from "./components/ISSTracker";
import EventsDisplay from "./components/EventsDisplay";
import EventModal from "./components/EventModal";

function App() {
  const [location, setLocation] = useState("New York");
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [apodData, setApodData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [isLoadingApod, setIsLoadingApod] = useState(true);
  const [apodError, setApodError] = useState(null);

  // Fetch APOD
  useEffect(() => {
    setIsLoadingApod(true);
    setApodError(null);

    fetch("http://localhost:5000/api/apod")
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch APOD")
      )
      .then((data) => setApodData(data))
      .catch((err) => {
        console.error("Error fetching APOD:", err);
        setApodError("Could not load Picture of the Day.");
      })
      .finally(() => setIsLoadingApod(false));
  }, []);

  // Fetch events for location
  const handleSearch = () => {
    setIsLoadingEvents(true);
    setEventsError(null);

    // Default test coords → New York
    setSearchedLocation({ name: location, lat: 40.71, lon: -74.0 });

    fetch(
      `http://localhost:5000/api/events?location=${encodeURIComponent(location)}`
    )
      .then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to fetch events")
      )
      .then((data) => {
        const sortedEvents = data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setEvents(sortedEvents);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setEventsError(err);
      })
      .finally(() => setIsLoadingEvents(false));
  };

  // Initial fetch
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen antialiased bg-gray-950 text-white">
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Celestial Compass
          </h1>
          <p className="text-lg md:text-xl text-indigo-300 mt-2">
            Your personal guide to the cosmos.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search Box */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Find Your Sky
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-grow bg-gray-900/50 border border-indigo-400/50 rounded-lg px-4 py-3"
                />
                <button
                  onClick={handleSearch}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Cosmic Feature */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Today's Cosmic Feature
              </h2>
              {isLoadingApod && <p>Loading Cosmic Feature...</p>}
              {apodError && <p className="text-red-400">{apodError}</p>}
              {apodData && searchedLocation && !isLoadingApod && !apodError && (
                <CosmicFeature apod={apodData} location={searchedLocation} />
              )}
            </div>

            {/* ISS Tracker */}
            <ISSTracker />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {searchedLocation && (
              <h3 className="text-3xl font-bold mb-6 text-center">
                Sky Events for {searchedLocation.name}
              </h3>
            )}
            {isLoadingEvents && (
              <p className="text-center">Loading events...</p>
            )}
            {eventsError && (
              <p className="text-center text-red-400">{eventsError}</p>
            )}
            {!isLoadingEvents && !eventsError && (
              <EventsDisplay events={events} onEventClick={setSelectedEvent} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
