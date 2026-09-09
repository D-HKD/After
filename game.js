import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

let scene, camera, renderer, clock;
let gameStarted = false;
let cinematic = false;
let ending = false;
let player;
let daniel;
let water;
let yaw = 0;
let pitch = 0;
let keys = {};
let storyStep = 0;
let reunionTime = 0;

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const PLAYER_HEIGHT = 1.7;
const WALK_SPEED = 4.2;
const RUN_SPEED = 6.2;

const C = {
ground: 0x555956,
road: 0x282d2e,
concrete: 0x777a76,
building: 0x696d6a,
glass: 0x30434a,
metal: 0x454b4b,
rail: 0x777b79,
water: 0x315762,
tree: 0x39483d,
trunk: 0x4d4137,
skin: 0xb98569,
shirt: 0x3e4a4b,
pants: 0x252a2b
};

function mat(color, rough = .8, metal = 0) {
return new THREE.MeshStandardMaterial({
color,
roughness: rough,
metalness: metal
});
}

function box(
x,y,z,
w,h,d,
material,
parent = scene
) {
const mesh = new THREE.Mesh(
new THREE.BoxGeometry(w,h,d),
material
);

mesh.position.set(x,y,z);
mesh.castShadow = true;
mesh.receiveShadow = true;
parent.add(mesh);

return mesh;
}

function cylinder(
x,y,z,
rt,rb,h,
material,
parent = scene
) {
const mesh = new THREE.Mesh(
new THREE.CylinderGeometry(
rt,rb,h,16
),
material
);

mesh.position.set(x,y,z);
mesh.castShadow = true;
mesh.receiveShadow = true;
parent.add(mesh);

return mesh;
}

function sphere(
x,y,z,
r,
material,
parent = scene
) {
const mesh = new THREE.Mesh(
new THREE.SphereGeometry(
r,20,14
),
material
);

mesh.position.set(x,y,z);
mesh.castShadow = true;
mesh.receiveShadow = true;
parent.add(mesh);

return mesh;
}

function createLighting() {

const hemi =
new THREE.HemisphereLight(
0xb9c7cc,
0x25282a,
1.15
);

scene.add(hemi);

const sun =
new THREE.DirectionalLight(
0xd8e1e4,
1.65
);

sun.position.set(
-45,75,30
);

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;

scene.add(sun);

const fill =
new THREE.DirectionalLight(
0x8298ad,
.32
);

fill.position.set(
50,35,-100
);

scene.add(fill);
}

function createGround() {

const ground = new THREE.Mesh(
new THREE.PlaneGeometry(
150,250,50,80
),
mat(C.ground,.95)
);

ground.rotation.x =
-Math.PI / 2;

ground.position.set(
0,-2,-55
);

ground.receiveShadow = true;

scene.add(ground);
}

function createRoad() {

box(
0,-1.94,-45,
18,.12,190,
mat(C.road,.98)
);

const line = mat(
0xc8c5aa,.8
);

for(
let z=45;
z>-135;
z-=8
) {
box(
0,-1.86,z,
.14,.025,3.8,
line
);
}
}

function createBuilding(
x,z,w,h,d,color
) {

const group =
new THREE.Group();

group.position.set(
x,-2,z
);

scene.add(group);

box(
0,h/2,0,
w,h,d,
mat(color,.88),
group
);

box(
0,h+.18,0,
w+.3,.3,d+.3,
mat(0x424647,.9,.15),
group
);

const glass =
new THREE.MeshPhysicalMaterial({
color:C.glass,
roughness:.18,
metalness:.08,
transmission:.03
});

const rows =
Math.max(
1,
Math.floor(h/3)
);

const cols =
Math.max(
2,
Math.floor(w/3)
);

for(
let r=0;
r<rows;
r++
) {

for(
let c=0;
c<cols;
c++
) {

const wx =
-w/2+1.3+
c*((w-2.6)/
Math.max(1,cols-1));

const wy =
2+r*2.8;

if(
wy>h-1
) continue;

box(
wx,wy,d/2+.02,
.9,1.25,.04,
glass,
group
);
}
}
}

