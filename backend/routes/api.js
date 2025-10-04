const express = require('express');
const router = express.Router();
const axios = require('axios');

// This is the new "smart" endpoint
router.get('/events', async (req, res) => {
    // For this demo, we will use fixed coordinates for Koovappally, Kerala.
    // A real app would first convert the user's location string to these coordinates.
    const latitude = 9.56;
    const longitude = 76.78;
    const altitude = 20; // altitude in meters

    const N2YO_API_KEY = process.env.N2YO_API_KEY;
    const N2YO_BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';
    const ISS_NORAD_ID = '25544'; // The official ID for the ISS

    // The URL for the N2YO API to get the next 5 ISS passes
    const requestUrl = `${N2YO_BASE_URL}/radiopasses/${ISS_NORAD_ID}/${latitude}/${longitude}/${altitude}/2/10/&apiKey=${N2YO_API_KEY}`;

    try {
        // 1. The backend makes a request to the REAL N2YO API
        const response = await axios.get(requestUrl);
        const passes = response.data.passes;

        // 2. We format the real data to match what our frontend expects
        const formattedEvents = passes.map(pass => ({
            type: 'flyover',
            title: `Live ISS Pass for Your Location`,
            date: new Date(pass.startUTC * 1000).toISOString(),
            description: `A live pass of the ISS, reaching a max elevation of ${pass.maxEl}° above the horizon.`,
            brightness: -3.5, // Mocking brightness for now
            duration: Math.round(pass.duration / 60), // Duration in minutes
            details: `<strong>Max Elevation:</strong> ${pass.maxEl}°<br><strong>Appears:</strong> ${pass.startAz}° ${pass.startAzCompass}<br><strong>Disappears:</strong> ${pass.endAz}° ${pass.endAzCompass}`
        }));

        // 3. Send the formatted LIVE data back to the frontend
        res.json(formattedEvents);

    } catch (error) {
        console.error("Error fetching data from N2YO:", error.message);
        res.status(500).json({ message: "Failed to fetch live satellite data." });
    }
});

module.exports = router;