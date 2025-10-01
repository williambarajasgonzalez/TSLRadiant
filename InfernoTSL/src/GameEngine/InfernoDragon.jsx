import { useAnimations, useGLTF } from "@react-three/drei";
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

export default function InfernoDragon() {
  const { nodes, materials, animations } = useGLTF("/Models/InfernoDragon.glb");
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  const {f,e,t} = useControls('lava',{
    f:{
      value:0.7,step:0.1
    },
    e:{
      value:0.8,step:0.1
    },
    t:{
      value:0.5,step:0.1
    }
  })

  const { nodesGround } = useMemo(() => {
    const uVu = uv().mul(8);
    const noise = mx_noise_vec3(uVu);
    const finalColor = mix(color("#1c1b1b"), color("#33312f"), noise.x);
    return {
      nodesGround: {
        colorNode: finalColor,
      },
    };
  }, []);

  const { nodesLava,uniforms } = useMemo(() => {
    const uniforms = {
      f: uniform(f),
      e: uniform(e),
      t: uniform(t),
    }
    const uVu = uv().mul(20);

    const noise = mx_noise_vec3(vec3(
      uVu.x.mul(uniforms.f), 
      uVu.y.mul(uniforms.f).add(time.mul(uniforms.t)), 
      uVu.z.mul(uniforms.f)
    )).mul(uniforms.e)
    const handX = hash(vertexIndex).mul(uniforms.f)
    const randHeight = hash(vertexIndex).mul(sin(uniforms.e.mul(time.mul(uniforms.t))))
    const finalPosition = positionLocal.add(vec3(handX,randHeight,0))

    const finalColor = mix(color("#fcc73f").mul(1.1), color("#eb5e1c"), noise.x);
    return {
      uniforms,
      nodesLava: {
        colorNode: finalColor,
        emissiveNode: finalColor,
        metalnessNode: finalColor.x,
        
      },
    };
  }, []);

  useFrame(()=>{
    uniforms.f.value = f
    uniforms.e.value = e
    uniforms.t.value = t
  })

  const { nodesLavaBody } = useMemo(() => {
    const uVu = uv().mul(8);
    const noise = mx_noise_vec3(vec3(uVu.x, uVu.y.sub(time.mul(0.5)), uVu.z));
    const finalColor = mix(
      color("#fa380c").mul(3.3),
      color("#fc8b56"),
      noise.y
    );
    return {
      nodesLavaBody: {
        colorNode: finalColor,
        emissiveNode: finalColor,
        metalnessNode: finalColor.x,
      },
    };
  }, []);

  const { nodesWings } = useMemo(() => {
    const uVu = uv().mul(5);
    const noise = mx_noise_vec3(vec3(uVu.x, uVu.y.sub(time.mul(0.5)), uVu.z));
    const finalColor = mix(
      color("#fa380c").mul(3.3),
      color("#fc8b56"),
      noise.y
    );
    return {
      nodesWings: {
        colorNode: finalColor,
        emissiveNode: finalColor,
        metalnessNode: finalColor.x,
      },
    };
  }, []);

  return (
    <group ref={group} position={[0, 0, -5]} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.lava.geometry}
        material={nodes.lava.material}
      >
        <meshStandardNodeMaterial {...nodesLava} transparent />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.ground.geometry}
        material={nodes.ground.material}
      >
        <meshStandardNodeMaterial {...nodesGround} transparent />
      </mesh>
      <mesh
        name="eyes"
        castShadow
        receiveShadow
        geometry={nodes.eyes.geometry}
        morphTargetDictionary={nodes.eyes.morphTargetDictionary}
        morphTargetInfluences={nodes.eyes.morphTargetInfluences}
      >
        <meshStandardNodeMaterial {...nodesLavaBody} transparent />
      </mesh>
      <mesh
        name="body"
        castShadow
        receiveShadow
        geometry={nodes.body.geometry}
        morphTargetDictionary={nodes.body.morphTargetDictionary}
        morphTargetInfluences={nodes.body.morphTargetInfluences}
      >
        <meshStandardNodeMaterial {...nodesLava} transparent />
      </mesh>
      <mesh
        name="Mesh_0001"
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0001.geometry}
        material={materials["Material_0.001"]}
        morphTargetDictionary={nodes.Mesh_0001.morphTargetDictionary}
        morphTargetInfluences={nodes.Mesh_0001.morphTargetInfluences}
      />
      <mesh
        name="Mesh_0001_1"
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0001_1.geometry}
        material={materials["Material_1.001"]}
        morphTargetDictionary={nodes.Mesh_0001_1.morphTargetDictionary}
        morphTargetInfluences={nodes.Mesh_0001_1.morphTargetInfluences}
      />
      <mesh
        name="Mesh_0002"
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0002.geometry}
        material={materials["Material_0.001"]}
        morphTargetDictionary={nodes.Mesh_0002.morphTargetDictionary}
        morphTargetInfluences={nodes.Mesh_0002.morphTargetInfluences}
      />
      <mesh
        name="Mesh_0002_1"
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0002_1.geometry}
        material={materials["Material_1.001"]}
        morphTargetDictionary={nodes.Mesh_0002_1.morphTargetDictionary}
        morphTargetInfluences={nodes.Mesh_0002_1.morphTargetInfluences}
      >
        <meshStandardNodeMaterial {...nodesLava} transparent />
      </mesh>
    </group>
  );
}
useGLTF.preload("/Models/InfernoDragon.glb");