function createBuildings() {

createBuilding(
-29,-25,
30,18,23,
0x777b78
);

createBuilding(
30,-18,
28,22,24,
0x686d6a
);

createBuilding(
-30,-77,
25,15,20,
0x746f67
);

createBuilding(
31,-94,
30,20,27,
0x656967
);

createBuilding(
-30,-130,
33,19,26,
0x6d716d
);
}

function createLRT() {

const rail =
mat(C.rail,.38,.8);

const sleeper =
mat(0x454947,.92);

for(
const x of [-3.2,3.2]
) {
box(
x,-1.73,-35,
.15,.18,205,
rail
);
}

for(
let z=60;
z>-135;
z-=2.1
) {
box(
0,-1.82,z,
8,.16,.35,
sleeper
);
}

const pole =
mat(0x515858,.58,.4);

for(
let z=50;
z>-130;
z-=18
) {

cylinder(
-6.5,3,z,
.09,.13,10,
pole
);

box(
-2.8,7.8,z,
7.3,.1,.1,
pole
);
}
}

function createStation() {

const station =
new THREE.Group();

station.position.set(
0,-2,-63
);

scene.add(station);

box(
0,.12,0,
15,.3,10,
mat(C.concrete,.9),
station
);

box(
0,5,0,
16,.3,11,
mat(0x555b5b,.65,.2),
station
);

const pillar =
mat(0x5e6361,.75);

for(
const x of [-6.5,6.5]
) {
for(
const z of [-4.2,4.2]
) {
cylinder(
x,2.5,z,
.22,.27,5,
pillar,
station
);
}
}

box(
0,4.05,5.55,
7,1.2,.12,
mat(0xd4d8d3,.55),
station
);
}

function createCars() {

createCar(
-5,-20,0,0x555e62
);

createCar(
5,-34,Math.PI,0x77716a
);

createCar(
-5,-76,0,0x4b5558
);

createCar(
5,-91,Math.PI,0x67635e
);
}

function createCar(
x,z,rotation,color
) {

const car =
new THREE.Group();

car.position.set(
x,-1.7,z
);

car.rotation.y =
rotation;

scene.add(car);

const body =
mat(color,.42,.28);

box(
0,.7,0,
3.1,.72,5.4,
body,
car
);

box(
0,1.3,-.2,
2.6,.8,2.8,
body,
car
);

const glass =
new THREE.MeshPhysicalMaterial({
color:0x26363b,
roughness:.15,
metalness:.1
});

box(
0,1.35,-.2,
2.25,.55,2.35,
glass,
car
);

const wheel =
mat(0x171919,.75,.1);

for(
const wx of [-1.45,1.45]
) {
for(
const wz of [-1.75,1.75]
) {

const w =
cylinder(
wx,.4,wz,
.45,.45,.28,
wheel,
car
);

w.rotation.z =
Math.PI/2;
}
}
}

function createTrees() {

const leaf =
mat(C.tree,.96);

const trunk =
mat(C.trunk,.95);

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
p => {

const tree =
new THREE.Group();

tree.position.set(
p[0],-2,p[1]
);

tree.scale.setScalar(
p[2]
);

scene.add(tree);

cylinder(
0,2,0,
.2,.3,4,
trunk,
tree
);

sphere(
-.4,4.3,0,
1.25,
leaf,
tree
);

sphere(
.5,4.5,.1,
1.45,
leaf,
tree
);

sphere(
0,5.2,-.3,
1.15,
leaf,
tree
);
}
);
}

function createDebris() {

const concrete =
mat(0x555957,.94);

const metal =
mat(0x3e4444,.7,.55);

for(
let i=0;
i<90;
i++
) {

const x =
THREE.MathUtils.randFloat(
-8,8
);

const z =
THREE.MathUtils.randFloat(
-145,45
);

if(
Math.abs(x)<3
) continue;

const w =
THREE.MathUtils.randFloat(
.15,1.4
);

const h =
THREE.MathUtils.randFloat(
.08,.5
);

const d =
THREE.MathUtils.randFloat(
.15,1
);

const object =
box(
x,
-1.9+h/2,
z,
w,h,d,
Math.random()>.65
? metal
: concrete
);

object.rotation.set(
Math.random()*.5,
Math.random()*Math.PI,
Math.random()*.5
);
}
}

