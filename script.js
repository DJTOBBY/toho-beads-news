const grid = document.getElementById("news-grid");
const upcomingSection = document.getElementById("upcoming-section");
const upcomingGrid = document.getElementById("upcoming-grid");
const filterGroup = document.getElementById("filter-group");
const updatedAtEl = document.getElementById("updated-at");

const todayStr = new Date().toISOString().slice(0, 10);

let activeCategory = "all";
let articles = [];

function cardHtml(a, { upcoming = false } = {}) {
  const isColumn = a.category === "コラム";
  const dateLabel = upcoming
    ? `<span class="card-date badge-upcoming">開催予定: ${a.date}</span>`
    : `<span class="card-date">${a.date}</span>`;
  return `
    <article class="news-card${upcoming ? " upcoming" : ""}${isColumn ? " column" : ""}">
      <div class="card-meta">
        <span class="card-category${isColumn ? " category-column" : ""}">${a.category}</span>
        <span class="card-country">${a.country}</span>
        ${dateLabel}
      </div>
      <h2>${a.title}</h2>
      <p>${a.summary}</p>
      <div class="card-source">
        出典: <a href="${a.sourceUrl}" target="_blank" rel="noopener noreferrer">${a.sourceName}</a>
      </div>
    </article>
  `;
}

function renderUpcoming(all) {
  const upcoming = all
    .filter(a => a.date > todayStr)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcoming.length === 0) {
    upcomingSection.hidden = true;
    return;
  }

  upcomingSection.hidden = false;
  upcomingGrid.innerHTML = upcoming.map(a => cardHtml(a, { upcoming: true })).join("");
}

function renderCards() {
  const reported = articles.filter(a => a.date <= todayStr);
  const filtered = activeCategory === "all"
    ? reported
    : reported.filter(a => a.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="loading">該当するニュースがありません。</p>';
    return;
  }

  grid.innerHTML = filtered.map(a => cardHtml(a)).join("");
}

function renderFilters() {
  const reported = articles.filter(a => a.date <= todayStr);
  const categories = ["all", ...new Set(reported.map(a => a.category))];
  filterGroup.innerHTML = categories.map(cat => {
    const count = cat === "all" ? reported.length : reported.filter(a => a.category === cat).length;
    return `
    <button class="filter-btn${cat === activeCategory ? " active" : ""}" data-category="${cat}">
      ${cat === "all" ? "すべて" : cat} <span class="filter-count">${count}</span>
    </button>
  `;
  }).join("");

  filterGroup.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderFilters();
      renderCards();
    });
  });
}

fetch("data/news.json")
  .then(res => res.json())
  .then(data => {
    articles = (data.articles || []).slice().sort((a, b) => b.date.localeCompare(a.date));
    updatedAtEl.textContent = `最終更新: ${data.updatedAt}`;
    renderUpcoming(articles);
    renderFilters();
    renderCards();
  })
  .catch(err => {
    grid.innerHTML = '<p class="loading">ニュースの読み込みに失敗しました。</p>';
    console.error(err);
  });
