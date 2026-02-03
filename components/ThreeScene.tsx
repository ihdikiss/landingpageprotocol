
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  isWarping: boolean;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ isWarping }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const warpingRef = useRef(isWarping);

  useEffect(() => {
    warpingRef.current = isWarping;
  }, [isWarping]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x4040ff, 0.6));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const ship = new THREE.Group();
    scene.add(ship);

    const material = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, metalness: 0.9, roughness: 0.1 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, 10, 32), material);
    body.rotation.x = Math.PI / 2;
    ship.add(body);

    const leftEngine = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6, 32), material);
    leftEngine.rotation.x = Math.PI / 2;
    leftEngine.position.set(2, 0, -1);
    ship.add(leftEngine);

    const rightEngine = leftEngine.clone();
    rightEngine.position.set(-2, 0, -1);
    ship.add(rightEngine);

    const starCount = 8000;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeom, new THREE.PointsMaterial({ size: 0.1, color: 0xffffff }));
    scene.add(stars);

    const animate = () => {
      requestAnimationFrame(animate);
      const positions = starGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 2] += warpingRef.current ? 15 : 0.5;
        if (positions[i * 3 + 2] > 10) positions[i * 3 + 2] = -390;
      }
      starGeom.attributes.position.needsUpdate = true;
      
      if (warpingRef.current) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, 140, 0.05);
        camera.updateProjectionMatrix();
      }
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 bg-[#020205]" />;
};

export default ThreeScene;
