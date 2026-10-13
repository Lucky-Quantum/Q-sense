"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

function roundedBox(
  width: number,
  height: number,
  depth: number,
  color: number,
  radius = 0.12
) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -depth / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + depth - radius);
  shape.quadraticCurveTo(x + width, y + depth, x + width - radius, y + depth);
  shape.lineTo(x + radius, y + depth);
  shape.quadraticCurveTo(x, y + depth, x, y + depth - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.045,
    bevelThickness: 0.04,
    curveSegments: 4,
  });

  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, height / 2, 0);

  return new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color,
      metalness: 0.68,
      roughness: 0.28,
    })
  );
}

function createLaptopScreenCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 780;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Background
  const bg = ctx.createLinearGradient(0, 0, 1280, 780);
  bg.addColorStop(0, "#070b1d");
  bg.addColorStop(1, "#0d1330");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1280, 780);

  // Sidebar
  ctx.fillStyle = "#080b17";
  ctx.fillRect(0, 0, 190, 780);

  ctx.font = "bold 26px Inter, Arial";
  ctx.fillStyle = "#f7f4ff";
  ctx.fillText("Q-SENSE", 40, 48);

  const nav = ["Quantum Lab", "Learn", "Algorithms", "Challenges", "Progress"];
  nav.forEach((item, i) => {
    const y = 110 + i * 58;
    if (i === 0) {
      ctx.fillStyle = "rgba(107, 76, 242, .20)";
      ctx.roundRect(20, y - 27, 150, 38, 10);
      ctx.fill();
      ctx.fillStyle = "#c8bcff";
    } else {
      ctx.fillStyle = "#70778e";
    }
    ctx.font = "16px Inter, Arial";
    ctx.fillText(item, 38, y);
  });

  // Main title
  ctx.fillStyle = "#7f8aff";
  ctx.font = "15px Inter, Arial";
  ctx.fillText("QUANTUM LAB", 230, 42);
  ctx.fillStyle = "#f9f8ff";
  ctx.font = "bold 28px Inter, Arial";
  ctx.fillText("Build a Bell State", 230, 76);

  // Backend + Run
  ctx.fillStyle = "#11162a";
  ctx.roundRect(950, 30, 150, 40, 9);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.09)";
  ctx.stroke();
  ctx.fillStyle = "#a2a8b9";
  ctx.font = "14px Inter, Arial";
  ctx.fillText("Qiskit Aer", 975, 56);

  ctx.fillStyle = "#6f4df3";
  ctx.roundRect(1114, 30, 90, 40, 9);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px Inter, Arial";
  ctx.fillText("Run", 1148, 56);

  // Circuit card
  ctx.fillStyle = "#090e20";
  ctx.strokeStyle = "rgba(255,255,255,.07)";
  ctx.roundRect(225, 115, 665, 250, 15);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#6e748b";
  ctx.font = "14px Inter, Arial";
  ctx.fillText("Circuit · 2 Qubits", 250, 146);

  const drawWire = (y: number) => {
    ctx.strokeStyle = "#42485d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(280, y);
    ctx.lineTo(842, y);
    ctx.stroke();
  };

  drawWire(215);
  drawWire(295);

  ctx.fillStyle = "#7b55ff";
  ctx.roundRect(340, 190, 54, 50, 9);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 21px Inter, Arial";
  ctx.fillText("H", 359, 222);

  ctx.fillStyle = "#a78bfa";
  ctx.beginPath();
  ctx.arc(580, 215, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#9b6eff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(580, 215);
  ctx.lineTo(580, 295);
  ctx.stroke();

  ctx.fillStyle = "#4b61f7";
  ctx.roundRect(552, 270, 56, 50, 9);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Inter, Arial";
  ctx.fillText("X", 572, 302);

  ctx.fillStyle = "#4b5267";
  ctx.roundRect(790, 190, 44, 50, 8);
  ctx.fill();
  ctx.roundRect(790, 270, 44, 50, 8);
  ctx.fill();
  ctx.fillStyle = "#9096aa";
  ctx.font = "16px Inter, Arial";
  ctx.fillText("M", 803, 221);
  ctx.fillText("M", 803, 301);

  ctx.fillStyle = "#60677d";
  ctx.font = "14px ui-monospace, monospace";
  ctx.fillText("q0", 245, 220);
  ctx.fillText("q1", 245, 300);

  // Code card
  ctx.fillStyle = "#070b18";
  ctx.roundRect(225, 385, 410, 200, 15);
  ctx.fill();
  ctx.fillStyle = "#697187";
  ctx.font = "14px Inter, Arial";
  ctx.fillText("Python · Qiskit", 250, 416);

  ctx.font = "15px ui-monospace, monospace";
  ctx.fillStyle = "#8ba6ff";
  ctx.fillText("qc = QuantumCircuit(2, 2)", 250, 458);
  ctx.fillStyle = "#c690ff";
  ctx.fillText("qc.h(0)", 250, 490);
  ctx.fillText("qc.cx(0, 1)", 250, 522);
  ctx.fillStyle = "#8ba6ff";
  ctx.fillText("qc.measure_all()", 250, 554);

  // Results
  ctx.fillStyle = "#090e20";
  ctx.roundRect(660, 385, 230, 200, 15);
  ctx.fill();
  ctx.fillStyle = "#697187";
  ctx.font = "14px Inter, Arial";
  ctx.fillText("Measurement Results", 685, 416);

  const bars = [
    { label: "00", value: 0.5, color: "#7860f7" },
    { label: "01", value: 0.02, color: "#273047" },
    { label: "10", value: 0.02, color: "#273047" },
    { label: "11", value: 0.5, color: "#cf5cf2" },
  ];

  bars.forEach((bar, i) => {
    const x = 690 + i * 47;
    const h = 105 * bar.value;
    ctx.fillStyle = bar.color;
    ctx.roundRect(x, 540 - h, 28, h, 4);
    ctx.fill();
    ctx.fillStyle = "#6f768a";
    ctx.font = "10px Inter, Arial";
    ctx.fillText(bar.label, x + 7, 566);
  });

  // AI Copilot
  ctx.fillStyle = "rgba(105, 76, 243, .14)";
  ctx.strokeStyle = "rgba(128, 105, 255, .35)";
  ctx.roundRect(410, 620, 505, 100, 15);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#b9a5ff";
  ctx.font = "bold 16px Inter, Arial";
  ctx.fillText("✦  AI Copilot", 435, 650);
  ctx.fillStyle = "#b6bdd0";
  ctx.font = "13px Inter, Arial";
  ctx.fillText("Great! This circuit creates a Bell state", 435, 678);
  ctx.fillText("with strong correlation between q0 and q1.", 435, 699);

  return canvas;
}

