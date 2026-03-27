"use client";

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Model({ group }: { group: React.RefObject<THREE.Group> }) {
  const { scene, animations } = useGLTF('/models/robot.glb');
  const { actions } = useAnimations(animations, group);
  const currentAction = useRef<string | null>(null);

  useFrame((state) => {
    // This will be handled by the PlayerController to set the right animation
  });

  // Expose actions to the parent or handle via a shared state/ref
  useEffect(() => {
    // Initial animation
    if (actions['Idle']) {
        actions['Idle'].play();
        currentAction.current = 'Idle';
    }
  }, [actions]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#f0f0f0" />
      <gridHelper args={[100, 50, 0x000000, 0xcccccc]} rotation={[Math.PI / 2, 0, 0]} />
    </mesh>
  );
}

function PlayerController() {
  const group = useRef<THREE.Group>(null);
  const { animations } = useGLTF('/models/robot.glb');
  const { actions } = useAnimations(animations, group);

  const keys = useRef<{ [key: string]: boolean }>({});
  const currentAnimation = useRef<string>('Idle');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    let moving = false;
    let running = keys.current['shift'];
    const speed = running ? 10 * delta : 4 * delta;
    const rotSpeed = 3 * delta;

    if (keys.current['w']) {
      group.current.translateZ(speed);
      moving = true;
    }
    if (keys.current['s']) {
      group.current.translateZ(-speed);
      moving = true;
    }
    if (keys.current['a']) {
      group.current.rotation.y += rotSpeed;
      moving = true;
    }
    if (keys.current['d']) {
      group.current.rotation.y -= rotSpeed;
      moving = true;
    }

    const nextAnimation = moving ? (running ? 'Running' : 'Walking') : 'Idle';

    if (currentAnimation.current !== nextAnimation) {
      const prevAction = actions[currentAnimation.current];
      const nextAction = actions[nextAnimation];

      if (nextAction) {
        if (prevAction) prevAction.fadeOut(0.2);
        nextAction.reset().fadeIn(0.2).play();
        currentAnimation.current = nextAnimation;
      }
    }

    // Camera follow (Third Person)
    const relativeCameraOffset = new THREE.Vector3(0, 3, -5);
    const cameraOffset = relativeCameraOffset.applyMatrix4(group.current.matrixWorld);

    state.camera.position.lerp(cameraOffset, 0.1);
    state.camera.lookAt(group.current.position.x, group.current.position.y + 1, group.current.position.z);
  });

  return <Model group={group} />;
}

export default function Game() {
  return (
    <div className="w-full h-full min-h-[400px] bg-sky-100 rounded-xl overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10 bg-black/60 text-white px-4 py-2 rounded-full font-black text-sm uppercase tracking-widest backdrop-blur-sm pointer-events-none">
        GRA: Sterowanie W,A,S,D + SHIFT (Bieg)
      </div>

      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, -10]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} castShadow intensity={1} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

          <PlayerController />
          <Ground />

          <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-black/10 text-[10px] font-bold uppercase tracking-wider text-black">
          Perspektywa 3D - Eksploracja Polutek.pl
        </div>
      </div>
    </div>
  );
}

useGLTF.preload('/models/robot.glb');
