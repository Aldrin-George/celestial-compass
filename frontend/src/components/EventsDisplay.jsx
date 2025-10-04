import React, { useState } from 'react';
import Icon from './Icon';

const EventsDisplay = ({ events, onEventClick }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    
    const filteredEvents = activeFilter === 'all' ? events : events.filter(e => e.type === activeFilter);

    const renderContent = () => {
        if (filteredEvents.length === 0) {
            return <div className="text-center py-10 glass-card"><p className="text-xl text-gray-300">No events found for this category.</p></div>;
        }

        switch (activeFilter) {
            case 'launch':
                return <div className="space-y-6">{filteredEvents.map(event => (
                    <div key={event.title} className="glass-card p-5 flex items-start gap-4">
                        <img className="w-20 h-20 rounded-md bg-black/30" src={event.missionPatch} alt="Mission Patch"/>
                        <div>
                            <p className="text-sm text-indigo-300 mb-1">{new Date(event.date).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</p>
                            <h4 className="text-2xl font-bold">{event.title}</h4>
                            <p className="mt-2 text-gray-300">{event.description}</p>
                            <button onClick={() => onEventClick(event)} className="mt-4 bg-gray-700/50 hover:bg-indigo-600/80 text-white font-semibold py-2 px-4 rounded-lg">Mission Details</button>
                        </div>
                    </div>
                ))}</div>;
            case 'flyover':
                 return <table className="w-full text-left glass-card">
                    <thead className="bg-black/20 text-indigo-300"><tr><th className="p-3">Satellite</th><th className="p-3">Time</th><th className="p-3">Duration</th><th className="p-3">Brightness</th><th className="p-3"></th></tr></thead>
                    <tbody>{filteredEvents.map(event => (
                        <tr key={event.date} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                            <td className="p-3 font-bold">{event.title}</td><td className="p-3 text-indigo-300">{new Date(event.date).toLocaleTimeString('en-IN', {timeStyle: 'short'})}</td><td className="p-3">{event.duration} min</td><td className="p-3">{event.brightness}</td>
                            <td className="p-3"><button onClick={() => onEventClick(event)} className="text-indigo-400 hover:text-indigo-200">Details</button></td>
                        </tr>
                    ))}</tbody>
                 </table>;
            case 'meteor':
                 return <div className="space-y-6">{filteredEvents.map(event =>(
                    <div key={event.title} className="glass-card p-5">
                        <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                        <p className="text-indigo-300 mb-4">Peak Night: {new Date(event.date).toLocaleDateString('en-IN', {dateStyle: 'long'})}</p>
                        <p className="mt-2 text-gray-300">{event.description}</p>
                        <button onClick={() => onEventClick(event)} className="mt-4 bg-gray-700/50 hover:bg-indigo-600/80 text-white font-semibold py-2 px-4 rounded-lg">View Gallery</button>
                    </div>
                ))}</div>;
            case 'celestial':
                return <div className="grid grid-cols-1 gap-6">{filteredEvents.map(event => (
                    <div key={event.title} className="glass-card p-5">
                        <div className="flex items-center gap-4">
                            <Icon type="celestial" />
                            <div><h3 className="text-2xl font-bold">{event.title}</h3><p className="text-indigo-300">{new Date(event.date).toLocaleString('en-IN', { dateStyle: 'medium' })}</p></div>
                        </div>
                        <p className="mt-3 text-gray-300">{event.description}</p>
                        <button onClick={() => onEventClick(event)} className="mt-4 bg-gray-700/50 hover:bg-indigo-600/80 text-white font-semibold py-2 px-4 rounded-lg">Learn More</button>
                    </div>
                ))}</div>;
            default: // all
                return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{events.map(event => (
                    <div key={event.date + event.title} className="glass-card p-5 flex flex-col h-full">
                         <div className="flex items-center mb-3"><div className="mr-4 text-indigo-400"><Icon type={event.type} /></div><h4 className="text-xl font-bold flex-grow">{event.title}</h4></div>
                         <p className="text-sm text-indigo-300 mb-3">{new Date(event.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                         <p className="text-gray-300 flex-grow mb-4">{event.description}</p>
                         <button onClick={() => onEventClick(event)} className="mt-auto bg-gray-700/50 hover:bg-indigo-600/80 text-white font-semibold py-2 px-4 rounded-lg">See Details</button>
                    </div>
                ))}</div>;
        }
    };
    
    return (
        <div>
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {['all', 'launch', 'flyover', 'meteor', 'celestial'].map(filter => (
                    <button key={filter} onClick={() => setActiveFilter(filter)} className={`filter-btn capitalize ${activeFilter === filter ? 'active' : ''}`}>
                        {filter}
                    </button>
                ))}
            </div>
            <div>{renderContent()}</div>
        </div>
    );
};

export default EventsDisplay;