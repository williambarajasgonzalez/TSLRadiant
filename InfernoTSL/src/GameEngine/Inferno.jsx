import { useGLTF } from "@react-three/drei";
import React, { useMemo } from "react";
import {
  color,
  mix,
  uv,
  time,
  mul,
  mx_fractal_noise_vec3,
  mx_noise_vec3,
  mx_worley_noise_vec3,
  step,
  sin,
  cos,
  modelViewPosition,
  cameraPosition,
  dot,
  saturate,
  normalView,
  positionView,
  positionLocal,
  add,
  sub,
  vertexIndex,
  smoothstep,
  hash,
  vec3,
  uniform,
  negate,
  normalize,
  pow,
} from "three/tsl";
import * as THREE2 from "three";

export default function Inferno() {
  const { nodes, materials } = useGLTF("/Models/InfernoCape.glb");

  const { infernoNodes } = useMemo(() => {
    const uvCord = uv().mul(10.0);
    const animatedY = uvCord.y.mul(8).sub(time.mul(0.5));
    const noise = mx_noise_vec3(vec3(uvCord.x.mul(9), animatedY, 0.0));
    const edgeNoise = mx_noise_vec3(
      vec3(uvCord.x.mul(2.0).add(sin(time.mul(0.5))), animatedY.mul(1.4), 0.0)
    )
    const edgeOffset = edgeNoise.x.mul(negate(sin(time.mul(0.5))));

    const viewDirection = normalize(negate(positionView));
    const fresnel = sub(1.0, dot(normalView, viewDirection));

    const strength = pow(noise.y, 0.2);

    const dark = color("#cf0000")
    const orange = color("#e06302").mul(2.2);
    const yellow = color("#f5b031").mul(1.385);

    const blackMask = smoothstep(
      add(0.5, edgeOffset),
      add(0.9, edgeOffset),
      strength
    );
    const orangeMask = smoothstep(
      add(0.4, edgeOffset),
      add(0.5, edgeOffset),
      strength
    );

    const metalness = mix(0.0, 1.0, orangeMask);

    const colorWithOrange = mix(yellow, orange, orangeMask);
    const finalColor = mix(colorWithOrange, dark, blackMask).add(
      fresnel.mul(color("#70420a")).mul(1.2)
    );

    return {
      infernoNodes: {
        colorNode: finalColor,
        emissiveNode: finalColor,
        metalnessNode: metalness
      },
    };
  }, []);
  return (
    <group position={[0, -5, -5]} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cape.geometry}
        material={materials.Material_0}
      />

      <mesh castShadow receiveShadow geometry={nodes.lava.geometry}>
        <meshStandardNodeMaterial
          {...infernoNodes}
          side={THREE2.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  );
}
useGLTF.preload("/Models/InfernoCape.glb");
