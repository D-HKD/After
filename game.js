import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

document.body.style.margin = "0";
document.body.style.overflow = "hidden";

const scene = new THREE.Scene();

scene.background = new THREE.Color(0xb9c3c3);
scene.fog = new THREE.Fog(0xb9c3c3, 15, 100);

const camera = new THREE.PerspectiveCamera(
70,
window.innerWidth / window.innerHeight,
0.1,
200
);

camera.position.set(0, 1.7, 10);

const renderer = new THREE.WebGLRenderer({
canvas: canvas,
antialias: true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.setPixelRatio(
Math.min(window.devicePixelRatio, 1.5)
);


/* =========================
LIGHT
========================= */

const ambientLight =
new THREE.HemisphereLight(
0xdce7e8,
0x59615f,
2
);

scene.add(ambientLight);

const sun =
new THREE.DirectionalLight(
0xffffff,
2
);

sun.position.set(
-20,
40,
20
);

scene.add(sun);


/* =========================
MATERIALS
========================= */

const roadMaterial =
new THREE.MeshStandardMaterial({
color: 0x555957,
roughness: 0.9
});

const concreteMaterial =
new THREE.MeshStandardMaterial({
color: 0x777b78,
roughness: 1
});

const buildingMaterial =
new THREE.MeshStandardMaterial({
color: 0x737875,
roughness: 0.9
});

const metalMaterial =
new THREE.MeshStandardMaterial({
color: 0x414746,
roughness: 0.8,
metalness: 0.3
});

const greenMaterial =
new THREE.MeshStandardMaterial({
color: 0x4d604f,
roughness: 1
});

const waterMaterial =
new THREE.MeshStandardMaterial({
color: 0x54767b,
roughness: 0.3,
metalness: 0.1
});


/* =========================
CREATE BOX
========================= */

function createBox(
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


/* =========================
ROAD
========================= */

createBox(
0,
-0.15,
-40,
24,
0.3,
110,
roadMaterial
);


/* =========================
SIDEWALKS
========================= */

createBox(
-14,
0,
-40,
4,
0.4,
110,
concreteMaterial
);

createBox(
14,
0,
-40,
4,
0.4,
110,
concreteMaterial
);


/* =========================
BUILDINGS
========================= */

for (let i = 0; i < 5; i++) {

const z =
-10 - i * 18;

createBox(
-21,
5,
z,
10,
10,
14,
buildingMaterial
);

createBox(
21,
6,
z - 5,
10,
12,
16,
buildingMaterial
);
}


/* =========================
ABANDONED CARS
========================= */

function createCar(x, z, rotation) {

const car =
createBox(
x,
0.8,
z,
3.2,
1.1,
5.5,
metalMaterial
);

car.rotation.y =
rotation;

const roof =
createBox(
x,
1.5,
z,
2.5,
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
0.15
);

createCar(
6,
-38,
-0.3
);

createCar(
-4,
-65,
0.1
);


/* =========================
VEGETATION
========================= */

for (let i = 0; i < 35; i++) {

const x =
(Math.random() > 0.5 ? 1 : -1)
*
(11 + Math.random() * 8);

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
3.3,
z
);

scene.add(leaves);
}


/* =========================
TUEN MUN SEA
========================= */

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
-62,
-0.05,
-40
);

scene.add(sea);


/* =========================
LIGHT RAIL TRACK
========================= */

const railMaterial =
new THREE.MeshStandardMaterial({
color: 0x303434,
metalness: 0.7,
roughness: 0.5
});

createBox(
-9,
0.08,
-45,
0.12,
0.15,
100,
railMaterial
);

createBox(
-7,
0.08,
-45,
0.12,
0.15,
100,
railMaterial
);


/* =========================
SIMPLE STREET LIGHTS
========================= */

function createStreetLight(x, z) {

createBox(
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
0xfff1cc,
1,
12
);

lamp.position.set(
x,
6,
z
);

scene.add(lamp);
}

createStreetLight(-12, -15);
createStreetLight(12, -30);
createStreetLight(-12, -55);


/* =========================
RADIO
========================= */

const radio =
createBox(
3,
1,
-55,
1.2,
1,
0.8,
metalMaterial
);


/* =========================
GAME STATE
========================= */

let chapter = 1;

let radioFound = false;

let danielFound = false;

let ending = false;


/* =========================
PLAYER
========================= */

let yaw = 0;

let pitch = 0;

const movement = {
forward: false,
backward: false,
left: false,
right: false
};


/* =========================
KEYBOARD
========================= */

window.addEventListener(
"keydown",
function(event) {

if (event.code === "KeyW")
movement.forward = true;

if (event.code === "KeyS")
movement.backward = true;

if (event.code === "KeyA")
movement.left = true;

if (event.code === "KeyD")
movement.right = true;
}
);


window.addEventListener(
"keyup",
function(event) {

if (event.code === "KeyW")
movement.forward = false;

if (event.code === "KeyS")
movement.backward = false;

if (event.code === "KeyA")
movement.left = false;

if (event.code === "KeyD")
movement.right = false;
}
);


/* =========================
MOBILE CONTROLS
========================= */

const joystick =
document.createElement("div");

joystick.innerHTML =
"移動";

joystick.style.position =
"fixed";

joystick.style.left =
"25px";

joystick.style.bottom =
"30px";

joystick.style.width =
"90px";

joystick.style.height =
"90px";

joystick.style.borderRadius =
"50%";

joystick.style.background =
"rgba(255,255,255,0.15)";

joystick.style.border =
"1px solid rgba(255,255,255,0.4)";

joystick.style.color =
"white";

joystick.style.display =
"flex";

joystick.style.alignItems =
"center";

joystick.style.justifyContent =
"center";

joystick.style.zIndex =
"20";

document.body.appendChild(
joystick
);


let joystickStart = null;


joystick.addEventListener(
"touchstart",
function(event) {

joystickStart = {
x: event.touches[0].clientX,
y: event.touches[0].clientY
};

}
);


joystick.addEventListener(
"touchmove",
function(event) {

if (!joystickStart)
return;

const x =
event.touches[0].clientX -
joystickStart.x;

const y =
event.touches[0].clientY -
joystickStart.y;

movement.forward =
y < -15;

movement.backward =
y > 15;

movement.left =
x < -15;

movement.right =
x > 15;
}
);


joystick.addEventListener(
"touchend",
function() {

movement.forward = false;
movement.backward = false;
movement.left = false;
movement.right = false;

joystickStart = null;
}
);


/* =========================
LOOK CONTROL
========================= */

let lastTouchX = null;

let lastTouchY = null;


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
touch.clientX < 140
)
return;

if (lastTouchX !== null) {

const dx =
touch.clientX -
lastTouchX;

const dy =
touch.clientY -
lastTouchY;

yaw -=
dx * 0.004;

pitch -=
dy * 0.003;

pitch =
Math.max(
-1.2,
Math.min(
1.2,
pitch
)
);
}

lastTouchX =
touch.clientX;

lastTouchY =
touch.clientY;
}
);


