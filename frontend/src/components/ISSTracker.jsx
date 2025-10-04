import React, { useEffect, useRef, useState } from 'react'; // <-- This line is now fixed
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensures the map CSS is loaded
import Icon from './Icon';

const ISSTracker = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [issInfo, setIssInfo] = useState('Initializing...');

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([10, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

        // This is the corrected icon definition
        const issIcon = L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIuMjUgMi4wNDJhOS45OCA5Ljk4IDAgMCAxIDcuNzEgNy47MSA5Ljk4IDkuOTggMCAwIDEgLTcuNzEgNy43MSA5Ljk4IDkuOTggMCAwIDEgLTcuNzEtNy47MUE5Ljk4IDkuOTggMCAwIDEgMTIuMjUgMi4wNDJaIi8+PHBhdGggZD0ibTcgMTIgNSA1Ii8+PHBhdGggZD0ibTEyLjUgNi45LTEgMSIvPjxwYXRoIGQ9Im02LjUgMTIuNS0xIDEiLz48cGF0aCBkPSJNMTIgMjJ2LTIiLz48cGF0aCBkPSJNMjIgMTJoLTIiLz48cGF0aCBkPSJtMTggMTgtMS0xIi8+PHBhdGggZD0ibTYgNi0xLTEiLz48L3N2Zz4=',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        const issMarker = L.marker([0, 0], { icon: issIcon }).addTo(mapRef.current);

        let mockLat = 9.5, mockLon = 76.7;
        const intervalId = setInterval(() => {
            mockLon += 5; if (mockLon > 180) mockLon = -180;
            mockLat += (Math.random() - 0.5) * 5;
            const lat = mockLat.toFixed(2), lon = mockLon.toFixed(2);
            issMarker.setLatLng([lat, lon]);
            setIssInfo(`Lat: ${lat}, Lon: ${lon}`);
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><Icon type="flyover" /> ISS Live Tracker</h2>
            <div ref={mapContainerRef} id="issMap"></div>
            <p className="text-center mt-3 text-indigo-300 text-sm">{issInfo}</p>
        </div>
    );
};

export default ISSTracker;