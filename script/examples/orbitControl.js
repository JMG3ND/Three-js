import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 100
);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Creación del Orbit Controls
//recibe 2 parámetros
//camera es la cámara que vamos a controlar
//renderer.domElement es para que pueda escuchar los eventos que iremos generando con el mause
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
console.log(controls);

camera.position.z = 3;
controls.update();

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();