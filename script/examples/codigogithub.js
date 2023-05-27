import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var id = "rubik";
var escena;
var camara;
var renderer;
var controls;
var webGLDisponible;
var luzDireccional;
var cubo;
var centroCubo;
var piezas;
var n = new THREE.Color(0x000000);
var blanco = new THREE.Color(0xFFFFFF);
var amarillo = new THREE.Color(0xFFFF00);
var rojo = new THREE.Color(0xFF0000);
var naranja = new THREE.Color(0xFF8800);
var azul = new THREE.Color(0x0044FF);
var verde = new THREE.Color(0x00FF00);
var autoRotandoCara = false;
var desordenando = false;
var indiceDesorden = 0;
var bloqueo = true;
var rotandoCara = false;
var rotandoEscena = false;
var direccionSeleccionada = false;
var direccion = "";
var caraSeleccionada = false;
var cara = new THREE.Object3D();
var lado;
var eje;
var giroAplicado;
var giroRestante;
var giroObjetivo;
var caras = [false, false, false, false, false, false];
var getObjeto;
var getNormal;
var invertirGiro = [1, 1, 1, 1, 1, 1];
var loader = 0;
var mouse = new THREE.Vector2();
var clickInicial = new THREE.Vector2();
var clickInicialGuardado;
var raycaster;
var winResize;

iniciarEscena();
iniciarCubo();
animarEscena();

function iniciarEscena() {
    renderer = true ? new THREE.WebGLRenderer({ antialias: true, alpha: true }) : new THREE.CanvasRenderer();
    webGLDisponible = true ? true : false;
    //document.getElementById("WebGLinfo").innerHTML += true ? "activado" : "desactivado";
    //var canvasWidth = window.innerWidth; var canvasHeight = window.innerHeight;
    //var canvasWidth = document.getElementById(id).offsetWidth; var canvasHeight = document.getElementById(id).offsetHeight;
    //renderer.setSize(canvasWidth, canvasHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //document.getElementById(id).appendChild(renderer.domElement);
    document.body.appendChild(renderer.domElement);
    escena = new THREE.Scene();
    //camara = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 100);
    camara = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camara.position.set(-3, 3, 6);
    camara.lookAt(escena.position);
    var luzAmbiente = new THREE.AmbientLight(0x666666, 1.0);
    escena.add(luzAmbiente);
    var luzDireccional1 = new THREE.DirectionalLight(0xFFFFFF, 1);
    luzDireccional1.position.set(0, 5, 2);
    var luzDireccional2 = new THREE.DirectionalLight(0xFFFFFF, 2);
    luzDireccional2.position.set(10, 3, 2);
    var luzDireccional3 = new THREE.DirectionalLight(0xFFFFFF, 2);
    luzDireccional3.position.set(-10, 3, 2);
    camara.add(luzDireccional1);
    camara.add(luzDireccional2);
    camara.add(luzDireccional3);
    escena.add(camara);

    raycaster = new THREE.Raycaster();

    document.addEventListener("keydown", onDocumentKeyDown, false);
    window.addEventListener("mousedown", onDocumentMouseDown, false);
    window.addEventListener("mouseup", onDocumentMouseUp, false);
    controls = new OrbitControls(camara, renderer.domElement);
    controls.enablePan = false;
    controls.enableKeys = false;
    //controls.enableZoom = false;

    //winResiza = new THREEx.WindowResize(renderer, camara);
    //winResiza.putiputi(id);
    //winResize.update();
}


function crearPieza(texturaColor, texturaBump, color1, color2, color3, color4, color5, color6, posicion, nombre) {
    var geometria = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
    var material = new THREE.MeshPhongMaterial({
        vertexColors: THREE.VertexColors,
        color: 0x353535,
        map: texturaColor,
        bumpMap: texturaBump,
        bumpScale: 0.02,
        shininess: 30
    });
    var modifier = new THREE.SubdivisionModifier(1);
    modifier.modify(geometria);
    var pieza = new THREE.Mesh(geometria, material);
    corregirUVs(geometria, color1, color2, color3, color4, color5, color6);
    pieza.position.set(posicion.x, posicion.y, posicion.z);
    pieza.name = nombre;
    return pieza;
}

