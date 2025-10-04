import React from 'react';

const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div className="modal-overlay visible" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold">{event.title}</h2>
                    <button onClick={onClose} className="text-3xl">&times;</button>
                </div>
                <p className="text-indigo-300 mb-4">{new Date(event.date).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "long" })}</p>
                {event.gallery && event.gallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {event.gallery.map(url => <img key={url} src={url} alt={event.title} className="rounded-lg w-full h-auto object-cover aspect-square" />)}
                    </div>
                )}
                <div className="space-y-4 text-gray-300 border-t border-gray-700 pt-4" dangerouslySetInnerHTML={{ __html: event.details }}></div>
            </div>
        </div>
    );
};

export default EventModal;