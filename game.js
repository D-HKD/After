import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

/* =========================================================
AMY - FIVE YEARS AFTER
V6
CLEAN / STABLE / NO V45 SKY DEPENDENCY
========================================================= */

let scene;
let camera;
let renderer;
let clock;

let player;
let started = false;
let gameFinished = false;

let yaw = 0;
let pitch = 0;

const keys = {};

let lastStepTime = 0;
let storyStage = 0;

let water;
let waterPositions;

let ambientLights = [];
let animatedLights = [];

let radioPlayed = false;
let danielFound = false;
let endingStarted = false;

let audioContext = null;
let masterGain = null;
let oceanGain = null;
let windGain = null;

let mouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

const velocity = new THREE.Vector3();

const startScreen =
document.getElementById("startScreen");

const startButton =
document.getElementById("startButton");

/* =========================================================
BASIC HELPERS
========================================================= */

function addBox(
x,
y,
z,
width,
height,
depth,
material,
cast = true,
receive = true
) {
const mesh =
new THREE.Mesh(
new THREE.BoxGeometry(
width,
height,
depth
),
material
);

mesh.position.set(
x,
y,
z
);

mesh.castShadow = cast;
mesh.receiveShadow = receive;

scene.add(mesh);

return mesh;
}

function addCylinder(
x,
y,
z,
radiusTop,
radiusBottom,
height,
material,
radialSegments = 12
) {
const mesh =
new THREE.Mesh(
new THREE.CylinderGeometry(
radiusTop,
radiusBottom,
height,
radialSegments
),
material
);

mesh.position.set(
x,
y,
z
);

mesh.castShadow = true;
mesh.receiveShadow = true;

scene.add(mesh);

return mesh;
}

function addSphere(
x,
y,
z,
radius,
material
) {
const mesh =
new THREE.Mesh(
new THREE.SphereGeometry(
radius,
16,
12
),
material
);

mesh.position.set(
x,
y,
z
);

mesh.castShadow = true;
mesh.receiveShadow = true;

scene.add(mesh);

return mesh;
}

/* =========================================================
MATERIALS
========================================================= */

const roadMaterial =
new THREE.MeshStandardMaterial({
color: 0x25282a,
roughness: 0.92
});

const concreteMaterial =
new THREE.MeshStandardMaterial({
color: 0x777b7c,
roughness: 0.88
});

const concreteDarkMaterial =
new THREE.MeshStandardMaterial({
color: 0x4f5354,
roughness: 0.94
});

const buildingMaterial =
new THREE.MeshStandardMaterial({
color: 0x73797a,
roughness: 0.82
});

const buildingDarkMaterial =
new THREE.MeshStandardMaterial({
color: 0x454a4b,
roughness: 0.9
});

const glassMaterial =
new THREE.MeshStandardMaterial({
color: 0x18333c,
roughness: 0.2,
metalness: 0.35
});

const metalMaterial =
new THREE.MeshStandardMaterial({
color: 0x42484a,
roughness: 0.65,
metalness: 0.55
});

const greenRailMaterial =
new THREE.MeshStandardMaterial({
color: 0x39745f,
roughness: 0.58,
metalness: 0.15
});

const orangeRailMaterial =
new THREE.MeshStandardMaterial({
color: 0xb87842,
roughness: 0.6,
metalness: 0.12
});

const yellowMaterial =
new THREE.MeshStandardMaterial({
color: 0xd7b62e,
roughness: 0.65
});

const whiteMaterial =
new THREE.MeshStandardMaterial({
color: 0xd5d5d0,
roughness: 0.7
});

const blackMaterial =
new THREE.MeshStandardMaterial({
color: 0x171919,
roughness: 0.9
});

const treeTrunkMaterial =
new THREE.MeshStandardMaterial({
color: 0x4c3c2c,
roughness: 1
});

const leafMaterial =
new THREE.MeshStandardMaterial({
color: 0x354b3a,
roughness: 0.95
});

const waterMaterial =
new THREE.MeshStandardMaterial({
color: 0x244d59,
roughness: 0.28,
metalness: 0.08,
transparent: true,
opacity: 0.91
});

/* =========================================================
UI
========================================================= */

