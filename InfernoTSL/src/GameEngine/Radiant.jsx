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
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";

export default function Radiant() {
  const { nodes, materials } = useGLTF("/Models/radiantOath.glb");

  const {colorA,colorB}= useControls("Color",{
    colorA: {
      value:"#acacad"
    },
    colorB: {
      value:"#ffffff"
    }
  })

  const { logoNode } = useMemo(() => {
    return {
      logoNode: {
        colorNode: color("#ffffff"),
        emissiveNode: color("#ffffff").mul(2.0),
      },
    };
  }, []);

  const { emisNode,uniforms } = useMemo(() => {
    const uniforms = {
      colorA: uniform(color(colorA)),
      colorB: uniform(color(colorB))
    }
    const uvCord = uv().mul(15.0)
    const timeuV = vec3(uvCord.x.add(cos(time)),uvCord.y.add(sin(time)),uvCord.z)
    const noise = mx_noise_vec3(timeuV)
    const finalColor = mix(color(uniforms.colorA),color(uniforms.colorB),noise.y)
    return {
      uniforms,
      emisNode: {
        colorNode: finalColor,
        emissiveNode: finalColor.mul(2.0)
      },
    };
  }, []);

  const { gemNode } = useMemo(() => {
    
    return {
      gemNode: {
        colorNode: color("#f57c2c"),
        emissiveNode: color("#f57c2c").mul(2.0)
      },
    };
  }, []);

  useFrame(()=>{
    uniforms.colorA.value.set(colorA)
    uniforms.colorB.value.set(colorB)
  })

  return (
    <group position={[0, -5, -5]} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.body.geometry}
        material={materials.Material_0}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.legs.geometry}
        material={materials['Material_0.001']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.helm.geometry}
        material={materials['Material_0.002']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.logo.geometry}
      >
        <meshStandardNodeMaterial {...logoNode}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.jem.geometry}
        >   
        <meshStandardNodeMaterial {...gemNode}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0007.geometry}
        >   
        <meshStandardNodeMaterial {...emisNode}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0007_1.geometry}
      >   
        <meshStandardNodeMaterial {...emisNode}/>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_0007_2.geometry}
        >   
        <meshStandardNodeMaterial {...emisNode}/>
      </mesh>
    </group>
  );
}
useGLTF.preload("/Models/radiantOath.glb");
