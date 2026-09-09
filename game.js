import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

/* =========================================================
AMY - FIVE YEARS AFTER
V7
Post-apocalyptic Tuen Mun Ferry Pier
========================================================= */

const VERSION = "V7.0";

let scene;
let camera;
let renderer;
let clock;

let player;
let flashlight;
let flashlightTarget;

let audio = {
ctx: null,
master: null,
ocean: null,
wind: null,
radio: null,
stepTimer: 0,
enabled: false
};

let gameStarted = false;
let endingStarted = false;
let endingStage = 0;

let currentStory = -1;
let lastStepTime = 0;

const keys = {};
const touch = {
active: false,
x: 0,
y: 0,
lookX: 0,
lookY: 0
};

const state = {
yaw: 0,
pitch: 0,
speed: 3.8,
sprint: false,
flashlight: true,
messageTimer: null,
radioPlayed: false,
danielPlayed: false,
endingTimer: 0
};

const materials = {};

const waterData = {
mesh: null,
base: []
};

const lights = {
street: [],
station: [],
buildings: []
};


/* =========================================================
DOM
========================================================= */

function getOrCreate(id, tag = "div") {
let el = document.getElementById(id);

if (!el) {
el = document.createElement(tag);
el.id = id;
document.body.appendChild(el);
}

return el;
}

const gameUI = getOrCreate("game");
const objectiveUI = getOrCreate("objective");
const messageUI = getOrCreate("message");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");


/* =========================================================
BASIC UI
========================================================= */

function setupUI() {

Object.assign(gameUI.style, {
position: "fixed",
inset: "0",
pointerEvents: "none",
zIndex: "5"
});

Object.assign(objectiveUI.style, {
position: "fixed",
left: "20px",
top: "20px",
color: "#ffffff",
fontFamily: "Arial, sans-serif",
fontSize: "16px",
lineHeight: "1.5",
padding: "10px 14px",
background: "rgba(0,0,0,.48)",
borderRadius: "8px",
textShadow: "0 1px 4px #000",
maxWidth: "330px",
pointerEvents: "none",
zIndex: "10"
});

Object.assign(messageUI.style, {
position: "fixed",
left: "50%",
bottom: "13%",
transform: "translateX(-50%)",
color: "#ffffff",
fontFamily: "Arial, sans-serif",
fontSize: "20px",
lineHeight: "1.5",
textAlign: "center",
padding: "12px 22px",
background: "rgba(0,0,0,.62)",
borderRadius: "10px",
textShadow: "0 2px 5px #000",
maxWidth: "80%",
opacity: "0",
transition: "opacity .4s",
pointerEvents: "none",
zIndex: "20"
});

objectiveUI.innerHTML = "OBJECTIVE<br>尋找 Daniel";

if (startScreen) {
startScreen.style.zIndex = "100";
}
}


/* =========================================================
MATERIALS
========================================================= */

function createMaterials() {

materials.ground = new THREE.MeshStandardMaterial({
color: 0x242628,
roughness: 0.92,
metalness: 0.02
});

materials.road = new THREE.MeshStandardMaterial({
color: 0x17191b,
roughness: 0.95
});

materials.concrete = new THREE.MeshStandardMaterial({
color: 0x696b68,
roughness: 0.9
});

materials.concreteDark = new THREE.MeshStandardMaterial({
color: 0x414342,
roughness: 0.94
});

materials.wall = new THREE.MeshStandardMaterial({
color: 0x77756e,
roughness: 0.9
});

materials.wallDark = new THREE.MeshStandardMaterial({
color: 0x464744,
roughness: 0.92
});

materials.window = new THREE.MeshStandardMaterial({
color: 0x182326,
roughness: 0.45,
metalness: 0.1
});

materials.windowLit = new THREE.MeshStandardMaterial({
color: 0xb59d62,
emissive: 0x6e5425,
emissiveIntensity: 0.55,
roughness: 0.6
});

materials.metal = new THREE.MeshStandardMaterial({
color: 0x505554,
roughness: 0.55,
metalness: 0.75
});

materials.rust = new THREE.MeshStandardMaterial({
color: 0x513d31,
roughness: 0.92,
metalness: 0.25
});

materials.green = new THREE.MeshStandardMaterial({
color: 0x3d6255,
roughness: 0.8
});

materials.orange = new THREE.MeshStandardMaterial({
color: 0xa16a36,
roughness: 0.82
});

materials.yellow = new THREE.MeshStandardMaterial({
color: 0xc1a34d,
roughness: 0.8
});

materials.white = new THREE.MeshStandardMaterial({
color: 0xd0d0c9,
roughness: 0.7
});

materials.lrtBlue = new THREE.MeshStandardMaterial({
color: 0x354f5b,
roughness: 0.6,
metalness: 0.25
});

materials.lrtYellow = new THREE.MeshStandardMaterial({
color: 0xc7a94d,
roughness: 0.62,
metalness: 0.2
});

materials.water = new THREE.MeshStandardMaterial({
color: 0x263e42,
roughness: 0.35,
metalness: 0.15,
transparent: true,
opacity: 0.82
});

materials.tree = new THREE.MeshStandardMaterial({
color: 0x26372d,
roughness: 0.98
});

materials.leaf = new THREE.MeshStandardMaterial({
color: 0x304b39,
roughness: 1
});

materials.neonGreen = new THREE.MeshStandardMaterial({
color: 0x648f61,
emissive: 0x243c22,
emissiveIntensity: 0.35
});
}


