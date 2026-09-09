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
new THREE.Color(0xb8c5c7);

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

// ========================================
// TUEN MUN PIER REALISTIC DETAILS V4
// ========================================


// ========================================
// BUILDING WINDOWS
// ========================================

const windowMaterial =
new THREE.MeshStandardMaterial({
color: 0x273231,
roughness: 0.45,
metalness: 0.15
});


const brokenWindowMaterial =
new THREE.MeshStandardMaterial({
color: 0x4b5552,
roughness: 0.8
});


function createBuildingWindows(
x,
y,
z,
width,
height,
depth
) {

const rows = 5;
const columns = 3;

const windowWidth =
1.3;

const windowHeight =
1.4;


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
2 +
col * 3;


const wy =
y -
height / 2 +
2 +
row * 2;


const window =
box(
wx,
wy,
z -
depth / 2 -
0.03,
windowWidth,
windowHeight,
0.05,
Math.random() > 0.18
? windowMaterial
: brokenWindowMaterial
);


window.userData.window =
true;
}
}
}


// ========================================
// WINDOWS ON BUILDINGS
// ========================================

createBuildingWindows(
-22,
5,
-5,
11,
10,
13
);


createBuildingWindows(
22,
6,
-10,
11,
12,
14
);


createBuildingWindows(
-22,
5,
-22,
11,
10,
13
);


createBuildingWindows(
22,
6,
-27,
11,
12,
14
);


createBuildingWindows(
-22,
5,
-39,
11,
10,
13
);


createBuildingWindows(
22,
6,
-44,
11,
12,
14
);


// ========================================
// ROAD MARKINGS
// ========================================

const roadLineMaterial =
new THREE.MeshBasicMaterial({
color: 0xd6d0b2
});


for (
let i = 0;
i < 15;
i++
) {

box(
0,
0.015,
-5 - i * 7,
0.25,
0.025,
3.5,
roadLineMaterial
);
}


// ========================================
// ROAD EDGE LINES
// ========================================

box(
-10,
0.018,
-40,
0.15,
0.025,
105,
roadLineMaterial
);


box(
10,
0.018,
-40,
0.15,
0.025,
105,
roadLineMaterial
);


// ========================================
// PIER SAFETY BARRIERS
// ========================================

const barrierMaterial =
new THREE.MeshStandardMaterial({
color: 0x6b706d,
metalness: 0.65,
roughness: 0.55
});


function createBarrier(
x,
z
) {

box(
x,
0.7,
z,
0.18,
1.4,
2.5,
barrierMaterial
);


box(
x,
1.3,
z,
0.18,
0.12,
2.5,
barrierMaterial
);
}


for (
let i = 0;
i < 8;
i++
) {

createBarrier(
-11,
-82 - i * 2.5
);

createBarrier(
11,
-82 - i * 2.5
);
}


// ========================================
// TUEN MUN PIER SIGN
// ========================================

const signCanvas =
document.createElement("canvas");


signCanvas.width = 1024;

signCanvas.height = 256;


const signContext =
signCanvas.getContext("2d");


signContext.fillStyle =
"#263331";


signContext.fillRect(
0,
0,
1024,
256
);


signContext.fillStyle =
"#f0ead1";


signContext.font =
"bold 92px sans-serif";


signContext.textAlign =
"center";


signContext.textBaseline =
"middle";


signContext.fillText(
"屯門碼頭",
512,
115
);


signContext.font =
"bold 42px sans-serif";


signContext.fillText(
"TUEN MUN PIER",
512,
190
);


const signTexture =
new THREE.CanvasTexture(
signCanvas
);


const signMaterial =
new THREE.MeshStandardMaterial({
map: signTexture,
roughness: 0.65
});


const pierSign =
new THREE.Mesh(
new THREE.BoxGeometry(
5.5,
1.6,
0.15
),
signMaterial
);


pierSign.position.set(
0,
4.2,
-76
);


scene.add(
pierSign
);


// ========================================
// SIGN SUPPORT
// ========================================

box(
-2.3,
2.1,
-76,
0.2,
4.2,
0.2,
metalMaterial
);


box(
2.3,
2.1,
-76,
0.2,
4.2,
0.2,
metalMaterial
);


// ========================================
// PIER INDUSTRIAL CONTAINERS
// ========================================

const containerMaterial =
new THREE.MeshStandardMaterial({
color: 0x505754,
roughness: 0.9
});


function createContainer(
x,
z,
rotation
) {

const container =
box(
x,
1.2,
z,
4.5,
2.4,
9,
containerMaterial
);


container.rotation.y =
rotation;


// Container vertical ribs

for (
let i = -3;
i <= 3;
i++
) {

const rib =
box(
x,
1.2,
z +
i * 1.1,
0.08,
2.5,
0.08,
metalMaterial
);


rib.rotation.y =
rotation;
}
}