function createUI() {

let game =
document.getElementById("game");

if (!game) {

game =
document.createElement("div");

game.id = "game";

game.style.position = "fixed";
game.style.inset = "0";
game.style.overflow = "hidden";
game.style.background = "#182126";

document.body.appendChild(game);
}

let objective =
document.getElementById(
"objective"
);

if (!objective) {

objective =
document.createElement("div");

objective.id = "objective";

objective.style.position = "fixed";
objective.style.left = "25px";
objective.style.top = "25px";
objective.style.padding =
"12px 18px";
objective.style.background =
"rgba(0,0,0,.55)";
objective.style.color =
"#ffffff";
objective.style.font =
"16px Arial";
objective.style.borderRadius =
"8px";
objective.style.zIndex = "10";

document.body.appendChild(
objective
);
}

let message =
document.getElementById(
"message"
);

if (!message) {

message =
document.createElement("div");

message.id = "message";

message.style.position =
"fixed";

message.style.left = "50%";
message.style.bottom = "12%";

message.style.transform =
"translateX(-50%)";

message.style.padding =
"15px 25px";

message.style.background =
"rgba(0,0,0,.7)";

message.style.color =
"#fff";

message.style.font =
"18px Arial";

message.style.borderRadius =
"10px";

message.style.opacity = "0";

message.style.transition =
"opacity .4s";

message.style.zIndex = "20";

document.body.appendChild(
message
);
}

return {
objective,
message
};
}

const ui = createUI();

function say(text) {

ui.message.textContent =
text;

ui.message.style.opacity =
"1";

clearTimeout(
ui.messageTimer
);

ui.messageTimer =
setTimeout(() => {

ui.message.style.opacity =
"0";

}, 4000);
}

/* =========================================================
SCENE
========================================================= */

function initScene() {

scene =
new THREE.Scene();

scene.background =
new THREE.Color(
0x8a9aa0
);

scene.fog =
new THREE.Fog(
0x7d898d,
35,
180
);

camera =
new THREE.PerspectiveCamera(
70,
window.innerWidth /
window.innerHeight,
0.1,
300
);

camera.position.set(
0,
1.7,
8
);

renderer =
new THREE.WebGLRenderer({
antialias: true,
powerPreference:
"high-performance"
});

renderer.setPixelRatio(
Math.min(
window.devicePixelRatio,
1.5
)
);

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.shadowMap.enabled =
true;

renderer.shadowMap.type =
THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
THREE.SRGBColorSpace;

renderer.toneMapping =
THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
1.05;

renderer.domElement.style.position =
"fixed";

renderer.domElement.style.inset =
"0";

renderer.domElement.style.zIndex =
"1";

const game =
document.getElementById("game");

game.appendChild(
renderer.domElement
);

clock =
new THREE.Clock();
}

/* =========================================================
LIGHTING
========================================================= */

function createLighting() {

const hemi =
new THREE.HemisphereLight(
0xd8e1e3,
0x343b3c,
1.8
);

scene.add(hemi);

ambientLights.push(
hemi
);

const sun =
new THREE.DirectionalLight(
0xf0e5d1,
2.1
);

sun.position.set(
-35,
45,
30
);

sun.castShadow = true;

sun.shadow.mapSize.width =
2048;

sun.shadow.mapSize.height =
2048;

sun.shadow.camera.left =
-70;

sun.shadow.camera.right =
70;

sun.shadow.camera.top =
70;

sun.shadow.camera.bottom =
-70;

scene.add(sun);

const seaLight =
new THREE.DirectionalLight(
0x9ab9c9,
0.45
);

seaLight.position.set(
25,
18,
-60
);

scene.add(
seaLight
);

createStreetLight(
-10,
-32
);

createStreetLight(
10,
-48
);

createStreetLight(
-10,
-68
);

createStreetLight(
10,
-88
);

createStreetLight(
-9,
-105
);
}

/* =========================================================
STREET LIGHT
========================================================= */

function createStreetLight(
x,
z
) {

addCylinder(
x,
2.4,
z,
0.07,
0.1,
4.8,
metalMaterial,
10
);

addBox(
x,
4.72,
z,
0.6,
0.12,
0.25,
blackMaterial
);

const lamp =
new THREE.PointLight(
0xffdca5,
1.5,
12
);

lamp.position.set(
x,
4.55,
z
);

scene.add(lamp);

animatedLights.push(
lamp
);
}

/* =========================================================
GROUND / ROAD
========================================================= */

