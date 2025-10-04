// backend/data/staticEvents.js

const staticEvents = [
    {
        type: 'meteor',
        title: 'Orionids Meteor Shower',
        date: '2025-10-21T22:00:00Z',
        description: 'A major meteor shower associated with Halley\'s Comet, known for bright and fast meteors.',
        gallery: ['https://images.unsplash.com/photo-1534237939992-676a1d4d21e4?q=80&w=1974&auto=format&fit=crop'],
        details: '<strong>Peak Rate:</strong> ~20 meteors/hour<br><strong>Radiant:</strong> Constellation Orion<br><strong>Best Viewing:</strong> After midnight. The Moon will be a waxing gibbous, potentially obscuring fainter meteors.'
    },
    {
        type: 'celestial',
        title: 'Venus-Jupiter Conjunction',
        date: '2025-11-22T18:45:00Z',
        description: 'The two brightest planets in our sky will appear extremely close together just after sunset.',
        gallery: ['https://images.unsplash.com/photo-1446776811953-b23d5795b4e2?q=80&w=2072&auto=format&fit=crop'],
        details: '<strong>Separation:</strong> Less than 1 degree apart.<br><strong>Location:</strong> Look to the west shortly after sunset. Both will be brilliant and unmistakable.'
    },
    {
        type: 'launch',
        title: 'Artemis III (Tentative)',
        date: '2025-12-15T12:00:00Z',
        description: 'Tentative launch window for NASA\'s Artemis III mission, aiming to return humans to the Moon.',
        missionPatch: 'https://placehold.co/100x100/0B3D91/FFFFFF?text=A-III',
        gallery: ['https://images.unsplash.com/photo-1634402735228-39e738472744?q=80&w=2070&auto=format&fit=crop'],
        details: '<strong>Agency:</strong> NASA<br><strong>Vehicle:</strong> Space Launch System (SLS)<br><strong>Goal:</strong> First crewed lunar landing since Apollo 17.'
    }
];

module.exports = { staticEvents };