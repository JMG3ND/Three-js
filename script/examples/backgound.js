import * as THREE from 'three';

//Creamos uan escena
const scene = new THREE.Scene();
/*Cambiamos el background de la escena
Puede recibir valores hexadecimales, rgb, decimales(1, 0.5, 0.1), por nombre
*/
scene.background = new THREE.Color(0x2a3b4c);

//Efecto de neblina con Fog
//scene.fog = new THREE.Fog(0x76456c, 0.1, 80);

//Creamos una textura
const loader = new THREE.TextureLoader();
loader.load('../assets/17010.jpg', (texture) => {
    scene.background = texture;
});

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

const animate = () => {
    requestAnimationFrame(animate);
    //Agregamos la escena y la cámara al renderer
    renderer.render(scene, camera);
}
animate();