function createGround() {

const ground =
addBox(
0,
-0.3,
-55,
70,
0.5,
150,
concreteDarkMaterial,
false,
true
);

ground.receiveShadow =
true;

addBox(
0,
-0.02,
-55,
24,
0.08,
125,
roadMaterial,
false,
true
);

/* Road centre markings */

for (
let z = 5;
z > -115;
z -= 7
) {

addBox(
0,
0.04,
z,
0.15,
0.025,
3.2,
yellowMaterial,
false,
true
);
}

/* Sidewalks */

addBox(
-14,
0.12,
-55,
4,
0.25,
125,
concreteMaterial
);

addBox(
14,
0.12,
-55,
4,
0.25,
125,
concreteMaterial
);

/* Kerbs */

addBox(
-12.1,
0.22,
-55,
0.25,
0.35,
125,
whiteMaterial
);

addBox(
12.1,
0.22,
-55,
0.25,
0.35,
125,
whiteMaterial
);
}

/* =========================================================
BUILDINGS
========================================================= */

function createBuilding(
x,
z,
width,
height,
depth
) {

addBox(
x,
height / 2,
z,
width,
height,
depth,
buildingMaterial
);

/* horizontal facade bands */

for (
let y = 3;
y < height;
y += 3.2
) {

addBox(
x,
y,
z - depth / 2 - 0.03,
width + 0.1,
0.12,
0.1,
concreteDarkMaterial
);
}

/* front windows */

const rows =
Math.floor(
height / 2.8
);

const columns =
Math.max(
3,
Math.floor(
width / 2.2
)
);

for (
let row = 0;
row < rows;
row++
) {

for (
let col = 0;
col < columns;
col++
) {

const wx =
x -
width / 2 +
1.2 +
col * (
width / columns
);

const wy =
1.6 +
row * 2.8;

addBox(
wx,
wy,
z -
depth / 2 -
0.08,
0.85,
1.15,
glassMaterial,
false,
false
);
}
}

/* AC units */

for (
let y = 2.2;
y < height;
y += 4.2
) {

addBox(
x +
width / 2 -
0.5,
y,
z -
depth / 2 -
0.22,
0.65,
0.45,
0.35,
metalMaterial
);
}
}

/* =========================================================
CITY BLOCK
========================================================= */

function createCity() {

createBuilding(
-21,
-15,
10,
18,
25
);

createBuilding(
21,
-20,
10,
22,
30
);

createBuilding(
-21,
20,
11,
15,
22
);

createBuilding(
21,
20,
12,
17,
25
);

createBuilding(
-22,
52,
13,
20,
24
);

createBuilding(
22,
52,
13,
18,
26
);

createBuilding(
-22,
80,
15,
23,
28
);

createBuilding(
22,
80,
15,
20,
28
);
}

/* =========================================================
LIGHT RAIL TRACKS
========================================================= */

function createLRT() {

const trackX =
[
-8.2,
-5.5,
-2.8,
2.8,
5.5,
8.2
];

for (
let i = 0;
i < trackX.length;
i++
) {

const x =
trackX[i];

addBox(
x,
0.17,
-55,
1.35,
0.18,
72,
concreteMaterial
);

addBox(
x - 0.38,
0.31,
-55,
0.08,
0.06,
72,
metalMaterial
);

addBox(
x + 0.38,
0.31,
-55,
0.08,
0.06,
72,
metalMaterial
);
}

/* sleepers */

for (
let z = -20;
z > -92;
z -= 2
) {

addBox(
-8.2,
0.28,
z,
1.1,
0.08,
0.18,
blackMaterial
);

addBox(
-5.5,
0.28,
z,
1.1,
0.08,
0.18,
blackMaterial
);

addBox(
-2.8,
0.28,
z,
1.1,
0.08,
0.18,
blackMaterial
);

addBox(
2.8,
0.28,
z,
1.1,
0.08,
0.18,
blackMaterial
);

addBox(
5.5,
0.28,
z,
1.1,
0.08,
0.18,
blackMaterial
);

addBox(
8.2,
0.28,
z,
1.1,
0.08,
0.18,
blackMaterial
);
}
}

/* =========================================================
LRT STATION
========================================================= */

