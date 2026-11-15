const pointerCircle = document.getElementById("pointerCircle")!;

export function AddCardPointers() {
  const overlay = document.getElementById("overlay")!;
  const middleOffset = pointerCircle.getBoundingClientRect().height >> 1;

  // The circle lives in #overlay's scrolled content, so it moves with the scroll.
  // Re-place it on scroll too, or it drifts away from a cursor that has not moved.
  let lastX = 0;
  let lastY = 0;
  const placeCircle = () => {
    pointerCircle.style.top = `${lastY - middleOffset + overlay.scrollTop}px`;
    pointerCircle.style.left = `${lastX - middleOffset}px`;
  };
  overlay.addEventListener("scroll", placeCircle, { passive: true });

  document.querySelectorAll<HTMLElement>(".tiltCard").forEach(
    (card) => {
      card.addEventListener(
        "mousemove",
        (e) => {
          pointerCircle.style.opacity = "1";
          lastX = e.clientX;
          lastY = e.clientY;
          placeCircle();
        },
      );
      // mouseleave, not mouseout: mouseout also fires when the cursor moves onto a child.
      card.addEventListener(
        "mouseleave",
        () => pointerCircle.style.opacity = "0",
      );
    }
  );
}

export function AddCardTilts() {
  const TILT_ANGLE = 10;
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

          const transformation = `rotateX(${-offsetX * TILT_ANGLE}deg) rotateY(${offsetY * TILT_ANGLE}deg)`
          cardContainer.style.transform = transformation;
          pointerCircle.style.transform = transformation;
        },
      );
      card.addEventListener(
        "mouseleave",
        () => {
          cardContainer.style.transform = `rotateX(0deg) rotateY(0deg)`;
          pointerCircle.style.transform = `rotateX(0deg) rotateY(0deg)`;
        },
      );
    }
  );
}