function createPier() {

const pier =
new THREE.Group();

pier.position.set(
0,-2,-150
);

scene.add(pier);

box(
0,.2,0,
38,.45,50,
mat(0x655e54,.82),
pier
);

const railing =
mat(0x505756,.58,.45);

for(
let z=-23;
z<=23;
z+=3
) {

cylinder(
-18,1,z,
.055,.07,2,
railing,
pier
);

cylinder(
18,1,z,
.055,.07,2,
railing,
pier
);
}

box(
-18,1.9,0,
.1,.1,50,
railing,
pier
);

box(
18,1.9,0,
.1,.1,50,
railing,
pier
);

for(
let z=-21;
z<=21;
z+=7
) {

cylinder(
-13,-3.8,z,
.35,.45,7,
mat(0x4b4e4c,.9),
pier
);

cylinder(
13,-3.8,z,
.35,.45,7,
mat(0x4b4e4c,.9),
pier
);
}
}

function createWater() {

const geometry =
new THREE.PlaneGeometry(
220,120,80,50
);

const material =
new THREE.MeshPhysicalMaterial({
color:C.water,
roughness:.2,
metalness:.18,
clearcoat:.55
});

water =
new THREE.Mesh(
geometry,
material
);

water.rotation.x =
-Math.PI/2;

water.position.set(
0,-1.8,-178
);

scene.add(water);
}

function updateWater(time) {

if(!water) return;

const p =
water.geometry
.attributes.position;

for(
let i=0;
i<p.count;
i++
) {

const x =
p.getX(i);

const y =
p.getY(i);

p.setZ(
i,
Math.sin(
x*.055+time*.7
)*.14 +
Math.sin(
y*.08+time*.5
)*.08
);
}

p.needsUpdate = true;
}

function createStreetLights() {

const pole =
mat(0x4b5150,.55,.4);

const lampMat =
new THREE.MeshStandardMaterial({
color:0xffd18a,
emissive:0xffa24d,
emissiveIntensity:1.8
});

for(
let z=45;
z>-130;
z-=22
) {

cylinder(
-11,2,z,
.09,.13,8,
pole
);

box(
-11,6.1,z,
1.8,.1,.1,
pole
);

box(
-11.9,6,z,
.45,.18,.35,
lampMat
);

const light =
new THREE.PointLight(
0xffbd78,
1.1,
14
);

light.position.set(
-11.9,5.9,z
);

scene.add(light);
}
}

function createCharacter(
shirtColor
) {

const group =
new THREE.Group();

const skin =
new THREE.MeshPhysicalMaterial({
color:C.skin,
roughness:.7,
clearcoat:.12
});

const shirt =
mat(
shirtColor,
.82
);

const pants =
mat(C.pants,.92);

box(
0,1.45,0,
.72,1.35,.42,
shirt,
group
);

sphere(
0,2.45,0,
.29,
skin,
group
);

sphere(
0,2.63,-.01,
.30,
mat(0x202020,.95),
group
);

box(
-.19,.48,0,
.3,.95,.34,
pants,
group
);

box(
.19,.48,0,
.3,.95,.34,
pants,
group
);

cylinder(
-.48,1.45,0,
.11,.13,1.2,
shirt,
group
);

cylinder(
.48,1.45,0,
.11,.13,1.2,
shirt,
group
);

return group;
}

function createDaniel() {

daniel =
createCharacter(
0x39474a
);

daniel.position.set(
0,-2,-126
);

daniel.rotation.y =
Math.PI;

daniel.visible = false;

scene.add(daniel);
}

function createFlashlight() {

const light =
new THREE.SpotLight(
0xeaf3ff,
3.8,
30,
Math.PI/7,
.4,
1.3
);

light.castShadow = true;

scene.add(light);

player.flashlight =
light;

player.flashTarget =
new THREE.Object3D();

scene.add(
player.flashTarget
);

light.target =
player.flashTarget;
}