function createStation() {

/* platforms */

const platformX =
[
-10.2,
-1.2,
1.2,
10.2
];

platformX.forEach(
x => {

addBox(
x,
0.55,
-60,
2.5,
0.55,
36,
concreteMaterial
);

/* green railing */

for (
let z = -43;
z >= -77;
z -= 3
) {

addCylinder(
x - 1.0,
1.05,
z,
0.035,
0.035,
1,
greenRailMaterial,
8
);

addBox(
x - 1,
1.35,
z,
0.08,
0.08,
3,
greenRailMaterial
);
}

/* orange safety edge */

addBox(
x,
0.88,
-60,
2.25,
0.08,
34,
orangeRailMaterial
);
}
);

/* station roof */

addBox(
0,
6.0,
-60,
23,
0.35,
36,
metalMaterial
);

/* roof supports */

for (
let x = -10;
x <= 10;
x += 5
) {

addCylinder(
x,
3.15,
-44,
0.12,
0.15,
5.8,
metalMaterial,
10
);

addCylinder(
x,
3.15,
-76,
0.12,
0.15,
5.8,
metalMaterial,
10
);
}

/* overhead beams */

for (
let z = -46;
z >= -75;
z -= 5
) {

addBox(
0,
5.35,
z,
21.5,
0.18,
0.2,
metalMaterial
);
}

/* station sign */

createStationSign(
0,
6.65,
-43
);
}

/* =========================================================
STATION SIGN
========================================================= */

function createStationSign(
x,
y,
z
) {

const sign =
addBox(
x,
y,
z,
7,
1.4,
0.22,
greenRailMaterial,
false,
false
);

const canvas =
document.createElement(
"canvas"
);

canvas.width = 900;
canvas.height = 220;

const ctx =
canvas.getContext(
"2d"
);

ctx.fillStyle =
"#36735e";

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);

ctx.fillStyle =
"#ffffff";

ctx.font =
"bold 70px Arial";

ctx.textAlign =
"center";

ctx.fillText(
"屯門碼頭",
450,
88
);

ctx.font =
"bold 45px Arial";

ctx.fillText(
"TUEN MUN FERRY PIER",
450,
155
);

const texture =
new THREE.CanvasTexture(
canvas
);

texture.colorSpace =
THREE.SRGBColorSpace;

sign.material.map =
texture;

sign.material.needsUpdate =
true;
}

/* =========================================================
BUS TERMINAL
========================================================= */

function createBusTerminal() {

addBox(
17,
0.18,
-62,
10,
0.3,
30,
roadMaterial
);

addBox(
17,
3.8,
-62,
10,
0.25,
30,
metalMaterial
);

for (
let z = -49;
z >= -75;
z -= 5
) {

addCylinder(
13,
2,
z,
0.1,
0.12,
3.8,
metalMaterial,
10
);

addCylinder(
21,
2,
z,
0.1,
0.12,
3.8,
metalMaterial,
10
);
}

addBox(
17,
0.6,
-48,
8,
0.08,
0.08,
yellowMaterial
);

addBox(
17,
0.6,
-75,
8,
0.08,
0.08,
yellowMaterial
);
}

/* =========================================================
CARS
========================================================= */

function createCar(
x,
z,
rotation = 0
) {

const group =
new THREE.Group();

group.position.set(
x,
0,
z
);

group.rotation.y =
rotation;

scene.add(group);

const body =
new THREE.Mesh(
new THREE.BoxGeometry(
2.1,
0.55,
4
),
blackMaterial
);

body.position.y =
0.55;

body.castShadow = true;

group.add(body);

const roof =
new THREE.Mesh(
new THREE.BoxGeometry(
1.65,
0.45,
1.9
),
glassMaterial
);

roof.position.y =
1.0;

roof.castShadow = true;

group.add(roof);

const wheelGeometry =
new THREE.CylinderGeometry(
0.38,
0.38,
0.25,
14
);

const wheelPositions =
[
[-0.95, 0.42, -1.25],
[0.95, 0.42, -1.25],
[-0.95, 0.42, 1.25],
[0.95, 0.42, 1.25]
];

wheelPositions.forEach(
p => {

const wheel =
new THREE.Mesh(
wheelGeometry,
blackMaterial
);

wheel.rotation.z =
Math.PI / 2;

wheel.position.set(
p[0],
p[1],
p[2]
);

wheel.castShadow =
true;

group.add(wheel);
}
);

const lightMaterial =
new THREE.MeshStandardMaterial({
color: 0xf6e5aa,
emissive: 0xffcc66,
emissiveIntensity: 0.5
});

addCarPart(
group,
-0.55,
0.65,
-2.03,
0.35,
0.16,
0.06,
lightMaterial
);

addCarPart(
group,
0.55,
0.65,
-2.03,
0.35,
0.16,
0.06,
lightMaterial
);
}