createContainer(
-7,
-65,
0.05
);


createContainer(
7,
-69,
-0.08
);


// ========================================
// WHEEL / RUBBER DEBRIS
// ========================================

const rubberMaterial =
new THREE.MeshStandardMaterial({
color: 0x202523,
roughness: 1
});


function createTire(
x,
z
) {

const tire =
new THREE.Mesh(
new THREE.TorusGeometry(
0.55,
0.2,
10,
18
),
rubberMaterial
);


tire.rotation.x =
Math.PI / 2;


tire.position.set(
x,
0.55,
z
);


scene.add(
tire
);
}


createTire(
-3,
-71
);


createTire(
4,
-91
);


// ========================================
// PIER WARNING STRIP
// ========================================

const warningMaterial =
new THREE.MeshBasicMaterial({
color: 0xb49b52
});


box(
0,
0.32,
-101.5,
23,
0.04,
0.25,
warningMaterial
);


// ========================================
// SEA WALL
// ========================================

const seaWallMaterial =
new THREE.MeshStandardMaterial({
color: 0x626866,
roughness: 1
});


box(
0,
0.8,
-104,
24,
1.6,
1.2,
seaWallMaterial
);


// ========================================
// EXTRA VEGETATION
// ========================================

for (
let i = 0;
i < 25;
i++
) {

const side =
Math.random() > 0.5
? -1
: 1;


const x =
side *
(
12 +
Math.random() * 6
);


const z =
-20 -
Math.random() * 75;


const bush =
new THREE.Mesh(
new THREE.SphereGeometry(
0.7 +
Math.random() * 0.7,
8,
8
),
greenMaterial
);


bush.scale.y =
0.7;


bush.position.set(
x,
0.7,
z
);


scene.add(
bush
);
}


// ========================================
// SMALL STREET LIGHT HEADS
// ========================================

const lampHeadMaterial =
new THREE.MeshStandardMaterial({
color: 0x252b2a,
metalness: 0.5,
roughness: 0.5
});


function createLampHead(
x,
z
) {

box(
x,
6,
z,
0.7,
0.2,
0.35,
lampHeadMaterial
);
}


createLampHead(
-9,
-78
);


createLampHead(
9,
-90
);


createLampHead(
-9,
-102
);


createLampHead(
9,
-106
);

// ================================
// V4.1 VISIBILITY FIX
// ================================

// ---------- Road-facing windows ----------
function addV4FixWindows(x, z, side) {

const windowMat = new THREE.MeshStandardMaterial({
color: 0x8fa0aa,
roughness: 0.65,
metalness: 0.05
});

const frameMat = new THREE.MeshStandardMaterial({
color: 0x30383c,
roughness: 0.8
});

for (let row = 0; row < 3; row++) {

for (let col = 0; col < 4; col++) {

const y = 2.5 + row * 2.2;
const zPos = z - 4.2 + col * 2.8;

const window = box(
0.10,
1.35,
1.65,
windowMat
);

window.position.set(
side === "left" ? x + 0.05 : x - 0.05,
y,
zPos
);

scene.add(window);

// window frame vertical
const frame = box(
0.12,
1.5,
0.08,
frameMat
);

frame.position.set(
side === "left" ? x + 0.10 : x - 0.10,
y,
zPos
);

scene.add(frame);
}
}
}


// ---------- Large Tuen Mun Pier sign ----------
const v4fixSignCanvas = document.createElement("canvas");
v4fixSignCanvas.width = 1024;
v4fixSignCanvas.height = 256;

const v4fixCtx = v4fixSignCanvas.getContext("2d");

v4fixCtx.fillStyle = "#25343b";
v4fixCtx.fillRect(0, 0, 1024, 256);

v4fixCtx.strokeStyle = "#d7e0df";
v4fixCtx.lineWidth = 12;
v4fixCtx.strokeRect(8, 8, 1008, 240);

v4fixCtx.fillStyle = "#ffffff";
v4fixCtx.font = "bold 88px Arial";
v4fixCtx.textAlign = "center";
v4fixCtx.textBaseline = "middle";

v4fixCtx.fillText(
"屯門碼頭",
512,
105
);

v4fixCtx.font = "bold 42px Arial";

v4fixCtx.fillText(
"TUEN MUN PIER",
512,
175
);

const v4fixSignTexture =
new THREE.CanvasTexture(v4fixSignCanvas);

const v4fixSignMaterial =
new THREE.MeshStandardMaterial({
map: v4fixSignTexture,
roughness: 0.7,
metalness: 0.05
});

const v4fixSign = new THREE.Mesh(
new THREE.BoxGeometry(9, 2.25, 0.18),
v4fixSignMaterial
);

v4fixSign.position.set(
0,
5.0,
-52
);