function updateFlashlight() {

if(
!player.flashlight
) return;

player.flashlight.position.copy(
camera.position
);

const dir =
new THREE.Vector3(
0,0,-1
);

dir.applyQuaternion(
camera.quaternion
);

player.flashTarget.position.copy(
camera.position
);

player.flashTarget.position.add(
dir.multiplyScalar(12)
);
}

function createHUD() {

let hud =
document.getElementById("hud");

if(!hud) {

hud =
document.createElement("div");

hud.id = "hud";

hud.style.position =
"fixed";

hud.style.left =
"18px";

hud.style.top =
"18px";

hud.style.color =
"#fff";

hud.style.fontFamily =
"Arial,sans-serif";

hud.style.fontSize =
"13px";

hud.style.textShadow =
"0 2px 8px #000";

hud.style.zIndex =
"2000";

document.body.appendChild(hud);
}

hud.innerHTML =
"屯門碼頭 — 五年後<br>" +
"目標：尋找 Daniel";
}

function message(
text,
duration=4000
) {

let el =
document.getElementById(
"message"
);

if(!el) {

el =
document.createElement(
"div"
);

el.id = "message";

el.style.position =
"fixed";

el.style.left =
"50%";

el.style.bottom =
"12%";

el.style.transform =
"translateX(-50%)";

el.style.width =
"90%";

el.style.maxWidth =
"850px";

el.style.textAlign =
"center";

el.style.color =
"#fff";

el.style.fontFamily =
"Arial,sans-serif";

el.style.fontSize =
"clamp(18px,3vw,28px)";

el.style.lineHeight =
"1.7";

el.style.textShadow =
"0 3px 14px #000";

el.style.zIndex =
"5000";

el.style.pointerEvents =
"none";

document.body.appendChild(el);
}

el.innerHTML = text;
el.style.opacity = "1";

clearTimeout(el.timer);

el.timer =
setTimeout(
()=>{
el.style.opacity =
"0";
},
duration
);
}

function speak(text) {

if(
!window.speechSynthesis
) return;

try {

speechSynthesis.cancel();

const u =
new SpeechSynthesisUtterance(
text
);

u.lang = "zh-HK";
u.rate = .9;
u.pitch = 1;
u.volume = .8;

const voices =
speechSynthesis.getVoices();

const voice =
voices.find(
v =>
v.lang &&
(
v.lang
.toLowerCase()
.includes("zh-hk") ||
v.lang
.toLowerCase()
.includes("yue")
)
);

if(voice)
u.voice = voice;

speechSynthesis.speak(u);

} catch(e) {
console.warn(e);
}
}

function startGame() {

if(gameStarted)
return;

gameStarted = true;

if(startScreen) {

startScreen.style.display =
"none";

startScreen.style.pointerEvents =
"none";
}

try {

if(
window.AudioContext ||
window.webkitAudioContext
) {
const AC =
window.AudioContext ||
window.webkitAudioContext;

const ctx =
new AC();

if(
ctx.state ===
"suspended"
) {
ctx.resume();
}
}

} catch(e) {}

createHUD();

message(
"五年後，屯門碼頭。<br>" +
"Amy 開始尋找失聯已久嘅 Daniel。",
5500
);

speak(
"Daniel……你仲喺唔喺度？"
);
}

function setupInput() {

document.addEventListener(
"pointerdown",
e => {

if(
e.target &&
(
e.target.id ===
"startButton" ||
e.target.closest?.(
"#startButton"
)
)
) {

e.preventDefault();
e.stopPropagation();
startGame();
}

},
true
);

document.addEventListener(
"click",
e => {

if(
e.target &&
(
e.target.id ===
"startButton" ||
e.target.closest?.(
"#startButton"
)
)
) {

e.preventDefault();
e.stopPropagation();
startGame();
}

},
true
);

window.addEventListener(
"keydown",
e => {
keys[e.code] = true;
}
);

window.addEventListener(
"keyup",
e => {
keys[e.code] = false;
}
);

renderer.domElement.addEventListener(
"click",
() => {

if(
gameStarted &&
!cinematic
) {

try {
renderer.domElement
.requestPointerLock();
} catch(e) {}
}
}
);

document.addEventListener(
"mousemove",
e => {

if(
document.pointerLockElement !==
renderer.domElement
) return;

if(
!gameStarted ||
cinematic ||
ending
) return;

yaw -=
e.movementX*.0022;

pitch -=
e.movementY*.0018;

pitch =
THREE.MathUtils.clamp(
pitch,
-1.1,
1.1
);
}
);
}