function addCarPart(
group,
x,
y,
z,
w,
h,
d,
material
) {

const mesh =
new THREE.Mesh(
new THREE.BoxGeometry(
w,
h,
d
),
material
);

mesh.position.set(
x,
y,
z
);

group.add(mesh);
}

/* =========================================================
TREES
========================================================= */

function createTree(
x,
z,
scale = 1
) {

const group =
new THREE.Group();

group.position.set(
x,
0,
z
);

group.scale.setScalar(
scale
);

scene.add(group);

const trunk =
new THREE.Mesh(
new THREE.CylinderGeometry(
0.16,
0.24,
2.2,
8
),
treeTrunkMaterial
);

trunk.position.y =
1.1;

trunk.castShadow =
true;

group.add(trunk);

const crown =
new THREE.Mesh(
new THREE.SphereGeometry(
1.3,
12,
10
),
leafMaterial
);

crown.position.y =
2.7;

crown.castShadow =
true;

group.add(crown);
}

/* =========================================================
TREES / VEGETATION
========================================================= */

function createVegetation() {

const positions =
[
[-16, -12],
[16, -5],
[-16, 10],
[16, 18],
[-16, 38],
[16, 42],
[-17, 65],
[17, 68],
[-15, 92],
[15, 96],
[-18, -35],
[18, -40]
];

positions.forEach(
p => {

createTree(
p[0],
p[1],
0.8 +
Math.random() *
0.5
);
}
);
}

/* =========================================================
DEBRIS
========================================================= */

function createDebris() {

const positions =
[
[-9, -25],
[8, -31],
[-10, -39],
[9, -47],
[-8, -55],
[11, -70],
[-9, -81],
[8, -88],
[-7, -96],
[7, -103]
];

positions.forEach(
p => {

const size =
0.2 +
Math.random() *
0.7;

const material =
Math.random() >
0.5
? metalMaterial
: blackMaterial;

const object =
addBox(
p[0],
size / 2,
p[1],
size,
size,
size,
material
);

object.rotation.set(
Math.random(),
Math.random(),
Math.random()
);
}
);

/* barrels */

for (
let i = 0;
i < 8;
i++
) {

const x =
-9 +
Math.random() *
18;

const z =
-25 -
Math.random() *
75;

addCylinder(
x,
0.65,
z,
0.48,
0.48,
1.3,
metalMaterial,
12
);
}
}

/* =========================================================
WATER
========================================================= */

function createWater() {

const geometry =
new THREE.PlaneGeometry(
110,
70,
80,
40
);

geometry.rotateX(
-Math.PI / 2
);

water =
new THREE.Mesh(
geometry,
waterMaterial
);

water.position.set(
0,
-0.05,
-125
);

water.receiveShadow =
true;

scene.add(
water
);

waterPositions =
geometry.attributes
.position.array.slice();
}

function updateWater(time) {

if (!water)
return;

const pos =
water.geometry.attributes
.position;

for (
let i = 0;
i < pos.count;
i++
) {

const x =
pos.getX(i);

const z =
pos.getZ(i);

const y =
Math.sin(
x * 0.13 +
time * 0.0008
) * 0.09
+
Math.sin(
z * 0.17 +
time * 0.0011
) * 0.06;

pos.setY(
i,
y
);
}

pos.needsUpdate =
true;

water.geometry.computeVertexNormals();
}

/* =========================================================
PIER
========================================================= */