scene.add(v4fixSign);


// ---------- Sign supports ----------
const v4fixSupportMat =
new THREE.MeshStandardMaterial({
color: 0x42494b,
roughness: 0.85,
metalness: 0.25
});

for (const x of [-3.4, 3.4]) {

const support = box(
0.28,
5.0,
0.28,
v4fixSupportMat
);

support.position.set(
x,
2.5,
-52
);

scene.add(support);
}


// ---------- Large shipping containers ----------
const v4fixContainerRed =
new THREE.MeshStandardMaterial({
color: 0x6e4038,
roughness: 0.9,
metalness: 0.15
});

const v4fixContainerBlue =
new THREE.MeshStandardMaterial({
color: 0x465c64,
roughness: 0.9,
metalness: 0.15
});

const v4fixContainer1 = box(
5.5,
2.7,
2.4,
v4fixContainerRed
);

v4fixContainer1.position.set(
-7.0,
1.35,
-62
);

scene.add(v4fixContainer1);


const v4fixContainer2 = box(
5.5,
2.7,
2.4,
v4fixContainerBlue
);

v4fixContainer2.position.set(
7.0,
1.35,
-66
);

scene.add(v4fixContainer2);


// ---------- Container vertical lines ----------
const v4fixContainerLineMat =
new THREE.MeshStandardMaterial({
color: 0x242a2c,
roughness: 0.9
});

for (const x of [-9.0, -7.0, -5.0, 5.0, 7.0, 9.0]) {

const line = box(
0.08,
2.5,
0.08,
v4fixContainerLineMat
);

line.position.set(
x,
1.35,
-60.75
);

scene.add(line);
}


// ---------- Large abandoned tyres ----------
const v4fixTyreMat =
new THREE.MeshStandardMaterial({
color: 0x17191a,
roughness: 1.0
});

function addV4FixTyre(x, z) {

const tyre = new THREE.Mesh(
new THREE.TorusGeometry(
0.72,
0.24,
12,
24
),
v4fixTyreMat
);

tyre.rotation.x = Math.PI / 2;

tyre.position.set(
x,
0.72,
z
);

scene.add(tyre);
}

addV4FixTyre(-4.5, -57);
addV4FixTyre(4.5, -58);
addV4FixTyre(-5.5, -69);


// ---------- Pier safety railings ----------
const v4fixRailMat =
new THREE.MeshStandardMaterial({
color: 0x667073,
roughness: 0.75,
metalness: 0.45
});

for (const x of [-10.5, 10.5]) {

for (let i = 0; i < 7; i++) {

const post = box(
0.12,
1.25,
0.12,
v4fixRailMat
);

post.position.set(
x,
0.65,
-50 - i * 3
);

scene.add(post);
}

const rail = box(
0.16,
0.16,
21,
v4fixRailMat
);

rail.position.set(
x,
1.15,
-59
);

scene.add(rail);
}


// ---------- Road lane markings ----------
const v4fixRoadMarkMat =
new THREE.MeshStandardMaterial({
color: 0xd8d5c8,
roughness: 0.8
});

for (let i = 0; i < 12; i++) {

const mark = box(
0.22,
0.025,
2.0,
v4fixRoadMarkMat
);

mark.position.set(
0,
0.03,
-30 - i * 4
);

scene.add(mark);
}


// ---------- Warning blocks near pier ----------
const v4fixWarningMat =
new THREE.MeshStandardMaterial({
color: 0xb18b42,
roughness: 0.8
});

for (let i = 0; i < 8; i++) {

const warning = box(
0.7,
0.12,
0.35,
v4fixWarningMat
);

warning.position.set(
-5.0 + i * 1.4,
0.08,
-74
);

scene.add(warning);
}


// ---------- Road-facing building windows ----------
addV4FixWindows(-16.5, -30, "left");
addV4FixWindows(16.5, -30, "right");

addV4FixWindows(-16.5, -58, "left");
addV4FixWindows(16.5, -58, "right");


// ---------- Extra pier lights ----------
const v4fixLampMat =
new THREE.MeshStandardMaterial({
color: 0x303638,
roughness: 0.8,
metalness: 0.35
});

for (const x of [-8, 8]) {

const pole = box(
0.18,
4.2,
0.18,
v4fixLampMat
);

pole.position.set(
x,
2.1,
-48
);

scene.add(pole);

const lamp = new THREE.Mesh(
new THREE.SphereGeometry(
0.28,
12,
12
),
new THREE.MeshStandardMaterial({
color: 0xd9d1a2,
emissive: 0x665f42,
emissiveIntensity: 0.8
})
);

lamp.position.set(
x,
4.3,
-48
);

scene.add(lamp);
}


// ================================
// END V4.1 VISIBILITY FIX
// ================================

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
