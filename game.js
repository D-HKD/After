import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ========================================
// AMY — FIVE YEARS AFTER
// TUEN MUN PIER
// ========================================


// ========================================
// BASIC UI
// ========================================

const startScreen =
document.getElementById("startScreen");

const startButton =
document.getElementById("startButton");


// ========================================
// SCENE
// ========================================

const scene =
new THREE.Scene();

scene.background =
new THREE.Color(0x8fb1c4);

scene.fog =
new THREE.Fog(
0xb8c5c7,
18,
110
);


// ========================================
// CAMERA
// ========================================

const camera =
new THREE.PerspectiveCamera(
70,
window.innerWidth /
window.innerHeight,
0.1,
250
);

camera.position.set(
0,
1.7,
8
);


// ========================================
// RENDERER
// ========================================

const renderer =
new THREE.WebGLRenderer({
antialias: true,
powerPreference: "high-performance"
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.setPixelRatio(
Math.min(
window.devicePixelRatio,
1.5
)
);

renderer.domElement.style.position =
"fixed";

renderer.domElement.style.left =
"0";

renderer.domElement.style.top =
"0";

renderer.domElement.style.width =
"100%";

renderer.domElement.style.height =
"100%";

renderer.domElement.style.zIndex =
"1";

document.body.appendChild(
renderer.domElement
);


// ========================================
// LIGHT
// ========================================

const skyLight =
new THREE.HemisphereLight(
0xe7eeee,
0x4e5552,
2.4
);

scene.add(skyLight);


const sunlight =
new THREE.DirectionalLight(
0xffffff,
2.3
);

sunlight.position.set(
-25,
45,
25
);

scene.add(sunlight);


// ========================================
// MATERIALS
// ========================================

const roadMaterial =
new THREE.MeshStandardMaterial({
color: 0x505655,
roughness: 0.95
});


const concreteMaterial =
new THREE.MeshStandardMaterial({
color: 0x747a77,
roughness: 0.95
});


const buildingMaterial =
new THREE.MeshStandardMaterial({
color: 0x707774,
roughness: 0.9
});


const metalMaterial =
new THREE.MeshStandardMaterial({
color: 0x343a39,
metalness: 0.45,
roughness: 0.75
});


const greenMaterial =
new THREE.MeshStandardMaterial({
color: 0x405445,
roughness: 1
});


const waterMaterial =
new THREE.MeshStandardMaterial({
color: 0x54767b,
roughness: 0.3,
metalness: 0.1
});


const railingMaterial =
new THREE.MeshStandardMaterial({
color: 0x505654,
metalness: 0.6,
roughness: 0.6
});


// ========================================
// BOX
// ========================================

function box(
x,
y,
z,
width,
height,
depth,
material
) {

const geometry =
new THREE.BoxGeometry(
width,
height,
depth
);

const object =
new THREE.Mesh(
geometry,
material
);

object.position.set(
x,
y,
z
);

scene.add(object);

return object;
}


// ========================================
// ROAD
// ========================================

box(
0,
-0.2,
-40,
26,
0.4,
110,
roadMaterial
);


// ========================================
// SIDEWALKS
// ========================================

box(
-15,
0,
-40,
4,
0.5,
110,
concreteMaterial
);

box(
15,
0,
-40,
4,
0.5,
110,
concreteMaterial
);


// ========================================
// BUILDINGS
// ========================================

for (
let i = 0;
i < 6;
i++
) {

const z =
-5 - i * 17;


box(
-22,
5,
z,
11,
10,
13,
buildingMaterial
);


box(
22,
6,
z - 5,
11,
12,
14,
buildingMaterial
);
}


// ========================================
// ABANDONED CARS
// ========================================

function createCar(
x,
z,
rotation
) {

const body =
box(
x,
0.8,
z,
3.2,
1.1,
5.5,
metalMaterial
);

body.rotation.y =
rotation;


const roof =
box(
x,
1.5,
z,
2.4,
0.7,
2.8,
metalMaterial
);

roof.rotation.y =
rotation;
}


createCar(
-5,
-18,
0.1
);

createCar(
6,
-38,
-0.25
);

createCar(
-4,
-63,
0.15
);


// ========================================
// LIGHT RAIL
// ========================================

const railMaterial =
new THREE.MeshStandardMaterial({
color: 0x292e2d,
metalness: 0.75,
roughness: 0.5
});


box(
-8,
0.1,
-45,
0.15,
0.15,
105,
railMaterial
);


box(
-6,
0.1,
-45,
0.15,
0.15,
105,
railMaterial
);


// ========================================
// VEGETATION
// ========================================

const trees = [];


for (
let i = 0;
i < 40;
i++
) {

const side =
Math.random() > 0.5
? 1
: -1;


const x =
side *
(12 + Math.random() * 8);


const z =
-Math.random() * 100;


const trunk =
new THREE.Mesh(
new THREE.CylinderGeometry(
0.15,
0.2,
3,
8
),
greenMaterial
);


trunk.position.set(
x,
1.5,
z
);


scene.add(trunk);


const leaves =
new THREE.Mesh(
new THREE.SphereGeometry(
1.3,
8,
8
),
greenMaterial
);


leaves.position.set(
x,
3.2,
z
);


scene.add(leaves);


trees.push({
trunk,
leaves,
phase:
Math.random() *
Math.PI *
2
});
}


// ========================================
// SEA
// ========================================

const sea =
new THREE.Mesh(
new THREE.PlaneGeometry(
100,
80
),
waterMaterial
);


sea.rotation.x =
-Math.PI / 2;


sea.position.set(
0,
-0.15,
-105
);


scene.add(sea);


// ========================================
// PIER
// ========================================

box(
0,
0.05,
-92,
24,
0.25,
20,
concreteMaterial
);


// ========================================
// PIER EDGE
// ========================================

box(
0,
0.25,
-103,
24,
0.5,
0.5,
metalMaterial
);


// ========================================
// RAILING
// ========================================

function createRailing(
x,
z
) {

box(
x,
1,
z,
0.12,
2,
4,
railingMaterial
);


box(
x,
1.75,
z,
0.12,
0.12,
4,
railingMaterial
);


box(
x,
1,
z,
0.08,
0.08,
4,
railingMaterial
);
}


for (
let i = 0;
i < 7;
i++
) {

createRailing(
-11,
-82 - i * 3
);


createRailing(
11,
-82 - i * 3
);
}


// ========================================
// PIER LIGHTS
// ========================================

function createPierLight(
x,
z
) {

box(
x,
3,
z,
0.15,
6,
0.15,
metalMaterial
);


const lamp =
new THREE.PointLight(
0xffedc7,
1.2,
15
);


lamp.position.set(
x,
6,
z
);


scene.add(lamp);
}


createPierLight(
-9,
-78
);

createPierLight(
9,
-90
);

createPierLight(
-9,
-102
);

createPierLight(
9,
-106
);


// ========================================
// STREET SIGN
// ========================================

box(
-5,
2.3,
-74,
0.12,
4.6,
0.12,
metalMaterial
);


box(
-5,
4.3,
-74,
3,
0.7,
0.12,
metalMaterial
);


// ========================================
// BINS
// ========================================

function createBin(
x,
z
) {

const bin =
new THREE.Mesh(
new THREE.CylinderGeometry(
0.45,
0.4,
1,
12
),
metalMaterial
);


bin.position.set(
x,
0.5,
z
);


scene.add(bin);
}


createBin(
5,
-76
);

createBin(
-6,
-94
);


// ========================================
// BUOYS
// ========================================

const buoyMaterial =
new THREE.MeshStandardMaterial({
color: 0x806c5c,
roughness: 0.7
});


function createBuoy(
x,
z
) {

const buoy =
new THREE.Mesh(
new THREE.SphereGeometry(
0.45,
12,
12
),
buoyMaterial
);


buoy.position.set(
x,
0.1,
z
);


scene.add(buoy);
}


createBuoy(
-8,
-108
);

createBuoy(
7,
-111
);

createBuoy(
-3,
-116
);


// ========================================
// ATMOSPHERIC PARTICLES
// ========================================

const particleGeometry =
new THREE.BufferGeometry();


const particleCount = 500;


const particlePositions =
new Float32Array(
particleCount * 3
);


for (
let i = 0;
i < particleCount;
i++
) {

particlePositions[
i * 3
] =
(Math.random() - 0.5) * 45;


particlePositions[
i * 3 + 1
] =
Math.random() * 10;


particlePositions[
i * 3 + 2
] =
-Math.random() * 110;
}


particleGeometry.setAttribute(
"position",
new THREE.BufferAttribute(
particlePositions,
3
)
);


const particleMaterial =
new THREE.PointsMaterial({
color: 0xe1e8e6,
size: 0.07,
transparent: true,
opacity: 0.3
});


const particles =
new THREE.Points(
particleGeometry,
particleMaterial
);


scene.add(
particles
);

// ============================================================
// V5 REALISTIC TUEN MUN FERRY PIER
// ============================================================

// ============================================================
// REALISTIC MATERIALS
// ============================================================

const v5Asphalt = new THREE.MeshStandardMaterial({
color: 0x363b3a,
roughness: 0.96
});

const v5Concrete = new THREE.MeshStandardMaterial({
color: 0x747877,
roughness: 0.92
});

const v5ConcreteDark = new THREE.MeshStandardMaterial({
color: 0x555b5a,
roughness: 0.95
});

const v5GreenRail = new THREE.MeshStandardMaterial({
color: 0x245c4c,
roughness: 0.72,
metalness: 0.25
});

const v5OrangeRail = new THREE.MeshStandardMaterial({
color: 0xb76532,
roughness: 0.72,
metalness: 0.2
});

const v5Glass = new THREE.MeshStandardMaterial({
color: 0x26373a,
roughness: 0.18,
metalness: 0.35
});

const v5Building = new THREE.MeshStandardMaterial({
color: 0x777c78,
roughness: 0.92
});

const v5BuildingDark = new THREE.MeshStandardMaterial({
color: 0x555b59,
roughness: 0.95
});

const v5Window = new THREE.MeshStandardMaterial({
color: 0x1d3035,
roughness: 0.28,
metalness: 0.15
});

const v5WindowLight = new THREE.MeshStandardMaterial({
color: 0x71898d,
roughness: 0.4,
metalness: 0.08
});

const v5Rust = new THREE.MeshStandardMaterial({
color: 0x66483d,
roughness: 0.96,
metalness: 0.25
});

const v5White = new THREE.MeshStandardMaterial({
color: 0xd7d9d2,
roughness: 0.82
});


// ============================================================
// HELPER
// ============================================================

function v5Box(
x,
y,
z,
w,
h,
d,
material
) {

const mesh = new THREE.Mesh(
new THREE.BoxGeometry(w, h, d),
material
);

mesh.position.set(x, y, z);

scene.add(mesh);

return mesh;
}


// ============================================================
// ROAD REBUILD DETAILS
// ============================================================

v5Box(
0,
0.025,
-55,
26,
0.05,
95,
v5Asphalt
);


// road centre markings

const v5RoadMark = new THREE.MeshStandardMaterial({
color: 0xc8c4a7,
roughness: 0.8
});

for (let i = 0; i < 14; i++) {

v5Box(
0,
0.065,
-18 - i * 5,
0.18,
0.035,
2.4,
v5RoadMark
);
}


// road edge markings

v5Box(
-10.8,
0.07,
-55,
0.12,
0.035,
95,
v5RoadMark
);

v5Box(
10.8,
0.07,
-55,
0.12,
0.035,
95,
v5RoadMark
);


// ============================================================
// BUILDING FACADE DETAIL
// ============================================================

function v5BuildingFacade(
x,
z,
side
) {

const wallX =
side === "left"
? x + 5.55
: x - 5.55;

// horizontal facade bands

for (let y = 2; y < 10; y += 2.6) {

v5Box(
wallX,
y,
z,
0.12,
0.12,
12.5,
v5ConcreteDark
);
}

// windows

for (let row = 0; row < 4; row++) {

for (let col = 0; col < 4; col++) {

const wz =
z - 4.2 + col * 2.8;

const wy =
1.8 + row * 2.2;

v5Box(
wallX +
(side === "left" ? 0.08 : -0.08),
wy,
wz,
0.10,
1.35,
1.65,
Math.random() > 0.2
? v5Window
: v5WindowLight
);
}
}

// air conditioners

for (let i = 0; i < 3; i++) {

v5Box(
wallX +
(side === "left" ? 0.25 : -0.25),
2.2 + i * 2.7,
z + 5.0,
0.45,
0.5,
0.8,
v5ConcreteDark
);
}
}


v5BuildingFacade(-22, -5, "left");
v5BuildingFacade(22, -10, "right");

v5BuildingFacade(-22, -22, "left");
v5BuildingFacade(22, -27, "right");

v5BuildingFacade(-22, -39, "left");
v5BuildingFacade(22, -44, "right");


// ============================================================
// BALCONY / EXTERNAL STRUCTURES
// ============================================================

for (const data of [
[-16.25, -8],
[16.25, -22],
[-16.25, -42],
[16.25, -50]
]) {

const x = data[0];
const z = data[1];

v5Box(
x,
4.2,
z,
0.35,
0.12,
8,
v5ConcreteDark
);

v5Box(
x,
4.7,
z - 3.5,
0.12,
1,
0.12,
v5ConcreteDark
);

v5Box(
x,
4.7,
z + 3.5,
0.12,
1,
0.12,
v5ConcreteDark
);
}


// ============================================================
// LIGHT RAIL TERMINAL
// ============================================================

// The real Tuen Mun Ferry Pier station has multiple platforms.
// Recreate the terminal as a wide multi-track area.

const v5TrackMaterial =
new THREE.MeshStandardMaterial({
color: 0x292d2d,
metalness: 0.75,
roughness: 0.45
});

const v5SleeperMaterial =
new THREE.MeshStandardMaterial({
color: 0x56524a,
roughness: 0.95
});


// tracks

const v5TrackXs = [
-9,
-6,
-3,
3,
6,
9
];

for (const x of v5TrackXs) {

v5Box(
x,
0.09,
-79,
0.14,
0.14,
40,
v5TrackMaterial
);

// second rail

v5Box(
x + 1.3,
0.09,
-79,
0.14,
0.14,
40,
v5TrackMaterial
);

// sleepers

for (
let z = -99;
z < -59;
z += 2
) {

v5Box(
x + 0.65,
0.055,
z,
1.8,
0.10,
0.18,
v5SleeperMaterial
);
}
}


// ============================================================
// STATION PLATFORMS
// ============================================================

const platformPositions = [
-7.4,
-1.5,
4.5
];

for (const x of platformPositions) {

v5Box(
x,
0.34,
-80,
3.5,
0.55,
38,
v5Concrete
);

// platform edge

v5Box(
x - 1.7,
0.66,
-80,
0.08,
0.08,
38,
v5OrangeRail
);
}


// ============================================================
// GREEN + ORANGE STATION RAILINGS
// ============================================================

function v5StationRail(
x,
z,
length
) {

v5Box(
x,
1.15,
z,
0.12,
1.5,
length,
v5GreenRail
);

v5Box(
x,
1.8,
z,
0.14,
0.14,
length,
v5OrangeRail
);

for (
let p = z - length / 2;
p <= z + length / 2;
p += 2.5
) {

v5Box(
x,
0.85,
p,
0.13,
1.3,
0.13,
v5GreenRail
);
}
}


v5StationRail(-9.2, -80, 36);
v5StationRail(-3.2, -80, 36);
v5StationRail(2.8, -80, 36);
v5StationRail(8.8, -80, 36);


// ============================================================
// STATION CANOPY
// ============================================================

const v5CanopyRoof =
new THREE.MeshStandardMaterial({
color: 0x6d7776,
roughness: 0.78,
metalness: 0.15
});


// large roof beams

for (const x of [-10, -4, 2, 8]) {

v5Box(
x,
5.5,
-80,
0.35,
5.5,
0.35,
v5ConcreteDark
);
}


// roof

v5Box(
-1,
6.1,
-80,
20,
0.35,
35,
v5CanopyRoof
);


// underside beams

for (let z = -96; z <= -64; z += 4) {

v5Box(
-1,
5.85,
z,
20,
0.16,
0.18,
v5ConcreteDark
);
}


// ============================================================
// STATION LIGHTS
// ============================================================

const v5StationLight =
new THREE.MeshStandardMaterial({
color: 0xfff3cf,
emissive: 0xffe9ad,
emissiveIntensity: 0.8
});

for (const x of [-8, -2, 4, 8]) {

for (let z = -94; z <= -66; z += 7) {

v5Box(
x,
5.85,
z,
0.55,
0.08,
0.35,
v5StationLight
);

const light =
new THREE.PointLight(
0xffe8bd,
0.65,
8
);

light.position.set(
x,
5.4,
z
);

scene.add(light);
}
}


// ============================================================
// REALISTIC STATION SIGN
// ============================================================

function v5TextSign(
text1,
text2,
x,
y,
z,
width
) {

const canvas =
document.createElement("canvas");

canvas.width = 1024;
canvas.height = 256;

const ctx =
canvas.getContext("2d");

ctx.fillStyle = "#07553f";
ctx.fillRect(0, 0, 1024, 256);

ctx.strokeStyle = "#d8e2d9";
ctx.lineWidth = 10;
ctx.strokeRect(8, 8, 1008, 240);

ctx.fillStyle = "#ffffff";

ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.font =
"bold 80px Arial";

ctx.fillText(
text1,
512,
100
);

ctx.font =
"bold 42px Arial";

ctx.fillText(
text2,
512,
175
);

const texture =
new THREE.CanvasTexture(canvas);

texture.colorSpace =
THREE.SRGBColorSpace;

const material =
new THREE.MeshStandardMaterial({
map: texture,
roughness: 0.65
});

const sign =
new THREE.Mesh(
new THREE.BoxGeometry(
width,
width * 0.25,
0.12
),
material
);

sign.position.set(
x,
y,
z
);

scene.add(sign);

return sign;
}


v5TextSign(
"屯門碼頭",
"TUEN MUN FERRY PIER",
0,
4.5,
-61,
8
);


// ============================================================
// FERRY PIER ENTRANCE
// ============================================================

v5Box(
0,
2.6,
-99,
17,
5.2,
0.45,
v5ConcreteDark
);


// opening in front

v5Box(
0,
2.4,
-98.7,
7,
4.5,
0.5,
v5Glass
);


// ============================================================
// FERRY / WATERFRONT STRUCTURE
// ============================================================

v5Box(
0,
1.0,
-104,
23,
2,
1.0,
v5ConcreteDark
);


// waterfront rail

v5StationRail(
-10.5,
-102,
5
);

v5StationRail(
10.5,
-102,
5
);


// ============================================================
// BUS TERMINAL AREA
// ============================================================

const v5BusRoad =
new THREE.MeshStandardMaterial({
color: 0x454a49,
roughness: 0.95
});

v5Box(
0,
0.06,
-43,
23,
0.12,
12,
v5BusRoad
);


// bus bay dividers

for (let x = -8; x <= 8; x += 4) {

v5Box(
x,
0.14,
-43,
0.12,
0.04,
10,
v5RoadMark
);
}


// bus stop sign

v5TextSign(
"巴士總站",
"BUS TERMINUS",
0,
3.1,
-47,
5.5
);


// ============================================================
// REALISTIC CARS
// ============================================================

function v5Car(
x,
z,
rotation,
bodyColor
) {

const bodyMaterial =
new THREE.MeshStandardMaterial({
color: bodyColor,
roughness: 0.75,
metalness: 0.25
});

const body =
v5Box(
x,
0.65,
z,
3.2,
0.85,
5.1,
bodyMaterial
);

body.rotation.y =
rotation;

const cabin =
v5Box(
x,
1.25,
z - 0.15,
2.35,
0.65,
2.4,
v5Glass
);

cabin.rotation.y =
rotation;

const wheelMat =
new THREE.MeshStandardMaterial({
color: 0x151719,
roughness: 1
});

for (const wx of [-1.35, 1.35]) {

for (const wz of [-1.65, 1.65]) {

const wheel =
new THREE.Mesh(
new THREE.CylinderGeometry(
0.38,
0.38,
0.22,
16
),
wheelMat
);

wheel.rotation.z =
Math.PI / 2;

wheel.position.set(
x + wx,
0.4,
z + wz
);

wheel.rotation.y =
rotation;

scene.add(wheel);
}
}

// headlights

const lampMat =
new THREE.MeshStandardMaterial({
color: 0xfff4ce,
emissive: 0xfff1b0,
emissiveIntensity: 0.5
});

v5Box(
x - 0.85,
0.75,
z - 2.58,
0.35,
0.22,
0.08,
lampMat
);

v5Box(
x + 0.85,
0.75,
z - 2.58,
0.35,
0.22,
0.08,
lampMat
);
}


v5Car(
-5,
-18,
0.08,
0x5b6462
);

v5Car(
6,
-38,
-0.22,
0x465256
);

v5Car(
-5,
-57,
0.12,
0x62605a
);


// ============================================================
// STREET FURNITURE
// ============================================================

function v5Bin(
x,
z
) {

v5Box(
x,
0.55,
z,
0.8,
1.1,
0.8,
v5BuildingDark
);

v5Box(
x,
1.13,
z,
0.9,
0.08,
0.9,
v5ConcreteDark
);
}


v5Bin(-7, -51);
v5Bin(7, -54);
v5Bin(-5, -72);
v5Bin(6, -91);


// ============================================================
// RUSTED BARRELS
// ============================================================

function v5Barrel(
x,
z
) {

const barrel =
new THREE.Mesh(
new THREE.CylinderGeometry(
0.48,
0.48,
1,
16
),
v5Rust
);

barrel.position.set(
x,
0.5,
z
);

scene.add(barrel);

for (const y of [0.22, 0.78]) {

const ring =
new THREE.Mesh(
new THREE.TorusGeometry(
0.48,
0.035,
8,
16
),
v5ConcreteDark
);

ring.rotation.x =
Math.PI / 2;

ring.position.set(
x,
y,
z
);

scene.add(ring);
}
}


v5Barrel(-6, -62);
v5Barrel(7, -67);
v5Barrel(-7, -76);


// ============================================================
// TREES / GRASS
// ============================================================

const v5Grass =
new THREE.MeshStandardMaterial({
color: 0x4d5946,
roughness: 1
});

for (let i = 0; i < 30; i++) {

const side =
Math.random() > 0.5
? -1
: 1;

const x =
side *
(12.5 + Math.random() * 6);

const z =
-15 -
Math.random() * 75;

const stem =
new THREE.Mesh(
new THREE.CylinderGeometry(
0.10,
0.18,
1.8,
7
),
v5Grass
);

stem.position.set(
x,
0.9,
z
);

scene.add(stem);

const crown =
new THREE.Mesh(
new THREE.SphereGeometry(
0.8 + Math.random() * 0.5,
8,
8
),
v5Grass
);

crown.position.set(
x,
2,
z
);

crown.scale.y = 0.8;

scene.add(crown);
}


// ============================================================
// SMALL DEBRIS
// ============================================================

const v5Debris =
new THREE.MeshStandardMaterial({
color: 0x444847,
roughness: 1
});

for (let i = 0; i < 45; i++) {

const debris =
v5Box(
-9 + Math.random() * 18,
0.12,
-25 - Math.random() * 70,
0.15 + Math.random() * 0.4,
0.15 + Math.random() * 0.3,
0.15 + Math.random() * 0.45,
v5Debris
);

debris.rotation.set(
Math.random(),
Math.random(),
Math.random()
);
}


// ============================================================
// WATER — REALISTIC PROCEDURAL WAVES
// ============================================================

const v5WaterGeometry =
new THREE.PlaneGeometry(
180,
100,
80,
40
);

const v5Water =
new THREE.Mesh(
v5WaterGeometry,
new THREE.MeshStandardMaterial({
color: 0x3f737b,
roughness: 0.22,
metalness: 0.12
})
);

v5Water.rotation.x =
-Math.PI / 2;

v5Water.position.set(
0,
-0.25,
-110
);

scene.add(v5Water);

const v5WaterPositions =
v5WaterGeometry.attributes.position;

const v5WaterBase = [];

for (
let i = 0;
i < v5WaterPositions.count;
i++
) {

v5WaterBase.push({
x: v5WaterPositions.getX(i),
y: v5WaterPositions.getY(i),
z: v5WaterPositions.getZ(i)
});
}


// ============================================================
// SKY / ATMOSPHERE
// ============================================================

scene.background =
new THREE.Color(0x91b0c1);

scene.fog =
new THREE.Fog(
0x91b0c1,
65,
185
);

const v5Sun =
new THREE.DirectionalLight(
0xfff3dc,
1.7
);

v5Sun.position.set(
-45,
65,
35
);

v5Sun.castShadow = true;

scene.add(v5Sun);

const v5Ambient =
new THREE.HemisphereLight(
0xd5e5ea,
0x515753,
1.45
);

scene.add(v5Ambient);


// ============================================================
// CLOUDS
// =================================================

// ========================================
// GAME VARIABLES
// ========================================

let started = false;

let chapter = 1;

let radioFound = false;

let danielFound = false;

let endingStarted = false;

// ========================================
// AUDIO SYSTEM
// ========================================

let audioContext = null;

let masterGain = null;

let windGain = null;

let oceanGain = null;

let radioGain = null;

let audioStarted = false;

let lastStepTime = 0;


// 建立遊戲聲音系統

function startAudio() {

if (audioStarted)
return;

audioStarted = true;

audioContext =
new (
window.AudioContext ||
window.webkitAudioContext
)();

masterGain =
audioContext.createGain();

masterGain.gain.value =
0.20;

masterGain.connect(
audioContext.destination
);


// -------------------------
// 海浪聲
// -------------------------

const ocean =
audioContext.createOscillator();

ocean.type =
"sine";

ocean.frequency.value =
75;


oceanGain =
audioContext.createGain();

oceanGain.gain.value =
0.006;


ocean.connect(
oceanGain
);

oceanGain.connect(
masterGain
);

ocean.start();


// -------------------------
// 風聲
// -------------------------

const wind =
audioContext.createOscillator();

wind.type =
"sine";

wind.frequency.value =
180;


windGain =
audioContext.createGain();

windGain.gain.value =
0.004;


wind.connect(
windGain
);

windGain.connect(
masterGain
);

wind.start();


// -------------------------
// 啟動音效
// -------------------------

const startOsc =
audioContext.createOscillator();

const startGain =
audioContext.createGain();


startOsc.frequency.value =
440;

startGain.gain.value =
0.001;


startOsc.connect(
startGain
);

startGain.connect(
masterGain
);


startOsc.start();


startGain.gain.exponentialRampToValueAtTime(
0.12,
audioContext.currentTime + 0.05
);


startGain.gain.exponentialRampToValueAtTime(
0.001,
audioContext.currentTime + 1
);


setTimeout(
function() {

startOsc.stop();

},
1100
);
}


// ========================================
// FOOTSTEP SOUND
// ========================================

function footstep() {

if (
!audioStarted ||
!audioContext
)
return;


const osc =
audioContext.createOscillator();


const gain =
audioContext.createGain();


osc.type =
"triangle";


osc.frequency.value =
80 +
Math.random() * 35;


gain.gain.value =
0.001;


osc.connect(
gain
);


gain.connect(
masterGain
);


const now =
audioContext.currentTime;


gain.gain.exponentialRampToValueAtTime(
0.08,
now + 0.01
);


gain.gain.exponentialRampToValueAtTime(
0.001,
now + 0.12
);


osc.start(now);

osc.stop(
now + 0.13
);
}


// ========================================
// RADIO STATIC
// ========================================

function radioStatic() {

if (
!audioStarted ||
!audioContext
)
return;


const buffer =
audioContext.createBuffer(
1,
audioContext.sampleRate * 0.15,
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


const noise =
audioContext.createBufferSource();


noise.buffer =
buffer;


radioGain =
audioContext.createGain();


radioGain.gain.value =
0.12;


noise.connect(
radioGain
);


radioGain.connect(
masterGain
);


noise.start();
}


// ========================================
// WATERFRONT SOUND UPDATE
// ========================================

function updateAudio() {

if (
!audioStarted ||
!audioContext
)
return;


const distanceToSea =
Math.abs(
camera.position.z + 105
);


// 越接近海，海浪越大

const oceanVolume =
Math.max(
0.025,
Math.min(
0.12,
0.12 -
distanceToSea *
0.0008
)
);


oceanGain.gain.value =
oceanVolume;


// 風聲根據玩家移動稍微變化

const movementAmount =
(
Math.abs(
camera.position.x
) +
Math.abs(
camera.position.z
)
) * 0.00002;


windGain.gain.value =
0.018 +
movementAmount;
}

// ========================================
// PLAYER CONTROL
// ========================================

let yaw = 0;

let pitch = 0;


const keys = {

w: false,
s: false,
a: false,
d: false
};


// ========================================
// KEYBOARD
// ========================================

window.addEventListener(
"keydown",
function(event) {

if (
event.code === "KeyW"
)
keys.w = true;


if (
event.code === "KeyS"
)
keys.s = true;


if (
event.code === "KeyA"
)
keys.a = true;


if (
event.code === "KeyD"
)
keys.d = true;
}
);


window.addEventListener(
"keyup",
function(event) {

if (
event.code === "KeyW"
)
keys.w = false;


if (
event.code === "KeyS"
)
keys.s = false;


if (
event.code === "KeyA"
)
keys.a = false;


if (
event.code === "KeyD"
)
keys.d = false;
}
);


// ========================================
// MOUSE LOOK
// ========================================

let mouseLooking = false;

let mouseX = null;

let mouseY = null;


window.addEventListener(
"mousedown",
function(event) {

if (
event.button === 0
) {

mouseLooking = true;

mouseX =
event.clientX;

mouseY =
event.clientY;
}
}
);


window.addEventListener(
"mouseup",
function() {

mouseLooking = false;

mouseX = null;

mouseY = null;
}
);


window.addEventListener(
"mousemove",
function(event) {

if (
!mouseLooking
)
return;


const dx =
event.clientX -
mouseX;


const dy =
event.clientY -
mouseY;


yaw -=
dx * 0.004;


pitch -=
dy * 0.003;


pitch =
Math.max(
-1.1,
Math.min(
1.1,
pitch
)
);


mouseX =
event.clientX;

mouseY =
event.clientY;
}
);


// ========================================
// MOBILE
// ========================================

let mobileForward = false;

let touchLookX = null;

let touchLookY = null;


window.addEventListener(
"touchstart",
function(event) {

if (
event.touches.length !== 1
)
return;


const touch =
event.touches[0];


if (
touch.clientX < 150
) {

mobileForward = true;

} else {

touchLookX =
touch.clientX;

touchLookY =
touch.clientY;
}
}
);


window.addEventListener(
"touchmove",
function(event) {

if (
event.touches.length !== 1
)
return;


const touch =
event.touches[0];


if (
touch.clientX < 150
)
return;


if (
touchLookX !== null
) {

const dx =
touch.clientX -
touchLookX;


const dy =
touch.clientY -
touchLookY;


yaw -=
dx * 0.004;


pitch -=
dy * 0.003;


pitch =
Math.max(
-1.1,
Math.min(
1.1,
pitch
)
);
}


touchLookX =
touch.clientX;


touchLookY =
touch.clientY;
}
);


window.addEventListener(
"touchend",
function() {

mobileForward = false;

touchLookX = null;

touchLookY = null;
}
);


// ========================================
// STORY TEXT
// ========================================

const storyText =
document.createElement("div");


storyText.style.position =
"fixed";

storyText.style.left =
"0";

storyText.style.bottom =
"120px";

storyText.style.width =
"100%";

storyText.style.textAlign =
"center";

storyText.style.color =
"white";

storyText.style.fontSize =
"18px";

storyText.style.textShadow =
"0 2px 8px black";

storyText.style.zIndex =
"30";

storyText.style.pointerEvents =
"none";


document.body.appendChild(
storyText
);


// ========================================
// OBJECTIVE
// ========================================

const objective =
document.createElement("div");


objective.style.position =
"fixed";

objective.style.top =
"20px";

objective.style.left =
"20px";

objective.style.padding =
"10px 15px";

objective.style.background =
"rgba(0,0,0,.35)";

objective.style.color =
"white";

objective.style.zIndex =
"30";


objective.innerText =
"目標：探索屯門碼頭";


document.body.appendChild(
objective
);


// ========================================
// SAY
// ========================================

function say(
text,
duration = 4000
) {

storyText.innerText =
text;


setTimeout(
function() {

storyText.innerText =
"";

},
duration
);
}


// ========================================
// START GAME
// ========================================

startButton.addEventListener(
"click",
function() {

started = true;

startAudio();

startScreen.style.display =
"none";


say(
"Amy：五年了……我終於回到屯門碼頭。"
);


objective.innerText =
"目標：探索屯門碼頭";
}
);


// ========================================
// MOVEMENT
// ========================================

function movePlayer(
delta
) {

if (!started)
return;
  
const moving =
keys.w ||
keys.s ||
keys.a ||
keys.d ||
mobileForward;

if (
moving &&
performance.now() - lastStepTime > 450
) {

footstep();

lastStepTime =
performance.now();
}

let forward = 0;

let sideways = 0;


if (keys.w)
forward += 1;


if (keys.s)
forward -= 1;


if (keys.a)
sideways -= 1;


if (keys.d)
sideways += 1;


if (mobileForward)
forward += 1;


if (
forward === 0 &&
sideways === 0
)
return;


const direction =
new THREE.Vector3(
sideways,
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


camera.position.add(
direction.multiplyScalar(
delta * 5
)
);


camera.position.x =
Math.max(
-8,
Math.min(
8,
camera.position.x
)
);


camera.position.z =
Math.max(
-125,
Math.min(
10,
camera.position.z
)
);
}


// ========================================
// CAMERA
// ========================================

function updateCamera() {

camera.rotation.order =
"YXZ";


camera.rotation.y =
yaw;


camera.rotation.x =
pitch;
}


// ========================================
// STORY
// ========================================

function checkStory() {

if (!started)
return;


const z =
camera.position.z;


if (
chapter === 1 &&
z < -45 &&
!radioFound
) {

radioFound = true;

radioStatic();  

objective.innerText =
"目標：調查神秘收音機";


say(
"收音機：……Amy……你聽得到嗎？"
);


setTimeout(
function() {

say(
"收音機：去碼頭下面……Daniel 喺等你。"
);

},
3500
);
}


if (
chapter === 1 &&
z < -80
) {

chapter = 2;


objective.innerText =
"CHAPTER 2：地下避難所";


say(
"Amy：Daniel……你仲生存緊？"
);
}


if (
chapter === 2 &&
z < -110 &&
!danielFound
) {

danielFound = true;


objective.innerText =
"找到 Daniel";


say(
"Daniel：Amy……"
);


setTimeout(
function() {

say(
"Amy：Daniel……真係你？"
);

},
3500
);


setTimeout(
startEnding,
7500
);
}
}


// ========================================
// ENDING
// ========================================

function startEnding() {

if (endingStarted)
return;


endingStarted = true;


chapter = 3;


objective.innerText =
"CHAPTER 3：A NEW BEGINNING";


say(
"五年後……"
);


setTimeout(
function() {

say(
"Amy 同 Daniel 開始喺海邊建立新嘅生存區。"
);

},
4000
);


setTimeout(
function() {

say(
"由兩個人，到一個社區。"
);

},
8000
);


setTimeout(
function() {

say(
"由生存，到生活。"
);

},
12000
);


setTimeout(
function() {

say(
"Year 10"
);

},
16000
);


setTimeout(
function() {

say(
"Amy 同 Daniel 結婚，並育有孩子。"
);

},
20000
);


setTimeout(
function() {

say(
"佢哋嘅孩子，喺海邊嘅新世界長大。"
);

},
24000
);


setTimeout(
function() {

say(
"世界曾經毀滅……但人類重新開始。"
);

},
28000
);


setTimeout(
function() {

storyText.innerText =
"THE WORLD ENDED. WE BEGAN AGAIN.";


storyText.style.fontSize =
"26px";

},
32000
);
}


// ========================================
// ENVIRONMENT ANIMATION
// ========================================

let waterTime = 0;

const waterBaseY =
sea.position.y;


let previous =
performance.now();


function animate() {

requestAnimationFrame(
animate
);
updateV45Sky();

const now =
performance.now();


const delta =
Math.min(
(now - previous) / 1000,
0.05
);


previous =
now;


movePlayer(
delta
);


updateCamera();


checkStory();

updateAudio();  

// 海面輕微上下

waterTime +=
delta;


sea.position.y =
waterBaseY +
Math.sin(
waterTime * 0.8
) * 0.025;


// 空氣粒子

particles.rotation.y +=
delta * 0.006;


// 植物微微擺動

for (
const tree of trees
) {

tree.leaves.rotation.z =
Math.sin(
waterTime * 0.7 +
tree.phase
) * 0.025;
}


renderer.render(
scene,
camera
);
}


// ========================================
// RESIZE
// ========================================

window.addEventListener(
"resize",
function() {

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


// ========================================
// START ENGINE
// ========================================

animate();
