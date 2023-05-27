import { Ambient } from './Ambient';
import { RubiksCube } from './RubiksCube';
import * as THREE from 'three';

const ambient = new Ambient();
const cube = new RubiksCube();

ambient.scene.add(cube.rubiksCubeGroup);

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function onMouseDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, ambient.camera);
    const objects = raycaster.intersectObjects(cube.rubiksCubeGroup.children);
    const cubeObjects = objects.filter((c) => {
        return c.object.type === 'Mesh';
    });
    if (cubeObjects.length > 0) {
        cube.highlightCubes(cubeObjects[0].object);
    }
}

const onKeyDown = (event) => {
    if (event.repeat) {
        return;
    }
    cube.onKeyDown(event);
};

window.addEventListener('keydown', onKeyDown);
window.addEventListener('mousedown', onMouseDown);

function animate() {
    requestAnimationFrame(animate);
    ambient.renderer();
}
animate();