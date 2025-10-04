import React from 'react';

const Icon = ({ type }) => {
    const icons = {
        flyover: <path d="M12.25 2.042a9.98 9.98 0 0 1 7.71 7.71 9.98 9.98 0 0 1-7.71 7.71 9.98 9.98 0 0 1-7.71-7.71A9.98 9.98 0 0 1 12.25 2.042ZM7 12l5 5m.25-10.5-1 1m-5.5 5.5-1 1M12 22v-2m10-8h-2m-2 6-1-1m-11-11-1-1" />,
        meteor: <path d="M22 2 2 22m12-20-2.5 2.5M19 7l-2.5 2.5m-2.5 7-2.5 2.5" />,
        celestial: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20zM2 12h20" /></>,
        launch: <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.1S5.21 15.66 4.5 16.5zM19 12c0-6-4.3-10-10-10M19 5c0-6-4.3-10-10-10M14 5c0-3.3-2.7-6-6-6" />,
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icons[type] || icons.celestial}
        </svg>
    );
};

export default Icon;