function corregirUVs(geometry, color1, color2, color3, color4, color5, color6) {
    geometry.computeBoundingBox();
    var max = geometry.boundingBox.max;
    var min = geometry.boundingBox.min;
    var offset = new THREE.Vector3(0 - min.x, 0 - min.y, 0 - min.z);
    var range = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;
    loader += 1;
    var cargado = Math.round(loader / 26.0 * 100);
    console.log("loading: " + cargado + "%");
    for (var i = 0; i < geometry.faces.length; i++) {
        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];
        if (faces[i].normal.z <= -0.5) {
            faces[i].vertexColors[0] = new THREE.Color(color1);
            faces[i].vertexColors[1] = new THREE.Color(color1);
            faces[i].vertexColors[2] = new THREE.Color(color1);
            geometry.faceVertexUvs[0].push([

                new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
                new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
                new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
            ]);
        }
        if (faces[i].normal.z >= 0.5) {
            faces[i].vertexColors[0] = new THREE.Color(color2);
            faces[i].vertexColors[1] = new THREE.Color(color2);
            faces[i].vertexColors[2] = new THREE.Color(color2);
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
                new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
                new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y)
            ]);
        }
        if (faces[i].normal.x <= -0.5) {
            faces[i].vertexColors[0] = new THREE.Color(color3);
            faces[i].vertexColors[1] = new THREE.Color(color3);
            faces[i].vertexColors[2] = new THREE.Color(color3);
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2((v1.y + offset.y) / range.y, (v1.z + offset.z) / range.z),
                new THREE.Vector2((v2.y + offset.y) / range.y, (v2.z + offset.z) / range.z),
                new THREE.Vector2((v3.y + offset.y) / range.y, (v3.z + offset.z) / range.z)
            ]);
        }
        if (faces[i].normal.x >= 0.5) {
            faces[i].vertexColors[0] = new THREE.Color(color4);
            faces[i].vertexColors[1] = new THREE.Color(color4);
            faces[i].vertexColors[2] = new THREE.Color(color4);
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2((v1.y + offset.y) / range.y, (v1.z + offset.z) / range.z),
                new THREE.Vector2((v2.y + offset.y) / range.y, (v2.z + offset.z) / range.z),
                new THREE.Vector2((v3.y + offset.y) / range.y, (v3.z + offset.z) / range.z)
            ]);
        }
        if (faces[i].normal.y <= -0.5) {
            faces[i].vertexColors[0] = new THREE.Color(color5);
            faces[i].vertexColors[1] = new THREE.Color(color5);
            faces[i].vertexColors[2] = new THREE.Color(color5);
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2((v1.x + offset.x) / range.x, (v1.z + offset.z) / range.z),
                new THREE.Vector2((v2.x + offset.x) / range.x, (v2.z + offset.z) / range.z),
                new THREE.Vector2((v3.x + offset.x) / range.x, (v3.z + offset.z) / range.z)
            ]);
        }
        if (faces[i].normal.y >= 0.5) {
            faces[i].vertexColors[0] = new THREE.Color(color6);
            faces[i].vertexColors[1] = new THREE.Color(color6);
            faces[i].vertexColors[2] = new THREE.Color(color6);
            geometry.faceVertexUvs[0].push([
                new THREE.Vector2((v1.x + offset.x) / range.x, (v1.z + offset.z) / range.z),
                new THREE.Vector2((v2.x + offset.x) / range.x, (v2.z + offset.z) / range.z),
                new THREE.Vector2((v3.x + offset.x) / range.x, (v3.z + offset.z) / range.z)
            ]);
        }
    }
    geometry.uvsNeedUpdate = true;
}

