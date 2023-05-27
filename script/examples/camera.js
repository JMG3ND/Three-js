import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 100
);

//Creación de un helper
const cameraHelper = new THREE.PerspectiveCamera(
    50, window.innerWidth / window.innerHeight, 2, 20
)

const helper = new THREE.CameraHelper(cameraHelper)
scene.add(helper);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(geometry, material);
cube.position.z = -5;
scene.add(cube);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let teta = 0;
const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    camera.lookAt(cube.position);
    camera.position.x = Math.cos(teta) * 30;
    camera.position.z = Math.sin(teta) * 30;
    teta += 0.01;
    renderer.render(scene, camera);
}
animate();