/* =========================================================
HELPERS
========================================================= */

function box(x, y, z, width, height, depth, material, parent = scene) {

const geometry = new THREE.BoxGeometry(width, height, depth);
const mesh = new THREE.Mesh(geometry, material);

mesh.position.set(x, y, z);
mesh.castShadow = true;
mesh.receiveShadow = true;

parent.add(mesh);

return mesh;
}


function cylinder(
x,
y,
z,
radius,
height,
material,
segments = 12,
parent = scene
) {

const geometry = new THREE.CylinderGeometry(
radius,
radius,
height,
segments
);

const mesh = new THREE.Mesh(geometry, material);

mesh.position.set(x, y, z);
mesh.castShadow = true;
mesh.receiveShadow = true;

parent.add(mesh);

return mesh;
}


function sphere(x, y, z, radius, material, parent = scene) {

const geometry = new THREE.SphereGeometry(radius, 12, 8);
const mesh = new THREE.Mesh(geometry, material);

mesh.position.set(x, y, z);
mesh.castShadow = true;
mesh.receiveShadow = true;

parent.add(mesh);

return mesh;
}


/* =========================================================
ENVIRONMENT
========================================================= */

function createGround() {

box(
0,
-0.55,
-60,
100,
1,
150,
materials.ground
);

box(
0,
-0.42,
-47,
34,
0.25,
80,
materials.road
);

// Road strips
for (let z = -8; z > -110; z -= 12) {

box(
0,
-0.27,
z,
0.18,
0.03,
5.5,
materials.yellow
);
}

// Pavements
box(
-17,
-0.1,
-60,
8,
0.3,
110,
materials.concrete
);

box(
17,
-0.1,
-60,
8,
0.3,
110,
materials.concrete
);
}


/* =========================================================
BUILDINGS
========================================================= */

function createBuilding(x, z, width, height, depth, dark = false) {

const building = new THREE.Group();

building.position.set(x, 0, z);

scene.add(building);

const wallMaterial = dark
? materials.wallDark
: materials.wall;

box(
0,
height / 2,
0,
width,
height,
depth,
wallMaterial,
building
);

// Roof
box(
0,
height + 0.15,
0,
width + 0.25,
0.3,
depth + 0.25,
materials.concreteDark,
building
);

const floors = Math.max(2, Math.floor(height / 3.2));
const columns = Math.max(2, Math.floor(width / 2.4));

for (let floor = 0; floor < floors; floor++) {

const y = 1.5 + floor * 3.1;

for (let c = 0; c < columns; c++) {

const px =
-width / 2 +
1.2 +
c * ((width - 2.4) / Math.max(1, columns - 1));

const lit =
((c + floor + Math.round(z)) % 7 === 0);

const windowMaterial =
lit ? materials.windowLit : materials.window;

box(
px,
y,
depth / 2 + 0.04,
0.85,
1.45,
0.08,
windowMaterial,
building
);

box(
px,
y,
-depth / 2 - 0.04,
0.85,
1.45,
0.08,
windowMaterial,
building
);
}
}

// Air conditioners
for (let floor = 0; floor < Math.min(floors, 6); floor++) {

const y = 1.0 + floor * 3.1;

box(
width / 2 - 0.55,
y,
depth / 2 + 0.28,
0.65,
0.45,
0.35,
materials.metal,
building
);

box(
-width / 2 + 0.55,
y + 0.2,
depth / 2 + 0.28,
0.65,
0.45,
0.35,
materials.metal,
building
);
}

// Vertical pipes
cylinder(
-width / 2 + 0.25,
height / 2,
depth / 2 + 0.18,
0.07,
height - 1,
materials.rust,
8,
building
);

return building;
}


function createCity() {

createBuilding(-26, -15, 15, 18, 18, false);
createBuilding(26, -18, 16, 23, 20, true);

createBuilding(-27, -43, 18, 25, 20, true);
createBuilding(27, -46, 18, 20, 22, false);

createBuilding(-28, -72, 19, 29, 21, false);
createBuilding(28, -70, 17, 22, 20, true);

createBuilding(-28, -100, 17, 17, 20, true);
createBuilding(27, -98, 20, 27, 22, false);

createBuilding(-30, -120, 20, 15, 20, false);
createBuilding(29, -118, 18, 18, 20, true);
}


/* =========================================================
LRT
========================================================= */