function iniciarCubo() {
    var texturaColor = new THREE.ImageUtils.loadTexture("../assets/17010.jpg");
    var texturaBump = new THREE.ImageUtils.loadTexture("../assets/17010.jpg");
    texturaColor.minFilter = THREE.LinearMipMapNearestFilter;
    texturaColor.magFilter = THREE.LinearMipMapNearestFilter;
    texturaBump.minFilter = THREE.LinearMipMapNearestFilter;
    texturaBump.magFilter = THREE.LinearMipMapNearestFilter;
    piezas =
        [
            crearPieza(texturaColor, texturaBump, n, n, n, n, n, blanco, new THREE.Vector3(0, 1, 0), "centro W"),
            crearPieza(texturaColor, texturaBump, n, n, n, n, amarillo, n, new THREE.Vector3(0, -1, 0), "centro Y"),
            crearPieza(texturaColor, texturaBump, n, rojo, n, n, n, n, new THREE.Vector3(0, 0, 1), "centro R"),
            crearPieza(texturaColor, texturaBump, naranja, n, n, n, n, n, new THREE.Vector3(0, 0, -1), "centro O"),
            crearPieza(texturaColor, texturaBump, n, n, azul, n, n, n, new THREE.Vector3(-1, 0, 0), "centro B"),
            crearPieza(texturaColor, texturaBump, n, n, n, verde, n, n, new THREE.Vector3(1, 0, 0), "centro G"),

            crearPieza(texturaColor, texturaBump, naranja, n, azul, n, n, blanco, new THREE.Vector3(-1, 1, -1), "esquina OBW"),
            crearPieza(texturaColor, texturaBump, n, rojo, azul, n, n, blanco, new THREE.Vector3(-1, 1, 1), "esquina RBW"),
            crearPieza(texturaColor, texturaBump, n, rojo, n, verde, n, blanco, new THREE.Vector3(1, 1, 1), "esquina RGW"),
            crearPieza(texturaColor, texturaBump, naranja, n, n, verde, n, blanco, new THREE.Vector3(1, 1, -1), "esquina OGW"),
            crearPieza(texturaColor, texturaBump, naranja, n, azul, n, amarillo, n, new THREE.Vector3(-1, -1, -1), "esquina OBY"),
            crearPieza(texturaColor, texturaBump, n, rojo, azul, n, amarillo, n, new THREE.Vector3(-1, -1, 1), "esquina RBY"),
            crearPieza(texturaColor, texturaBump, n, rojo, n, verde, amarillo, n, new THREE.Vector3(1, -1, 1), "esquina RGY"),
            crearPieza(texturaColor, texturaBump, naranja, n, n, verde, amarillo, n, new THREE.Vector3(1, -1, -1), "esquina OGY"),

            crearPieza(texturaColor, texturaBump, n, n, azul, n, n, blanco, new THREE.Vector3(-1, 1, 0), "arista BW"),
            crearPieza(texturaColor, texturaBump, n, n, n, verde, n, blanco, new THREE.Vector3(1, 1, 0), "arista GW"),
            crearPieza(texturaColor, texturaBump, n, rojo, n, n, n, blanco, new THREE.Vector3(0, 1, 1), "arista RW"),
            crearPieza(texturaColor, texturaBump, naranja, n, n, n, n, blanco, new THREE.Vector3(0, 1, -1), "arista OW"),
            crearPieza(texturaColor, texturaBump, n, rojo, azul, n, n, n, new THREE.Vector3(-1, 0, 1), "arista RB"),
            crearPieza(texturaColor, texturaBump, n, rojo, n, verde, n, n, new THREE.Vector3(1, 0, 1), "arista RG"),
            crearPieza(texturaColor, texturaBump, naranja, n, n, verde, n, n, new THREE.Vector3(1, 0, -1), "arista OG"),
            crearPieza(texturaColor, texturaBump, naranja, n, azul, n, n, n, new THREE.Vector3(-1, 0, -1), "arista OB"),
            crearPieza(texturaColor, texturaBump, n, n, azul, n, amarillo, n, new THREE.Vector3(-1, -1, 0), "arista BY"),
            crearPieza(texturaColor, texturaBump, n, n, n, verde, amarillo, n, new THREE.Vector3(1, -1, 0), "arista GY"),
            crearPieza(texturaColor, texturaBump, n, rojo, n, n, amarillo, n, new THREE.Vector3(0, -1, 1), "arista RY"),
            crearPieza(texturaColor, texturaBump, naranja, n, n, n, amarillo, n, new THREE.Vector3(0, -1, -1), "arista OY")
        ];
    cubo = new THREE.Object3D();
    for (var i = 0; i < piezas.length; i++) { cubo.add(piezas[i]); }
    escena.add(cubo);

    //Crea un cubo
    /*function piece(x, y, z) {
        const piece = new THREE.Mesh();
        const geometryPrincipalBox = new THREE.BoxGeometry(1, 1, 1);
        const materialPrincipalBox = new THREE.MeshBasicMaterial({ color: 0x595959 });
        const principalBox = new THREE.Mesh(geometryPrincipalBox, materialPrincipalBox);
        piece.add(principalBox);
        //////////////////////////////////////////////////////////////////
        if (x != 0) {
            const geometryColorBox_x = new THREE.BoxGeometry(0.05, 0.9, 0.9);
            const materialColorBox_x = new THREE.MeshBasicMaterial({ color: x == 1 ? 0xff5500 : 0xff012d });
            const colorBox_x = new THREE.Mesh(geometryColorBox_x, materialColorBox_x);
            colorBox_x.position.x += 0.5 * x;
            piece.add(colorBox_x);
        }
        //////////////////////////////////////////////////////////////////
        if (y != 0) {
            const geometryColorBox_y = new THREE.BoxGeometry(0.9, 0.05, 0.9);
            const materialColorBox_y = new THREE.MeshBasicMaterial({ color: y == 1 ? 0xcacd00 : 0xdceae1 });
            const colorBox_y = new THREE.Mesh(geometryColorBox_y, materialColorBox_y);
            colorBox_y.position.y += 0.5 * y;
            piece.add(colorBox_y);
        }
        //////////////////////////////////////////////////////////////////
        if (z != 0) {
            const geometryColorBox_z = new THREE.BoxGeometry(0.9, 0.9, 0.05);
            const materialColorBox_z = new THREE.MeshBasicMaterial({ color: z == 1 ? 0x0094c6 : 0x0aaa0a });
            const colorBox_z = new THREE.Mesh(geometryColorBox_z, materialColorBox_z);
            colorBox_z.position.z += 0.5 * z;
            piece.add(colorBox_z);
        }
        piece.position.y += y;
        piece.position.x += x;
        piece.position.z += z;
        return piece
    }
    cubo = new THREE.Object3D();
    const positions = [1, 0, -1];
    for (let x of positions) {
        for (let y of positions) {
            for (let z of positions) {
                if (x === 0 && y === 0 && z === 0) continue;
                cubo.add(piece(x, y, z));
            }
        }
    }*/
}

