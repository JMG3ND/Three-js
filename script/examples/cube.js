import * as THREE from 'three';

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

//Creamos la animación
const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    //Agregamos la escena y la cámara al renderer
    renderer.render(scene, camera);
}

animate();