// ============================================================
// AMY — FIVE YEARS AFTER
// V8.1 CINEMATIC EDITION
// COMPLETE game.js
// ============================================================

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// ============================================================
// GLOBAL
// ============================================================

let scene;
let camera;
let renderer;
let clock;

let gameStarted = false;
let cinematic = false;
let ending = false;

let player;
let daniel = null;

let water = null;
let flashlight = null;
let flashlightTarget = null;

let yaw = 0;
let pitch = 0;

const keys = {};

let storyStep = 0;
let reunionStart = 0;
let endingStart = 0;

let touchLook = {
active: false,
x: 0,
y: 0
};

let audioCtx = null;
let audioMaster = null;

let environmentObjects = [];

const startScreen =
document.getElementById("startScreen");

const startButton =
document.getElementById("startButton");

// ============================================================
// CONSTANTS
// ============================================================

const PLAYER_HEIGHT = 1.7;
const WALK_SPEED = 4.2;
const RUN_SPEED = 6.3;

const WORLD_MIN_Z = -160;
const WORLD_MAX_Z = 35;

// ============================================================
// MATERIALS
// ============================================================

function makeMaterial(
color,
roughness = 0.8,
metalness = 0
) {

return new THREE.MeshStandardMaterial({
color,
roughness,
metalness
});
}

function makePhysical(
color,
roughness = 0.6,
metalness = 0,
clearcoat = 0
) {

return new THREE.MeshPhysicalMaterial({
color,
roughness,
metalness,
clearcoat,
clearcoatRoughness: 0.35
});
}

// ============================================================
// GEOMETRY HELPERS
// ============================================================

function makeBox(
x,
y,
z,
width,
height,
depth,
material,
parent = scene
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

mesh.castShadow = true;
mesh.receiveShadow = true;

parent.add(mesh);

return mesh;
}