window.addEventListener(
"touchend",
function() {

lastTouchX = null;
lastTouchY = null;

}
);


/* =========================
STORY MESSAGE
========================= */

const story =
document.createElement("div");

story.style.position =
"fixed";

story.style.left =
"0";

story.style.right =
"0";

story.style.bottom =
"120px";

story.style.textAlign =
"center";

story.style.color =
"white";

story.style.fontSize =
"18px";

story.style.textShadow =
"0 2px 5px black";

story.style.zIndex =
"30";

document.body.appendChild(
story
);


function say(text, time = 4000) {

story.innerText =
text;

setTimeout(
function() {

story.innerText =
"";

},
time
);
}


/* =========================
OBJECTIVE
========================= */

const objective =
document.createElement("div");

objective.style.position =
"fixed";

objective.style.top =
"20px";

objective.style.left =
"20px";

objective.style.color =
"white";

objective.style.background =
"rgba(0,0,0,0.35)";

objective.style.padding =
"10px 15px";

objective.style.zIndex =
"30";

objective.innerText =
"目標：探索屯門碼頭";

document.body.appendChild(
objective
);


/* =========================
STORY TRIGGER
========================= */

function storyCheck() {

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
3000
);

setTimeout(
startEnding,
7000
);
}
}


/* =========================
ENDING
========================= */

function startEnding() {

if (ending)
return;

ending = true;

chapter = 3;

objective.innerText =
"CHAPTER 3：A NEW BEGINNING";

say(
"五年後……"
);

setTimeout(
function() {

say(
"Amy 同 Daniel 開始喺海邊建立生存區。"
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
"Amy 同 Daniel 結婚，並建立咗屬於自己嘅家庭。"
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

story.innerText =
"THE WORLD ENDED. WE BEGAN AGAIN.";

story.style.fontSize =
"25px";

},
32000
);
}


/* =========================
MOVEMENT
========================= */

function updateMovement(delta) {

const speed =
5 * delta;

let forward = 0;

let sideways = 0;


if (movement.forward)
forward += 1;

if (movement.backward)
forward -= 1;

if (movement.right)
sideways += 1;

if (movement.left)
sideways -= 1;


const direction =
new THREE.Vector3(
sideways,
0,
-forward
);


if (
direction.length() > 0
) {

direction.normalize();

direction.applyAxisAngle(
new THREE.Vector3(0,1,0),
yaw
);

camera.position.add(
direction.multiplyScalar(
speed
)
);
}


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


/* =========================
CAMERA
========================= */

function updateCamera() {

camera.rotation.order =
"YXZ";

camera.rotation.y =
yaw;

camera.rotation.x =
pitch;
}


/* =========================
GAME LOOP
========================= */

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

updateMovement(
delta
);

updateCamera();

storyCheck();

renderer.render(
scene,
camera
);
}


animate();


/* =========================
RESIZE
========================= */

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

const startButton =
document.getElementById("startButton");

const startScreen =
document.getElementById("startScreen");

startButton.addEventListener(
"click",
function() {

startScreen.style.display =
"none";

say(
"Amy：五年了……我終於再次回到屯門碼頭。"
);

objective.innerText =
"目標：探索屯門碼頭";
}
);
