const cardsEl = document.querySelector("#cards");
const tabs = [...document.querySelectorAll(".tab")];
const searchInput = document.querySelector("#search");

let allProjects = [];
let activeFilter = "all";

const categoryLabel = (cat) => {
  if (cat === "plugin") return "Plugin";
  if (cat === "addon") return "Addon";
  if (cat === "model3d") return "Models";
  return cat;
};

const escapeHtml = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function render(list){
  if (!list.length){
    cardsEl.innerHTML = `<div class="card"><p class="desc">Aucun projet ne correspond.</p></div>`;
    return;
  }

  cardsEl.innerHTML = list.map(p => {
    const badgeClass = p.category;
    const href = p.link || "#";
    return `
      <a class="card" data-category="${escapeHtml(p.category)}" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">
        <div class="cardTop">
          <div>
            <h3>${escapeHtml(p.title)}</h3>
            <p class="desc">${escapeHtml(p.description || "")}</p>
          </div>
          <span class="badge ${escapeHtml(badgeClass)}">${escapeHtml(categoryLabel(p.category))}</span>
        </div>

        <div class="block">
          <div class="blockHeader">Commandes</div>
          <div class="blockBody mono">
            ${(p.commands || []).map(c => `• ${escapeHtml(c)}`).join("<br>")}
          </div>
        </div>

        <div class="block">
          <div class="blockHeader">Contenu</div>
          <div class="blockBody">
            ${(p.content || []).map(x => `• ${escapeHtml(x)}`).join("<br>")}
          </div>
        </div>
      </a>
    `;
  }).join("");
}

function applyFilters(){
  const q = (searchInput.value || "").trim().toLowerCase();

  const filtered = allProjects.filter(p => {
    const okFilter = activeFilter === "all" ? true : p.category === activeFilter;
    const hay = `${p.title} ${p.description} ${(p.commands||[]).join(" ")} ${(p.content||[]).join(" ")}`.toLowerCase();
    const okSearch = !q || hay.includes(q);
    return okFilter && okSearch;
  });

  render(filtered);
}

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);

fetch("assets/data/projects.json")
  .then(r => r.json())
  .then(data => {
    allProjects = data;
    applyFilters();
  })
  .catch(() => {
    cardsEl.innerHTML = `<div class="card"><p class="desc">Erreur: impossible de charger projects.json</p></div>`;
  });
