import React, { useState, useEffect } from 'react';
import { mockApod } from './data/mockData';
import CosmicFeature from './components/CosmicFeature';
import ISSTracker from './components/ISSTracker';
import EventsDisplay from './components/EventsDisplay';
import EventModal from './components/EventModal';

function App() {
    const [location, setLocation] = useState('Koovappally, Kerala');
    const [searchedLocation, setSearchedLocation] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleSearch = () => {
        setSearchedLocation({ name: location, lat: 9.56, lon: 76.78 });

        // The URL now includes the location!
        // We use encodeURIComponent to make sure spaces and special characters are handled correctly.
        fetch(`http://localhost:5000/api/events?location=${encodeURIComponent(location)}`)
            .then(response => response.json())
            .then(data => {
                const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
                setEvents(sortedEvents);
            })
            .catch(error => {
                console.error("Error fetching events from backend:", error);
            });
    };

    useEffect(() => {
        handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen antialiased">
            <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Celestial Compass</h1>
                    <p className="text-lg md:text-xl text-indigo-300 mt-2">Your personal guide to the cosmos.</p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-card p-6">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Find Your Sky</h2>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="flex-grow bg-gray-900/50 border border-indigo-400/50 rounded-lg px-4 py-3" />
                                <button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg">Search</button>
                            </div>
                        </div>
                        {searchedLocation && <CosmicFeature apod={mockApod} location={searchedLocation} />}
                        <ISSTracker />
                    </div>
                    <div className="lg:col-span-2">
                         {searchedLocation && <h3 className="text-3xl font-bold mb-6 text-center">Sky Events for {searchedLocation.name}</h3>}
                        <EventsDisplay events={events} onEventClick={setSelectedEvent} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;