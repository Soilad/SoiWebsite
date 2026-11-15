export function AddNorrisText() {
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
