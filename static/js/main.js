const contentMap = {
    articles: {
        title: "文章",
        file: `articles.html`,
    },
    about: {
        title: "介绍",
        file: `about.html`,
    },
};

async function loadPage(page) {
    console.log("Loading page:", page);
    const { title, file } = contentMap[page];
    document.title = "Loiuyis~" + title;

    const res = await fetch(`pages/${file}`).catch((err) => {
        console.error("Failed to fetch page:", err);
    });
    const html = await res.text().catch((err) => {
        console.error("Failed to load page:", err);
    });
    document.getElementById("content").innerHTML = html;
    if (page === "articles") await loadList();
}

async function loadList() {
    const hook = document.getElementById("article-list");
    if (!hook) return;

    const frag = document.createDocumentFragment();

    const res = await fetch("index.json");
    const list = await res.json();

    for (const meta of list) {
        const card = document.createElement("div");
        card.className = "article-card";
        card.dataset.page = meta.slug;
        card.textContent = meta.title;
        frag.appendChild(card);
    }

    hook.innerHTML = "";
    hook.appendChild(frag);
}

async function loadArticle(slug) {
    console.log("Loading article:", slug);
    const res = await fetch(`pages/${slug}.html`).catch((err) => {
        console.error("Failed to fetch article:", err);
    });
    const html = await res.text().catch((err) => {
        console.error("Failed to load article:", err);
    });
    document.getElementById("content").innerHTML = html;
}

document.getElementById("header").addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-btn")) {
        loadPage(e.target.dataset.page);
    }
});

document.getElementById("content").addEventListener("click", (e) => {
    if (e.target.classList.contains("article-card")) {
        loadArticle(e.target.dataset.page);
    }
});

loadPage("articles").catch((err) => {
    console.error("Failed to load initial page:", err);
});