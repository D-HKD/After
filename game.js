import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ================================
// AMY — FIVE YEARS AFTER
// ================================

const startScreen =
document.getElementById("startScreen");

const startButton =
document.getElementById("startButton");


// ================================
// SCENE
// ================================

const scene =
new THREE.Scene();

scene.background =
new THREE.Color(0xb8c5c7);

scene.fog =
new THREE.Fog(
0xb8c5c7,
15,
100
);


// ================================
// CAMERA
// ================================

const camera =
new THREE.PerspectiveCamera(
70,
window.innerWidth /
window.innerHeight,
0.1,
200
);

camera.position.set(
0,
2,
8
);


// ================================
// RENDERER
// ================================

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


// ================================
// LIGHTING
// ================================

const skyLight =
new THREE.HemisphereLight(
0xe6eeee,
0x505754,
2.5
);

scene.add(skyLight);


const sunlight =
new THREE.DirectionalLight(
0xffffff,
2.5
);

sunlight.position.set(
-20,
40,
20
);

scene.add(sunlight);


// ================================
// MATERIALS
// ================================

const roadMaterial =
new THREE.MeshStandardMaterial({
color: 0x4e5554,
roughness: 0.9
});


const concreteMaterial =
new THREE.MeshStandardMaterial({
color: 0x777d7b,
roughness: 0.9
});


const buildingMaterial =
new THREE.MeshStandardMaterial({
color: 0x727875,
roughness: 0.95
});


const metalMaterial =
new THREE.MeshStandardMaterial({
color: 0x343b3a,
metalness: 0.5,
roughness: 0.7
});


const vegetationMaterial =
new THREE.MeshStandardMaterial({
color: 0x405544,
roughness: 1
});


const waterMaterial =
new THREE.MeshStandardMaterial({
color: 0x4f7379,
roughness: 0.25,
metalness: 0.1
});


// ================================
// BOX FUNCTION
// ================================

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


// ================================
// ROAD
// ================================

box(
0,
-0.2,
-40,
26,
0.4,
110,
roadMaterial
);


// ================================
// SIDEWALKS
// ================================

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


// ================================
// BUILDINGS
// ================================

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


// ================================
// ABANDONED CARS
// ================================

