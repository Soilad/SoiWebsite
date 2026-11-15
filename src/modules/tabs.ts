// Slide the .tabs highlight (its ::before) onto the hovered or focused tab.
// Done in JS rather than CSS anchor positioning so the slide animates in every browser.
// With no tab active the custom properties are removed and the CSS falls back to filling .tabs.
export function AddTabHighlight() {
  document.querySelectorAll<HTMLElement>(".tabs").forEach((tabs) => {
    const highlight = (tab: HTMLElement) => {
      tabs.style.setProperty("--tab-left", `${tab.offsetLeft}px`);
      tabs.style.setProperty("--tab-top", `${tab.offsetTop}px`);
      tabs.style.setProperty("--tab-width", `${tab.offsetWidth}px`);
      tabs.style.setProperty("--tab-height", `${tab.offsetHeight}px`);
    };
    const reset = () => {
      for (const name of ["--tab-left", "--tab-top", "--tab-width", "--tab-height"]) {
        tabs.style.removeProperty(name);
      }
    };

    for (const tab of Array.from(tabs.children) as HTMLElement[]) {
      tab.addEventListener("pointerenter", () => highlight(tab));
      tab.addEventListener("focus", () => highlight(tab));
    }
    tabs.addEventListener("pointerleave", reset);
    tabs.addEventListener("focusout", (event) => {
      if (!tabs.contains(event.relatedTarget as Node | null)) reset();
    });
  });
}
