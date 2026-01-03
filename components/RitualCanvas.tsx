'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Button } from './ui/button';

interface RitualCanvasProps {
  audioBuffer: AudioBuffer;
  isPaused?: boolean;
  onComplete: (result: { imageDataUrl: string; audioBlob: Blob }) => void;
}

export function RitualCanvas({ audioBuffer, isPaused = false, onComplete }: RitualCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Three.js state (all refs, never triggers re-render)
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const spheresRef = useRef<Array<Array<THREE.Mesh | null>>>([]);
  const gridParticlesRef = useRef<THREE.Mesh[]>([]);
  const ribbonLineRef = useRef<THREE.Mesh | null>(null);
  
  // Audio state
  const audioCtxRef = useRef<AudioContext>();
  const eqFiltersRef = useRef<BiquadFilterNode[]>([]);
  const sourceNodeRef = useRef<AudioBufferSourceNode>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const recordedChunksRef = useRef<Blob[]>([]);
  
  // Ritual state
  const isActiveRef = useRef(false);
  const crystallizingRef = useRef(false);
  const finalEQStateRef = useRef<number[]>([]);
  const activeRowsRef = useRef<number[]>(new Array(36).fill(-1));
  const animationFrameIdRef = useRef<number>();
  const countdownIntervalRef = useRef<NodeJS.Timeout>();
  const timeRemainingRef = useRef(360);
  
  // UI state (these trigger re-renders for the overlay)
  const [timeDisplay, setTimeDisplay] = useState('6:00');
  const [isCrystallizing, setIsCrystallizing] = useState(false);
  
  const MAX_BANDS = 36;
  const MAX_ROWS = 36;
  const CIRCLE_OF_SIX = [0x4ade80, 0xf87171, 0xfb923c, 0x60a5fa, 0xc084fc, 0xfde047];
  
  // Setup Three.js scene (runs once on mount)
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x404040, 1.2));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);
    sceneRef.current = scene;
    
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
    camera.position.z = 10;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true, 
      preserveDrawingBuffer: true, 
      alpha: true 
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    
    // Initialize spheres array structure
    spheresRef.current = new Array(MAX_BANDS).fill(null).map(() => new Array(MAX_ROWS).fill(null));
    
    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      // Deep cleanup of geometries/materials would go here in production
    };
  }, []);
  
  // Animation loop (runs continuously while mounted)
  useEffect(() => {
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        // Update particles
        const particles = gridParticlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i] as any;
          p.userData.life -= 0.016;
          p.position.add(p.userData.velocity);
          (p.material as THREE.MeshBasicMaterial).opacity = p.userData.life * 0.6;
          if (p.userData.life <= 0) {
            sceneRef.current?.remove(p);
            p.geometry.dispose();
            (p.material as THREE.Material).dispose();
            particles.splice(i, 1);
          }
        }
        
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();
    
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);
  
  // Handle pause/resume from parent
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    if (isPaused && ctx.state === 'running') {
      ctx.suspend();
    } else if (!isPaused && ctx.state === 'suspended' && isActiveRef.current) {
      ctx.resume();
    }
  }, [isPaused]);
  
  // Initialize Audio and start ritual when audioBuffer arrives
  useEffect(() => {
    if (!audioBuffer || !canvasRef.current) return;
    
    const startRitual = async () => {
      // Create audio context
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      
      // Create EQ chain (36 bands)
      const bandFrequencies = Array.from({length: MAX_BANDS}, (_, i) => 20 * Math.pow(2, i / 3));
      const eqFilters: BiquadFilterNode[] = [];
      
      for (let i = 0; i < MAX_BANDS; i++) {
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = bandFrequencies[i];
        filter.Q.value = 1.4;
        filter.gain.value = 0;
        if (i > 0) eqFilters[i-1].connect(filter);
        eqFilters.push(filter);
      }
      eqFiltersRef.current = eqFilters;
      
      // Connect audio
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(eqFilters[0]);
      eqFilters[eqFilters.length - 1].connect(audioCtx.destination);
      sourceNodeRef.current = source;
      
      // Setup recording
      try {
        const dest = audioCtx.createMediaStreamDestination();
        eqFilters[eqFilters.length - 1].connect(dest);
        const recorder = new MediaRecorder(dest.stream, {
          mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm'
        });
        recordedChunksRef.current = [];
        recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
        recorder.onstop = () => {
          // Recording finalized - audioBlob available
        };
        recorder.start(100);
        mediaRecorderRef.current = recorder;
      } catch (e) {
        console.warn('Recording not supported', e);
      }
      
      // Start playback
      source.start(0);
      source.onended = () => {
        if (isActiveRef.current) endSession();
      };
      
      // Initialize state
      isActiveRef.current = true;
      finalEQStateRef.current = [];
      activeRowsRef.current = new Array(MAX_BANDS).fill(-1);
      timeRemainingRef.current = Math.floor(audioBuffer.duration);
      
      // Start countdown
      const updateTimer = () => {
        const t = timeRemainingRef.current;
        const m = Math.floor(t / 60);
        const s = t % 60;
        setTimeDisplay(`${m}:${s.toString().padStart(2, '0')}`);
      };
      updateTimer();
      
      countdownIntervalRef.current = setInterval(() => {
        timeRemainingRef.current--;
        updateTimer();
        if (timeRemainingRef.current <= 0) {
          clearInterval(countdownIntervalRef.current!);
        }
      }, 1000);
      
      // Enable interaction
      setupInteractionHandlers();
    };
    
    startRitual();
    
    return () => {
      // Cleanup audio on unmount
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [audioBuffer]); // Only re-run if audioBuffer changes (shouldn't)
  
  // Interaction logic (extracted from handleInteraction in your script)
  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!isActiveRef.current || crystallizingRef.current) return;
    
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const eqFilters = eqFiltersRef.current;
    const spheres = spheresRef.current;
    
    if (!canvas || !scene || !camera || !renderer || !eqFilters.length) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    
    if (x < -1 || x > 1 || y < -1 || y > 1) return;
    
    const bandIndex = Math.floor((x + 1) / 2 * MAX_BANDS);
    const rowIndex = Math.floor((y + 1) / 2 * MAX_ROWS);
    
    if (bandIndex < 0 || bandIndex >= MAX_BANDS || rowIndex < 0 || rowIndex >= MAX_ROWS) return;
    
    // Lazy create column
    if (!spheres[bandIndex] || !spheres[bandIndex][0]) {
      if (!spheres[bandIndex]) spheres[bandIndex] = new Array(MAX_ROWS).fill(null);
      for (let y = 0; y < MAX_ROWS; y++) {
        const colorHex = CIRCLE_OF_SIX[Math.min(Math.floor(bandIndex / 6), 5)];
        const color = new THREE.Color(`#${colorHex.toString(16).padStart(6, '0')}`);
        const material = new THREE.MeshStandardMaterial({
          color,
          transparent: true,
          opacity: 0.001 + (y / (MAX_ROWS - 1)) * 0.999,
          roughness: 0.2,
          metalness: 0.3,
          emissive: color,
          emissiveIntensity: 0
        });
        const geometry = new THREE.SphereGeometry(0.02, 16, 16);
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set((bandIndex / (MAX_BANDS - 1)) * 2 - 1, (y / (MAX_ROWS - 1)) * 2 - 1, 0);
        scene.add(sphere);
        spheres[bandIndex][y] = sphere;
      }
    }
    
    // Deactivate previous
    const oldRow = activeRowsRef.current[bandIndex];
    if (oldRow !== -1 && spheres[bandIndex][oldRow]) {
      (spheres[bandIndex][oldRow].material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
    }
    
    // Activate new
    activeRowsRef.current[bandIndex] = rowIndex;
    if (spheres[bandIndex][rowIndex]) {
      const material = spheres[bandIndex][rowIndex].material as THREE.MeshStandardMaterial;
      material.emissive = material.color.clone();
      material.emissiveIntensity = 2.0;
    }
    
    // Update EQ
    if (eqFilters[bandIndex]) {
      const gainDB = (rowIndex / (MAX_ROWS - 1) * 36) - 18;
      eqFilters[bandIndex].gain.value = gainDB;
    }
    
    // Create particle
    if (Math.random() < 0.3) {
      const geometry = new THREE.SphereGeometry(0.008, 8, 8);
      const colorHex = CIRCLE_OF_SIX[Math.min(Math.floor(bandIndex / 6), 5)];
      const material = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(`#${colorHex.toString(16).padStart(6, '0')}`), 
        transparent: true, 
        opacity: 0.6 
      });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set((bandIndex / (MAX_BANDS - 1)) * 2 - 1, (rowIndex / (MAX_ROWS - 1)) * 2 - 1, 0);
      (particle as any).userData = { 
        life: 1.0, 
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, 0) 
      };
      scene.add(particle);
      gridParticlesRef.current.push(particle);
    }
    
    // Capture final state in last 36 seconds (read from ref, not DOM!)
    if (timeRemainingRef.current <= 36) {
      finalEQStateRef.current[bandIndex] = rowIndex;
    }
  }, []);
  
  const setupInteractionHandlers = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        handleInteraction(touch.clientX, touch.clientY);
      }
    };
    
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        handleInteraction(e.touches[i].clientX, e.touches[i].clientY);
      }
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (e.buttons !== 1) return;
      const rect = canvas.getBoundingClientRect();
      handleInteraction(e.clientX, e.clientY);
    };
    
    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      handleInteraction(e.clientX, e.clientY);
    };
    
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    
    // Cleanup function returned but we don't call it since we only set up once
  };
  
  const endSession = useCallback(() => {
    if (!isActiveRef.current || crystallizingRef.current) return;
    
    crystallizingRef.current = true;
    setIsCrystallizing(true);
    isActiveRef.current = false;
    
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch {}
    }
    
    // Create ribbon line from finalEQState
    const createRibbon = () => {
      const scene = sceneRef.current;
      if (!scene || !finalEQStateRef.current.length) return;
      
      if (ribbonLineRef.current) {
        scene.remove(ribbonLineRef.current);
        ribbonLineRef.current.geometry.dispose();
        (ribbonLineRef.current.material as THREE.Material).dispose();
      }
      
      const points = [];
      for (let i = 0; i < MAX_BANDS; i++) {
        const row = finalEQStateRef.current[i] !== undefined ? finalEQStateRef.current[i] : 0;
        const x = (i / (MAX_BANDS - 1)) * 2 - 1;
        const y = (row / (MAX_ROWS - 1)) * 2 - 1;
        points.push(new THREE.Vector3(x, y, 0.05));
      }
      
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 64, 0.01, 8, false);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.8 
      });
      const ribbon = new THREE.Mesh(geometry, material);
      scene.add(ribbon);
      ribbonLineRef.current = ribbon;
      
      // Animate ribbon pulse
      let phase = 0;
      const pulse = () => {
        if (!ribbonLineRef.current || crystallizingRef.current) return;
        phase += 0.05;
        const r = Math.sin(phase) * 0.5 + 0.5;
        const g = Math.sin(phase + 2) * 0.5 + 0.5;
        const b = Math.sin(phase + 4) * 0.5 + 0.5;
        (ribbonLineRef.current.material as THREE.MeshBasicMaterial).color.setRGB(r, g, b);
        requestAnimationFrame(pulse);
      };
      pulse();
    };
    
    createRibbon();
    
    // Stop recording and capture
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const image = rendererRef.current?.domElement.toDataURL('image/png') || '';
        onComplete({ imageDataUrl: image, audioBlob: blob });
      };
      mediaRecorderRef.current.stop();
    } else {
      // No recorder, just image
      const image = rendererRef.current?.domElement.toDataURL('image/png') || '';
      onComplete({ imageDataUrl: image, audioBlob: new Blob() });
    }
  }, [onComplete]);
  
  return (
    <div ref={containerRef} className="canvas-container">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Timer Display */}
      <div className={`status-indicator ${isCrystallizing ? 'status-complete' : 'status-playing'}`}>
        {isCrystallizing ? 'CRYSTALLIZING...' : timeDisplay}
      </div>
      
      {/* Controls */}
      <div className="controls">
        <Button 
          variant="secondary" 
          onClick={endSession}
          disabled={isCrystallizing || !isActiveRef.current}
        >
          {isCrystallizing ? 'Finalizing...' : 'Complete Ritual'}
        </Button>
      </div>
    </div>
  );
}
