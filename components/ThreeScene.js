
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = ({ isWarping }) => {
  const mountRef = useRef(null);
  const warpingRef = useRef(isWarping);

  useEffect(() => {
    warpingRef.current = isWarping;
  }, [isWarping]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- إضاءة محيطة وجانبية قوية لإبراز الهيكل الفولاذي ---
    const ambientLight = new THREE.AmbientLight(0x222244, 1.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(0, 10, 10);
    scene.add(mainLight);

    // أضواء Rim Lights ملونة تحيط بالمركبة من كل الجهات
    const pointLightBlue = new THREE.PointLight(0x00ffff, 15, 40);
    pointLightBlue.position.set(-10, 5, 5);
    scene.add(pointLightBlue);

    const pointLightOrange = new THREE.PointLight(0xff6600, 15, 40);
    pointLightOrange.position.set(10, 5, 5);
    scene.add(pointLightOrange);

    const sr71 = new THREE.Group();
    scene.add(sr71);

    // --- مواد النيون ---
    const blackMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x050505, 
      metalness: 1.0, 
      roughness: 0.2,
      emissive: 0x010102 // بصيص خفيف جداً للهيكل لئلا يختفي تماماً
    });
    
    const blueNeon = new THREE.MeshBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.9 });
    const orangeNeon = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.8 });
    const strobeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });

    // 1. الهيكل الرئيسي (Fuselage)
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.7, 12, 32), blackMaterial);
    body.rotation.x = Math.PI / 2;
    sr71.add(body);

    // خطوط طولية برتقالية وزرقاء على الهيكل
    const bodyLineB = new THREE.Mesh(new THREE.BoxGeometry(0.05, 10, 0.05), blueNeon);
    bodyLineB.position.y = 0.65;
    bodyLineB.rotation.x = Math.PI / 2;
    sr71.add(bodyLineB);

    const bodyLineO1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 9, 0.03), orangeNeon);
    bodyLineO1.position.set(0.6, 0.1, 0);
    bodyLineO1.rotation.x = Math.PI / 2;
    sr71.add(bodyLineO1);

    const bodyLineO2 = bodyLineO1.clone();
    bodyLineO2.position.x = -0.6;
    sr71.add(bodyLineO2);

    // 2. المقدمة (The Nose) - نيون أمامي
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.1, 2.8, 32), blackMaterial);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = 7.4;
    sr71.add(nose);

    const noseRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 16, 100), blueNeon);
    noseRing.rotation.x = Math.PI / 2;
    noseRing.position.z = 6.5;
    sr71.add(noseRing);

    // 3. قمرة القيادة (Cockpit) - تحديد الحواف
    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x00aaff }));
    cockpit.scale.set(1, 0.45, 2.2);
    cockpit.position.set(0, 0.45, 5.2);
    sr71.add(cockpit);

    const cockpitRim = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 16, 100), orangeNeon);
    cockpitRim.scale.set(1, 0.2, 2.2);
    cockpitRim.position.set(0, 0.4, 5.2);
    cockpitRim.rotation.x = Math.PI / 2;
    sr71.add(cockpitRim);

    // 4. المحركات والجوانب (Nacelles & Side Glow)
    const strobes = [];
    const createNacelle = (x) => {
      const group = new THREE.Group();
      
      const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.85, 8, 32), blackMaterial);
      engine.rotation.x = Math.PI / 2;
      group.add(engine);

      // خط نيون برتقالي يلف المحرك
      const ringO = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.03, 16, 100), orangeNeon);
      ringO.position.z = 2.5;
      group.add(ringO);

      // خط نيون أزرق في منتصف المحرك
      const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.03, 16, 100), blueNeon);
      ringB.position.z = 0;
      group.add(ringB);

      // أضواء الوميض (Strobes)
      const strobe = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), strobeMaterial.clone());
      strobe.position.set(x > 0 ? 0.9 : -0.9, 0.2, 1);
      group.add(strobe);
      strobes.push(strobe);

      // عادم خلفي متوهج (Back Glow)
      const exhaust = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.12, 16, 100), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
      exhaust.position.z = -4.1;
      group.add(exhaust);
      
      const fire = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.1, 1.5, 32), new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.6 }));
      fire.rotation.x = -Math.PI / 2;
      fire.position.z = -4.5;
      group.add(fire);

      // زعانف عمودية مع حواف نيون
      const finGeom = new THREE.ShapeGeometry(new THREE.Shape().moveTo(0,0).lineTo(2.5,0).lineTo(1.8,2.2).lineTo(0.7,2.2).lineTo(0,0));
      const fin = new THREE.Mesh(finGeom, blackMaterial);
      fin.rotation.y = Math.PI / 2;
      fin.rotation.z = x > 0 ? -0.3 : 0.3;
      fin.position.set(0, 0.6, -2.5);
      group.add(fin);

      const finGlow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.2, 0.04), orangeNeon);
      finGlow.position.set(x > 0 ? 0.1 : -0.1, 1.8, -1.8);
      group.add(finGlow);

      group.position.set(x, 0, -1);
      return group;
    };

    sr71.add(createNacelle(2.8));
    sr71.add(createNacelle(-2.8));

    // 5. الأجنحة (Wings) - تحديد كامل للحواف
    const wings = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 7.2), blackMaterial);
    wings.rotation.x = -Math.PI / 2;
    wings.position.z = -0.5;
    sr71.add(wings);

    // حواف الأجنحة الخارجية (أزرق)
    const wingEdgeBL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 7.2, 0.05), blueNeon);
    wingEdgeBL.position.set(3.1, 0.05, -0.5);
    wingEdgeBL.rotation.x = -Math.PI / 2;
    sr71.add(wingEdgeBL);

    const wingEdgeBR = wingEdgeBL.clone();
    wingEdgeBR.position.x = -3.1;
    sr71.add(wingEdgeBR);

    // حواف الأجنحة الخلفية (برتقالي)
    const wingEdgeRear = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.05, 0.05), orangeNeon);
    wingEdgeRear.position.set(0, 0.05, -4.1);
    sr71.add(wingEdgeRear);

    // النجوم
    const starCount = 12000;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 500;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 500;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(starGeom, new THREE.PointsMaterial({ size: 0.2, color: 0xffffff, transparent: true, opacity: 0.6 }));
    scene.add(stars);

    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now();
      
      // تحريك النجوم
      const positions = starGeom.attributes.position.array;
      const speed = warpingRef.current ? 40 : 1.0;
      for (let i = 0; i < starCount; i++) {
        positions[i * 3 + 2] += speed;
        if (positions[i * 3 + 2] > 100) positions[i * 3 + 2] = -700;
      }
      starGeom.attributes.position.needsUpdate = true;

      // تحريك المركبة (تمايل انسيابي)
      sr71.position.y = Math.sin(time * 0.001) * 0.25;
      sr71.position.x = Math.cos(time * 0.0005) * 0.1;
      sr71.rotation.y = Math.sin(time * 0.0004) * 0.06;
      sr71.rotation.z = Math.sin(time * 0.0008) * 0.05;

      // منطق الوميض الاحترافي (Strobe Logic)
      const strobeOn = (time % 2000) < 100 || ((time % 2000) > 250 && (time % 2000) < 350);
      strobes.forEach(s => {
        s.material.opacity = strobeOn ? 1.0 : 0.0;
        s.scale.setScalar(strobeOn ? 1.8 : 0.01);
      });

      // تأثير الـ Warp وتغيير قوة النيون
      if (warpingRef.current) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, 145, 0.05);
        sr71.position.z = THREE.MathUtils.lerp(sr71.position.z, -12, 0.05);
        blueNeon.opacity = 1.0;
        orangeNeon.opacity = 1.0;
      } else {
        camera.fov = THREE.MathUtils.lerp(camera.fov, 75, 0.02);
        sr71.position.z = THREE.MathUtils.lerp(sr71.position.z, 0, 0.02);
        blueNeon.opacity = 0.85;
        orangeNeon.opacity = 0.7;
      }
      camera.updateProjectionMatrix();
      
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
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return React.createElement('div', { 
    ref: mountRef, 
    className: "absolute inset-0 z-0 bg-black" 
  });
};

export default ThreeScene;
