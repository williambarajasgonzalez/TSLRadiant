import { useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
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
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";

export default function ZukHelm() {
  const { nodes, materials } = useGLTF("/Models/Zuk Helm.glb");
  const group = useRef();

  const {f,e,t} = useControls('lava',{
    f:{
      value:0.6,step:0.1
    },
    e:{
      value:0.7,step:0.1
    },
    t:{
      value:0.2,step:0.1
    }
  })

  const { nodesLava,uniforms } = useMemo(() => {
    const uniforms = {
      f: uniform(f),
      e: uniform(e),
      t: uniform(t),
    }
    const uVu = uv().mul(5);

    const noise = mx_noise_vec3(vec3(
      uVu.x.mul(uniforms.f), 
      uVu.y.mul(uniforms.f).add(time.mul(uniforms.t)), 
      uVu.z.mul(uniforms.f)
    )).mul(uniforms.e)

    const handX = hash(vertexIndex).mul(uniforms.f)
    const randHeight = hash(vertexIndex).mul(sin(uniforms.e.mul(time.mul(uniforms.t))))
    const finalPosition = positionLocal.add(vec3(handX,randHeight,0))

    const finalColor = mix(color("#f74040"), color("#f5db69"), noise.y);
    return {
      uniforms,
      nodesLava: {
        colorNode: finalColor,
        emissiveNode: finalColor.mul(2.0),
        metalnessNode: finalColor.x,
        
      },
    };
  }, []);

  useFrame(()=>{
    uniforms.f.value = f
    uniforms.e.value = e
    uniforms.t.value = t
  })

  return (
    <group ref={group} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0.geometry}
        material={materials.Material_0}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.lava.geometry}
        >
        <meshStandardNodeMaterial {...nodesLava} transparent />
      </mesh>
    </group>
  );
}
useGLTF.preload("/Models/Zuk Helm.glb");
