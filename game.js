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
// GAME VARIABLES
// ========================================

let started = false;

let chapter = 1;

let radioFound = false;

let danielFound = false;

let endingStarted = false;


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