function createPier() {

addBox(
0,
0.2,
-100,
23,
0.4,
30,
concreteMaterial
);

addBox(
0,
0.08,
-114,
20,
0.12,
2,
orangeRailMaterial
);

/* railings */

for (
let x = -10;
x <= 10;
x += 2
) {

addCylinder(
x,
1,
-114,
0.045,
0.045,
1.8,
greenRailMaterial,
8
);
}

addBox(
0,
1.8,
-114,
20,
0.08,
0.08,
greenRailMaterial
);

/* ferry terminal canopy */

addBox(
0,
4.8,
-101,
16,
0.3,
14,
metalMaterial
);

for (
let x = -7;
x <= 7;
x += 7
) {

addCylinder(
x,
2.4,
-95,
0.12,
0.15,
4.8,
metalMaterial,
10
);

addCylinder(
x,
2.4,
-108,
0.12,
0.15,
4.8,
metalMaterial,
10
);
}
}

/* =========================================================
ENVIRONMENT
========================================================= */

function createEnvironment() {

createGround();

createCity();

createLRT();

createStation();

createBusTerminal();

createPier();

createWater();

createVegetation();

createDebris();

createCar(
-5,
-27,
0
);

createCar(
5,
-35,
Math.PI
);

createCar(
-5,
-48,
0
);

createCar(
5,
-83,
Math.PI
);

createCar(
-4,
-92,
0
);

/* ferry lights */

for (
let i = 0;
i < 6;
i++
) {

const light =
new THREE.PointLight(
0xffc77d,
0.9,
9
);

light.position.set(
-7 +
i * 2.8,
3.8,
-96
);

scene.add(light);

animatedLights.push(
light
);
}
}

/* =========================================================
PLAYER
========================================================= */

function createPlayer() {

player =
new THREE.Object3D();

player.position.set(
0,
1.7,
8
);

player.rotation.order =
"YXZ";

scene.add(
player
);

player.add(
camera
);

camera.position.set(
0,
0,
0
);

const flashlight =
new THREE.SpotLight(
0xffffff,
2.4,
32,
Math.PI / 7,
0.6,
1.2
);

flashlight.position.set(
0,
0,
0
);

flashlight.target.position.set(
0,
0,
-15
);

camera.add(
flashlight
);

camera.add(
flashlight.target
);
}

/* =========================================================
INPUT
========================================================= */

function setupInput() {

window.addEventListener(
"keydown",
event => {

keys[
event.key.toLowerCase()
] = true;

}
);

window.addEventListener(
"keyup",
event => {

keys[
event.key.toLowerCase()
] = false;

}
);

renderer.domElement.addEventListener(
"mousedown",
event => {

mouseDown = true;

lastMouseX =
event.clientX;

lastMouseY =
event.clientY;
}
);

window.addEventListener(
"mouseup",
() => {

mouseDown = false;

}
);

window.addEventListener(
"mousemove",
event => {

if (!mouseDown)
return;

const dx =
event.clientX -
lastMouseX;

const dy =
event.clientY -
lastMouseY;

lastMouseX =
event.clientX;

lastMouseY =
event.clientY;

yaw -=
dx * 0.003;

pitch -=
dy * 0.0025;

pitch =
THREE.MathUtils.clamp(
pitch,
-1.35,
1.35
);
}
);

/* Mobile touch */

let touchStartX = 0;
let touchStartY = 0;
let touchMode = "";

renderer.domElement.addEventListener(
"touchstart",
event => {

if (
event.touches.length !== 1
)
return;

const touch =
event.touches[0];

touchStartX =
touch.clientX;

touchStartY =
touch.clientY;

touchMode =
touch.clientX <
window.innerWidth / 2
? "move"
: "look";
},
{
passive: false
}
);

renderer.domElement.addEventListener(
"touchmove",
event => {

if (
event.touches.length !== 1
)
return;

event.preventDefault();

const touch =
event.touches[0];

const dx =
touch.clientX -
touchStartX;

const dy =
touch.clientY -
touchStartY;

if (
touchMode ===
"move"
) {

keys["w"] =
dy < -15;

keys["s"] =
dy > 15;

keys["a"] =
dx < -15;

keys["d"] =
dx > 15;

} else {

yaw -=
dx * 0.002;

pitch -=
dy * 0.0018;

pitch =
THREE.MathUtils.clamp(
pitch,
-1.35,
1.35
);

touchStartX =
touch.clientX;

touchStartY =
touch.clientY;
}

},
{
passive: false
}
);

renderer.domElement.addEventListener(
"touchend",
() => {

keys["w"] = false;
keys["s"] = false;
keys["a"] = false;
keys["d"] = false;

}
);
}

/* =========================================================
PLAYER MOVEMENT
========================================================= */

