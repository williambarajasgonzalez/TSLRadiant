import React, { Suspense, useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import {
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
  Progress,
  Stats,
} from "@react-three/drei";
import { PostProcessing } from "./GameEngine/PostProcessing";
import Experience from "./GameEngine/Experience";
import { useControls } from "leva";
import * as THREE from "three/webgpu";
extend({
  MeshBasicNodeMaterial: THREE.MeshBasicNodeMaterial,
  MeshStandardNodeMaterial: THREE.MeshStandardNodeMaterial,
});

export default function App() {
  return (
    <div className="w-full h-screen">
      <Canvas
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props);
          await renderer.init();
          return renderer;
        }}
        style={{ background: "#FFFFFF" }}
      >
        <Environment preset="city" />
        <Stats />
        <PerspectiveCamera />
        <OrbitControls />
    
        <Suspense
          fallback={
            <Html>
              <h1>loading...</h1>
            </Html>
          }
        >
          <Experience />
        </Suspense>
        <PostProcessing />
      </Canvas>
      <Progress />
    </div>
  );
}