function car(
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

car(-5, -18, 0.1);

car(6, -38, -0.25);

car(-4, -63, 0.15);


// ================================
// LIGHT RAIL TRACK
// ================================

const railMaterial =
new THREE.MeshStandardMaterial({
color: 0x292e2d,
metalness: 0.7,
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


// ================================
// VEGETATION
// ================================

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
vegetationMaterial
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
vegetationMaterial
);

leaves.position.set(
x,
3.2,
z
);

scene.add(leaves);
}


// ================================
// SEA
// ================================

const sea =
new THREE.Mesh(
new THREE.PlaneGeometry(
120,
120
),
waterMaterial
);

sea.rotation.x =
-Math.PI / 2;

sea.position.set(
-60,
-0.1,
-40
);

scene.add(sea);


// ================================
// STORY UI
// ================================

const text =
document.createElement("div");

text.style.position =
"fixed";

text.style.bottom =
"130px";

text.style.left =
"0";

text.style.width =
"100%";

text.style.textAlign =
"center";

text.style.color =
"white";

text.style.fontSize =
"18px";

text.style.textShadow =
"0 2px 8px black";

text.style.zIndex =
"20";

text.style.pointerEvents =
"none";

document.body.appendChild(
text
);


const mission =
document.createElement("div");

mission.style.position =
"fixed";

mission.style.top =
"20px";

mission.style.left =
"20px";

mission.style.padding =
"10px 15px";

mission.style.background =
"rgba(0,0,0,.35)";

mission.style.color =
"white";

mission.style.zIndex =
"20";

mission.innerText =
"目標：探索屯門碼頭";

document.body.appendChild(
mission
);


// ================================
// GAME START
// ================================

let started = false;

let chapter = 1;

let radioFound = false;

let danielFound = false;


startButton.addEventListener(
"click",
function() {

started = true;

startScreen.style.display =
"none";

text.innerText =
"Amy：五年了……我終於回到屯門碼頭。";

setTimeout(
function() {

text.innerText =
"";

},
4000
);
}
);


// ================================
// PLAYER
// ================================

let yaw = 0;

let pitch = 0;

const keys = {

w: false,
s: false,
a: false,
d: false

};


// ================================
// KEYBOARD
// ================================

window.addEventListener(
"keydown",
function(e) {

if (e.code === "KeyW")
keys.w = true;

if (e.code === "KeyS")
keys.s = true;

if (e.code === "KeyA")
keys.a = true;

if (e.code === "KeyD")
keys.d = true;
}
);


window.addEventListener(
"keyup",
function(e) {

if (e.code === "KeyW")
keys.w = false;

if (e.code === "KeyS")
keys.s = false;

if (e.code === "KeyA")
keys.a = false;

if (e.code === "KeyD")
keys.d = false;
}
);


// ================================
// MOBILE LOOK
// ================================

let lastX = null;

let lastY = null;


window.addEventListener(
"touchmove",
function(e) {

if (
e.touches.length !== 1
)
return;

const touch =
e.touches[0];

if (
touch.clientX < 140
)
return;

if (
lastX !== null
) {

const dx =
touch.clientX -
lastX;

const dy =
touch.clientY -
lastY;

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

lastX =
touch.clientX;

lastY =
touch.clientY;
}
);


window.addEventListener(
"touchend",
function() {

lastX = null;

lastY = null;
}
);


// ================================
// SIMPLE MOBILE MOVE
// ================================

let moveForward = false;

let moveBackward = false;


window.addEventListener(
"touchstart",
function(e) {

const touch =
e.touches[0];

if (
touch.clientX < 140
) {

moveForward = true;
}
}
);


window.addEventListener(
"touchend",
function() {

moveForward = false;

moveBackward = false;
}
);


// ================================
// MOVEMENT
// ================================

function move(delta) {

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


if (moveForward)
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
new THREE.Vector3(0,1,0),
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


// ================================
// STORY
// ================================

function storyCheck() {

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

mission.innerText =
"目標：調查神秘收音機";

text.innerText =
"收音機：……Amy……你聽得到嗎？";


setTimeout(
function() {

text.innerText =
"收音機：去碼頭下面……Daniel 喺等你。";

},
3500
);
}


if (
chapter === 1 &&
z < -80
) {

chapter = 2;

mission.innerText =
"CHAPTER 2：地下避難所";

text.innerText =
"Amy：Daniel……你仲生存緊？";
}


if (
chapter === 2 &&
z < -110 &&
!danielFound
) {

danielFound = true;

mission.innerText =
"找到 Daniel";

text.innerText =
"Daniel：Amy……";


setTimeout(
function() {

text.innerText =
"Amy：Daniel……真係你？";

},
3500
);


setTimeout(
ending,
7500
);
}
}


// ================================
// ENDING
// ================================

function ending() {

chapter = 3;

mission.innerText =
"CHAPTER 3：A NEW BEGINNING";


text.innerText =
"五年後……";


setTimeout(
function() {

text.innerText =
"Amy 同 Daniel 開始喺海邊建立新嘅生存區。";

},
4000
);


setTimeout(
function() {

text.innerText =
"由兩個人，到一個社區。";

},
8000
);


setTimeout(
function() {

text.innerText =
"由生存，到生活。";

},
12000
);


setTimeout(
function() {

text.innerText =
"Year 10";

},
16000
);


setTimeout(
function() {

text.innerText =
"Amy 同 Daniel 結婚，並育有孩子。";

},
20000
);


setTimeout(
function() {

text.innerText =
"佢哋嘅孩子，喺海邊嘅新世界長大。";

},
24000
);


setTimeout(
function() {

text.innerText =
"世界曾經毀滅……但人類重新開始。";

},
28000
);


setTimeout(
function() {

text.innerText =
"THE WORLD ENDED. WE BEGAN AGAIN.";

text.style.fontSize =
"26px";

},
32000
);
}


// ================================
// CAMERA
// ================================

function updateCamera() {

camera.rotation.order =
"YXZ";

camera.rotation.y =
yaw;

camera.rotation.x =
pitch;
}


// ================================
// GAME LOOP
// ================================

let previous =
performance.now();


function gameLoop() {

requestAnimationFrame(
gameLoop
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


move(delta);

updateCamera();

storyCheck();


renderer.render(
scene,
camera
);
}


gameLoop();


// ================================
// RESIZE
// ================================

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