function createTrack(x, zStart, zEnd) {

const length = Math.abs(zEnd - zStart);
const z = (zStart + zEnd) / 2;

box(
x - 0.72,
-0.05,
z,
0.13,
0.1,
length,
materials.metal
);

box(
x + 0.72,
-0.05,
z,
0.13,
0.1,
length,
materials.metal
);

for (let p = zStart; p <= zEnd; p += 2.5) {

box(
x,
-0.16,
p,
2.1,
0.18,
0.22,
materials.concreteDark
);
}
}


function createLRTTracks() {

const xs = [-7.4, -4.7, -2.0, 2.0, 4.7, 7.4];

xs.forEach(x => {
createTrack(x, -8, -112);
});

// Central separation
box(
0,
0.05,
-60,
0.3,
0.25,
105,
materials.green
);
}


/* =========================================================
LRT STATION
========================================================= */

function createStation() {

// Platforms
for (const x of [-9.8, -1.35, 1.35, 9.8]) {

box(
x,
0.25,
-63,
1.75,
0.5,
78,
materials.concrete
);

box(
x,
0.56,
-63,
0.13,
0.62,
78,
materials.green
);

box(
x + (x > 0 ? -0.12 : 0.12),
0.59,
-63,
0.06,
0.65,
78,
materials.orange
);
}

// Canopy roof
box(
0,
5.1,
-63,
22,
0.35,
72,
materials.concreteDark
);

// Roof underside
box(
0,
4.88,
-63,
21,
0.12,
70,
materials.metal
);

// Supports
for (let z = -28; z >= -98; z -= 8) {

for (const x of [-10, 10]) {

box(
x,
2.5,
z,
0.38,
5,
0.38,
materials.concreteDark
);
}
}

// Cross beams
for (let z = -28; z >= -98; z -= 16) {

box(
0,
4.15,
z,
20.5,
0.28,
0.3,
materials.metal
);
}

createStationSigns();
createStationLights();
}


/* =========================================================
STATION SIGNS
========================================================= */

function createTextTexture(text, subtext = "") {

const canvas = document.createElement("canvas");
canvas.width = 1024;
canvas.height = 256;

const ctx = canvas.getContext("2d");

ctx.fillStyle = "#1f2524";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = "#87978c";
ctx.lineWidth = 8;
ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

ctx.fillStyle = "#eeeeea";
ctx.font = "bold 58px Arial";
ctx.textAlign = "center";
ctx.fillText(text, 512, 105);

ctx.font = "bold 34px Arial";
ctx.fillText(subtext, 512, 164);

const texture = new THREE.CanvasTexture(canvas);

return texture;
}


function createStationSigns() {

const texture = createTextTexture(
"屯門碼頭",
"TUEN MUN FERRY PIER"
);

const material = new THREE.MeshBasicMaterial({
map: texture
});

for (const z of [-37, -62, -87]) {

const sign = box(
0,
3.4,
z,
7,
1.75,
0.12,
material
);

sign.rotation.y = 0;
}
}


/* =========================================================
STATION LIGHTS
========================================================= */

function createStationLights() {

for (let z = -30; z >= -96; z -= 8) {

const light = new THREE.PointLight(
0xffe5b1,
0.7,
9,
2
);

light.position.set(0, 4.6, z);

scene.add(light);

lights.station.push(light);

box(
0,
4.45,
z,
0.8,
0.08,
0.15,
materials.windowLit
);
}
}


/* =========================================================
LRT TRAIN
========================================================= */

function createLRTTrain(x, z, direction = 1) {

const train = new THREE.Group();

train.position.set(x, 1.0, z);
train.rotation.y = direction > 0 ? 0 : Math.PI;

scene.add(train);

box(
0,
0.8,
0,
2.15,
1.7,
11,
materials.lrtBlue,
train
);

box(
0,
1.28,
0,
2.18,
0.45,
10.6,
materials.lrtYellow,
train
);

// Windows
for (let zz = -4.2; zz <= 4.2; zz += 2.1) {

box(
-1.09,
1.15,
zz,
0.05,
0.72,
1.45,
materials.window,
train
);

box(
1.09,
1.15,
zz,
0.05,
0.72,
1.45,
materials.window,
train
);
}

// Front / rear
box(
0,
1.18,
5.52,
1.75,
0.9,
0.08,
materials.window,
train
);

box(
0,
1.18,
-5.52,
1.75,
0.9,
0.08,
materials.window,
train
);

// Headlights
const lampMaterial = new THREE.MeshStandardMaterial({
color: 0xffffff,
emissive: 0xffffff,
emissiveIntensity: 2
});

box(
-0.58,
0.7,
5.57,
0.25,
0.25,
0.08,
lampMaterial,
train
);

box(
0.58,
0.7,
5.57,
0.25,
0.25,
0.08,
lampMaterial,
train
);

return train;
}


/* =========================================================
BUS TERMINAL
========================================================= */

