import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { pass, mrt, emissive, output } from "three/tsl";
import * as THREE from "three/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";

export const PostProcessing = () => {
  const { gl: renderer, scene, camera } = useThree();
  const postProcessingRef = useRef(null);
  const bloomPassRef = useRef(null);
  useEffect(() => {
    if (!renderer || !scene || !camera) {
      return;
    }

    const scenePass = pass(scene, camera);
    scenePass.setMRT(
      mrt({
        output,
        emissive,
      })
    );
    // Get texture nodes
    const outputPass = scenePass.getTextureNode("output");
    const emissivePass = scenePass.getTextureNode("emissive");

    const bloomPass = bloom(emissivePass, 0.5, 0.1, 0.5);
    bloomPassRef.current = bloomPass;
    // Setup post-processing
    const postProcessing = new THREE.PostProcessing(renderer);

    const outputNode = outputPass.add(bloomPass);
    postProcessing.outputNode = outputNode;
    postProcessingRef.current = postProcessing;

    return () => {
      postProcessingRef.current = null;
    };
  }, [renderer, scene, camera]);

  useFrame(() => {
    
    if(postProcessingRef.current){
      postProcessingRef.current.render()
    }
  },1);

  return null;
};
