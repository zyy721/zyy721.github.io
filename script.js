"use strict";

// Progressive enhancement: the figures are ordinary image links without JS.
const figureDialog = document.querySelector(".figure-dialog");
const enlargedFigure = document.querySelector("#enlarged-figure");
const figureCaption = document.querySelector("#figure-caption");
const figureViewport = document.querySelector("#figure-viewport");
const figureOriginal = document.querySelector("#figure-original");
const zoomButton = document.querySelector(".dialog-zoom");

if (figureDialog && typeof figureDialog.showModal === "function") {
  const setZoom = (zoomed) => {
    if (zoomed) {
      const fittedWidth = enlargedFigure.getBoundingClientRect().width;
      enlargedFigure.style.width = `${Math.max(enlargedFigure.naturalWidth, Math.round(fittedWidth * 2))}px`;
    } else {
      enlargedFigure.style.removeProperty("width");
    }
    figureDialog.classList.toggle("is-zoomed", zoomed);
    zoomButton.setAttribute("aria-pressed", String(zoomed));
    zoomButton.textContent = zoomed ? "Fit to screen" : "Zoom in";
    figureViewport.scrollTop = 0;
    figureViewport.scrollLeft = 0;
  };

  document.querySelectorAll("a[data-figure]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const thumbnail = link.querySelector("img");
      enlargedFigure.src = link.href;
      enlargedFigure.alt = link.dataset.figureAlt || thumbnail?.alt || link.dataset.caption || "Research figure";
      figureCaption.textContent = link.dataset.caption;
      figureOriginal.href = link.href;
      setZoom(false);
      figureDialog.showModal();
      document.body.classList.add("dialog-open");
    });
  });
  zoomButton.addEventListener("click", () => {
    setZoom(!figureDialog.classList.contains("is-zoomed"));
  });
  figureDialog.querySelector(".dialog-close").addEventListener("click", () => figureDialog.close());
  figureDialog.addEventListener("click", (event) => {
    if (event.target !== figureDialog) return;
    const box = figureDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) {
      figureDialog.close();
    }
  });
  figureDialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    setZoom(false);
  });
}
