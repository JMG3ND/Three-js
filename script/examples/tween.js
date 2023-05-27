import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

//Creamos uan escena
const scene = new THREE.Scene();

//Creamos una cámara
const camera = new THREE.PerspectiveCamera(
    75,                                     //Perspectiva
    window.innerWidth / window.innerHeight  //Tamaño
);

//Creamos el renderer
const renderer = new THREE.WebGLRenderer();

//Le damos un tamaño al renderer
renderer.setSize(window.innerWidth, window.innerHeight);

//Agregamos el renderer al documento html
document.body.appendChild(renderer.domElement);

//Creamos un cubo
let geometry = new THREE.BoxGeometry();                             //Creamos una geometría
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });    //Creamos un material
let cube = new THREE.Mesh(geometry, material);                      //Creamos un cubo a partir de la geometría y el material

//Agregamos el cubo a la escena
scene.add(cube);
camera.position.z = 5;

//Creación de animación TWEEN
var group = new TWEEN.Group();
const initialRotation = new THREE.Euler(0, 0, 0, 'XYZ');
const targetRotation = new THREE.Euler(Math.PI / 2, 0, 0, 'XYZ');
let variable = 0
var tween = new TWEEN.Tween(initialRotation, group)
    .to(targetRotation, 1000) // Duración de 1000 ms (1 segundo)
    .easing(TWEEN.Easing.Quadratic.InOut) // Efecto de aceleración/desaceleración
    .onUpdate(function () {
        // Callback llamado en cada actualización de la animación
        // Actualiza la rotación del objeto en base al estado actual del Tween
        cube.rotation.x = initialRotation.x;
    })

//Comportamiento al presionar los controles
function onKeyDown(event) {
    if (event.code === 'KeyS') {
        tween.start();
    }
    if (event.code === 'KeyW') {
        cube.rotation.x += Math.PI / 2;
    }
    if (event.code === 'KeyA') {
        cube.rotation.y -= Math.PI / 2;
    }
    if (event.code === 'KeyD') {
        cube.rotation.y += Math.PI / 2;
    }
    if (event.code == 'KeyO') { //Función que agrupa la cara azul

    }
    if (event.code === 'KeyP') { //Función que devuelve los objetos al cubo

    }
    if (event.code === 'KeyR') {

    }
}
document.addEventListener('keydown', onKeyDown, false);

//Creamos la animación
const animate = () => {
    requestAnimationFrame(animate);

    group.update();
    TWEEN.update();
    //Agregamos la escena y la cámara al renderer
    renderer.render(scene, camera);
}

animate();