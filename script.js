const grid = document.getElementById("news-grid");
const filterGroup = document.getElementById("filter-group");
const updatedAtEl = document.getElementById("updated-at");

let activeCategory = "all";
let articles = [];

function renderCards() {
  const filtered = activeCategory === "all"
    ? articles
    : articles.filter(a => a.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="loading">該当するニュースがありません。</p>';
    return;
  }

  grid.innerHTML = filtered.map(a => `
    <article class="news-card">
      <div class="card-meta">
        <span class="card-category">${a.category}</span>
        <span>${a.date}</span>
      </div>
      <h2>${a.title}</h2>
      <p>${a.summary}</p>
      <div class="card-source">
        出典: <a href="${a.sourceUrl}" target="_blank" rel="noopener noreferrer">${a.sourceName}</a>
      </div>
    </article>
  `).join("");
}

function renderFilters() {
  const categories = ["all", ...new Set(articles.map(a => a.category))];
  filterGroup.innerHTML = categories.map(cat => {
    const count = cat === "all" ? articles.length : articles.filter(a => a.category === cat).length;
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
    renderFilters();
    renderCards();
  })
  .catch(err => {
    grid.innerHTML = '<p class="loading">ニュースの読み込みに失敗しました。</p>';
    console.error(err);
  });