function createBusTerminal() {

box(
13,
4.5,
-38,
9,
0.35,
22,
materials.concreteDark
);

for (const z of [-47, -39, -31]) {

box(
9,
2.1,
z,
0.35,
4.2,
0.35,
materials.metal
);

box(
17,
2.1,
z,
0.35,
4.2,
0.35,
materials.metal
);
}

const bus = new THREE.Group();

bus.position.set(14, 1.15, -47);

scene.add(bus);

box(
0,
0,
0,
3.2,
2.3,
10,
materials.lrtBlue,
bus
);

box(
0,
0.75,
0,
3.25,
0.7,
9.5,
materials.window,
bus
);

for (const z of [-3.5, -1.2, 1.2, 3.5]) {

cylinder(
-1.25,
-1.1,
z,
0.45,
0.22,
materials.metal,
16,
bus
);

cylinder(
1.25,
-1.1,
z,
0.45,
0.22,
materials.metal,
16,
bus
);
}
}


/* =========================================================
CARS
========================================================= */

function createCar(x, z, rotation = 0, abandoned = false) {

const car = new THREE.Group();

car.position.set(x, 0.45, z);
car.rotation.y = rotation;

scene.add(car);

const bodyMaterial = abandoned
? materials.rust
: materials.metal;

box(
0,
0.35,
0,
2.3,
0.7,
4.7,
bodyMaterial,
car
);

box(
0,
0.9,
-0.15,
1.7,
0.55,
2.2,
materials.window,
car
);

for (const zz of [-1.5, 1.5]) {

for (const xx of [-1.1, 1.1]) {

const wheel = cylinder(
xx,
-0.2,
zz,
0.42,
0.28,
materials.metal,
12,
car
);

wheel.rotation.z = Math.PI / 2;
}
}

return car;
}


function createCars() {

createCar(-13, -20, Math.PI / 2, true);
createCar(13, -28, -Math.PI / 2, true);

createCar(-13, -55, Math.PI / 2, false);
createCar(13, -68, -Math.PI / 2, true);

createCar(-13, -82, Math.PI / 2, true);
createCar(13, -91, -Math.PI / 2, false);

createCar(-13, -107, Math.PI / 2, true);
}


/* =========================================================
STREET LIGHTS
========================================================= */

function createStreetLight(x, z) {

const group = new THREE.Group();

group.position.set(x, 0, z);

scene.add(group);

cylinder(
0,
3.2,
0,
0.08,
6.4,
materials.metal,
8,
group
);

box(
x > 0 ? -0.45 : 0.45,
6.3,
0,
0.9,
0.1,
0.1,
materials.metal,
group
);

const light = new THREE.PointLight(
0xffdca4,
1.1,
13,
2
);

light.position.set(
x > 0 ? -0.5 : 0.5,
6.1,
0
);

group.add(light);

lights.street.push(light);

sphere(
x > 0 ? -0.5 : 0.5,
6.1,
0,
0.12,
materials.windowLit,
group
);
}


function createStreetLights() {

for (let z = -15; z >= -110; z -= 10) {

createStreetLight(-14.5, z);
createStreetLight(14.5, z + 4);
}
}


/* =========================================================
TREES
========================================================= */

function createTree(x, z, scale = 1) {

const group = new THREE.Group();

group.position.set(x, 0, z);
group.scale.setScalar(scale);

scene.add(group);

cylinder(
0,
1.4,
0,
0.25,
2.8,
materials.tree,
8,
group
);

sphere(
0,
3.1,
0,
1.3,
materials.leaf,
group
);

sphere(
-0.8,
2.7,
0.2,
0.8,
materials.leaf,
group
);

sphere(
0.8,
2.8,
-0.2,
0.85,
materials.leaf,
group
);
}


function createVegetation() {

createTree(-20, -22, 1.2);
createTree(20, -33, 1);
createTree(-21, -52, 0.9);
createTree(20, -61, 1.25);
createTree(-21, -78, 1.1);
createTree(20, -88, 0.85);
createTree(-21, -102, 1);
createTree(20, -109, 1.1);
}


/* =========================================================
DEBRIS
========================================================= */

function createDebris() {

for (let i = 0; i < 30; i++) {

const x =
THREE.MathUtils.randFloat(-16, 16);

const z =
THREE.MathUtils.randFloat(-110, -15);

const s =
THREE.MathUtils.randFloat(0.15, 0.6);

box(
x,
s / 2,
z,
s,
s,
s,
i % 3 === 0
? materials.rust
: materials.concreteDark
);
}

for (const z of [-35, -59, -82, -104]) {

cylinder(
-12,
0.7,
z,
0.55,
1.4,
materials.rust,
12
);
}
}


/* =========================================================
FERRY PIER
========================================================= */

