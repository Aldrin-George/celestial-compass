require('dotenv').config(); // Make sure this is at the very top
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// Use CORS - This allows your frontend at localhost:3000 to talk to your backend at localhost:5000
app.use(cors());
app.use(express.json());

// Simple logging middleware to see incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.url}`);
    next();
});

// Use the API routes
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    // Let's check if the keys were loaded
    console.log("--- API Keys Loaded ---");
    console.log("NASA Key exists:", !!process.env.NASA_API_KEY);
    console.log("N2YO Key exists:", !!process.env.N2YO_API_KEY);
    console.log("Positionstack Key exists:", !!process.env.POSITIONSTACK_API_KEY);
    console.log("-----------------------");
    console.log(`Backend server is running on http://localhost:${PORT}`);
});