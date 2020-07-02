const imageElems = [];

const container = document.getElementById("img-container");
if (!container) throw new Error("No image container found");

const init = async (): Promise<void> => {
  for (let idx = 0; idx < 25; idx++) {
    const element = defaultElem();
    container.append(element);
    imageElems.push(element);
  }
};

function defaultElem(): HTMLDivElement {
  const element = document.createElement("div");
  element.classList.add("image", "loading", "lax");
  element.setAttribute("data-lax-preset", "fadeIn");
  return element;
}

async function loadImages() {
  const res = await fetch(
    "https://api.github.com/repos/SagnikPradhan/garden-photos/contents/photos"
  );
  const images: any[] = await res.json();

  for (const image of images.slice(1, 20)) {
    const imageElem = document.createElement("img");
    imageElem.setAttribute("loading", "lazy");
    imageElem.setAttribute("src", image.download_url);
    container?.appendChild(imageElem);
  }
}

// Laxxx
window.addEventListener("load", () => {
  /* @ts-expect-error */
  lax.setup();

  const updateLax = () => {
    /* @ts-expect-error */
    lax.update(window.scrollY);
    window.requestAnimationFrame(updateLax);
  };

  window.requestAnimationFrame(updateLax);
});

init().catch(console.error);