function girarCaraAutomaticamente(lado, direccion, rotacionInicial, duracion) {
    autoRotandoCara = true;
    var index = 0;
    caras = (lado == "M" || lado == "S" || lado == "E") ? [null, null, null, null, null, null, null, null] : [null, null, null, null, null, null, null, null, null];
    switch (lado) {
        case "F":
            direccion = -direccion;
            for (var f = 0; f < piezas.length; f++) {
                if (piezas[f].position.z > 0.5) {
                    caras[index] = piezas[f];
                    index++;
                }
            }
            break;
        case "B": for (var b = 0; b < piezas.length; b++) { if (piezas[b].position.z < -0.5) { caras[index] = piezas[b]; index++; } } break;
        case "U": direccion = -direccion; for (var u = 0; u < piezas.length; u++) { if (piezas[u].position.y > 0.5) { caras[index] = piezas[u]; index++; } } break;
        case "D": for (var d = 0; d < piezas.length; d++) { if (piezas[d].position.y < -0.5) { caras[index] = piezas[d]; index++; } } break;
        case "R": direccion = -direccion; for (var r = 0; r < piezas.length; r++) { if (piezas[r].position.x > 0.5) { caras[index] = piezas[r]; index++; } } break;
        case "L": for (var l = 0; l < piezas.length; l++) { if (piezas[l].position.x < -0.5) { caras[index] = piezas[l]; index++; } } break;
        case "M": for (var m = 0; m < piezas.length; m++) { if (piezas[m].position.x > -0.5 && piezas[m].position.x < 0.5) { caras[index] = piezas[m]; index++; } } break;
        case "S": direccion = -direccion; for (var s = 0; s < piezas.length; s++) { if (piezas[s].position.z > -0.5 && piezas[s].position.z < 0.5) { caras[index] = piezas[s]; index++; } } break;
        case "E": direccion = -direccion; for (var e = 0; e < piezas.length; e++) { if (piezas[e].position.y > -0.5 && piezas[e].position.y < 0.5) { caras[index] = piezas[e]; index++; } } break;
    }
    var nulo = new THREE.Object3D();
    for (var i = 0; i < caras.length; i++) {
        caras[i].updateMatrixWorld();
        THREE.SceneUtils.attach(caras[i], cubo, nulo);
    }
    var origen = { x: rotacionInicial, y: 0 };
    var destino = { x: direccion * 90 * Math.PI / 180, y: 0 };
    var movimiento = new TWEEN.Tween(origen).to(destino, duracion);
    movimiento.onUpdate(function () {
        switch (lado) {
            case "F": nulo.rotation.set(0, 0, origen.x); break;
            case "B": nulo.rotation.set(0, 0, origen.x); break;
            case "U": nulo.rotation.set(0, origen.x, 0); break;
            case "D": nulo.rotation.set(0, origen.x, 0); break;
            case "R": nulo.rotation.set(origen.x, 0, 0); break;
            case "L": nulo.rotation.set(origen.x, 0, 0); break;
            case "M": nulo.rotation.set(origen.x, 0, 0); break;
            case "S": nulo.rotation.set(0, 0, origen.x); break;
            case "E": nulo.rotation.set(0, origen.x, 0); break;
        }
    });
    movimiento.easing(TWEEN.Easing.Exponential.InOut);
    movimiento.start();
    movimiento.onComplete(function () {
        nulo.updateMatrixWorld();
        for (var i = 0; i < caras.length; i++) {
            THREE.SceneUtils.detach(caras[i], nulo, cubo);
            caras[i].updateMatrixWorld();
        }
        if (!desordenando) autoRotandoCara = false;
    });
    escena.add(nulo);
}


function ran(rango) {
    return Math.floor((Math.random() * rango) + 1);
}



function desordenar() {
    autoRotandoCara = true;
    desordenando = true;
    var tiempo = 200;
    indiceDesorden++;
    var aleatorio = ran(18);
    switch (aleatorio) {
        case 1: girarCaraAutomaticamente("R", -1, 0, tiempo); break;
        case 2: girarCaraAutomaticamente("U", -1, 0, tiempo); break;
        case 3: girarCaraAutomaticamente("F", -1, 0, tiempo); break;
        case 4: girarCaraAutomaticamente("B", -1, 0, tiempo); break;
        case 5: girarCaraAutomaticamente("L", -1, 0, tiempo); break;
        case 6: girarCaraAutomaticamente("D", -1, 0, tiempo); break;
        case 7: girarCaraAutomaticamente("M", -1, 0, tiempo); break;
        case 8: girarCaraAutomaticamente("S", -1, 0, tiempo); break;
        case 9: girarCaraAutomaticamente("E", -1, 0, tiempo); break;
        case 10: girarCaraAutomaticamente("R", 1, 0, tiempo); break;
        case 11: girarCaraAutomaticamente("U", 1, 0, tiempo); break;
        case 12: girarCaraAutomaticamente("F", 1, 0, tiempo); break;
        case 13: girarCaraAutomaticamente("B", 1, 0, tiempo); break;
        case 14: girarCaraAutomaticamente("L", 1, 0, tiempo); break;
        case 15: girarCaraAutomaticamente("D", 1, 0, tiempo); break;
        case 16: girarCaraAutomaticamente("M", 1, 0, tiempo); break;
        case 17: girarCaraAutomaticamente("S", 1, 0, tiempo); break;
        case 18: girarCaraAutomaticamente("E", 1, 0, tiempo); break;
    }
    if (indiceDesorden < 20) setTimeout(desordenar, 270);
    else {
        indiceDesorden = 0;
        setTimeout(terminarDesorden, 270);
    }
}

function terminarDesorden() {
    autoRotandoCara = false;
    desordenando = false;
}


