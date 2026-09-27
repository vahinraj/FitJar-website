// The import map in index.html resolves GLTFLoader's bare `three` import.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.185.0/examples/jsm/loaders/GLTFLoader.js';
import { BODY_MODEL_GZIP_BASE64 } from './body-model-data.js';
import { BODY_FACE_GZIP_BASE64, BODY_FEMALE_OVERLAY_GZIP_BASE64 } from './body-overlay-data.js';

const canvas = document.querySelector('#body-preview');
const loading = document.querySelector('#body-loading');
const buttons = [...document.querySelectorAll('[data-body-variant]')];
const modal = document.querySelector('#body-modal');
const openButton = document.querySelector('#body-preview-open');
const closeButton = document.querySelector('#body-preview-close');
const modalStage = document.querySelector('#body-modal-stage');
if (!canvas) throw new Error('FitJar body preview canvas is missing.');

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
const scene = new THREE.Scene();
scene.add(new THREE.HemisphereLight('#d8ffe2', '#07120d', 2.2));
const key = new THREE.DirectionalLight('#baff9b', 4.4); key.position.set(2.4, 3.8, 4); scene.add(key);
const rim = new THREE.DirectionalLight('#76a8ff', 3.8); rim.position.set(-3, 1.4, -4); scene.add(rim);
const camera = new THREE.PerspectiveCamera(27, 1, 0.1, 100);
camera.position.set(0, 0.02, 4.4);
const modelRoot = new THREE.Group();
scene.add(modelRoot);
let model;
let baseScale = 1;
let maleFaceOverlay;
let femaleSoftTissueOverlay;
let yaw = -0.28;
let pointerDown = false;
let lastX = 0;

function resize() {
  const bounds = canvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  renderer.setSize(bounds.width, bounds.height, false);
  camera.aspect = bounds.width / bounds.height;
  camera.updateProjectionMatrix();
}

function setModal(open) {
  if (!modal || !modalStage || !canvas) return;
  if (open) {
    modalStage.append(canvas);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    closeButton?.focus();
  } else {
    document.querySelector('.body-orb')?.append(canvas);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    openButton?.focus();
  }
  requestAnimationFrame(resize);
}

function materialFor(name) {
  const context = name === 'context';
  return new THREE.MeshStandardMaterial({
    color: context ? '#a9b5bf' : '#62b878',
    roughness: context ? 0.7 : 0.48,
    metalness: 0.16,
    emissive: context ? '#10231c' : '#102b1d',
    emissiveIntensity: 0.4,
  });
}

function overlayMaterial(color, roughness = 0.55) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0,
    emissive: '#071b12',
    emissiveIntensity: 0.16,
  });
}

function paintOverlay(group, variant) {
  if (!group) return;
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.frustumCulled = false;
    let node = object;
    let isBreast = false;
    while (node) {
      if (/breast_soft_tissue/i.test(node.name || '')) isBreast = true;
      node = node.parent;
    }
    object.material = overlayMaterial(
      variant === 'female-soft-tissue' && isBreast ? '#f8cfd4' : '#a6adb3',
      variant === 'female-soft-tissue' && isBreast ? 0.48 : 0.7,
    );
  });
}

function setOverlayVisibility(variant) {
  if (maleFaceOverlay) maleFaceOverlay.visible = variant === 'male';
  if (femaleSoftTissueOverlay) femaleSoftTissueOverlay.visible = variant === 'female';
}

function paintVariant(variant) {
  if (!model) return;
  model.scale.set(
    baseScale * (variant === 'female' ? 1.08 : 1),
    baseScale,
    baseScale * (variant === 'female' ? 1.025 : 1),
  );
  model.position.x = variant === 'female' ? 0.015 : 0;
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.material = materialFor(object.name);
  });
  paintOverlay(maleFaceOverlay, 'male-face');
  paintOverlay(femaleSoftTissueOverlay, 'female-soft-tissue');
  setOverlayVisibility(variant);
}

async function decodeGzipBase64(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).arrayBuffer();
}

async function loadGlb(value) {
  const binary = await decodeGzipBase64(value);
  const source = URL.createObjectURL(new Blob([binary], { type: 'model/gltf-binary' }));
  try {
    return (await new GLTFLoader().loadAsync(source)).scene;
  } finally {
    URL.revokeObjectURL(source);
  }
}

async function load() {
  try {
    const [anatomy, maleFace, femaleSoftTissue] = await Promise.all([
      loadGlb(BODY_MODEL_GZIP_BASE64),
      loadGlb(BODY_FACE_GZIP_BASE64),
      loadGlb(BODY_FEMALE_OVERLAY_GZIP_BASE64),
    ]);
    model = anatomy;
    maleFaceOverlay = maleFace;
    femaleSoftTissueOverlay = femaleSoftTissue;
    paintOverlay(maleFaceOverlay, 'male-face');
    paintOverlay(femaleSoftTissueOverlay, 'female-soft-tissue');
    maleFaceOverlay.visible = false;
    femaleSoftTissueOverlay.visible = false;
    model.add(maleFaceOverlay, femaleSoftTissueOverlay);
    model.traverse((object) => { if (object instanceof THREE.Mesh) object.frustumCulled = false; });
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    model.position.sub(center);
    model.position.y += size.y * 0.02;
    model.scale.multiplyScalar(1.8 / size.y);
    baseScale = model.scale.x;
    modelRoot.add(model);
    paintVariant('male');
    paintOverlay(maleFaceOverlay, 'male-face');
    paintOverlay(femaleSoftTissueOverlay, 'female-soft-tissue');
    setOverlayVisibility('male');
    loading?.remove();
  } catch (error) {
    if (loading) loading.textContent = 'Body preview unavailable';
    console.error('[FitJar] body preview failed', error);
  }
}

buttons.forEach((button) => button.addEventListener('click', () => {
  const variant = button.dataset.bodyVariant || 'male';
  buttons.forEach((item) => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  paintVariant(variant);
}));
openButton?.addEventListener('click', () => setModal(true));
closeButton?.addEventListener('click', () => setModal(false));
modal?.addEventListener('click', (event) => { if (event.target === modal) setModal(false); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal?.classList.contains('open')) setModal(false); });
canvas.addEventListener('pointerdown', (event) => { pointerDown = true; lastX = event.clientX; canvas.setPointerCapture(event.pointerId); });
canvas.addEventListener('pointermove', (event) => { if (!pointerDown) return; yaw += (event.clientX - lastX) * 0.012; lastX = event.clientX; });
canvas.addEventListener('pointerup', () => { pointerDown = false; });
canvas.addEventListener('pointercancel', () => { pointerDown = false; });
window.addEventListener('resize', resize, { passive: true });
resize();
load();
function animate() {
  requestAnimationFrame(animate);
  if (!pointerDown) yaw += 0.0012;
  modelRoot.rotation.y += (yaw - modelRoot.rotation.y) * 0.06;
  renderer.render(scene, camera);
}
animate();
