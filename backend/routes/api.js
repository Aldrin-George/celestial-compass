const express = require('express');
const router = express.Router();
const axios = require('axios');
const { staticEvents } = require('../data/staticEvents'); // Make sure we have our other events

router.get('/events', async (req, res) => {
    const locationQuery = req.query.location;
    console.log(`\n--- New Event Request for "${locationQuery}" ---`);

    if (!locationQuery) {
        return res.status(400).json({ message: "A location query is required." });
    }

    // CORRECTED: We are now looking for the POSITIONSTACK key
    const POSITIONSTACK_API_KEY = process.env.POSITIONSTACK_API_KEY;
    const N2YO_API_KEY = process.env.N2YO_API_KEY;

    console.log(`[DEBUG] Positionstack Key Loaded: ${!!POSITIONSTACK_API_KEY}`);
    console.log(`[DEBUG] N2YO Key Loaded:          ${!!N2YO_API_KEY}`);

    try {
        // STEP 1: Geocoding with Positionstack
        const geocodeUrl = `http://api.positionstack.com/v1/forward?access_key=${POSITIONSTACK_API_KEY}&query=${encodeURIComponent(locationQuery)}&limit=1`;
        console.log(`[DEBUG] Calling Positionstack URL: ${geocodeUrl}`);
        const geoResponse = await axios.get(geocodeUrl);

        if (!geoResponse.data || geoResponse.data.data.length === 0) {
            return res.status(404).json({ message: `Could not find coordinates for location: ${locationQuery}` });
        }
        const { latitude, longitude, label } = geoResponse.data.data[0];
        console.log(`[DEBUG] Coordinates found: Lat ${latitude}, Lon ${longitude}`);

        // STEP 2: Satellite Tracking with N2YO
        const n2yoUrl = `https://api.n2yo.com/rest/v1/satellite/radiopasses/25544/${latitude}/${longitude}/0/2/10/&apiKey=${N2YO_API_KEY}`;
        console.log(`[DEBUG] Calling N2YO URL: ${n2yoUrl}`);
        const n2yoResponse = await axios.get(n2yoUrl);
        const passes = n2yoResponse.data.passes || [];

        const liveFlyoverEvents = passes.map(pass => ({
            type: 'flyover',
            title: `Live ISS Pass over ${label}`,
            date: new Date(pass.startUTC * 1000).toISOString(),
            description: `A real-time pass of the ISS, reaching ${pass.maxEl}° above the horizon.`,
            duration: Math.round(pass.duration / 60),
            details: `<strong>Max Elevation:</strong> ${pass.maxEl}°<br><strong>Appears:</strong> ${pass.startAz}° ${pass.startAzCompass}<br><strong>Disappears:</strong> ${pass.endAz}° ${pass.endAzCompass}`
        }));

        const allEvents = [...liveFlyoverEvents, ...staticEvents];
        const sortedEvents = allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        res.json(sortedEvents);

    } catch (error) {
        console.error("\n--- ERROR IN BACKEND ---");
        console.error(error.message);
        if (error.response) { console.error("DETAILS:", error.response.data); }
        console.error("------------------------\n");
        res.status(500).json({ message: "An error occurred on the server." });
    }
});

// APOD route (no changes needed here)
router.get('/apod', async (req, res) => {
    const NASA_API_KEY = process.env.NASA_API_KEY;
    const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
    try {
        const response = await axios.get(apodUrl);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching APOD from NASA:", error.message);
        res.status(500).json({ message: "Failed to fetch Picture of the Day." });
    }
});

module.exports = router;