function selecccionarCara(pieza, normal, direccion) {
    var cuadrante = conocerCuadrante();
    var normalMatrix = new THREE.Matrix3().getNormalMatrix(pieza.matrixWorld);
    var worldNormal = normal.clone().applyMatrix3(normalMatrix).normalize();
    var cara;
    if (pieza.position.x > 0.9 && pieza.position.y < 0.1 && pieza.position.y > -0.1 && pieza.position.z < 0.1 && pieza.position.z > -0.1) { //CARA VERDE
        if (worldNormal.x > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "S"; }
        }
    }
    if (pieza.position.x < -0.9 && pieza.position.y < 0.1 && pieza.position.y > -0.1 && pieza.position.z < 0.1 && pieza.position.z > -0.1) { //CARA AZUL
        if (worldNormal.x < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "S"; }
        }
    }
    if (pieza.position.x < 0.1 && pieza.position.x > -0.1 && pieza.position.y < 0.1 && pieza.position.y > -0.1 && pieza.position.z < -0.9) { //CARA NARANJA
        if (worldNormal.z < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "M"; }
        }
    }
    if (pieza.position.x < 0.1 && pieza.position.x > -0.1 && pieza.position.y < 0.1 && pieza.position.y > -0.1 && pieza.position.z > 0.9) { //CARA ROJA
        if (worldNormal.z > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "M"; }
        }
    }
    if (pieza.position.x < 0.1 && pieza.position.x > -0.1 && pieza.position.y < -0.9 && pieza.position.z < 0.1 && pieza.position.z > -0.1) { //CARA AMARILLA
        if (worldNormal.y < -0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "S"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "S"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "S"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "S"; }
            }
        }
    }
    if (pieza.position.x < 0.1 && pieza.position.x > -0.1 && pieza.position.y > 0.9 && pieza.position.z < 0.1 && pieza.position.z > -0.1) { //CARA BLANCA
        if (worldNormal.y > 0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "S"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "S"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "S"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "S"; }
            }
        }
    }
    if (pieza.position.x > 0.9 && pieza.position.y < 0.1 && pieza.position.y > -0.1 && pieza.position.z < -0.9) { //ARISTA NARANJA-VERDE
        if (worldNormal.x > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "B"; }
        }
        if (worldNormal.z < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "R"; }
        }
    }
    if (pieza.position.x > 0.9 && pieza.position.y < 0.1 && pieza.position.y > -0.1 && pieza.position.z > 0.9) { //ARISTA ROJA-VERDE
        if (worldNormal.x > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "F"; }
        }
        if (worldNormal.z > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "R"; }
        }
    }
    if (pieza.position.x < -0.9 && pieza.position.y < 0.1 && pieza.position.y > -0.1 && pieza.position.z < -0.9) { //ARISTA NARANJA-AZUL
        if (worldNormal.x < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "B"; }
        }
        if (worldNormal.z < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "L"; }
        }
    }
    if (pieza.position.x < -0.9 && pieza.position.y < 0.1 && pieza.position.y > -0.1 && pieza.position.z > 0.9) { //ARISTA ROJA-AZUL
        if (worldNormal.x < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "F"; }
        }
        if (worldNormal.z > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "E"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "L"; }
        }
    }
    if (pieza.position.x > 0.9 && pieza.position.y < -0.9 && pieza.position.z < 0.1 && pieza.position.z > -0.1) { //ARISTA VERDE-AMARILLA
        if (worldNormal.x > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "S"; }
        }
        if (worldNormal.y < -0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "S"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "S"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "S"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "S"; }
            }
        }
    }
    if (pieza.position.x > 0.9 && pieza.position.y > 0.9 && pieza.position.z < 0.1 && pieza.position.z > -0.1) { //ARISTA VERDE-BLANCA
        if (worldNormal.x > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "S"; }
        }
        if (worldNormal.y > 0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "S"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "S"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "S"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "S"; }
            }
        }
    }
    if (pieza.position.x < -0.9 && pieza.position.y < -0.9 && pieza.position.z < 0.1 && pieza.position.z > -0.1) { //ARISTA AZUL-AMARILLA
        if (worldNormal.x < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "S"; }
        }
        if (worldNormal.y < -0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "S"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "S"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "S"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "S"; }
            }
        }
    }
    if (pieza.position.x < -0.9 && pieza.position.y > 0.9 && pieza.position.z < 0.1 && pieza.position.z > -0.1) { //ARISTA AZUL-BLANCA
        if (worldNormal.x < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "S"; }
        }
        if (worldNormal.y > 0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "S"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "S"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "S"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "S"; }
            }
        }
    }
    if (pieza.position.x < 0.1 && pieza.position.x > -0.1 && pieza.position.y < -0.9 && pieza.position.z < -0.9) { //ARISTA NARANJA-AMARILLA
        if (worldNormal.y < -0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "B"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "B"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "B"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "B"; }
            }
        }
        if (worldNormal.z < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "M"; }
        }
    }
    if (pieza.position.x < 0.1 && pieza.position.x > -0.1 && pieza.position.y > 0.9 && pieza.position.z < -0.9) { //ARISTA NARANJA-BLANCA
        if (worldNormal.y > 0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "B"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "B"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "B"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "B"; }
            }
        }
        if (worldNormal.z < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "M"; }
        }
    }
    if (pieza.position.x < 0.1 && pieza.position.x > -0.1 && pieza.position.y < -0.9 && pieza.position.z > 0.9) { //ARISTA ROJA-AMARILLA
        if (worldNormal.y < -0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "F"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "F"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "F"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "F"; }
            }
        }
        if (worldNormal.z > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "M"; }
        }
    }
    if (pieza.position.x < 0.1 && pieza.position.x > -0.1 && pieza.position.y > 0.9 && pieza.position.z > 0.9) { //ARISTA ROJA-BLANCA
        if (worldNormal.y > 0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "F"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "F"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "M"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "F"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "M"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "F"; }
            }
        }
        if (worldNormal.z > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "M"; }
        }
    }
    if (pieza.position.x < -0.9 && pieza.position.y > 0.9 && pieza.position.z > 0.9) { //ESQUINA ROJA-AZUL-BLANCA
        if (worldNormal.x < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "F"; }
        }
        if (worldNormal.y > 0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "F"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "F"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "F"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "F"; }
            }
        }
        if (worldNormal.z > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "L"; }
        }
    }
    if (pieza.position.x < -0.9 && pieza.position.y < -0.9 && pieza.position.z > 0.9) { //ESQUINA ROJA-AZUL-AMARILLA
        if (worldNormal.x < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "F"; }
        }
        if (worldNormal.y < -0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "F"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "F"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "F"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "F"; }
            }
        }
        if (worldNormal.z > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "L"; }
        }
    }
    if (pieza.position.x > 0.9 && pieza.position.y > 0.9 && pieza.position.z > 0.9) { //ESQUINA ROJA-VERDE-BLANCA
        if (worldNormal.x > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "F"; }
        }
        if (worldNormal.y > 0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "F"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "F"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "F"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "F"; }
            }
        }
        if (worldNormal.z > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "R"; }
        }
    }
    if (pieza.position.x > 0.9 && pieza.position.y < -0.9 && pieza.position.z > 0.9) { //ESQUINA ROJA-VERDE-AMARILLA
        if (worldNormal.x > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "F"; }
        }
        if (worldNormal.y < -0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "F"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "F"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "F"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "F"; }
            }
        }
        if (worldNormal.z > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "R"; }
        }
    }
    if (pieza.position.x > 0.9 && pieza.position.y > 0.9 && pieza.position.z < -0.9) { //ESQUINA NARANJA-VERDE-BLANCA
        if (worldNormal.x > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "B"; }
        }
        if (worldNormal.y > 0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "B"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "B"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "B"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "B"; }
            }
        }
        if (worldNormal.z < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "R"; }
        }
    }
    if (pieza.position.x > 0.9 && pieza.position.y < -0.9 && pieza.position.z < -0.9) { //ESQUINA NARANJA-VERDE-AMARILLA
        if (worldNormal.x > 0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "B"; }
        }
        if (worldNormal.y < -0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "B"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "B"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "R"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "B"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "R"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "B"; }
            }
        }
        if (worldNormal.z < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "R"; }
        }
    }
    if (pieza.position.x < -0.9 && pieza.position.y > 0.9 && pieza.position.z < -0.9) { //ESQUINA NARANJA-AZUL-BLANCA
        if (worldNormal.x < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "B"; }
        }
        if (worldNormal.y > 0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "B"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "B"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "B"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "B"; }
            }
        }
        if (worldNormal.z < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "U"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "L"; }
        }
    }
    if (pieza.position.x < -0.9 && pieza.position.y < -0.9 && pieza.position.z < -0.9) { //ESQUINA NARANJA-AZUL-AMARILLA
        if (worldNormal.x < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "B"; }
        }
        if (worldNormal.y < -0.9) {
            if (cuadrante == 1) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = -1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = 1; cara = "B"; }
            }
            if (cuadrante == 2) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = -1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = -1; cara = "B"; }
            }
            if (cuadrante == 3) {
                if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "L"; }
                if (direccion == "H") { eje = "Z"; invertirGiro[5] = -1; cara = "B"; }
            }
            if (cuadrante == 4) {
                if (direccion == "H") { eje = "X"; invertirGiro[1] = 1; cara = "L"; }
                if (direccion == "V") { eje = "Z"; invertirGiro[4] = 1; cara = "B"; }
            }
        }
        if (worldNormal.z < -0.9) {
            if (direccion == "H") { eje = "Y"; invertirGiro[3] = 1; cara = "D"; }
            if (direccion == "V") { eje = "X"; invertirGiro[0] = 1; cara = "L"; }
        }
    }

    var index = 0;
    var caras = (cara == "M" || cara == "S" || cara == "E") ? [null, null, null, null, null, null, null, null] : [null, null, null, null, null, null, null, null, null];
    switch (cara) {
        case "F": for (var f = 0; f < piezas.length; f++) { if (piezas[f].position.z > 0.5) { caras[index] = piezas[f]; index++; } } break;
        case "B": for (var b = 0; b < piezas.length; b++) { if (piezas[b].position.z < -0.5) { caras[index] = piezas[b]; index++; } } break;
        case "U": for (var u = 0; u < piezas.length; u++) { if (piezas[u].position.y > 0.5) { caras[index] = piezas[u]; index++; } } break;
        case "D": for (var d = 0; d < piezas.length; d++) { if (piezas[d].position.y < -0.5) { caras[index] = piezas[d]; index++; } } break;
        case "R": for (var r = 0; r < piezas.length; r++) { if (piezas[r].position.x > 0.5) { caras[index] = piezas[r]; index++; } } break;
        case "L": for (var l = 0; l < piezas.length; l++) { if (piezas[l].position.x < -0.5) { caras[index] = piezas[l]; index++; } } break;
        case "M": for (var m = 0; m < piezas.length; m++) { if (piezas[m].position.x > -0.5 && piezas[m].position.x < 0.5) { caras[index] = piezas[m]; index++; } } break;
        case "S": for (var s = 0; s < piezas.length; s++) { if (piezas[s].position.z > -0.5 && piezas[s].position.z < 0.5) { caras[index] = piezas[s]; index++; } } break;
        case "E": for (var e = 0; e < piezas.length; e++) { if (piezas[e].position.y > -0.5 && piezas[e].position.y < 0.5) { caras[index] = piezas[e]; index++; } } break;
    }
    var nulo = new THREE.Object3D();
    for (var i = 0; i < caras.length; i++) {
        caras[i].updateMatrixWorld();
        THREE.SceneUtils.attach(caras[i], cubo, nulo);
    }
    escena.add(nulo);
    return nulo;
}

