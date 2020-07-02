const graphQLToken = "afa6d76dc0e5155f2aca8d637023951ffda26000";

const container = document.getElementById("img-container");
if (!container) throw new Error("No image container found");

const init = async (): Promise<void> => {
  const imageMeta = await getImageMeta()

  const lazyImageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target instanceof HTMLDivElement) {
        let lazyImage = entry.target;
        lazyImage.style.backgroundImage = `url(${lazyImage.dataset.src || ""})`;
        lazyImage.classList.remove("lazy");
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });

  for (let idx = 0; idx < imageMeta.length; idx++) {
    const element = defaultElem();
    element.dataset.src = `https://github.com/SagnikPradhan/garden-photos/raw/web/photos/${imageMeta[idx].name}`
    container.append(element);
    lazyImageObserver.observe(element)
  }
};

function defaultElem(): HTMLDivElement {
  const element = document.createElement("div");
  element.classList.add("image", "lazy", "lax");
  element.setAttribute("data-lax-preset", "fadeIn");
  return element;
}

async function getImageMeta() {
  const query = `query { 
    repository(name: "garden-photos", owner: "SagnikPradhan") {
      object(expression: "web:photos") {
        ... on Tree { entries { name } }
      }
    }
  }`;

  const imagesMetaReq = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${graphQLToken}`,
    },
    body: JSON.stringify({ query }),
  });

  const imagesMeta: { name: string }[] = (await imagesMetaReq.json()).data
    .repository.object.entries;
  
  return imagesMeta;
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