export default function QuantumLaptop() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      34,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0.05, 0.75, 7.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.x = -0.03;
    group.rotation.y = -0.12;

    const updateResponsiveFraming = () => {
      const isMobile = window.matchMedia("(max-width: 620px)").matches;
      camera.position.z = isMobile ? 9.8 : 7.2;
      group.scale.setScalar(isMobile ? 0.76 : 1);
    };

    updateResponsiveFraming();
    scene.add(group);

    // Base
    const base = roundedBox(5.4, 0.18, 2.8, 0x111729, 0.18);
    base.position.y = -0.16;
    group.add(base);

    const cyanEdge = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 0.025, 0.018),
      new THREE.MeshBasicMaterial({ color: 0x14b8ff, toneMapped: false })
    );
    cyanEdge.position.set(-1.35, -0.19, 1.395);
    group.add(cyanEdge);

    const violetEdge = new THREE.Mesh(
      new THREE.BoxGeometry(2.7, 0.025, 0.018),
      new THREE.MeshBasicMaterial({ color: 0x8b5cff, toneMapped: false })
    );
    violetEdge.position.set(1.35, -0.19, 1.395);
    group.add(violetEdge);

    // Trackpad
    const trackpad = roundedBox(1.45, 0.035, 0.92, 0x0d1120, 0.08);
    trackpad.position.set(0.0, -0.03, 0.72);
    group.add(trackpad);

    // Keyboard
    const keyMaterial = new THREE.MeshStandardMaterial({
      color: 0x252b3f,
      metalness: 0.35,
      roughness: 0.65,
    });

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 11; col++) {
        const width = col === 10 ? 0.27 : 0.3;
        const key = new THREE.Mesh(
          new THREE.BoxGeometry(width, 0.055, 0.26),
          keyMaterial
        );
        key.position.set(
          -1.9 + col * 0.37,
          -0.015,
          -0.62 + row * 0.34
        );
        group.add(key);
      }
    }

    // Screen frame
    const screenFrame = new THREE.Mesh(
      new RoundedBoxGeometry(5.35, 3.25, 0.15, 3, 0.06),
      new THREE.MeshStandardMaterial({
        color: 0x111729,
        metalness: 0.68,
        roughness: 0.28,
      })
    );
    screenFrame.position.set(0, 1.5, -1.45);
    screenFrame.rotation.x = -0.08;
    group.add(screenFrame);

    const canvas = createLaptopScreenCanvas();
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(4.9, 2.86),
      new THREE.MeshBasicMaterial({
        map: texture,
        toneMapped: false,
      })
    );

    screen.position.set(0, 1.5, -1.365);
    screen.rotation.x = -0.08;
    group.add(screen);

    // Screen glow plane
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.05, 2.96),
      new THREE.MeshBasicMaterial({
        color: 0x6458ff,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
      })
    );
    glow.position.set(0, 1.5, -1.35);
    glow.rotation.x = -0.08;
    group.add(glow);

    // Lights
    scene.add(new THREE.HemisphereLight(0x6f67ff, 0x0d1022, 2.1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 7, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const violet = new THREE.PointLight(0x7c5cff, 18, 9);
    violet.position.set(3.3, 2.2, 2.7);
    scene.add(violet);

    const cyan = new THREE.PointLight(0x2dd4ff, 11, 8);
    cyan.position.set(-3.2, 2.0, 1.8);
    scene.add(cyan);

    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);

      const t = performance.now() * 0.001;
      group.position.y = Math.sin(t * 1.15) * 0.045;
      group.rotation.y = -0.12 + Math.sin(t * 0.55) * 0.018;
      group.rotation.z = Math.sin(t * 0.45) * 0.004;

      renderer.render(scene, camera);
    };

    animate();

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      updateResponsiveFraming();
      renderer.setSize(width, height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.dispose();
      texture.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="quantum-laptop-canvas" />;
}