import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Stars, Sparkles, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Stage } from '../App';
import gsap from 'gsap';

// --- Procedural Cake Component ---

interface CandleProps {
  position: [number, number, number];
  isLit: boolean;
  onLight: () => void;
}

const Candle: React.FC<CandleProps> = ({ 
  position, 
  isLit, 
  onLight 
}) => {
  const flameRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (flameRef.current && isLit) {
      const t = state.clock.elapsedTime;
      // Enhanced flame animation (flicker and shape shift)
      flameRef.current.scale.y = 1 + Math.sin(t * 10) * 0.2 + Math.cos(t * 5) * 0.1;
      flameRef.current.scale.x = 1 + Math.sin(t * 15) * 0.1;
      flameRef.current.scale.z = 1 + Math.cos(t * 15) * 0.1;
      flameRef.current.rotation.z = Math.sin(t * 2) * 0.1; // Slight sway
    }
  });

  return (
    <group position={position}>
      {/* Candle Body */}
      <mesh onClick={(e) => { e.stopPropagation(); onLight(); }} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
        <meshStandardMaterial color={isLit ? "#ffcccc" : "#ffffff"} roughness={0.3} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Flame */}
      {isLit && (
        <group position={[0, 0.9, 0]}>
            <pointLight distance={3} intensity={1.5} color="#ffaa00" decay={2} />
            
            {/* Flame Core (Hot) */}
            <mesh position={[0, -0.1, 0]}>
               <sphereGeometry args={[0.08, 16, 16]} />
               <meshBasicMaterial color="#ffffcc" />
            </mesh>

            {/* Main Flame Shape */}
            <mesh ref={flameRef} position={[0, 0, 0]}>
                <coneGeometry args={[0.12, 0.4, 16]} />
                <meshStandardMaterial 
                    emissive="#ff5500" 
                    emissiveIntensity={3} 
                    color="#ff8800" 
                    transparent 
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Fire Particles/Sparks */}
            <Sparkles count={6} scale={0.5} size={3} speed={2} opacity={0.8} color="#ffff00" position={[0, 0.2, 0]} />
        </group>
      )}
    </group>
  );
};

const Cake = ({ 
  stage, 
  setLitCount 
}: { 
  stage: Stage, 
  setLitCount: React.Dispatch<React.SetStateAction<number>> 
}) => {
  // 5 Candles positions around the center
  const candlePositions = [
    [0, 0.6, 0],
    [0.4, 0.6, 0.4],
    [-0.4, 0.6, 0.4],
    [0.4, 0.6, -0.4],
    [-0.4, 0.6, -0.4]
  ];
  
  const [candlesLit, setCandlesLit] = useState<boolean[]>([false, false, false, false, false]);

  const handleLight = (index: number) => {
    // Allow lighting in CAKE stage
    if (stage === 'CAKE' && !candlesLit[index]) {
      const newLit = [...candlesLit];
      newLit[index] = true;
      setCandlesLit(newLit);
      setLitCount(prev => prev + 1);
    }
  };

  // Determine if candles should be visually lit
  // They stay lit during CAKE and WISH. They extinguish in MESSAGES/FINALE.
  const areCandlesActive = stage === 'CAKE' || stage === 'WISH';

  return (
    <group position={[0, -1, 0]}>
      {/* Base Cake Layer */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 1, 64]} />
        <meshStandardMaterial color="#fff0f5" roughness={0.3} />
      </mesh>
      
      {/* Top Icing / Second Layer */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1.4, 1.5, 0.2, 64]} />
        <meshStandardMaterial color="#ffb7b2" roughness={0.5} />
      </mesh>

      {/* Decorative Spheres at base */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.45, -0.4, Math.sin(angle) * 1.45]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#ff99c8" roughness={0.2} metalness={0.1} />
          </mesh>
        )
      })}

      {/* Candles */}
      {candlePositions.map((pos, i) => (
        <Candle 
          key={i} 
          position={pos as [number, number, number]} 
          isLit={areCandlesActive && candlesLit[i]} 
          onLight={() => handleLight(i)}
        />
      ))}
    </group>
  );
};

// --- Scene Setup ---

const CinematicCamera = ({ stage }: { stage: Stage }) => {
  const { camera } = useThree();
  
  useFrame((state) => {
    // Camera Animation State Machine
    const targetPos = new THREE.Vector3();
    const lookAtPos = new THREE.Vector3(0, 0, 0);

    if (stage === 'INTRO') {
       // Far away, slight drift
       targetPos.set(0, 1, 8 + Math.sin(state.clock.elapsedTime * 0.2) * 1);
    } else if (stage === 'CAKE') {
       // Zoom in to cake, slight angle
       targetPos.set(3, 2, 4);
    } else if (stage === 'WISH') {
       // Close up center
       targetPos.set(0, 1.5, 3.5);
    } else if (stage === 'MESSAGES') {
       // Pan sideways for text space
       targetPos.set(-2, 0, 6);
       lookAtPos.set(2, 0, 0);
    } else if (stage === 'FINALE') {
       // Pull back up
       targetPos.set(0, 4, 9);
    }

    camera.position.lerp(targetPos, 0.02);
    
    // Smooth LookAt
    const currentLook = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position);
    currentLook.lerp(lookAtPos, 0.02);
    camera.lookAt(currentLook);
  });

  return null;
}

const FloatingMessages = ({ stage }: { stage: Stage }) => {
    if (stage !== 'MESSAGES') return null;

    return (
        <group position={[2, 0, 0]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh position={[1, 1, -2]}>
                     <sphereGeometry args={[0.5, 32, 32]} />
                     <MeshDistortMaterial color="#ff0080" speed={2} distort={0.4} transparent opacity={0.3} />
                </mesh>
            </Float>
        </group>
    )
}

export const Experience: React.FC<{ stage: Stage }> = ({ stage }) => {
  const [litCount, setLitCount] = useState(0);

  return (
    <>
      <CinematicCamera stage={stage} />
      
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 5]} angle={0.5} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, 5, -10]} color="#a020f0" intensity={0.5} />
      
      {/* Mood Lighting varies by stage */}
      <group>
        {stage === 'INTRO' && <Sparkles count={100} scale={10} size={4} speed={0.4} opacity={0.5} color="#fff" />}
        {stage === 'WISH' && <Sparkles count={200} scale={8} size={6} speed={2} opacity={1} color="#ffd700" />}
        {(stage === 'MESSAGES' || stage === 'FINALE') && <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      </group>

      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
         <Cake stage={stage} setLitCount={setLitCount} />
      </Float>

      <FloatingMessages stage={stage} />

      {/* Shadow */}
      <ContactShadows 
        position={[0, -1, 0]} 
        opacity={0.5} 
        scale={10} 
        blur={2.5} 
        far={4} 
        color="#2d1b4e"
      />

      {/* Background Ambience */}
      <mesh position={[0, 0, -15]}>
         <planeGeometry args={[50, 30]} />
         <meshBasicMaterial color="#0f0518" transparent opacity={0.9} />
      </mesh>
    </>
  );
};