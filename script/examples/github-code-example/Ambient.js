import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class Ambient {
    constructor() {
        this._scene;
        this._camera;
        this._renderer;
        this._controls;

        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createControls();
    }

    createScene() {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color('#444654');
    }
    createCamera() {
        this._camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            5,
            10000
        );
        this._camera.position.z = 178;
        const resizeCamera = () => {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', resizeCamera);
    }
    createRenderer() {
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);
        const resizeRenderer = () => {
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', resizeRenderer);
    }
    createControls() {
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.enableZoom = false;
        this._controls.enablePan = false;
        this._controls.update();
    }
    renderer() {
        this._renderer.render(this._scene, this._camera);
    }

    get scene() {
        return this._scene;
    }

    get camera() {
        return this._camera;
    }
}