function createPier() {

// Pier platform
box(
0,
0,
-112,
19,
0.5,
14,
materials.concrete
);

// Pier end
box(
0,
-0.1,
-121,
16,
0.4,
7,
materials.concreteDark
);

// Railings
for (let x = -8; x <= 8; x += 2) {

cylinder(
x,
1.0,
-118,
0.06,
2,
materials.metal,
8
);

cylinder(
x,
1.0,
-109,
0.06,
2,
materials.metal,
8
);
}

box(
0,
1.75,
-118,
16,
0.08,
0.08,
materials.metal
);

box(
0,
1.75,
-109,
16,
0.08,
0.08,
materials.metal
);

// Pier roof
box(
0,
4.6,
-112,
13,
0.3,
8,
materials.concreteDark
);

for (const x of [-6, 6]) {

box(
x,
2.3,
-112,
0.3,
4.6,
0.3,
materials.metal
);
}

// Ferry building
box(
0,
2,
-105,
11,
4,
5,
materials.wallDark
);

box(
0,
2,
-102.45,
8,
2.4,
0.1,
materials.window
);

createPierLights();
}


function createPierLights() {

for (const x of [-5, 0, 5]) {

const light = new THREE.PointLight(
0xffd8a0,
0.8,
10,
2
);

light.position.set(x, 4.2, -112);

scene.add(light);

lights.station.push(light);
}
}


/* =========================================================
WATER
========================================================= */

function createWater() {

const geometry = new THREE.PlaneGeometry(
90,
70,
50,
40
);

geometry.rotateX(-Math.PI / 2);

const position = geometry.attributes.position;

waterData.base = [];

for (let i = 0; i < position.count; i++) {

waterData.base.push({
x: position.getX(i),
y: position.getY(i),
z: position.getZ(i)
});
}

const mesh = new THREE.Mesh(
geometry,
materials.water
);

mesh.position.set(
0,
-0.35,
-137
);

mesh.receiveShadow = true;

scene.add(mesh);

waterData.mesh = mesh;
}


/* =========================================================
WATER UPDATE
========================================================= */

function updateWater(time) {

if (!waterData.mesh) return;

const position =
waterData.mesh.geometry.attributes.position;

for (let i = 0; i < position.count; i++) {

const base = waterData.base[i];

const wave =
Math.sin(
base.x * 0.18 +
time * 0.001
) * 0.12
+
Math.cos(
base.z * 0.13 +
time * 0.0007
) * 0.08;

position.setY(
i,
base.y + wave
);
}

position.needsUpdate = true;
}


/* =========================================================
ATMOSPHERE
========================================================= */

function createAtmosphere() {

scene.fog = new THREE.FogExp2(
0x252b2d,
0.012
);

scene.background = new THREE.Color(
0x252b2d
);
}


/* =========================================================
LIGHTING
========================================================= */

function createLighting() {

const ambient = new THREE.HemisphereLight(
0x87908d,
0x151719,
1.05
);

scene.add(ambient);

const moon = new THREE.DirectionalLight(
0x8794a1,
1.25
);

moon.position.set(
-25,
35,
20
);

moon.castShadow = true;

moon.shadow.mapSize.width = 2048;
moon.shadow.mapSize.height = 2048;

moon.shadow.camera.left = -45;
moon.shadow.camera.right = 45;
moon.shadow.camera.top = 45;
moon.shadow.camera.bottom = -45;

scene.add(moon);
}


/* =========================================================
PLAYER
========================================================= */

function createPlayer() {

player = {
position: new THREE.Vector3(
0,
1.65,
-10
),
velocity: new THREE.Vector3()
};

camera.position.copy(
player.position
);

state.yaw = 0;
state.pitch = 0;
}


function createFlashlight() {

flashlight = new THREE.SpotLight(
0xffffff,
4.0,
28,
Math.PI / 7,
0.45,
1.2
);

flashlight.position.set(
0,
0,
0
);

flashlightTarget =
new THREE.Object3D();

flashlightTarget.position.set(
0,
0,
-10
);

scene.add(
flashlightTarget
);

flashlight.target =
flashlightTarget;

camera.add(flashlight);
camera.add(flashlightTarget);
}


/* =========================================================
PLAYER LOOK
========================================================= */

function updateCamera() {

camera.rotation.order = "YXZ";

camera.rotation.y = state.yaw;
camera.rotation.x = state.pitch;

flashlightTarget.position.set(
0,
0,
-10
);
}


/* =========================================================
PLAYER MOVEMENT
========================================================= */

