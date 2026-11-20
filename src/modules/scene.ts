import * as THREE from "three";
import { gsap } from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import modelUrl from "../Untitled.glb?url";

const SPIN_SPEED = 0.5; // radians per second

export function ThreeJS() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const canvas = document.getElementById("threeCanvas") as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // The model is wrapped in a pivot group: the loaded scene gets re-centred inside it,
  // so rotating/scaling the pivot spins the character around its own middle.
  const pivot = new THREE.Group();
  scene.add(pivot);
  let animationMixer: THREE.AnimationMixer | undefined;
  const timer = new THREE.Timer();
  new GLTFLoader().load(
    modelUrl,
    (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      // Fit the tallest side to ~3 units so it fills the view at camera z = 5
      const fit = 3 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(fit);
      model.position.copy(center).multiplyScalar(-fit);
      pivot.add(model);

      // Play the clip baked in Blender ("clinging") on loop
      animationMixer = new THREE.AnimationMixer(model);
      const clip = THREE.AnimationClip.findByName(gltf.animations, "clinging") ?? gltf.animations[0];
      if (clip) animationMixer.clipAction(clip).play();
    },
    undefined,
    (err) => console.error("Could not load Untitled.glb", err),
  );

  const raycaster: THREE.Raycaster = new THREE.Raycaster();
  document.body.addEventListener(
    "mousemove",
    (e: MouseEvent) => {
      const X = (e.clientX * 2 / window.innerWidth) - 1;
      const Y = -(e.clientY * 2 / window.innerHeight) + 1;
      raycaster.setFromCamera(
        new THREE.Vector2(X, Y),
        camera
      )
    }
  );


  const light = new THREE.HemisphereLight(
    0xffffff,
    0x000000,
    1
  );
  scene.add(light);

  camera.position.z = 5;
  function animate(time: number) {
    timer.update(time);
    const delta = timer.getDelta();
    animationMixer?.update(delta);
    // Spin the pivot around its vertical axis, frame-rate independent
    pivot.rotation.y += delta * SPIN_SPEED;
    renderer.render(scene, camera);

    // Grow while the cursor is over any part of the model
    const hovered = raycaster.intersectObject(pivot, true).length > 0;
    if (hovered !== wasHovered) {
      wasHovered = hovered;
      const s = hovered ? 1.2 : 1;
      gsap.to(pivot.scale, { x: s, y: s, z: s, duration: 0.4, overwrite: true });
    }
  }
  let wasHovered = false;
  renderer.setAnimationLoop(animate);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
