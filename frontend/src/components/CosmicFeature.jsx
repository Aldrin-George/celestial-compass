import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CosmicFeature = ({ apod, location }) => {
    const globeContainerRef = useRef(null);

    // This useEffect handles the 3D globe
    useEffect(() => {
        if (!globeContainerRef.current || !location) return;
        // Clear the container on re-render
        while (globeContainerRef.current.firstChild) {
            globeContainerRef.current.removeChild(globeContainerRef.current.firstChild);
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, globeContainerRef.current.clientWidth / globeContainerRef.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(globeContainerRef.current.clientWidth, globeContainerRef.current.clientHeight);
        globeContainerRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(5, 64, 64);
        const textureLoader = new THREE.TextureLoader();
        const material = new THREE.MeshPhongMaterial({ map: textureLoader.load('https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg') });
        const earth = new THREE.Mesh(geometry, material);
        scene.add(earth);

        const phi = (90 - location.lat) * (Math.PI / 180);
        const theta = (location.lon + 180) * (Math.PI / 180);
        camera.position.set(-10 * Math.sin(phi) * Math.cos(theta), 10 * Math.cos(phi), 10 * Math.sin(phi) * Math.sin(theta));
        camera.lookAt(earth.position);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            earth.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();

        return () => cancelAnimationFrame(animationFrameId);

    }, [location]);

    // This function decides whether to render an image or a video
    const renderMedia = () => {
        if (apod.media_type === 'video') {
            return (
                <iframe
                    src={apod.url}
                    title="Astronomy Video of the Day"
                    frameBorder="0"
                    allow="encrypted-media"
                    allowFullScreen
                    className="rounded-lg mb-4 w-full h-auto aspect-video object-cover"
                />
            );
        } else {
            return (
                <img
                    src={apod.url}
                    alt={apod.title}
                    className="rounded-lg mb-4 w-full h-auto aspect-video object-cover"
                />
            );
        }
    };

    return (
        <>
            <div ref={globeContainerRef} id="globe-container"></div>
            <p className="text-center mt-2 text-indigo-300 text-sm">Your Location from Orbit</p>
            <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">{apod.title || "Astronomy Picture of the Day"}</h3>
                {renderMedia()}
                <p className="text-gray-300 text-sm max-h-24 overflow-y-auto">{apod.explanation}</p>
            </div>
        </>
    );
};

export default CosmicFeature;