function makeCylinder(
x,
y,
z,
radiusTop,
radiusBottom,
height,
material,
parent = scene,
segments = 16
) {

const mesh =
new THREE.Mesh(
new THREE.CylinderGeometry(
radiusTop,
radiusBottom,
height,
segments
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

parent.add(mesh);

return mesh;
}

function makeSphere(
x,
y,
z,
radius,
material,
parent = scene
) {

const mesh =
new THREE.Mesh(
new THREE.SphereGeometry(
radius,
20,
14
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

parent.add(mesh);

return mesh;
}

// ============================================================
// SCENE
// ============================================================

function createScene() {

scene =
new THREE.Scene();

scene.background =
new THREE.Color(
0x69757a
);

scene.fog =
new THREE.FogExp2(
0x69757a,
0.0085
);

camera =
new THREE.PerspectiveCamera(
68,
window.innerWidth /
window.innerHeight,
0.05,
500
);

camera.position.set(
0,
PLAYER_HEIGHT,
28
);

renderer =
new THREE.WebGLRenderer({
antialias: true,
powerPreference:
"high-performance"
});

renderer.setPixelRatio(
Math.min(
window.devicePixelRatio || 1,
1.6
)
);

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.outputColorSpace =
THREE.SRGBColorSpace;

renderer.toneMapping =
THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
1.05;

renderer.shadowMap.enabled =
true;

renderer.shadowMap.type =
THREE.PCFSoftShadowMap;

document.body.appendChild(
renderer.domElement
);

clock =
new THREE.Clock();
}

// ============================================================
// LIGHTING
// ============================================================

function createLighting() {

const hemisphere =
new THREE.HemisphereLight(
0xc5d0d3,
0x202426,
1.15
);

scene.add(
hemisphere
);

const sun =
new THREE.DirectionalLight(
0xdce4e5,
1.65
);

sun.position.set(
-55,
75,
35
);

sun.castShadow = true;

sun.shadow.mapSize.width =
2048;

sun.shadow.mapSize.height =
2048;

sun.shadow.camera.left =
-100;

sun.shadow.camera.right =
100;

sun.shadow.camera.top =
100;

sun.shadow.camera.bottom =
-100;

sun.shadow.camera.near =
1;

sun.shadow.camera.far =
250;

scene.add(
sun
);

const fill =
new THREE.DirectionalLight(
0x8da2b4,
0.32
);

fill.position.set(
60,
35,
-100
);

scene.add(
fill
);
}

// ============================================================
// GROUND
// ============================================================

function createGround() {

const ground =
new THREE.Mesh(
new THREE.PlaneGeometry(
150,
250,
50,
80
),
makeMaterial(
0x555a57,
0.96
)
);

ground.rotation.x =
-Math.PI / 2;

ground.position.set(
0,
-2,
-60
);

ground.receiveShadow =
true;

scene.add(
ground
);
}

// ============================================================
// ROAD
// ============================================================

function createRoad() {

const road =
makeMaterial(
0x282d2e,
0.98
);

makeBox(
0,
-1.94,
-48,
18,
0.12,
195,
road
);

const line =
makeMaterial(
0xc8c5a9,
0.8
);

for (
let z = 42;
z > -142;
z -= 8
) {

makeBox(
0,
-1.86,
z,
0.14,
0.025,
3.7,
line
);
}

// Crossing

for (
let i = -4;
i <= 4;
i++
) {

makeBox(
i * 1.6,
-1.86,
-60,
0.9,
0.025,
5,
line
);
}
}

// ============================================================
// BUILDINGS
// ============================================================

function createBuilding(
x,
z,
width,
height,
depth,
color
) {

const group =
new THREE.Group();

group.position.set(
x,
-2,
z
);

scene.add(group);

const wall =
makePhysical(
color,
0.88,
0.02
);

makeBox(
0,
height / 2,
0,
width,
height,
depth,
wall,
group
);

const roof =
makeMaterial(
0x414546,
0.92,
0.05
);

makeBox(
0,
height + 0.18,
0,
width + 0.3,
0.35,
depth + 0.3,
roof,
group
);

const glass =
new THREE.MeshPhysicalMaterial({
color: 0x304249,
roughness: 0.18,
metalness: 0.08,
clearcoat: 0.7
});

const rows =
Math.max(
1,
Math.floor(
height / 3
)
);

const columns =
Math.max(
2,
Math.floor(
width / 3
)
);

for (
let r = 0;
r < rows;
r++
) {

for (
let c = 0;
c < columns;
c++
) {

const px =
-width / 2 +
1.3 +
c *
(
(width - 2.6) /
Math.max(
1,
columns - 1
)
);

const py =
2 +
r * 2.8;

if (
py >
height - 1
) {
continue;
}

makeBox(
px,
py,
depth / 2 + 0.03,
0.9,
1.25,
0.04,
glass,
group
);
}
}

// Air conditioners

const ac =
makeMaterial(
0xb4b7b4,
0.72,
0.15
);

const acCount =
Math.max(
2,
Math.floor(
width / 8
)
);

for (
let i = 0;
i < acCount;
i++
) {

const ax =
-width / 2 +
3 +
i *
(
(width - 6) /
Math.max(
1,
acCount - 1
)
);

makeBox(
ax,
Math.min(
height - 1.2,
5
),
depth / 2 + 0.35,
1.05,
0.7,
0.55,
ac,
group
);
}
}

function createBuildings() {

createBuilding(
-29,
-25,
30,
18,
23,
0x777b78
);

createBuilding(
30,
-18,
28,
22,
24,
0x686d6a
);

createBuilding(
-30,
-77,
25,
15,
20,
0x746f67
);

createBuilding(
31,
-94,
30,
20,
27,
0x656967
);

createBuilding(
-30,
-130,
33,
19,
26,
0x6d716d
);

createBuilding(
29,
-140,
26,
16,
21,
0x626866
);
}

// ============================================================
// LRT
// ============================================================

function createLRT() {

const rail =
makeMaterial(
0x696f70,
0.35,
0.8
);

const sleeper =
makeMaterial(
0x454947,
0.92
);

for (
const x of [-3.2, 3.2]
) {

makeBox(
x,
-1.73,
-35,
0.16,
0.18,
205,
rail
);
}

for (
let z = 60;
z > -140;
z -= 2.1
) {

makeBox(
0,
-1.82,
z,
8,
0.16,
0.35,
sleeper
);
}

const pole =
makeMaterial(
0x515858,
0.58,
0.4
);

for (
let z = 50;
z > -135;
z -= 18
) {

makeCylinder(
-6.5,
3,
z,
0.09,
0.13,
10,
pole
);

makeBox(
-2.8,
7.8,
z,
7.3,
0.1,
0.1,
pole
);
}
}

// ============================================================
// LRT STATION
// ============================================================

function createStation() {

const station =
new THREE.Group();

station.position.set(
0,
-2,
-63
);

scene.add(
station
);

makeBox(
0,
0.12,
0,
15,
0.3,
10,
makeMaterial(
0x80837f,
0.9
),
station
);

makeBox(
0,
5,
0,
16,
0.3,
11,
makeMaterial(
0x555b5b,
0.65,
0.2
),
station
);

const pillar =
makeMaterial(
0x5e6361,
0.75
);

for (
const x of [-6.5, 6.5]
) {

for (
const z of [-4.2, 4.2]
) {

makeCylinder(
x,
2.5,
z,
0.22,
0.27,
5,
pillar,
station
);
}
}

makeBox(
0,
4.05,
5.55,
7,
1.2,
0.12,
makeMaterial(
0xd7dad5,
0.55
),
station
);
}

// ============================================================
// VEHICLES
// ============================================================

function createCar(
x,
z,
rotation,
color
) {

const car =
new THREE.Group();

car.position.set(
x,
-1.7,
z
);

car.rotation.y =
rotation;

scene.add(car);

const body =
makePhysical(
color,
0.42,
0.28,
0.25
);

makeBox(
0,
0.7,
0,
3.1,
0.72,
5.4,
body,
car
);

makeBox(
0,
1.3,
-0.2,
2.6,
0.8,
2.8,
body,
car
);

const glass =
new THREE.MeshPhysicalMaterial({
color: 0x26363b,
roughness: 0.15,
metalness: 0.1
});

makeBox(
0,
1.35,
-0.2,
2.25,
0.55,
2.35,
glass,
car
);

const wheel =
makeMaterial(
0x171919,
0.75,
0.1
);

for (
const wx of [-1.45, 1.45]
) {

for (
const wz of [-1.75, 1.75]
) {

const w =
makeCylinder(
wx,
0.4,
wz,
0.45,
0.45,
0.28,
wheel,
car
);

w.rotation.z =
Math.PI / 2;
}
}
}

function createVehicles() {

createCar(
-5,
-20,
0,
0x555e62
);

createCar(
5,
-34,
Math.PI,
0x77716a
);

createCar(
-5,
-76,
0,
0x4b5558
);

createCar(
5,
-91,
Math.PI,
0x67635e
);

createCar(
5,
-111,
Math.PI,
0x4f5756
);
}

// ============================================================
// VEGETATION
// ============================================================

function createTree(
x,
z,
scale = 1
) {

const tree =
new THREE.Group();

tree.position.set(
x,
-2,
z
);

tree.scale.setScalar(
scale
);

scene.add(tree);

const trunk =
makeMaterial(
0x4c4035,
0.96
);

const leaves =
makeMaterial(
0x39483d,
0.98
);

makeCylinder(
0,
2,
0,
0.2,
0.3,
4,
trunk,
tree
);

makeSphere(
-0.4,
4.3,
0,
1.25,
leaves,
tree
);

makeSphere(
0.5,
4.5,
0.1,
1.45,
leaves,
tree
);

makeSphere(
0,
5.2,
-0.3,
1.15,
leaves,
tree
);
}

function createVegetation() {

const positions = [
[-24,15,1],
[25,20,1.1],
[-26,-5,.8],
[26,-34,1.1],
[-25,-55,.9],
[26,-75,1],
[-26,-100,1.1],
[25,-122,.9],
[-27,-145,1]
];

positions.forEach(
p => createTree(
p[0],
p[1],
p[2]
)
);

const weeds =
makeMaterial(
0x465540,
0.99
);

for (
let i = 0;
i < 130;
i++
) {

const x =
THREE.MathUtils.randFloat(
-65,
65
);

const z =
THREE.MathUtils.randFloat(
-155,
40
);

if (
Math.abs(x) < 10
) {
continue;
}

const h =
THREE.MathUtils.randFloat(
0.15,
0.7
);

const weed =
makeBox(
x,
-1.8 + h / 2,
z,
0.035,
h,
0.035,
weeds
);

weed.rotation.y =
Math.random() *
Math.PI;
}
}

// ============================================================
// DEBRIS
// ============================================================

function createDebris() {

const concrete =
makeMaterial(
0x555957,
0.95
);

const metal =
makeMaterial(
0x3d4444,
0.72,
0.55
);

for (
let i = 0;
i < 90;
i++
) {

const x =
THREE.MathUtils.randFloat(
-8,
8
);

const z =
THREE.MathUtils.randFloat(
-145,
35
);

if (
Math.abs(x) < 3
) {
continue;
}

const w =
THREE.MathUtils.randFloat(
0.15,
1.4
);

const h =
THREE.MathUtils.randFloat(
0.08,
0.5
);

const d =
THREE.MathUtils.randFloat(
0.15,
1
);

const object =
makeBox(
x,
-1.9 + h / 2,
z,
w,
h,
d,
Math.random() > .65
? metal
: concrete
);

object.rotation.set(
Math.random() * .5,
Math.random() *
Math.PI,
Math.random() * .5
);
}
}

// ============================================================
// STREET LIGHTS
// ============================================================

function createStreetLight(
x,
z
) {

const group =
new THREE.Group();

group.position.set(
x,
-2,
z
);

scene.add(group);

const pole =
makeMaterial(
0x4c5251,
0.58,
0.4
);

makeCylinder(
0,
4,
0,
0.09,
0.13,
8,
pole,
group
);

const side =
x < 0 ? -1 : 1;

makeBox(
side * 0.75,
7.65,
0,
1.5,
0.12,
0.12,
pole,
group
);

const lampMat =
new THREE.MeshStandardMaterial({
color: 0xffd28c,
emissive: 0xffa14d,
emissiveIntensity: 1.7
});

makeBox(
side * 1.45,
7.52,
0,
0.48,
0.18,
0.32,
lampMat,
group
);

const light =
new THREE.PointLight(
0xffb96c,
1.0,
15
);

light.position.set(
side * 1.45,
7.35,
0
);

group.add(light);
}

function createStreetLights() {

for (
let z = 45;
z > -140;
z -= 22
) {

createStreetLight(
-11,
z
);

createStreetLight(
11,
z - 8
);
}
}

// ============================================================
// PIER
// ============================================================

function createPier() {

const pier =
new THREE.Group();

pier.position.set(
0,
-2,
-150
);

scene.add(
pier
);

const deck =
makePhysical(
0x665f55,
0.82,
0.04
);

makeBox(
0,
0.2,
0,
38,
0.45,
50,
deck,
pier
);

const rail =
makeMaterial(
0x505756,
0.58,
0.45
);

for (
let z = -23;
z <= 23;
z += 3
) {

makeCylinder(
-18,
1,
z,
0.055,
0.07,
2,
rail,
pier
);

makeCylinder(
18,
1,
z,
0.055,
0.07,
2,
rail,
pier
);
}

makeBox(
-18,
1.9,
0,
0.1,
0.1,
50,
rail,
pier
);

makeBox(
18,
1.9,
0,
0.1,
0.1,
50,
rail,
pier
);

const post =
makeMaterial(
0x4b4e4c,
0.9
);

for (
let z = -21;
z <= 21;
z += 7
) {

makeCylinder(
-13,
-3.8,
z,
0.35,
0.45,
7,
post,
pier
);

makeCylinder(
13,
-3.8,
z,
0.35,
0.45,
7,
post,
pier
);
}
}

// ============================================================
// PIER LIGHTS
// ============================================================

function createPierLights() {

const pole =
makeMaterial(
0x4b5050,
0.6,
0.4
);

const lamp =
new THREE.MeshStandardMaterial({
color: 0xffd18a,
emissive: 0xff9e4d,
emissiveIntensity: 2
});

const positions = [
[-15,-145],
[15,-145],
[-15,-160],
[15,-160],
[-15,-174],
[15,-174]
];

positions.forEach(
p => {

makeCylinder(
p[0],
2.4,
p[1],
0.07,
0.1,
4.8,
pole
);

makeBox(
p[0],
4.8,
p[1],
0.38,
0.18,
0.38,
lamp
);

const light =
new THREE.PointLight(
0xffb96d,
0.85,
12
);

light.position.set(
p[0],
4.5,
p[1]
);

scene.add(light);
}
);
}

// ============================================================
// WATER
// ============================================================

function createWater() {

const geometry =
new THREE.PlaneGeometry(
220,
130,
80,
50
);

const material =
new THREE.MeshPhysicalMaterial({
color: 0x315762,
roughness: 0.2,
metalness: 0.18,
clearcoat: 0.6,
clearcoatRoughness: 0.2
});

water =
new THREE.Mesh(
geometry,
material
);

water.rotation.x =
-Math.PI / 2;

water.position.set(
0,
-1.8,
-178
);

scene.add(
water
);
}

function updateWater(
time
) {

if (!water)
return;

const position =
water.geometry
.attributes
.position;

for (
let i = 0;
i < position.count;
i++
) {

const x =
position.getX(i);

const y =
position.getY(i);

position.setZ(
i,
Math.sin(
x * .055 +
time * .7
) * .14 +
Math.sin(
y * .08 +
time * .5
) * .08
);
}

position.needsUpdate =
true;
}

// ============================================================
// BOAT
// ============================================================

function createBoat() {

const boat =
new THREE.Group();

boat.position.set(
13,
-0.7,
-177
);

boat.rotation.y =
-0.15;

scene.add(boat);

makeBox(
0,
0,
0,
4,
.65,
9,
makePhysical(
0x394449,
.42,
.3
),
boat
);

makeBox(
0,
.45,
0,
3.1,
.35,
6.8,
makeMaterial(
0x77736a,
.85
),
boat
);

makeCylinder(
0,
1.6,
0,
.055,
.07,
3,
makeMaterial(
0x3f4646,
.6,
.4
),
boat
);
}

// ============================================================
// ATMOSPHERIC PARTICLES
// ============================================================

let dustParticles = null;

function createDust() {

const geometry =
new THREE.BufferGeometry();

const positions = [];

for (
let i = 0;
i < 650;
i++
) {

positions.push(
THREE.MathUtils.randFloat(
-50,
50
),
THREE.MathUtils.randFloat(
-1,
11
),
THREE.MathUtils.randFloat(
-165,
40
)
);
}

geometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(
positions,
3
)
);

dustParticles =
new THREE.Points(
geometry,
new THREE.PointsMaterial({
color: 0xc0c6c3,
size: .035,
transparent: true,
opacity: .25,
depthWrite: false
})
);

scene.add(
dustParticles
);
}

function updateDust(
time
) {

if (!dustParticles)
return;

const position =
dustParticles.geometry
.attributes
.position;

for (
let i = 0;
i < position.count;
i++
) {

let y =
position.getY(i);

y += .0018;

if (y > 11)
y = -1;

position.setY(
i,
y
);

position.setX(
i,
position.getX(i) +
Math.sin(
time * .2 + i
) * .0005
);
}

position.needsUpdate =
true;
}

// ============================================================
// PLAYER
// ============================================================

function createPlayer() {

player = {
position:
new THREE.Vector3(
0,
PLAYER_HEIGHT,
28
)
};

camera.position.copy(
player.position
);
}

// ============================================================
// FLASHLIGHT
// ============================================================

function createFlashlight() {

flashlight =
new THREE.SpotLight(
0xeaf3ff,
3.8,
30,
Math.PI / 7,
.4,
1.3
);

flashlight.castShadow =
true;

flashlight.shadow.mapSize.width =
1024;

flashlight.shadow.mapSize.height =
1024;

flashlightTarget =
new THREE.Object3D();

scene.add(
flashlightTarget
);

flashlight.target =
flashlightTarget;

scene.add(
flashlight
);
}

function updateFlashlight() {

if (!flashlight)
return;

flashlight.position.copy(
camera.position
);

const direction =
new THREE.Vector3(
0,
0,
-1
);

direction.applyQuaternion(
camera.quaternion
);

flashlightTarget.position.copy(
camera.position
);

flashlightTarget.position.add(
direction.multiplyScalar(
12
)
);
}

// ============================================================
// CHARACTERS
// ============================================================

function createCharacter(
shirtColor,
scale = 1
) {

const group =
new THREE.Group();

group.scale.setScalar(
scale
);

const skin =
makePhysical(
0xb98569,
.72,
0,
.12
);

const shirt =
makePhysical(
shirtColor,
.82,
.02
);

const pants =
makeMaterial(
0x252a2b,
.92
);

const hair =
makeMaterial(
0x202020,
.96
);

// Body

makeBox(
0,
1.45,
0,
.72,
1.35,
.42,
shirt,
group
);

// Head

makeSphere(
0,
2.45,
0,
.29,
skin,
group
);

// Hair

makeSphere(
0,
2.63,
-.01,
.30,
hair,
group
);

// Legs

makeBox(
-.19,
.48,
0,
.30,
.95,
.34,
pants,
group
);

makeBox(
.19,
.48,
0,
.30,
.95,
.34,
pants,
group
);

// Arms

const armL =
makeCylinder(
-.48,
1.45,
0,
.11,
.13,
1.2,
shirt,
group
);

const armR =
makeCylinder(
.48,
1.45,
0,
.11,
.13,
1.2,
shirt,
group
);

armL.rotation.z =
-.08;

armR.rotation.z =
.08;

group.userData.armL =
armL;

group.userData.armR =
armR;

return group;
}

function createDaniel() {

daniel =
createCharacter(
0x39474a
);

daniel.position.set(
0,
-2,
-126
);

daniel.rotation.y =
Math.PI;

daniel.visible =
false;

scene.add(
daniel
);
}

// ============================================================
// UI
// ============================================================

function showMessage(
text,
duration = 4500
) {

let element =
document.getElementById(
"message"
);

if (!element) {

element =
document.createElement(
"div"
);

element.id =
"message";

element.style.position =
"fixed";

element.style.left =
"50%";

element.style.bottom =
"11%";

element.style.transform =
"translateX(-50%)";

element.style.width =
"90%";

element.style.maxWidth =
"900px";

element.style.textAlign =
"center";

element.style.color =
"#fff";

element.style.fontFamily =
"Arial,sans-serif";

element.style.fontSize =
"clamp(18px,3vw,28px)";

element.style.lineHeight =
"1.7";

element.style.textShadow =
"0 3px 15px rgba(0,0,0,.95)";

element.style.zIndex =
"5000";

element.style.pointerEvents =
"none";

element.style.transition =
"opacity .6s";

document.body.appendChild(
element
);
}

element.innerHTML =
text;

element.style.opacity =
"1";

clearTimeout(
element._timer
);

element._timer =
setTimeout(
() => {
element.style.opacity =
"0";
},
duration
);
}

function createHUD() {

let element =
document.getElementById(
"hud"
);

if (!element) {

element =
document.createElement(
"div"
);

element.id =
"hud";

element.style.position =
"fixed";

element.style.left =
"18px";

element.style.top =
"18px";

element.style.color =
"#fff";

element.style.fontFamily =
"Arial,sans-serif";

element.style.fontSize =
"13px";

element.style.lineHeight =
"1.5";

element.style.textShadow =
"0 2px 8px #000";

element.style.zIndex =
"3000";

element.style.pointerEvents =
"none";

document.body.appendChild(
element
);
}

element.innerHTML =
"TUEN MUN — FIVE YEARS AFTER<br>" +
"目標：尋找 Daniel";
}

// ============================================================
// AUDIO
// ============================================================

function initAudio() {

if (audioCtx)
return;

try {

const AudioContext =
window.AudioContext ||
window.webkitAudioContext;

if (!AudioContext)
return;

audioCtx =
new AudioContext();

audioMaster =
audioCtx.createGain();

audioMaster.gain.value =
0.12;

audioMaster.connect(
audioCtx.destination
);

// Wind noise

const buffer =
audioCtx.createBuffer(
1,
audioCtx.sampleRate * 2,
audioCtx.sampleRate
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

const source =
audioCtx.createBufferSource();

source.buffer =
buffer;

source.loop =
true;

const filter =
audioCtx.createBiquadFilter();

filter.type =
"lowpass";

filter.frequency.value =
750;

const gain =
audioCtx.createGain();

gain.gain.value =
0.025;

source
.connect(filter)
.connect(gain)
.connect(audioMaster);

source.start();

} catch (error) {

console.warn(
"Audio unavailable",
error
);
}
}

function playTone(
frequency,
duration = .5,
volume = .025
) {

if (!audioCtx ||
!audioMaster)
return;

try {

const oscillator =
audioCtx.createOscillator();

const gain =
audioCtx.createGain();

oscillator.type =
"sine";

oscillator.frequency.value =
frequency;

gain.gain.setValueAtTime(
.0001,
audioCtx.currentTime
);

gain.gain.exponentialRampToValueAtTime(
volume,
audioCtx.currentTime + .03
);

gain.gain.exponentialRampToValueAtTime(
.0001,
audioCtx.currentTime +
duration
);

oscillator
.connect(gain)
.connect(audioMaster);

oscillator.start();

oscillator.stop(
audioCtx.currentTime +
duration
);

} catch (error) {}
}

// ============================================================
// CANTONESE VOICE
// ============================================================

function speak(
text,
rate = .9,
pitchValue = 1
) {

if (
!("speechSynthesis" in window)
) {
return;
}

try {

speechSynthesis.cancel();

const utterance =
new SpeechSynthesisUtterance(
text
);

utterance.lang =
"zh-HK";

utterance.rate =
rate;

utterance.pitch =
pitchValue;

utterance.volume =
.8;

const voices =
speechSynthesis.getVoices();

const cantonese =
voices.find(
voice =>
voice.lang &&
(
voice.lang
.toLowerCase()
.includes(
"zh-hk"
) ||
voice.lang
.toLowerCase()
.includes(
"yue"
)
)
);

if (cantonese) {
utterance.voice =
cantonese;
}

speechSynthesis.speak(
utterance
);

} catch (error) {

console.warn(
"Speech unavailable",
error
);
}
}

// ============================================================
// START GAME
// ============================================================

function startGame() {

if (gameStarted)
return;

gameStarted =
true;

if (startScreen) {

startScreen.style.display =
"none";

startScreen.style.pointerEvents =
"none";
}

initAudio();

if (
audioCtx &&
audioCtx.state ===
"suspended"
) {

audioCtx.resume()
.catch(() => {});
}

createHUD();

showMessage(
"五年後，屯門碼頭。<br>" +
"Amy 開始尋找失聯已久嘅 Daniel。",
5500
);

speak(
"Daniel……你仲喺唔喺度？"
);
}

// ============================================================
// INPUT
// ============================================================

function setupInput() {

// Start button

document.addEventListener(
"pointerdown",
event => {

const target =
event.target;

if (
target &&
(
target.id ===
"startButton" ||
target.closest?.(
"#startButton"
)
)
) {

event.preventDefault();
event.stopPropagation();

startGame();
}

},
true
);

document.addEventListener(
"click",
event => {

const target =
event.target;

if (
target &&
(
target.id ===
"startButton" ||
target.closest?.(
"#startButton"
)
)
) {

event.preventDefault();
event.stopPropagation();

startGame();
}

},
true
);

// Keyboard

window.addEventListener(
"keydown",
event => {

keys[
event.code
] = true;

if (
[
"KeyW",
"KeyA",
"KeyS",
"KeyD",
"ArrowUp",
"ArrowDown",
"ArrowLeft",
"ArrowRight",
"Space"
].includes(
event.code
)
) {

event.preventDefault();
}
}
);

window.addEventListener(
"keyup",
event => {

keys[
event.code
] = false;
}
);

// Mouse

renderer.domElement.addEventListener(
"click",
() => {

if (
gameStarted &&
!cinematic &&
!ending
) {

try {

renderer.domElement
.requestPointerLock();

} catch (error) {}
}
}
);

document.addEventListener(
"mousemove",
event => {

if (
document.pointerLockElement !==
renderer.domElement
) {
return;
}

if (
!gameStarted ||
cinematic ||
ending
) {
return;
}

yaw -=
event.movementX *
.0022;

pitch -=
event.movementY *
.0018;

pitch =
THREE.MathUtils.clamp(
pitch,
-1.15,
1.15
);
}
);

// Touch

renderer.domElement.addEventListener(
"touchstart",
event => {

if (!gameStarted)
return;

if (
event.touches.length === 1
) {

touchLook.active =
true;

touchLook.x =
event.touches[0]
.clientX;

touchLook.y =
event.touches[0]
.clientY;
}

},
{
passive: true
}
);

renderer.domElement.addEventListener(
"touchmove",
event => {

if (
!touchLook.active ||
!gameStarted ||
cinematic ||
ending
) {
return;
}

const touch =
event.touches[0];

const dx =
touch.clientX -
touchLook.x;

const dy =
touch.clientY -
touchLook.y;

yaw -=
dx * .005;

pitch -=
dy * .003;

pitch =
THREE.MathUtils.clamp(
pitch,
-1.15,
1.15
);

touchLook.x =
touch.clientX;

touchLook.y =
touch.clientY;

},
{
passive: true
}
);

renderer.domElement.addEventListener(
"touchend",
() => {

touchLook.active =
false;
}
);
}

// ============================================================
// PLAYER MOVEMENT
// ============================================================

function updatePlayer(
delta
) {

if (
!gameStarted ||
cinematic ||
ending
) {
return;
}

let forward = 0;
let side = 0;

if (
keys.KeyW ||
keys.ArrowUp
) {
forward++;
}

if (
keys.KeyS ||
keys.ArrowDown
) {
forward--;
}

if (
keys.KeyA ||
keys.ArrowLeft
) {
side--;
}

if (
keys.KeyD ||
keys.ArrowRight
) {
side++;
}

const direction =
new THREE.Vector3(
0,
0,
-1
);

direction.applyQuaternion(
camera.quaternion
);

direction.y = 0;

direction.normalize();

const right =
new THREE.Vector3(
direction.z,
0,
-direction.x
);

const movement =
new THREE.Vector3();

movement.addScaledVector(
direction,
forward
);

movement.addScaledVector(
right,
side
);

if (
movement.lengthSq() > 0
) {

movement.normalize();

const speed =
keys.ShiftLeft ||
keys.ShiftRight
? RUN_SPEED
: WALK_SPEED;

player.position.addScaledVector(
movement,
speed * delta
);
}

player.position.x =
THREE.MathUtils.clamp(
player.position.x,
-8.5,
8.5
);

player.position.z =
THREE.MathUtils.clamp(
player.position.z,
WORLD_MIN_Z,
WORLD_MAX_Z
);

player.position.y =
PLAYER_HEIGHT;

camera.position.copy(
player.position
);

camera.rotation.order =
"YXZ";

camera.rotation.y =
yaw;

camera.rotation.x =
pitch;

updateFlashlight();
}

// ============================================================
// STORY
// ============================================================

function updateStory() {

if (
!gameStarted ||
cinematic ||
ending
) {
return;
}

const z =
camera.position.z;

if (
storyStep === 0 &&
z < -42
) {

storyStep = 1;

showMessage(
"街道已經被植物同荒廢車輛吞噬。",
4500
);

speak(
"呢度已經完全變晒。"
);
}

else if (
storyStep === 1 &&
z < -62
) {

storyStep = 2;

showMessage(
"前面係荒廢咗嘅輕鐵站……",
4500
);

speak(
"前面係輕鐵站……"
);
}

else if (
storyStep === 2 &&
z < -82
) {

storyStep = 3;

showMessage(
"收音機突然收到微弱訊號……",
4500
);

speak(
"有人收到嗎……請去碼頭。"
);

playTone(
220,
.8,
.025
);
}

else if (
storyStep === 3 &&
z < -105
) {

storyStep = 4;

showMessage(
"無線電：「Amy……如果係你……嚟碼頭。」",
5000
);

speak(
"Amy……如果係你……嚟碼頭。"
);
}

else if (
storyStep === 4 &&
z < -120
) {

storyStep = 5;

startReunion();
}
}

// ============================================================
// REUNION
// ============================================================

function startReunion() {

cinematic =
true;

reunionStart =
performance.now();

if (!daniel) {
createDaniel();
}

daniel.visible =
true;

daniel.position.set(
0,
-2,
-126
);

daniel.rotation.y =
Math.PI;

showMessage(
"遠處一個熟悉嘅身影慢慢轉身……",
5000
);

speak(
"Daniel……係你？"
);

playTone(
330,
1,
.03
);
}

function updateReunion(
now
) {

if (!cinematic)
return;

const elapsed =
now -
reunionStart;

// --------------------------------------------------------
// 0 — 4 sec
// Camera approaches
// --------------------------------------------------------

if (
elapsed < 4000
) {

const target =
new THREE.Vector3(
0,
1.9,
-119
);

camera.position.lerp(
target,
.025
);

camera.lookAt(
0,
1.45,
-126
);
}

// --------------------------------------------------------
// 4 — 8 sec
// Daniel turns
// --------------------------------------------------------

else if (
elapsed < 8000
) {

const p =
THREE.MathUtils.clamp(
(elapsed - 4000) /
4000,
0,
1
);

daniel.rotation.y =
THREE.MathUtils.lerp(
Math.PI,
Math.PI * 0.5,
p
);

camera.position.set(
0,
2,
-119
);

camera.lookAt(
0,
1.5,
-126
);
}

// --------------------------------------------------------
// 8 — 12 sec
// Daniel walks toward Amy
// --------------------------------------------------------

else if (
elapsed < 12000
) {

const p =
THREE.MathUtils.clamp(
(elapsed - 8000) /
4000,
0,
1
);

daniel.position.z =
THREE.MathUtils.lerp(
-126,
-121,
p
);

camera.position.set(
2.8 -
p * 1.4,
2.1,
-120.5 -
p * 1.0
);

camera.lookAt(
0,
1.45,
-121
);
}

// --------------------------------------------------------
// 12 — 16 sec
// Reunion close-up
// --------------------------------------------------------

else if (
elapsed < 16000
) {

camera.position.set(
1.35,
2.0,
-122.7
);

camera.lookAt(
0,
1.5,
-120.8
);
}

// --------------------------------------------------------
// 16 — 20 sec
// Couple moment
// --------------------------------------------------------

else if (
elapsed < 20000
) {

const p =
THREE.MathUtils.clamp(
(elapsed - 16000) /
4000,
0,
1
);

camera.position.set(
1.35 -
p * .9,
2.0 +
p * .15,
-122.7 -
p * .8
);

camera.lookAt(
0,
1.45,
-121
);
}

// --------------------------------------------------------
// End reunion
// --------------------------------------------------------

else {

showMessage(
"Amy 同 Daniel 終於再次相遇。",
5000
);

speak(
"我等咗你好耐。"
);

cinematic =
false;

setTimeout(
startEnding,
5000
);
}
}

// ============================================================
// ENDING
// ============================================================

function startEnding() {

ending =
true;

endingStart =
performance.now();

if (
document.pointerLockElement
) {

try {
document.exitPointerLock();
} catch (error) {}
}

createSettlement();

showEndingText(
"FIVE YEARS LATER"
);

setTimeout(
() => {

showEndingText(
"屯門海旁重新建立起一個小型生存社區。"
);

},
4500
);

setTimeout(
() => {

showEndingText(
"Amy 同 Daniel 成為社區嘅核心。"
);

},
9000
);

setTimeout(
() => {

showEndingText(
"佢哋結婚，建立咗屬於自己嘅家庭。"
);

},
13500
);

setTimeout(
() => {

showEndingText(
"<strong>THE WORLD ENDED.</strong><br>" +
"<strong>WE BEGAN AGAIN.</strong>"
);

speak(
"世界曾經終結，但我哋重新開始。"
);

},
19000
);
}

// ============================================================
// SETTLEMENT
// ============================================================

function createSettlement() {

const group =
new THREE.Group();

scene.add(
group
);

const wood =
makeMaterial(
0x625140,
.94
);

const canvas =
makeMaterial(
0xa59c87,
.98
);

const metal =
makeMaterial(
0x464c4b,
.68,
.4
);

// Shelters

for (
let i = 0;
i < 5;
i++
) {

const x =
-10 +
i * 5;

makeBox(
x,
-1.5,
-146,
4,
.35,
4,
wood,
group
);

makeBox(
x,
.7,
-146,
4,
.12,
4,
canvas,
group
);
}

// Fence

for (
let x = -18;
x <= 18;
x += 2.5
) {

makeCylinder(
x,
-.2,
-138,
.06,
.08,
1.7,
metal,
group
);
}

makeBox(
0,
.7,
-138,
36,
.08,
.08,
metal,
group
);

// Water tanks

for (
let i = 0;
i < 2;
i++
) {

makeCylinder(
10 + i * 2,
0,
-143,
.8,
.9,
2.2,
metal,
group
);
}

// Solar panels

const solar =
makeMaterial(
0x263943,
.28,
.35
);

for (
let i = 0;
i < 4;
i++
) {

const panel =
makeBox(
-10 + i * 3,
2.1,
-143,
2.2,
.08,
1.3,
solar,
group
);

panel.rotation.x =
-.25;
}

// Fire

const fireLight =
new THREE.PointLight(
0xff9b45,
2.8,
14
);

fireLight.position.set(
0,
.5,
-153
);

group.add(
fireLight
);

makeSphere(
0,
-1.1,
-153,
.35,
new THREE.MeshBasicMaterial({
color: 0xff8a38
}),
group
);

// People

const people = [
[-14,-151],
[-8,-158],
[8,-158],
[14,-151],
[5,-141]
];

people.forEach(
p => {

const person =
createCharacter(
Math.random() > .5
? 0x4a5552
: 0x55504a,
.9
);

person.position.set(
p[0],
-2,
p[1]
);

person.rotation.y =
Math.random() *
Math.PI * 2;

group.add(
person
);
}
);

// Amy

const amy =
createCharacter(
0x4c5957
);

amy.position.set(
-1.2,
-2,
-148
);

amy.rotation.y =
.25;

group.add(
amy
);

// Daniel

const finalDaniel =
createCharacter(
0x39474a
);

finalDaniel.position.set(
1.2,
-2,
-148
);

finalDaniel.rotation.y =
-.25;

group.add(
finalDaniel
);

// Child

const child =
createCharacter(
0x68635b,
.55
);

child.position.set(
0,
-2,
-146.8
);

child.rotation.y =
Math.PI;

group.add(
child
);

// Final camera

camera.position.set(
17,
7,
-133
);

camera.lookAt(
0,
.5,
-150
);
}

// ============================================================
// ENDING TEXT
// ============================================================

function showEndingText(
text
) {

let overlay =
document.getElementById(
"endingOverlay"
);

if (!overlay) {

overlay =
document.createElement(
"div"
);

overlay.id =
"endingOverlay";

overlay.style.position =
"fixed";

overlay.style.inset =
"0";

overlay.style.display =
"flex";

overlay.style.alignItems =
"center";

overlay.style.justifyContent =
"center";

overlay.style.textAlign =
"center";

overlay.style.padding =
"30px";

overlay.style.boxSizing =
"border-box";

overlay.style.background =
"rgba(0,0,0,.34)";

overlay.style.color =
"#fff";

overlay.style.fontFamily =
"Arial,sans-serif";

overlay.style.fontSize =
"clamp(20px,4vw,42px)";

overlay.style.lineHeight =
"1.7";

overlay.style.textShadow =
"0 3px 18px #000";

overlay.style.zIndex =
"8000";

overlay.style.pointerEvents =
"none";

document.body.appendChild(
overlay
);
}

overlay.innerHTML =
`<div>${text}</div>`;
}

// ============================================================
// ENDING CAMERA
// ============================================================

function updateEndingCamera(
time
) {

if (!ending)
return;

const elapsed =
time -
endingStart;

if (
elapsed < 8000
) {

const p =
THREE.MathUtils.clamp(
elapsed / 8000,
0,
1
);

camera.position.lerp(
new THREE.Vector3(
18 -
p * 5,
7 -
p * 2,
-134 -
p * 7
),
.015
);

camera.lookAt(
0,
.4,
-148
);
}

else if (
elapsed < 17000
) {

const p =
THREE.MathUtils.clamp(
(elapsed - 8000) /
9000,
0,
1
);

camera.position.lerp(
new THREE.Vector3(
13 -
p * 25,
5 +
p * .5,
-141 -
p * 28
),
.012
);

camera.lookAt(
0,
0,
-165
);
}

else {

camera.lookAt(
0,
0,
-165
);
}
}

// ============================================================
// RESIZE
// ============================================================

function setupResize() {

window.addEventListener(
"resize",
() => {

if (
!camera ||
!renderer
) {
return;
}

camera.aspect =
window.innerWidth /
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);
}
);
}

// ============================================================
// ANIMATION
// ============================================================

function animate() {

requestAnimationFrame(
animate
);

if (!clock)
return;

const delta =
Math.min(
clock.getDelta(),
.05
);

const time =
performance.now() * .001;

updateWater(
time
);

updateDust(
time
);

if (
gameStarted &&
!cinematic &&
!ending
) {

updatePlayer(
delta
);

updateStory();
}

if (cinematic) {

updateReunion(
performance.now()
);

if (daniel) {

const breathe =
1 +
Math.sin(
time * 1.7
) * .008;

daniel.scale.y =
breathe;
}
}

if (ending) {

updateEndingCamera(
performance.now()
);
}

renderer.render(
scene,
camera
);
}

// ============================================================
// INITIALIZATION
// ============================================================

function init() {

try {

createScene();

createLighting();
createGround();
createRoad();
createBuildings();
createLRT();
createStation();
createVehicles();
createVegetation();
createDebris();
createStreetLights();
createPier();
createPierLights();
createWater();
createBoat();
createDust();
createPlayer();
createFlashlight();
createDaniel();

setupInput();
setupResize();

if (startScreen) {

startScreen.style.display =
"flex";

startScreen.style.zIndex =
"9999";

startScreen.style.pointerEvents =
"auto";
}

if (startButton) {

startButton.style.zIndex =
"10000";

startButton.style.pointerEvents =
"auto";

startButton.disabled =
false;

startButton.style.cursor =
"pointer";
}

animate();

console.log(
"AMY V8.1 READY"
);

} catch (error) {

console.error(
"AMY V8.1 INITIALIZATION ERROR:",
error
);

const errorBox =
document.createElement(
"div"
);

errorBox.style.position =
"fixed";

errorBox.style.inset =
"0";

errorBox.style.display =
"flex";

errorBox.style.alignItems =
"center";

errorBox.style.justifyContent =
"center";

errorBox.style.background =
"#111";

errorBox.style.color =
"#fff";

errorBox.style.fontFamily =
"Arial,sans-serif";

errorBox.style.textAlign =
"center";

errorBox.style.padding =
"30px";

errorBox.style.zIndex =
"99999";

errorBox.innerHTML =
"遊戲初始化失敗。<br>" +
"請重新整理頁面。";

document.body.appendChild(
errorBox
);
}
}

// ============================================================
// DOM READY
// ============================================================

if (
document.readyState ===
"loading"
) {

document.addEventListener(
"DOMContentLoaded",
init,
{
once: true
}
);

} else {

init();
}

// ============================================================
// SAFETY
// ============================================================

window.addEventListener(
"error",
event => {

console.error(
"AMY runtime error:",
event.error ||
event.message
);
}
);

window.addEventListener(
"unhandledrejection",
event => {

console.error(
"AMY promise error:",
event.reason
);
}
);

// ============================================================
// END
// ============================================================