function updatePlayer(delta) {

if (!started)
return;

let forward = 0;
let side = 0;

if (keys["w"])
forward += 1;

if (keys["s"])
forward -= 1;

if (keys["d"])
side += 1;

if (keys["a"])
side -= 1;

const moving =
forward !== 0 ||
side !== 0;

const speed =
4.4;

if (moving) {

const direction =
new THREE.Vector3(
side,
0,
-forward
);

direction.normalize();

direction.applyAxisAngle(
new THREE.Vector3(
0,
1,
0
),
yaw
);

player.position.x +=
direction.x *
speed *
delta;

player.position.z +=
direction.z *
speed *
delta;

player.position.x =
THREE.MathUtils.clamp(
player.position.x,
-10.5,
10.5
);

player.position.z =
THREE.MathUtils.clamp(
player.position.z,
-118,
8
);

if (
audioContext &&
audioContext.state ===
"running"
) {

if (
performance.now() -
lastStepTime >
450
) {

playFootstep();

lastStepTime =
performance.now();
}
}
}

player.rotation.y =
yaw;

camera.rotation.x =
pitch;
}

/* =========================================================
STORY
========================================================= */

function updateStory() {

if (!started ||
gameFinished)
return;

const z =
player.position.z;

if (
storyStage === 0 &&
z < -25
) {

storyStage = 1;

say(
"Amy：五年了……呢度已經完全變咗。"
);

ui.objective.textContent =
"目標：沿住輕鐵站方向前進";
}

if (
storyStage === 1 &&
z < -48
) {

storyStage = 2;

say(
"遠處傳來微弱嘅無線電雜訊……"
);

playRadioStatic();

ui.objective.textContent =
"目標：尋找訊號來源";
}

if (
storyStage === 2 &&
z < -70
) {

storyStage = 3;

say(
"無線電：……有人嗎……如果有人聽到……"
);

ui.objective.textContent =
"目標：前往屯門碼頭";
}

if (
storyStage === 3 &&
z < -94
) {

storyStage = 4;

say(
"Amy：Daniel……係你嗎？"
);

ui.objective.textContent =
"目標：搜尋碼頭附近";
}

if (
storyStage === 4 &&
z < -108
) {

storyStage = 5;

findDaniel();
}
}

/* =========================================================
DANIEL
========================================================= */

function findDaniel() {

if (danielFound)
return;

danielFound =
true;

say(
"Daniel：Amy……真係妳。"
);

setTimeout(
() => {

say(
"Amy：我搵咗你五年。"
);

},
3200
);

setTimeout(
() => {

say(
"Daniel：我一直都相信妳會返嚟。"
);

},
6800
);

setTimeout(
startEnding,
10500
);
}

/* =========================================================
ENDING
========================================================= */

function startEnding() {

if (endingStarted)
return;

endingStarted =
true;

say(
"五年後……"
);

setTimeout(
() => {

say(
"海旁開始出現第一批倖存者建立嘅屋舍。"
);

},
4000
);

setTimeout(
() => {

say(
"Amy 同 Daniel 成為新社區嘅守護者。"
);

},
8000
);

setTimeout(
() => {

say(
"新嘅規矩、新嘅生活、新嘅希望。"
);

},
12000
);

setTimeout(
() => {

say(
"多年後……兩人結婚，並有咗自己嘅家庭。"
);

},
16500
);

setTimeout(
() => {

gameFinished =
true;

ui.objective.textContent =
"THE WORLD ENDED. WE BEGAN AGAIN.";

say(
"THE WORLD ENDED. WE BEGAN AGAIN."
);

},
21500
);
}

/* =========================================================
AUDIO
========================================================= */

