// components/RitualCanvas.tsx
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { Button } from './ui/button';

// --- Component Props (Update based on page.tsx implementation) ---
interface RitualCanvasProps {
  audioBuffer: AudioBuffer
  isPaused: boolean
  flatMode: boolean
  onComplete: (result: { imageDataUrl: string; audioBlob: Blob }) => void
  onPause?: () => void // <-- Add this (optional)
  onResume?: () => void // <-- Add this (optional)
  onEnd?: () => void;
}
export function RitualCanvas({ 
    audioBuffer, 
    isPaused, 
    flatMode, 
    onComplete, 
    onPause,
    onResume,
    onEnd
}: RitualCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Refs for Three.js and mutable objects that don't need re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const spheresRef = useRef<Array<Array<THREE.Mesh | null>>>([]);
  const gridParticlesRef = useRef<THREE.Mesh[]>([]);
  const ribbonLineRef = useRef<THREE.Mesh | null>(null);
  
  // Refs for Audio Management
  const audioCtxRef = useRef<AudioContext | null>(null);
  const eqFiltersRef = useRef<BiquadFilterNode[]>([]);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  // Refs for Ritual State
  const isActiveRef = useRef(false);
  const crystallizingRef = useRef(false);
  const finalEQStateRef = useRef<number[]>([]);
  const activeRowsRef = useRef<number[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | undefined | null>(null);
  const timeRemainingRef = useRef(360);
  
  // State for UI elements that need to update the DOM (like the timer)
  const [timeDisplay, setTimeDisplay] = useState('6:00');
  
  const MAX_BANDS = 36;
  const MAX_ROWS = 36;
  const CIRCLE_OF_SIX = [0x4ade80, 0xf87171, 0xfb923c, 0x60a5fa, 0xc084fc, 0xfde047];
  
  // --- Effect 1: Setup Canvas, Renderer, Camera, and Resize Listener (Runs Once) ---
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.add(new THREE.AmbientLight(0x404040, 1.2));
    
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
    camera.position.z = 10;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: true });
    rendererRef.current = renderer;
    
    spheresRef.current = Array.from({length: MAX_BANDS}, () => new Array(MAX_ROWS).fill(null));
    activeRowsRef.current = new Array(MAX_BANDS).fill(flatMode ? 0 : MAX_ROWS - 1);

    const handleResize = () => {
      if (rendererRef.current) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [flatMode]);
  
  // --- Effect 2: Main Animation Loop (Runs Continuously) ---
  useEffect(() => {
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;

      if (renderer && scene && camera) {
        // 1. Update Particles Life/Position
        const particles = gridParticlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p: any = particles[i];
          p.userData.life -= 0.016;
          p.position.add(p.userData.velocity);
          (p.material as THREE.MeshBasicMaterial).opacity = p.userData.life * 0.6;
          if (p.userData.life <= 0) {
            scene.remove(p);
            p.geometry.dispose(null);
            (p.material as THREE.Material).dispose();
            particles.splice(i, 1);
          }
        }
        
        renderer.render(scene, camera);
      }
    };
    animate();
    
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  // --- Effect 3: Handle Pause/Resume from Parent ---
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    if (isPaused && ctx.state === 'running') {
      ctx.suspend();
    } else if (!isPaused && ctx.state === 'suspended' && isActiveRef.current) {
      ctx.resume();
    }
  }, [isPaused]);
  
  // --- Effect 4: Audio Setup, Interaction Setup, and Start Ritual (Runs ONCE when audioBuffer is passed) ---
  useEffect(() => {
    if (!audioBuffer || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    const endSession = useCallback(() => {
        if (!isActiveRef.current || crystallizingRef.current) return;
        
        crystallizingRef.current = true;
        isActiveRef.current = false;
        
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        if (sourceNodeRef.current) {
          try { sourceNodeRef.current.stop(); } catch {}
        }
        
        // 1. Create Ribbon Line (visualizes final state)
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
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
            const ribbon = new THREE.Mesh(geometry, material);
            scene.add(ribbon);
            ribbonLineRef.current = ribbon;
            
            // Simple pulse animation for the ribbon end state
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
        
        // 2. Stop Recording & Notify Parent
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
                const image = rendererRef.current?.domElement.toDataURL('image/png') || '';
                onComplete({ imageDataUrl: image, audioBlob: blob });
            };
            mediaRecorderRef.current.stop();
        } else {
            const image = rendererRef.current?.domElement.toDataURL('image/png') || '';
            onComplete({ imageDataUrl: image, audioBlob: new Blob() });
        }
    }, [onComplete]);

    // --- Main Ritual Start Logic ---
    const startRitual = async () => {
      try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioCtx();
          audioCtxRef.current = audioCtx;

          // Initialize EQ Chain
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

          // Connect Audio Source -> EQ -> Destination
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(eqFilters[0]);
          eqFilters[eqFilters.length - 1].connect(audioCtx.destination);
          sourceNodeRef.current = source;

          // Setup Recording Stream
          try {
              const dest = audioCtx.createMediaStreamDestination();
              eqFilters[eqFilters.length - 1].connect(dest);
              const recorder = new MediaRecorder(dest.stream, {
                  mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm'
              });
              recordedChunksRef.current = [];
              recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
              recorder.start(100);
              mediaRecorderRef.current = recorder;
          } catch (e) {
              console.warn('Recording not supported, proceeding without audio recording.', e);
          }

          source.start(0);
          source.onended = () => { if (isActiveRef.current) endSession(); };

          // Initialize Ritual State
          isActiveRef.current = true;
          timeRemainingRef.current = Math.floor(audioBuffer.duration);
          
          // Setup Countdown & UI Timer
          const updateTimer = () => {
              const t = timeRemainingRef.current;
              const m = Math.floor(t / 60);
              const s = t % 60;
              setTimeDisplay(`${m}:${s.toString().padStart(2, '0')}`);
          };
          
          countdownIntervalRef.current = setInterval(() => {
              timeRemainingRef.current--;
              updateTimer();
              if (timeRemainingRef.current <= 0) {
    if (countdownIntervalRef.current != null) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
    }
    endSession();
              }
          }, 1000);
          updateTimer();

          // Enable Interaction
          setupInteractionHandlers();

      } catch (e) {
          console.error("Ritual failed to start:", e);
          // In a real app, you would call onComplete or handle error state here
      }
    };
    
    // --- Interaction Handlers Setup ---
    const handleInteraction = useCallback((clientX: number, clientY: number) => {
        if (!isActiveRef.current || crystallizingRef.current) return;
        
        const canvas = canvasRef.current;
        const scene = sceneRef.current;
        const eqFilters = eqFiltersRef.current;
        const spheres = spheresRef.current;
        
        if (!canvas || !scene || !eqFilters.length || !cameraRef.current) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((clientY - rect.top) / rect.height) * 2 + 1;
        
        if (x < -1 || x > 1 || y < -1 || y > 1) return;
        
        const bandIndex = Math.floor((x + 1) / 2 * MAX_BANDS);
        const rowIndex = Math.floor((y + 1) / 2 * MAX_ROWS);
        
        if (bandIndex < 0 || bandIndex >= MAX_BANDS || rowIndex < 0 || rowIndex >= MAX_ROWS) return;
        
        // 1. Lazy Create Column Spheres
        if (!spheres[bandIndex] || !spheres[bandIndex][0]) {
          if (!spheres[bandIndex]) spheres[bandIndex] = new Array(MAX_ROWS).fill(null);
          for (let y = 0; y < MAX_ROWS; y++) {
            const colorHex = CIRCLE_OF_SIX[Math.min(Math.floor(bandIndex / 6), 5)];
            const color = new THREE.Color(`#${colorHex.toString(16).padStart(6, '0')}`);
            const material = new THREE.MeshStandardMaterial({
              color,
              transparent: true,
              opacity: 0.001 + (y / (MAX_ROWS - 1)) * 0.999,
              roughness: 0.2, metalness: 0.3, emissive: color, emissiveIntensity: 0
            });
            const geometry = new THREE.SphereGeometry(0.02, 16, 16);
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set((bandIndex / (MAX_BANDS - 1)) * 2 - 1, (y / (MAX_ROWS - 1)) * 2 - 1, 0);
            scene.add(sphere);
            spheres[bandIndex][y] = sphere;
          }
        }
        
        // 2. Deactivate previous & Activate new sphere height
        const oldRow = activeRowsRef.current[bandIndex];
        if (oldRow !== -1 && spheres[bandIndex][oldRow]) {
          (spheres[bandIndex][oldRow]?.material as THREE.MeshStandardMaterial)!.emissiveIntensity = 0;
        }
        
        activeRowsRef.current[bandIndex] = rowIndex;
        if (spheres[bandIndex][rowIndex]) {
          const material = spheres[bandIndex][rowIndex]?.material as THREE.MeshStandardMaterial;
          material.emissive = material.color.clone();
          material.emissiveIntensity = 2.0;
        }
        
        // 3. Update EQ Gain
        if (eqFilters[bandIndex]) {
          const gainDB = (rowIndex / (MAX_ROWS - 1) * 36) - 18;
          eqFilters[bandIndex].gain.value = gainDB;
        }
        
        // 4. Particle effect
        if (Math.random() < 0.3) {
          const geometry = new THREE.SphereGeometry(0.008, 8, 8);
          const colorHex = CIRCLE_OF_SIX[Math.min(Math.floor(bandIndex / 6), 5)];
          const material = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color(`#${colorHex.toString(16).padStart(6, '0')}`), 
            transparent: true, opacity: 0.6 
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
        
        // 5. Capture final state data for ribbon
        if (timeRemainingRef.current <= 36) {
          finalEQStateRef.current[bandIndex] = rowIndex;
        }
    }, [MAX_BANDS, MAX_ROWS]);
    
    const setupInteractionHandlers = () => {
      if (!canvas) return;
      
      const onTouchStart = (e: TouchEvent) => { e.preventDefault(); for (let i = 0; i < e.touches.length; i++) handleInteraction(e.touches[i].clientX, e.touches[i].clientY); };
      const onTouchMove = (e: TouchEvent) => { e.preventDefault(); for (let i = 0; i < e.touches.length; i++) handleInteraction(e.touches[i].clientX, e.touches[i].clientY); };
      const onMouseMove = (e: MouseEvent) => { if (e.buttons === 1) handleInteraction(e.clientX, e.clientY); };
      const onMouseDown = (e: MouseEvent) => { handleInteraction(e.clientX, e.clientY); };
      
      canvas.addEventListener('touchstart', onTouchStart, { passive: false });
      canvas.addEventListener('touchmove', onTouchMove, { passive: false });
      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('mousemove', onMouseMove);
      
      // Cleanup is handled by the outer useEffect return block, but event listeners often need manual cleanup too:
      return () => {
        canvas.removeEventListener('touchstart', onTouchStart);
        canvas.removeEventListener('touchmove', onTouchMove);
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseMove);
      };
    };

    // Start the process
    const cleanupHandlers = setupInteractionHandlers();
    startRitual();
    
    // Return cleanup for interaction handlers
    return () => {
        if(cleanupHandlers) cleanupHandlers();
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        if (sourceNodeRef.current) { try { sourceNodeRef.current.stop(); } catch {} }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (audioCtxRef.current) {
            audioCtxRef.current.close();
        }
    };
  }, [audioBuffer, onComplete]); // DEPENDENCY: Only runs when audioBuffer is ready
  
  // External Handlers needed for UI buttons (e.g., Play/Pause from parent)
  const handlePause = useCallback(() => {
    if (isActiveRef.current && !isPaused) {
        onPause?.();
    }
  }, [isPaused, onPause]);
  
  const handleResume = useCallback(() => {
    if (isActiveRef.current && isPaused) {
        onResume?.();
    }
  }, [isPaused, onResume]);


  return (
    <div ref={containerRef} className="canvas-container w-screen h-screen absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Visual Timer/Status */}
      <div className={`status-indicator ${crystallizingRef.current ? 'status-complete' : 'status-playing'}`}
           style={{ top: 'var(--space-md)', left: 'var(--space-md)' }}>
        {crystallizingRef.current ? 'CRYSTALLIZING...' : timeDisplay}
      </div>
      
      {/* Controls Overlay */}
      <div className="controls" style={{ bottom: 'var(--space-xl)' }}>
        <Button 
          variant={isPaused ? 'primary' : 'secondary'}
          onClick={isPaused ? handleResume : handlePause}
          disabled={crystallizingRef.current || !isActiveRef.current}
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => onEnd?.()}
          disabled={crystallizingRef.current || !isActiveRef.current}
        >
          End Ritual
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => {
              if (document.fullscreenElement) {
                  document.exitFullscreen();
              } else {
                  containerRef.current?.requestFullscreen();
              }
          }}
          className="fullscreen-btn"
        >
          ⛶
        </Button>
      </div>
    </div>
  );
}