function conocerCuadrante() {
    var anguloCamara;
    var cuadrante;
    if (camara.position.x < 0 && camara.position.z >= 0) anguloCamara = Math.abs(Math.atan(camara.position.x / camara.position.z) * 180 / Math.PI);
    if (camara.position.x < 0 && camara.position.z < 0) anguloCamara = Math.abs(Math.atan(camara.position.z / camara.position.x) * 180 / Math.PI) + 90;
    if (camara.position.x >= 0 && camara.position.z < 0) anguloCamara = Math.abs(Math.atan(camara.position.x / camara.position.z) * 180 / Math.PI) + 180;
    if (camara.position.x >= 0 && camara.position.z >= 0) anguloCamara = Math.abs(Math.atan(camara.position.z / camara.position.x) * 180 / Math.PI) + 270;
    if (anguloCamara >= 315 || anguloCamara < 45) cuadrante = 1;
    if (anguloCamara >= 45 && anguloCamara < 135) cuadrante = 2;
    if (anguloCamara >= 135 && anguloCamara < 225) cuadrante = 3;
    if (anguloCamara >= 225 && anguloCamara < 315) cuadrante = 4;
    return (cuadrante);
}

function guardarClickInicial() {
    if (!clickInicialGuardado) {
        clickInicialGuardado = true;
        clickInicial.x = mouse.x;
        clickInicial.y = mouse.y;
        bloqueo = false;
    }
}

