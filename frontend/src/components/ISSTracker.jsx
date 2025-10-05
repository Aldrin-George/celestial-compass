import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Icon from './Icon';

const ISSTracker = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [issInfo, setIssInfo] = useState('Loading ISS position...');

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

        const issIcon = L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIuMjUgMi4wNDJhOS45OCA5Ljk4IDAgMCAxIDcuNzEgNy43MSA5Ljk4IDkuOTggMCAwIDEgLTcuNzEgNy43MSA5Ljk4IDkuOTggMCAwIDEgLTcuNzEtNy43MUE5Ljk4IDkuOTggMCAwIDEgMTIuMjUgMi4wNDJaIi8+PHBhdGggZD0ibTcgMTIgNSA1Ii8+PHBhdGggZD0ibTEyLjUgNi45LTEgMSIvPjxwYXRoIGQ9Im02LjUgMTIuNS0xIDEiLz48cGF0aCBkPSJNMTIgMjJ2LTIiLz48cGF0aCBkPSJNMjIgMTJoLTIiLz48cGF0aCBkPSJtMTggMTgtMS0xIi8+PHBhdGggZD0ibTYgNi0xLTEiLz48L3N2Zz4=',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });

        const issMarker = L.marker([0, 0], { icon: issIcon }).addTo(mapRef.current);

        // Fetch ISS position every 5 seconds
        const fetchISS = async () => {
            try {
                const res = await fetch('http://api.open-notify.org/iss-now.json');
                const data = await res.json();
                if (data.message === 'success') {
                    const lat = parseFloat(data.iss_position.latitude);
                    const lon = parseFloat(data.iss_position.longitude);
                    issMarker.setLatLng([lat, lon]);
                    mapRef.current.setView([lat, lon], mapRef.current.getZoom());
                    setIssInfo(`Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);
                }
            } catch (err) {
                console.error('Error fetching ISS position:', err);
                setIssInfo('Failed to fetch ISS position.');
            }
        };

        fetchISS(); // initial fetch
        const intervalId = setInterval(fetchISS, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><Icon type="flyover" /> ISS Live Tracker</h2>
            <div ref={mapContainerRef} id="issMap" style={{ height: '300px', width: '100%' }}></div>
            <p className="text-center mt-3 text-indigo-300 text-sm">{issInfo}</p>
        </div>
    );
};

export default ISSTracker;