function startAudio() {

if (audioContext)
return;

audioContext =
new (
window.AudioContext ||
window.webkitAudioContext
)();

masterGain =
audioContext.createGain();

masterGain.gain.value =
0.11;

masterGain.connect(
audioContext.destination
);

/* Ocean */

const oceanBuffer =
createNoiseBuffer(4);

const oceanSource =
audioContext.createBufferSource();

oceanSource.buffer =
oceanBuffer;

oceanSource.loop =
true;

const oceanFilter =
audioContext.createBiquadFilter();

oceanFilter.type =
"lowpass";

oceanFilter.frequency.value =
850;

oceanGain =
audioContext.createGain();

oceanGain.gain.value =
0.018;

oceanSource
.connect(oceanFilter)
.connect(oceanGain)
.connect(masterGain);

oceanSource.start();

/* Wind */

const windBuffer =
createNoiseBuffer(5);

const windSource =
audioContext.createBufferSource();

windSource.buffer =
windBuffer;

windSource.loop =
true;

const windFilter =
audioContext.createBiquadFilter();

windFilter.type =
"bandpass";

windFilter.frequency.value =
900;

windFilter.Q.value =
0.5;

windGain =
audioContext.createGain();

windGain.gain.value =
0.006;

windSource
.connect(windFilter)
.connect(windGain)
.connect(masterGain);

windSource.start();

audioContext.resume();
}

function createNoiseBuffer(
seconds
) {

const buffer =
audioContext.createBuffer(
1,
audioContext.sampleRate *
seconds,
audioContext.sampleRate
);

const data =
buffer.getChannelData(0);

for (
let i = 0;
i < data.length;
i++
) {

data[i] =
Math.random() * 2 - 1;
}

return buffer;
}

function playFootstep() {

if (!audioContext)
return;

const osc =
audioContext.createOscillator();

const gain =
audioContext.createGain();

osc.type =
"triangle";

osc.frequency.value =
75 +
Math.random() * 25;

gain.gain.setValueAtTime(
0.0001,
audioContext.currentTime
);

gain.gain.exponentialRampToValueAtTime(
0.035,
audioContext.currentTime +
0.015
);

gain.gain.exponentialRampToValueAtTime(
0.0001,
audioContext.currentTime +
0.11
);

osc
.connect(gain)
.connect(masterGain);

osc.start();

osc.stop(
audioContext.currentTime +
0.12
);
}

function playRadioStatic() {

if (!audioContext)
return;

const buffer =
createNoiseBuffer(
0.35
);

const source =
audioContext.createBufferSource();

const gain =
audioContext.createGain();

const filter =
audioContext.createBiquadFilter();

filter.type =
"bandpass";

filter.frequency.value =
1400;

gain.gain.value =
0.055;

source.buffer =
buffer;

source
.connect(filter)
.connect(gain)
.connect(masterGain);

source.start();
}

/* =========================================================
AUDIO UPDATE
========================================================= */

function updateAudio() {

if (
!audioContext ||
!oceanGain ||
!windGain
)
return;

const z =
player
? player.position.z
: 0;

const distanceToSea =
Math.max(
0,
-95 - z
);

const oceanVolume =
THREE.MathUtils.clamp(
0.012 +
distanceToSea *
0.00035,
0.012,
0.028
);

oceanGain.gain.value =
oceanVolume;

const windVolume =
0.004 +
Math.abs(
Math.sin(
performance.now() *
0.00015
)
) *
0.003;

windGain.gain.value =
windVolume;
}

/* =========================================================
WATER / LIGHT ANIMATION
========================================================= */

function updateEnvironment(
time
) {

updateWater(
time
);

animatedLights.forEach(
(light, index) => {

light.intensity =
0.75 +
Math.sin(
time *
0.002 +
index
) *
0.15;
}
);
}

/* =========================================================
RESIZE
========================================================= */

function onResize() {

camera.aspect =
window.innerWidth /
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);
}

window.addEventListener(
"resize",
onResize
);

/* =========================================================
START BUTTON
========================================================= */

if (startButton) {

startButton.addEventListener(
"click",
() => {

if (started)
return;

started =
true;

if (startScreen) {

startScreen.style.display =
"none";
}

startAudio();

say(
"Amy：五年了……我終於回到屯門碼頭。"
);

ui.objective.textContent =
"目標：沿住道路前往屯門碼頭";
}
);
}

/* =========================================================
MAIN LOOP
========================================================= */

function animate() {

requestAnimationFrame(
animate
);

const delta =
Math.min(
clock.getDelta(),
0.05
);

const time =
performance.now();

if (started) {

updatePlayer(
delta
);

updateStory();

updateAudio();

updateEnvironment(
time
);
}

renderer.render(
scene,
camera
);
}

/* =========================================================
INITIALIZE
========================================================= */

function init() {

initScene();

createLighting();

createEnvironment();

createPlayer();

setupInput();

ui.objective.textContent =
"按「開始遊戲」開始";

animate();
}

init();