function actualizarRotacionCara(cara, desplazamiento, eje, direccion) {
    if (!bloqueo) {
        switch (eje) {
            case "X":
                if (direccion == "V") { cara.rotation.x = desplazamiento.y * 3 * invertirGiro[0]; giroAplicado = desplazamiento.y * 3 * invertirGiro[0] * 180 / Math.PI; }
                if (direccion == "H") { cara.rotation.x = desplazamiento.x * 3 * invertirGiro[1]; giroAplicado = desplazamiento.x * 3 * invertirGiro[1] * 180 / Math.PI; }
                break;
            case "Y":
                if (direccion == "V") { cara.rotation.y = desplazamiento.y * 3 * invertirGiro[2]; giroAplicado = desplazamiento.y * 3 * invertirGiro[2] * 180 / Math.PI; }
                if (direccion == "H") { cara.rotation.y = desplazamiento.x * 3 * invertirGiro[3]; giroAplicado = desplazamiento.x * 3 * invertirGiro[3] * 180 / Math.PI; }
                break;
            case "Z":
                if (direccion == "V") { cara.rotation.z = desplazamiento.y * 3 * invertirGiro[4]; giroAplicado = desplazamiento.y * 3 * invertirGiro[4] * 180 / Math.PI; }
                if (direccion == "H") { cara.rotation.z = desplazamiento.x * 3 * invertirGiro[5]; giroAplicado = desplazamiento.x * 3 * invertirGiro[5] * 180 / Math.PI; }
                break;
        }
        giroAplicado = giroAplicado % 360;
        if (giroAplicado >= -45 && giroAplicado < 45) giroObjetivo = 0;
        if (giroAplicado >= 45 && giroAplicado < 135) giroObjetivo = 90;
        if (giroAplicado >= 135 && giroAplicado < 225) giroObjetivo = 180;
        if (giroAplicado >= 225) giroObjetivo = 360;
        if (giroAplicado < -45 && giroAplicado >= -135) giroObjetivo = -90;
        if (giroAplicado < -135 && giroAplicado >= -225) giroObjetivo = -180;
        if (giroAplicado < -225) giroObjetivo = -360;
    }
}

function terminarGiro(inicio, fin) {
    var origen = { x: inicio * Math.PI / 180, y: 0 };
    var destino = { x: fin * Math.PI / 180, y: 0 };
    var movimiento = new TWEEN.Tween(origen).to(destino, Math.abs(Math.floor(600 * ((fin - inicio) / 45))));
    movimiento.onUpdate(function () {
        switch (eje) {
            case "X": cara.rotation.set(origen.x, 0, 0); break;
            case "Y": cara.rotation.set(0, origen.x, 0); break;
            case "Z": cara.rotation.set(0, 0, origen.x); break;
        }
    });
    movimiento.easing(TWEEN.Easing.Bounce.Out);
    movimiento.start();
    movimiento.onComplete(function () {
        lapsoDeSeguridad();

    });

}