function updatePlayer(delta) {

if (!gameStarted || endingStarted) {
return;
}

let forward = 0;
let right = 0;

if (keys["KeyW"] || keys["ArrowUp"]) {
forward += 1;
}

if (keys["KeyS"] || keys["ArrowDown"]) {
forward -= 1;
}

if (keys["KeyD"] || keys["ArrowRight"]) {
right += 1;
}

if (keys["KeyA"] || keys["ArrowLeft"]) {
right -= 1;
}

if (touch.active) {

if (Math.abs(touch.y) > 20) {
forward += -touch.y / 80;
}

if (Math.abs(touch.x) > 20) {
right += touch.x / 80;
}
}

const length =
Math.sqrt(
forward * forward +
right * right
);

if (length > 1) {
forward /= length;
right /= length;
}

const moving =
Math.abs(forward) > 0.05 ||
Math.abs(right) > 0.05;

state.sprint =
keys["ShiftLeft"] ||
keys["ShiftRight"];

const speed =
state.sprint ? 6.0 : 3.8;

const direction =
new THREE.Vector3();

direction.z = -forward;
direction.x = right;

direction.applyAxisAngle(
new THREE.Vector3(0, 1, 0),
state.yaw
);

player.position.addScaledVector(
direction,
speed * delta
);

// Keep player in playable area
player.position.x =
THREE.MathUtils.clamp(
player.position.x,
-11.3,
11.3
);

player.position.z =
THREE.MathUtils.clamp(
player.position.z,
-120,
-5
);

camera.position.copy(
player.position
);

updateCamera();

if (moving) {

if (
performance.now() -
lastStepTime >
(state.sprint ? 270 : 390)
) {

playFootstep();

lastStepTime =
performance.now();
}
}
}


/* =========================================================
KEYBOARD
========================================================= */

window.addEventListener(
"keydown",
event => {

keys[event.code] = true;

if (
event.code === "KeyF" &&
gameStarted
) {

state.flashlight =
!state.flashlight;

flashlight.intensity =
state.flashlight ? 4.0 : 0;
}
}
);


window.addEventListener(
"keyup",
event => {

keys[event.code] = false;
}
);


/* =========================================================
MOUSE LOOK
========================================================= */

let mouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;

window.addEventListener(
"mousedown",
event => {

mouseDown = true;

previousMouseX =
event.clientX;

previousMouseY =
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

if (!mouseDown || !gameStarted) {
return;
}

const dx =
event.clientX -
previousMouseX;

const dy =
event.clientY -
previousMouseY;

previousMouseX =
event.clientX;

previousMouseY =
event.clientY;

state.yaw -= dx * 0.0023;

state.pitch -= dy * 0.0018;

state.pitch =
THREE.MathUtils.clamp(
state.pitch,
-1.35,
1.35
);
}
);


/* =========================================================
TOUCH
========================================================= */

window.addEventListener(
"touchstart",
event => {

if (!gameStarted) return;

const t =
event.touches[0];

touch.active = true;
touch.x = 0;
touch.y = 0;
touch.lookX = t.clientX;
touch.lookY = t.clientY;
},
{ passive: true }
);


window.addEventListener(
"touchmove",
event => {

if (!gameStarted) return;

const t =
event.touches[0];

const dx =
t.clientX -
touch.lookX;

const dy =
t.clientY -
touch.lookY;

touch.x = dx;
touch.y = dy;

state.yaw -= dx * 0.0015;

state.pitch -= dy * 0.0011;

state.pitch =
THREE.MathUtils.clamp(
state.pitch,
-1.35,
1.35
);

touch.lookX = t.clientX;
touch.lookY = t.clientY;
},
{ passive: true }
);


window.addEventListener(
"touchend",
() => {

touch.active = false;
touch.x = 0;
touch.y = 0;
},
{ passive: true }
);


/* =========================================================
AUDIO
========================================================= */

function initAudio() {

if (audio.enabled) return;

try {

const AudioContext =
window.AudioContext ||
window.webkitAudioContext;

audio.ctx =
new AudioContext();

audio.master =
audio.ctx.createGain();

audio.master.gain.value =
0.22;

audio.master.connect(
audio.ctx.destination
);

createOceanSound();
createWindSound();

audio.enabled = true;

} catch (error) {

console.warn(
"Audio unavailable",
error
);
}
}


function createOceanSound() {

const ctx = audio.ctx;

const buffer =
ctx.createBuffer(
1,
ctx.sampleRate * 3,
ctx.sampleRate
);

const data =
buffer.getChannelData(0);

for (let i = 0; i < data.length; i++) {

data[i] =
(Math.random() * 2 - 1) *
0.15;
}

const source =
ctx.createBufferSource();

source.buffer = buffer;
source.loop = true;

const filter =
ctx.createBiquadFilter();

filter.type = "lowpass";
filter.frequency.value = 650;

const gain =
ctx.createGain();

gain.gain.value = 0.035;

source
.connect(filter)
.connect(gain)
.connect(audio.master);

source.start();

audio.ocean = gain;
}


function createWindSound() {

const ctx = audio.ctx;

const buffer =
ctx.createBuffer(
1,
ctx.sampleRate * 2,
ctx.sampleRate
);

const data =
buffer.getChannelData(0);

for (let i = 0; i < data.length; i++) {

data[i] =
(Math.random() * 2 - 1) *
0.08;
}

const source =
ctx.createBufferSource();

source.buffer = buffer;
source.loop = true;

const filter =
ctx.createBiquadFilter();

filter.type = "lowpass";
filter.frequency.value = 420;

const gain =
ctx.createGain();

gain.gain.value = 0.018;

source
.connect(filter)
.connect(gain)
.connect(audio.master);

source.start();

audio.wind = gain;
}


