import * as THREE from 'three';
import { gsap } from "gsap"
const pointerCircle = document.createElement("div");

function AddCardPointers() {
  pointerCircle.classList.add("pointerCircle");
  document.getElementById("overlay")?.appendChild(pointerCircle);
  const middleOffset = pointerCircle.getBoundingClientRect().height >> 1;
  document.querySelectorAll<HTMLElement>(".pointerGuy").forEach(
    (pointerGuy) => {
      pointerGuy.addEventListener(
        "mousemove",
        (e) => {
          pointerCircle.style.opacity = "100%";
          pointerCircle.style.top = `${e.clientY - middleOffset + document.getElementById("overlay")!.scrollTop}px`;
          pointerCircle.style.left = `${e.clientX - middleOffset}px`;
        },
      );
      pointerGuy.addEventListener(
        "mouseout",
        () => pointerCircle.style.opacity = "0",
      );
    }
  );
}

function AddCardTilts() {
  const TILT_ANGLE = 30;
  document.querySelectorAll<HTMLElement>(".card").forEach(
    card => {
      const innerCard = card.querySelector<HTMLElement>(".innerCard")!;
      card.addEventListener(
        "mouseleave",
        () => {
          innerCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
          pointerCircle.style.transform = `rotateX(0deg) rotateY(0deg)`;
        },
      );
      card.addEventListener(
        "mousemove",
        (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const offsetY = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const offsetX = ((e.clientY - rect.top) / rect.height) * 2 - 1;

          const transformation = `rotateX(${-offsetX * TILT_ANGLE}deg) rotateY(${offsetY * TILT_ANGLE}deg)`
          console.log(transformation);
          innerCard.style.transform = transformation;
          pointerCircle.style.transform = transformation;
        },
      );
    }
  );
}

function ThreeJS() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  const cube: THREE.Mesh = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const raycaster: THREE.Raycaster = new THREE.Raycaster();
  renderer.domElement.addEventListener(
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
  gsap.to(cube.position, { x: 3 });
  function animate(time: number) {
    // cube.rotation.x = time / 1000;
    cube.rotation.y = time / 1000;
    material.color.setHSL((time / 1000) % 1, 1, 0.5);
    renderer.render(scene, camera);
    const hits = raycaster.intersectObjects(scene.children).map(x => x.object.uuid);
    scene.children.forEach(
      object => {
        if (hits.includes(object.uuid)) {
          object.rotation.x += .1;
          gsap.to(
            object.scale,
            {
              x: 2,
              y: 2,
              z: 2,
              yoyo: true,
            },
          )
        } else {
          gsap.to(
            object.scale,
            {
              x: 1,
              y: 1,
              z: 1,
              yoyo: true,
            },
          )

        }
      }
    )
  }
  renderer.setAnimationLoop(animate);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function GSAP() {
  gsap.to(
    ".unHighlight",
    {
      "--width": 0,
      stagger: 0.1
    }
  );
}

function AddNorrisText() {
  Array.from(document.getElementsByClassName("landoText"))
    .forEach(
      (norrisText) => {
        const chars: string[] = Array.from(norrisText.textContent.trim())
        const charsDiv = document.createElement("div");
        norrisText.classList.forEach(
          (_class) => {
            charsDiv.classList.add(_class);
          }
        )
        chars.map(
          (char) => {
            const charSpan = document.createElement("span");
            charSpan.innerHTML = char;
            // charSpan.classList.add("landoText");
            charsDiv.appendChild(charSpan);
          }
        )
        norrisText.replaceWith(charsDiv);
      }

    );

}

ThreeJS();
AddCardTilts();
AddCardPointers();
AddNorrisText();
GSAP();