function lapsoDeSeguridad() {
    setTimeout(restaurarCaras, 1);
}

function restaurarCaras() {
    var array = [null, null, null, null, null, null, null, null, null];
    for (var i = 0; i < cara.children.length; i++) array[i] = cara.children[i];
    for (var u = 0; u < array.length; u++) {
        if (array[u] != null) {
            THREE.SceneUtils.detach(array[u], cara, cubo);
            array[u].updateMatrixWorld();
        }

    }
    rotandoCara = false;
    clickInicialGuardado = false;
}

function onDocumentMouseDown(event) {
    if (event.button === THREE.MOUSE.LEFT) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        clickInicial.x = mouse.x;
        clickInicial.y = mouse.y;

        if (!desordenando && !autoRotandoCara && !rotandoEscena && !rotandoCara) {
            var ray = new THREE.Raycaster();
            ray.setFromCamera(mouse, camara);
            var intersects = ray.intersectObjects(cubo.children);
            if (intersects.length > 0) {
                bloqueo = rotandoCara;
                rotandoCara = true;
                direccionSeleccionada = false;
                direccion = "";
                caraSeleccionada = false;
            }
            else {
                rotandoEscena = true;
            }
        } else rotandoEscena = true;
    }

}

function onDocumentMouseMove(event) {
    if (event.button === THREE.MOUSE.LEFT) {
        var desplazamiento = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        var ray = new THREE.Raycaster();
        ray.setFromCamera(mouse, camara);
        var intersects = ray.intersectObjects(cubo.children);
        if (intersects.length > 0) {
            getObjeto = intersects[0].object;
            getNormal = intersects[0].face.normal;
        }
        if (rotandoCara && !rotandoEscena && !bloqueo) {
            desplazamiento.x = mouse.x - clickInicial.x;
            desplazamiento.y = mouse.y - clickInicial.y;

            if (!direccionSeleccionada) {
                if (desplazamiento.y > 0.01 || desplazamiento.y < -0.01) {
                    direccionSeleccionada = true;
                    direccion = "V";
                    guardarClickInicial();
                }
                if (desplazamiento.x > 0.01 || desplazamiento.x < -0.01) {
                    direccionSeleccionada = true;
                    direccion = "H";
                    guardarClickInicial();
                }
            }
            else if (!caraSeleccionada) {
                caraSeleccionada = true;
                cara = selecccionarCara(getObjeto, getNormal, direccion);
            }

            actualizarRotacionCara(cara, desplazamiento, eje, direccion);
        }
    }
}

function onDocumentMouseUp(event) {
    if (event.button === THREE.MOUSE.LEFT) {
        if (rotandoCara && !bloqueo) {
            bloqueo = true;
            terminarGiro(giroAplicado, giroObjetivo);
        }
        else rotandoEscena = false;

    }
}

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (!autoRotandoCara && !rotandoCara) {
        if (event.shiftKey) {
            switch (keyCode) {
                case 82: girarCaraAutomaticamente("R", -1, 0, 500); break;
                case 85: girarCaraAutomaticamente("U", -1, 0, 500); break;
                case 70: girarCaraAutomaticamente("F", -1, 0, 500); break;
                case 66: girarCaraAutomaticamente("B", -1, 0, 500); break;
                case 76: girarCaraAutomaticamente("L", -1, 0, 500); break;
                case 68: girarCaraAutomaticamente("D", -1, 0, 500); break;
                case 77: girarCaraAutomaticamente("M", -1, 0, 500); break;
                case 83: girarCaraAutomaticamente("S", -1, 0, 500); break;
                case 69: girarCaraAutomaticamente("E", -1, 0, 500); break;
            }
        }
        else {
            switch (keyCode) {
                case 82: girarCaraAutomaticamente("R", 1, 0, 500); break;
                case 85: girarCaraAutomaticamente("U", 1, 0, 500); break;
                case 70: girarCaraAutomaticamente("F", 1, 0, 500); break;
                case 66: girarCaraAutomaticamente("B", 1, 0, 500); break;
                case 76: girarCaraAutomaticamente("L", 1, 0, 500); break;
                case 68: girarCaraAutomaticamente("D", 1, 0, 500); break;
                case 77: girarCaraAutomaticamente("M", 1, 0, 500); break;
                case 83: girarCaraAutomaticamente("S", 1, 0, 500); break;
                case 69: girarCaraAutomaticamente("E", 1, 0, 500); break;
                case 88: desordenar(); break;
            }
        }
    }
}


function animarEscena() {
    TWEEN.update();
    controls.enableRotate = bloqueo;
    controls.update();
    requestAnimationFrame(animarEscena);
    renderizarEscena();
}

function renderizarEscena() {
    renderer.render(escena, camara);
}

window.addEventListener("mousemove", onDocumentMouseMove, false);
window.requestAnimationFrame(renderizarEscena);