function playFootstep() {

if (!audio.enabled) return;

const ctx = audio.ctx;

const oscillator =
ctx.createOscillator();

const gain =
ctx.createGain();

oscillator.type = "triangle";

oscillator.frequency.value =
75 + Math.random() * 20;

gain.gain.setValueAtTime(
0.045,
ctx.currentTime
);

gain.gain.exponentialRampToValueAtTime(
0.001,
ctx.currentTime + 0.12
);

oscillator
.connect(gain)
.connect(audio.master);

oscillator.start();

oscillator.stop(
ctx.currentTime + 0.13
);
}


/* =========================================================
RADIO
========================================================= */

function playRadioStatic() {

if (!audio.enabled) return;

const ctx = audio.ctx;

const buffer =
ctx.createBuffer(
1,
ctx.sampleRate * 1.5,
ctx.sampleRate
);

const data =
buffer.getChannelData(0);

for (let i = 0; i < data.length; i++) {

data[i] =
(Math.random() * 2 - 1) *
0.2;
}

const source =
ctx.createBufferSource();

source.buffer = buffer;

const filter =
ctx.createBiquadFilter();

filter.type = "bandpass";
filter.frequency.value = 1600;
filter.Q.value = 1.5;

const gain =
ctx.createGain();

gain.gain.value = 0.08;

source
.connect(filter)
.connect(gain)
.connect(audio.master);

source.start();
}


/* =========================================================
MESSAGE
========================================================= */

function showMessage(text, duration = 3500) {

messageUI.innerHTML =
text;

messageUI.style.opacity =
"1";

clearTimeout(
state.messageTimer
);

state.messageTimer =
setTimeout(() => {

messageUI.style.opacity =
"0";

}, duration);
}


/* =========================================================
STORY
========================================================= */

const story = [

{
z: -25,
objective: "繼續前往屯門碼頭",
text:
"Amy：五年了……呢度仲係咁安靜。"
},

{
z: -45,
objective: "尋找任何生還者留下嘅痕跡",
text:
"Amy：Daniel……你究竟去咗邊？"
},

{
z: -62,
objective: "調查輕鐵站附近",
text:
"遠處傳來微弱嘅無線電雜訊……"
},

{
z: -75,
objective: "尋找無線電訊號來源",
text:
"無線電：……有人嗎？……有人聽到嗎？"
},

{
z: -91,
objective: "前往屯門碼頭",
text:
"Amy：呢個聲音……我認得。"
},

{
z: -104,
objective: "前往碼頭盡頭",
text:
"無線電：Amy……如果你聽到……嚟碼頭。"
},

{
z: -112,
objective: "尋找 Daniel",
text:
"Amy：Daniel？！"
},

{
z: -117,
objective: "……",
text:
"Daniel：Amy……真係你。"
}
];


function updateStory() {

if (
endingStarted ||
!gameStarted
) {
return;
}

const z =
player.position.z;

let index = -1;

for (let i = 0; i < story.length; i++) {

if (z <= story[i].z) {
index = i;
}
}

if (
index >= 0 &&
index !== currentStory
) {

currentStory = index;

objectiveUI.innerHTML =
"<b>OBJECTIVE</b><br>" +
story[index].objective;

showMessage(
story[index].text,
4200
);

if (index === 3) {

if (!state.radioPlayed) {

state.radioPlayed = true;

playRadioStatic();
}
}

if (index === 7) {

if (!state.danielPlayed) {

state.danielPlayed = true;

playRadioStatic();

setTimeout(
startEnding,
2500
);
}
}
}
}


/* =========================================================
DANIEL
========================================================= */

function createDaniel() {

const group =
new THREE.Group();

group.position.set(
0,
0,
-119
);

scene.add(group);

// Body
box(
0,
1.0,
0,
0.75,
1.6,
0.42,
materials.wallDark,
group
);

// Head
sphere(
0,
2.05,
0,
0.32,
materials.wall,
group
);

// Legs
box(
-0.2,
0.05,
0,
0.2,
0.8,
0.25,
materials.metal,
group
);

box(
0.2,
0.05,
0,
0.2,
0.8,
0.25,
materials.metal,
group
);

// Small warm light beside Daniel
const light =
new THREE.PointLight(
0xffbd75,
1.1,
7,
2
);

light.position.set(
1,
1.5,
0
);

group.add(light);

return group;
}


/* =========================================================
ENDING
========================================================= */

