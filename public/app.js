const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");
const refreshBtn = document.getElementById("refresh");
const template = document.getElementById("source-card");

function formatTimestamp(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  return date.toLocaleString();
}

function setStatus(text) {
  statusEl.textContent = text;
}

function renderSources(data) {
  grid.innerHTML = "";

  data.sources.forEach((source) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".card");
    const title = node.querySelector("h2");
    const link = node.querySelector(".site-link");
    const list = node.querySelector(".headline-list");
    const error = node.querySelector(".error");

    title.textContent = source.name;
    link.href = source.homepage;

    if (source.items && source.items.length) {
      source.items.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = item.title;
        li.appendChild(a);
        list.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No headlines found.";
      li.style.color = "#6b645d";
      list.appendChild(li);
    }

    if (source.error) {
      error.textContent = source.error;
      card.classList.add("card-error");
    }

    grid.appendChild(node);
  });
}

async function loadStories({ refresh = false } = {}) {
  setStatus("Loading headlines…");
  const url = refresh ? "/api/stories?refresh=1" : "/api/stories";

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    const data = await res.json();
    renderSources(data);
    setStatus(`Updated ${formatTimestamp(data.updatedAt)}`);
  } catch (err) {
    setStatus(err.message || "Failed to load");
  }
}

refreshBtn.addEventListener("click", () => loadStories({ refresh: true }));

loadStories();
