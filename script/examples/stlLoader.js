import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x3a4b5c);
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);

const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

let object;
const loader = new STLLoader();
loader.load('/assets/DeathBottle_-Bottle.stl', (model) => {
    object = new THREE.Mesh(model, material);
    object.scale.set(0.1, 0.1, 0.1);
    object.rotation.x = -Math.PI / 2;
    object.position.set(0, 0, 0);
    scene.add(object);
});

//Luces
const luces = new THREE.DirectionalLight(0xffffff);
luces.position.z = 20;
scene.add(luces);

const luces2 = new THREE.DirectionalLight(0xffffff);
luces2.position.z = -20;
scene.add(luces2);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

camera.position.z = 20;
controls.update();

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();