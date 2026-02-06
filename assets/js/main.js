const cardsEl = document.querySelector("#cards");
const tabs = [...document.querySelectorAll(".tab[data-filter]")];
const searchInput = document.querySelector("#search");
const modal = document.querySelector("#modal");
const modalBody = document.querySelector("#modalBody");

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

function openModal(project){
  if (!modal || !modalBody) return;

  const badgeClass = project.category;
  const downloadUrl = project.download || "https://www.mediafire.com/";

  modalBody.innerHTML = `
    <div class="modalHeader">
      <div class="modalTitleGroup">
        <img src="${escapeHtml(project.icon)}" alt="${escapeHtml(project.title)}" class="modalIcon" />
        <div>
          <h2>${escapeHtml(project.title)}</h2>
          <span class="badge ${escapeHtml(badgeClass)}">${escapeHtml(categoryLabel(project.category))}</span>
        </div>
      </div>
    </div>

    <p class="modalDesc">${escapeHtml(project.description)}</p>

    <div class="block">
      <div class="blockHeader">Download</div>
      <div class="blockBody">
        <a class="pill pill-accent" href="${escapeHtml(downloadUrl)}" target="_blank" rel="noreferrer">Download</a>
        <span class="mono" style="opacity:.7;margin-left:10px">Lien externe (MediaFire)</span>
      </div>
    </div>

    <div class="block">
      <div class="blockHeader">Commandes</div>
      <div class="blockBody mono">
        ${(project.commands || []).map(c => `• ${escapeHtml(c)}`).join("<br>")}
      </div>
    </div>

    <div class="block">
      <div class="blockHeader">Contenu</div>
      <div class="blockBody">
        ${(project.content || []).map(x => `• ${escapeHtml(x)}`).join("<br>")}
      </div>
    </div>
  `;
  modal.classList.add("is-open");
}

function closeModal(){
  if (!modal) return;
  modal.classList.remove("is-open");
}

function render(list){
  if (!cardsEl) return;

  if (!list.length){
    cardsEl.innerHTML = `<div class="card"><p class="desc">Aucun projet ne correspond.</p></div>`;
    return;
  }

  cardsEl.innerHTML = list.map(p => {
    const badgeClass = p.category;
    return `
      <div class="card" onclick='openModal(${JSON.stringify(p).replaceAll("'", "\\'")})'>
        <div class="cardIcon">
          <img src="${escapeHtml(p.icon)}" alt="${escapeHtml(p.title)}" />
        </div>
        <div class="cardTop">
          <div>
            <h3>${escapeHtml(p.title)}</h3>
            <p class="desc">${escapeHtml(p.description || "")}</p>
          </div>
          <span class="badge ${escapeHtml(badgeClass)}">${escapeHtml(categoryLabel(p.category))}</span>
        </div>
        <div class="cardFooter">Clique pour en savoir plus</div>
      </div>
    `;
  }).join("");
}

function applyFilters(){
  if (!cardsEl || !searchInput) return;

  const q = (searchInput.value || "").trim().toLowerCase();

  const filtered = allProjects.filter(p => {
    const okFilter = activeFilter === "all" ? true : p.category === activeFilter;
    const hay = `${p.title} ${p.description} ${(p.commands||[]).join(" ")} ${(p.content||[]).join(" ")}`.toLowerCase();
    const okSearch = !q || hay.includes(q);
    return okFilter && okSearch;
  });

  render(filtered);
}

if (tabs.length && cardsEl && searchInput) {
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
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}


function syncThemeButtons(theme) {
  const lightTop = document.getElementById("themeLightTop");
  const darkTop = document.getElementById("themeDarkTop");
  if (lightTop && darkTop) {
    lightTop.classList.toggle("is-active", theme === "light");
    darkTop.classList.toggle("is-active", theme === "dark");
  }

  const lightPill = document.getElementById("themeLight");
  const darkPill = document.getElementById("themeDark");
  if (lightPill && darkPill) {
    document.querySelectorAll(".pill").forEach(btn => btn.classList.remove("pill-accent"));
    if (theme === "light") lightPill.classList.add("pill-accent");
    else darkPill.classList.add("pill-accent");
  }
}

function setTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  syncThemeButtons(theme);
}


const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);
