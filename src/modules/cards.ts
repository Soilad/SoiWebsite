import { gsap } from "gsap";

const pointerCircle = document.getElementById("pointerCircle")!;
const MIDDLE_OFFSET = pointerCircle.getBoundingClientRect().height >> 1;
const POINTER_SPEED = 1;

// quickTo keeps one tween per property and retargets it in place.
// A new tween per mousemove restarts the ease from zero velocity, which looks like a stutter-then-snap.
const POINTER_EASE = "power3.out";
const pointerX = gsap.quickTo(pointerCircle, "x", { duration: POINTER_SPEED, ease: POINTER_EASE });
const pointerY = gsap.quickTo(pointerCircle, "y", { duration: POINTER_SPEED, ease: POINTER_EASE });
const pointerRotateX = gsap.quickTo(pointerCircle, "rotationX", { duration: POINTER_SPEED, ease: POINTER_EASE });
const pointerRotateY = gsap.quickTo(pointerCircle, "rotationY", { duration: POINTER_SPEED, ease: POINTER_EASE });

function pointerOpacity(a_opacity: number) {
  gsap.to(
    pointerCircle,
    {
      opacity: a_opacity,
      overwrite: "auto"
    }
  )
}

export function AddCardPointers() {
  const overlay = document.getElementById("overlay")!;

  // The circle lives in #overlay's scrolled content, so it moves with the scroll.
  // Re-place it on scroll too, or it drifts away from a cursor that has not moved.
  let lastX = 0;
  let lastY = 0;
  const placeCircle = () => {
    pointerX(lastX - MIDDLE_OFFSET);
    pointerY(lastY - MIDDLE_OFFSET + overlay.scrollTop);
  };
  overlay.addEventListener("scroll", placeCircle, { passive: true });

  document.querySelectorAll<HTMLElement>(".tiltCard").forEach(
    (card) => {
      card.addEventListener(
        "mousemove",
        (e) => {
          pointerOpacity(1);
          lastX = e.clientX;
          lastY = e.clientY;
          placeCircle();
        },
      );
      // mouseleave, not mouseout: mouseout also fires when the cursor moves onto a child.
      card.addEventListener(
        "mouseleave",
        () => pointerOpacity(0),
      );
    }
  );
}

export function AddCardTilts() {
  const TILT_ANGLE = 5;
  const tiltPointerGuy = (a_rotateX: number, a_rotateY: number) => {
    pointerRotateX(a_rotateX);
    pointerRotateY(a_rotateY);
  }
  document.querySelectorAll<HTMLElement>(".tiltCard").forEach(
    card => {
      const cardContainer = document.createElement("div");
      cardContainer.classList.add("cardContainer");
      cardContainer.append(...Array.from(card.childNodes));
      card.appendChild(cardContainer);
      card.addEventListener(
        "mousemove",
        (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const offsetY = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const offsetX = ((e.clientY - rect.top) / rect.height) * 2 - 1;

          cardContainer.style.transform = `rotateX(${-offsetX * TILT_ANGLE}deg) rotateY(${offsetY * TILT_ANGLE}deg)`
          tiltPointerGuy(-offsetX * TILT_ANGLE, offsetY * TILT_ANGLE);
        },
      );
      card.addEventListener(
        "mouseleave",
        () => {
          cardContainer.style.transform = `rotateX(0deg) rotateY(0deg)`;
          tiltPointerGuy(0, 0);
          pointerOpacity(0)
        },
      );
    }
  );
}
