import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 100
);

const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

const cube = new THREE.Mesh(new THREE.BoxGeometry(), material);
const circle = new THREE.Mesh(new THREE.CircleGeometry(0.5, 20, 0, Math.PI), material);
circle.position.x = 2;
const cone = new THREE.Mesh(new THREE.ConeGeometry(0.5), material);
cone.position.x = -2;
const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5), material);
cylinder.position.y = -2;
const plane = new THREE.Mesh(new THREE.PlaneGeometry(), material);
plane.position.y = 2;
const tetrahedro = new THREE.Mesh(new THREE.TetrahedronGeometry(0.5), material);
tetrahedro.position.y = 2;
tetrahedro.position.x = 2;
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), material);
sphere.position.y = 2;
sphere.position.x = -2;
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.25), material);
torus.position.y = -2;
torus.position.x = -2;
const ring = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.5), material);
ring.position.y = -2;
ring.position.x = 2;

scene.add(cube);
scene.add(circle);
scene.add(cone);
scene.add(cylinder);
scene.add(plane);
scene.add(tetrahedro);
scene.add(sphere);
scene.add(torus);
scene.add(ring);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

const animate = () => {
    requestAnimationFrame(animate);

    scene.traverse(function (object) {
        if (object.isMesh) {
            object.rotation.x += 0.01;
            object.rotation.z += 0.01;
        }
    })

    renderer.render(scene, camera);
}
animate();