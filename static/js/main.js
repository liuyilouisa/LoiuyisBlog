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
    document.title = 'Loiuyis~'+title;

    const res = await fetch(`/pages/${file}`).catch((err) => {
        console.error("Failed to fetch page:", err);
    });
    const html = await res.text().catch((err) => {  
        console.error("Failed to load page:", err);
    });
    document.getElementById("content").innerHTML = html;
}

document.getElementById('header').addEventListener('click', e => {
  if (e.target.classList.contains('nav-btn')) {
    loadPage(e.target.dataset.page);
  }
});
