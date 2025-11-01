import pathlib, shutil, frontmatter, json
PUBLIC = pathlib.Path("public")
POSTS = pathlib.Path("posts")

ARTICLE_TEMPLATE = '''<article data-date="{date}" data-author="{author}">
    <h1 style="text-align:center">{title}</h1>
{body}
</article>'''

def clean():
    if PUBLIC.exists():
        shutil.rmtree(PUBLIC)
    PUBLIC.mkdir()
    
def collect_static():
    shutil.copy('index.html', PUBLIC / 'index.html')
    shutil.copytree('static', PUBLIC / 'static', dirs_exist_ok=True)
    shutil.copytree('pages', PUBLIC / 'pages', dirs_exist_ok=True)
    
def body_to_html(content: str) -> str:
    lines = content.splitlines()
    html_lines = [f"    <p>{line}</p>" for line in lines if line.strip()]
    return "\n".join(html_lines)
    
def main():
    clean()
    collect_static()
    index = []
    for path in POSTS.glob("*.txt"):
        post = frontmatter.load(path)
        slug = path.stem

        html = ARTICLE_TEMPLATE.format(
            date=post['date'],
            author=post['author'],
            title=post['title'],
            body=body_to_html(post.content)
        )
        
        (PUBLIC / 'pages' / f"{slug}.html").write_text(html, encoding="utf-8")
        
        index.append({
            "title": post["title"],
            "date": str(post["date"]),
            "author": post["author"],
            "slug": slug
        })
        
    index.sort(key=lambda x: x["date"], reverse=True)
    (PUBLIC / "index.json").write_text(
        json.dumps(index),
        encoding="utf-8"
    )
    print(f"Built {len(index)} posts.")

if __name__ == '__main__':
    main()
    