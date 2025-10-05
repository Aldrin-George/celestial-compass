import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CosmicFeature = ({ apod, location }) => {
  const globeContainerRef = useRef(null);

  useEffect(() => {
    if (!globeContainerRef.current) return;

    const container = globeContainerRef.current;

    // Clear previous children
    while (container.firstChild) container.removeChild(container.firstChild);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // Texture loader (single working texture)
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load(
      "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg"
    );

    // Earth
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 10, // makes the Earth slightly reflective
    });
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Starry background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const starVertices = [];
    for (let i = 0; i < starCount; i++) {
      starVertices.push(
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000)
      );
    }
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, [location]);

  // Render APOD media
  const renderMedia = () => {
    if (!apod) return null;
    if (apod.media_type === "video") {
      return (
        <iframe
          src={apod.url}
          title="Astronomy Video of the Day"
          frameBorder="0"
          allow="encrypted-media"
          allowFullScreen
          className="rounded-lg mb-4 w-full aspect-video"
        />
      );
    }
    return (
      <img
        src={apod.url}
        alt={apod.title}
        className="rounded-lg mb-4 w-full aspect-video object-cover"
      />
    );
  };

  return (
    <>
      <div
        ref={globeContainerRef}
        className="w-full h-[500px] bg-black rounded-lg"
      />
      <p className="text-center mt-2 text-indigo-300 text-sm">
        Your Location from Orbit
      </p>
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">
          {apod?.title || "Astronomy Picture of the Day"}
        </h3>
        {renderMedia()}
        <p className="text-gray-300 text-sm max-h-24 overflow-y-auto">
          {apod?.explanation}
        </p>
      </div>
    </>
  );
};

export default CosmicFeature;