function updatePlayer(delta) {

if(
!gameStarted ||
cinematic ||
ending
) return;

let forward = 0;
let side = 0;

if(
keys.KeyW ||
keys.ArrowUp
) forward++;

if(
keys.KeyS ||
keys.ArrowDown
) forward--;

if(
keys.KeyA ||
keys.ArrowLeft
) side--;

if(
keys.KeyD ||
keys.ArrowRight
) side++;

const dir =
new THREE.Vector3(
0,0,-1
);

dir.applyQuaternion(
camera.quaternion
);

dir.y = 0;
dir.normalize();

const right =
new THREE.Vector3(
dir.z,
0,
-dir.x
);

const movement =
new THREE.Vector3();

movement.addScaledVector(
dir,
forward
);

movement.addScaledVector(
right,
side
);

if(
movement.lengthSq()>0
) {

movement.normalize();

const speed =
keys.ShiftLeft ||
keys.ShiftRight
? RUN_SPEED
: WALK_SPEED;

player.position.addScaledVector(
movement,
speed*delta
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
-145,
30
);

camera.position.copy(
player.position
);

camera.rotation.order =
"YXZ";

camera.rotation.y = yaw;
camera.rotation.x = pitch;

updateFlashlight();
}

function checkStory() {

if(
!gameStarted ||
cinematic ||
ending
) return;

const z =
camera.position.z;

if(
storyStep === 0 &&
z < -42
) {

storyStep = 1;

message(
"前面係荒廢咗嘅輕鐵站……",
4500
);

speak(
"前面係輕鐵站……"
);
}

else if(
storyStep === 1 &&
z < -72
) {

storyStep = 2;

message(
"收音機突然收到微弱訊號……",
4500
);

speak(
"有人收到嗎……請去碼頭。"
);
}

else if(
storyStep === 2 &&
z < -100
) {

storyStep = 3;

message(
"無線電：「Amy……如果係你……嚟碼頭。」",
5000
);

speak(
"Amy……如果係你……嚟碼頭。"
);
}

else if(
storyStep === 3 &&
z < -119
) {

storyStep = 4;

startReunion();
}
}

function startReunion() {

cinematic = true;
reunionTime =
performance.now();

if(!daniel)
createDaniel();

daniel.visible = true;

daniel.position.set(
0,-2,-126
);

message(
"遠處一個熟悉嘅身影慢慢轉身……",
4500
);

speak(
"Daniel……係你？"
);
}

function updateReunion(time) {

if(!cinematic)
return;

const t =
time -
reunionTime;

if(t < 3500) {

const p =
THREE.MathUtils.clamp(
t/3500,
0,1
);

camera.position.lerp(
new THREE.Vector3(
0,2,-119
),
.025
);

camera.lookAt(
0,1.5,-126
);
}

else if(t < 7000) {

daniel.position.z =
THREE.MathUtils.lerp(
-126,
-122,
(t-3500)/3500
);

camera.lookAt(
0,1.5,-123
);

}

else if(t < 10500) {

const p =
(t-7000)/3500;

daniel.position.z =
THREE.MathUtils.lerp(
-122,
-119.8,
p
);

camera.position.set(
2.8-p*1.4,
2.2,
-120.5-p*1.2
);

camera.lookAt(
0,1.5,-120
);

}

else if(t < 14000) {

camera.position.set(
1.4,
2.0,
-122.5
);

camera.lookAt(
0,
1.45,
-120
);

}

else {

cinematic = false;

message(
"五年嘅等待，終於完結。<br>" +
"Amy 同 Daniel 再次相遇。",
5000
);

speak(
"我等咗你好耐。"
);

setTimeout(
startEnding,
5000
);
}
}

function startEnding() {

ending = true;

if(
document.pointerLockElement
) {
document.exitPointerLock();
}

createSettlement();

message(
"數年後……",
5000
);

setTimeout(
()=>{
showEnding(
"屯門海旁重新建立起一個生存社區。"
);
},
5000
);

setTimeout(
()=>{
showEnding(
"Amy 同 Daniel 結婚，<br>" +
"並建立咗屬於自己嘅家庭。"
);
},
10000
);

setTimeout(
()=>{
showEnding(
"世界曾經終結。<br>" +
"<strong>但人類重新開始。</strong>"
);
},
16000
);
}

function createSettlement() {

const group =
new THREE.Group();

scene.add(group);

const wood =
mat(0x625140,.92);

const canvas =
mat(0xa69d88,.98);

for(
let i=0;
i<5;
i++
) {

const x =
-10+i*5;

box(
x,-1.5,-146,
4,.35,4,
wood,
group
);

box(
x,.7,-146,
4,.12,4,
canvas,
group
);
}

const fire =
new THREE.PointLight(
0xff9c45,
2.8,
14
);

fire.position.set(
0,.5,-153
);

group.add(fire);

sphere(
0,-1.1,-153,
.35,
new THREE.MeshBasicMaterial({
color:0xff8a38
}),
group
);

const people = [
[-13,-151],
[-8,-158],
[8,-158],
[13,-151]
];

people.forEach(
p => {

const person =
createCharacter(
Math.random()>.5
? 0x4a5552
: 0x55504a
);

person.position.set(
p[0],-2,p[1]
);

group.add(person);
}
);

const amyFinal =
createCharacter(
0x4c5957
);

amyFinal.position.set(
-1.2,-2,-148
);

group.add(
amyFinal
);

const danielFinal =
createCharacter(
0x39474a
);

danielFinal.position.set(
1.2,-2,-148
);

group.add(
danielFinal
);

const child =
createCharacter(
0x68635b
);

child.scale.setScalar(
.55
);

child.position.set(
0,-2,-146.8
);

group.add(
child
);

camera.position.set(
17,
7,
-133
);

camera.lookAt(
0,
0,
-150
);
}

function showEnding(text) {

let overlay =
document.getElementById(
"endingOverlay"
);

if(!overlay) {

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
"rgba(0,0,0,.42)";

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

document.body.appendChild(
overlay
);
}

overlay.innerHTML =
`<div>${text}</div>`;
}

function animate() {

requestAnimationFrame(
animate
);

const delta =
Math.min(
clock.getDelta(),
.05
);

const time =
performance.now()*.001;

updateWater(time);

if(gameStarted) {

updatePlayer(delta);
checkStory();
}

if(cinematic) {
updateReunion(
performance.now()
);
}

renderer.render(
scene,
camera
);
}

function init() {

scene =
new THREE.Scene();

scene.background =
new THREE.Color(
0x68737a
);

scene.fog =
new THREE.FogExp2(
0x68737a,
.009
);

camera =
new THREE.PerspectiveCamera(
68,
innerWidth/innerHeight,
.05,
500
);

camera.position.set(
0,
PLAYER_HEIGHT,
28
);

renderer =
new THREE.WebGLRenderer({
antialias:true,
powerPreference:
"high-performance"
});

renderer.setPixelRatio(
Math.min(
devicePixelRatio,
1.7
)
);

renderer.setSize(
innerWidth,
innerHeight
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

player = {
position:
new THREE.Vector3(
0,
PLAYER_HEIGHT,
28
),
flashlight:null,
flashTarget:null
};

createLighting();
createGround();
createRoad();
createBuildings();
createLRT();
createStation();
createCars();
createTrees();
createDebris();
createPier();
createWater();
createStreetLights();
createDaniel();
createFlashlight();
setupInput();

window.addEventListener(
"resize",
()=>{
camera.aspect =
innerWidth/
innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
innerWidth,
innerHeight
);
}
);

if(startScreen) {

startScreen.style.zIndex =
"9999";

startScreen.style.pointerEvents =
"auto";
}

if(startButton) {

startButton.style.zIndex =
"10000";

startButton.style.pointerEvents =
"auto";

startButton.disabled =
false;
}

animate();
}

if(
document.readyState ===
"loading"
) {

document.addEventListener(
"DOMContentLoaded",
init,
{once:true}
);

} else {

init();
}
