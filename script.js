import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";
import { OrbitControls } from "OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(400, 900 / 4);
renderer.setClearColor(0x000000, 0);

document.getElementById("3d_element").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = false;

camera.position.set(0, 1, 3);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 25).normalize();
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();
const baseColorMap = textureLoader.load(
  "model/textures/texture_pbr_v128_1.png"
  //   "model/textures/c-texture_pbr_v128_1.png"
);
const metalRoughMap = textureLoader.load(
  "model/textures/texture_pbr_v128_metallic-texture_pbr_v128_roughness_2@chann.png"
  //   "model/textures/c-texture_pbr_v128_metallic-texture_pbr_v128_roughness_2@chann.png"
);
const normalMap = textureLoader.load(
  "model/textures/texture_pbr_v128_normal_0.png"
  //   "model/textures/c-texture_pbr_v128_normal_0.png"
);

let model;
const loader = new GLTFLoader();
// loader.load("model/Combi.glb", (gltf) => {
loader.load("model/myModel.glb", (gltf) => {
  model = gltf.scene;

  model.traverse((child) => {
    if (child.isMesh) {
      child.material.map = baseColorMap;
      child.material.metalnessMap = metalRoughMap;
      child.material.roughnessMap = metalRoughMap;
      child.material.normalMap = normalMap;
      child.material.metalness = 1.0;
      child.material.roughness = 1.0;
      child.material.needsUpdate = true;
    }
  });
  model.scale.set(3.5, 3.5, 3.5);
  model.position.set(0, 1, 0);

  scene.add(model);
});

let targetRotationX = 0;
let targetRotationY = 0;

document
  .getElementsByTagName("main")[0]
  .addEventListener("mousemove", (event) => {
    if (!model) return;

    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    const maxRotation = Math.PI / 12;

    targetRotationY = x * maxRotation;
    targetRotationX = y * maxRotation;
  });

document.getElementsByTagName("main")[0].addEventListener("mouseleave", () => {
  targetRotationX = 0;
  targetRotationY = 0;
});

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.x += (targetRotationX - model.rotation.x) * 0.1;
    // for Combi
    // model.rotation.y += (targetRotationY - model.rotation.y) * 0.1 - 0.1;
    //
    // for bike
    model.rotation.y += (targetRotationY - model.rotation.y) * 0.1 - 0.05;
  }

  renderer.render(scene, camera);
}

animate(); // ✅ start animation loop