function startEnding() {

if (endingStarted) return;

endingStarted = true;

endingStage = 0;

state.endingTimer =
performance.now();

objectiveUI.innerHTML =
"<b>ENDING</b><br>與 Daniel 重逢";

showMessage(
"Daniel：Amy……我等咗你好耐。",
5000
);

setTimeout(() => {

showMessage(
"Amy：我終於搵到你。",
5000
);

}, 5200);

setTimeout(() => {

endingStage = 1;

showMessage(
"兩個人離開碼頭，開始建立屬於倖存者嘅新家園。",
6000
);

}, 11000);

setTimeout(() => {

endingStage = 2;

showMessage(
"五年後……屯門碼頭重新出現燈光。",
6000
);

}, 18000);

setTimeout(() => {

endingStage = 3;

showFinalEnding();

}, 25000);
}


function showFinalEnding() {

const overlay =
document.createElement("div");

overlay.id =
"finalEnding";

Object.assign(
overlay.style,
{
position: "fixed",
inset: "0",
zIndex: "200",
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
background:
"rgba(0,0,0,.88)",
color: "#ffffff",
textAlign: "center",
fontFamily:
"Arial, sans-serif",
padding: "30px",
boxSizing: "border-box"
}
);

overlay.innerHTML = `
<div style="
font-size:38px;
font-weight:bold;
margin-bottom:24px;
">
FIVE YEARS LATER
</div>

<div style="
font-size:21px;
line-height:1.8;
max-width:720px;
">
屯門碼頭重新亮起燈光。<br>
倖存者開始建立一個新嘅社區。<br>
Amy 同 Daniel 一齊守護住呢個地方。<br><br>

佢哋結婚，建立家庭。<br>
新一代嘅孩子，終於可以喺冇戰爭、冇恐懼嘅世界成長。
</div>

<div style="
margin-top:45px;
font-size:30px;
letter-spacing:5px;
">
THE WORLD ENDED.
</div>

<div style="
margin-top:12px;
font-size:30px;
letter-spacing:5px;
">
WE BEGAN AGAIN.
</div>

<div style="
margin-top:45px;
font-size:14px;
opacity:.55;
">
AMY — FIVE YEARS AFTER · ${VERSION}
</div>
`;

document.body.appendChild(
overlay
);
}


/* =========================================================
ENVIRONMENT UPDATE
========================================================= */

function updateEnvironment(time) {

// Street light flickering
lights.street.forEach(
(light, index) => {

const flicker =
Math.sin(
time * 0.002 +
index * 3.7
);

if (Math.abs(flicker) > 0.96) {

light.intensity =
0.2;

} else {

light.intensity =
1.0;
}
}
);

// Station lights slightly unstable
lights.station.forEach(
(light, index) => {

light.intensity =
0.65 +
Math.sin(
time * 0.0013 +
index
) * 0.12;
}
);
}


/* =========================================================
RESIZE
========================================================= */

function resize() {

if (!camera || !renderer) {
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

window.addEventListener(
"resize",
resize
);


/* =========================================================
START GAME
========================================================= */

function startGame() {

if (gameStarted) return;

gameStarted = true;

if (startScreen) {

startScreen.style.display =
"none";
}

initAudio();

if (
audio.ctx &&
audio.ctx.state === "suspended"
) {

audio.ctx.resume();
}

showMessage(
"五年後，屯門碼頭。<br>Amy 開始尋找失聯已久嘅 Daniel。",
5000
);
}


if (startButton) {

startButton.addEventListener(
"click",
startGame
);
}


/* =========================================================
INITIALIZE
========================================================= */

function init() {

setupUI();

clock =
new THREE.Clock();

scene =
new THREE.Scene();

camera =
new THREE.PerspectiveCamera(
72,
window.innerWidth /
window.innerHeight,
0.05,
250
);

renderer =
new THREE.WebGLRenderer({
antialias: true,
powerPreference: "high-performance"
});

renderer.setPixelRatio(
Math.min(
window.devicePixelRatio,
1.75
)
);

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
THREE.SRGBColorSpace;

renderer.toneMapping =
THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure =
1.0;

document.body.appendChild(
renderer.domElement
);

renderer.domElement.style.position =
"fixed";

renderer.domElement.style.inset =
"0";

renderer.domElement.style.zIndex =
"0";

renderer.domElement.style.touchAction =
"none";

createMaterials();

createAtmosphere();

createLighting();

createGround();

createCity();

createLRTTracks();

createStation();

createBusTerminal();

createCars();

createStreetLights();

createVegetation();

createDebris();

createPier();

createWater();

createPlayer();

createFlashlight();

createLRTTrain(
-4.7,
-72,
1
);

createLRTTrain(
4.7,
-94,
-1
);

createDaniel();

resize();

animate();
}


/* =========================================================
ANIMATION LOOP
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

const elapsed =
performance.now();

updatePlayer(delta);

updateStory();

updateEnvironment(
elapsed
);

updateWater(
elapsed
);

renderer.render(
scene,
camera
);
}


/* =========================================================
START
========================================================= */

init();
