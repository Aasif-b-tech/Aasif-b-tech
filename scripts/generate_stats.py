import json
import os
import urllib.request
from collections import Counter
from pathlib import Path
from xml.sax.saxutils import escape

USER = os.environ["GITHUB_USER"]
TOKEN = os.environ["GITHUB_TOKEN"]
OUT = Path("assets/generated")
OUT.mkdir(parents=True, exist_ok=True)

QUERY = """
query($login: String!) {
  user(login: $login) {
    login
    followers { totalCount }
    following { totalCount }
    repositories(ownerAffiliations: OWNER, first: 100, privacy: PUBLIC) {
      totalCount
      nodes {
        stargazerCount
        forkCount
        languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name } }
        }
      }
    }
  }
}
"""

request = urllib.request.Request(
    "https://api.github.com/graphql",
    data=json.dumps({"query": QUERY, "variables": {"login": USER}}).encode(),
    headers={
        "Authorization": f"bearer {TOKEN}",
        "Content-Type": "application/json",
        "User-Agent": "Aasif-Profile-Stats",
    },
    method="POST",
)

with urllib.request.urlopen(request, timeout=30) as response:
    payload = json.load(response)

if payload.get("errors"):
    raise RuntimeError(payload["errors"])

user = payload["data"]["user"]
repos = user["repositories"]["nodes"]

languages = Counter()
for repo in repos:
    for edge in repo["languages"]["edges"]:
        languages[edge["node"]["name"]] += edge["size"]

top_languages = languages.most_common(6)

def esc(value):
    return escape(str(value))

def header(title, height):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="900" height="{height}" '
        f'viewBox="0 0 900 {height}">'
        '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0%" stop-color="#07111f"/><stop offset="100%" stop-color="#111827"/>'
        '</linearGradient><linearGradient id="line" x1="0" y1="0" x2="1" y2="0">'
        '<stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#6366f1"/>'
        '<stop offset="100%" stop-color="#a855f7"/></linearGradient></defs>'
        f'<rect width="900" height="{height}" rx="22" fill="url(#bg)" stroke="#243244"/>'
        f'<text x="42" y="58" fill="#e5f3ff" font-family="monospace" font-size="22" '
        f'font-weight="700">AASIF // {esc(title)}</text>'
        '<rect x="42" y="76" width="816" height="2" fill="url(#line)"/>'
    )

stats = header("GITHUB METRICS", 320)
metrics = [
    ("PUBLIC REPOS", user["repositories"]["totalCount"]),
    ("FOLLOWERS", user["followers"]["totalCount"]),
    ("FOLLOWING", user["following"]["totalCount"]),
    ("STARS", sum(r["stargazerCount"] for r in repos)),
    ("FORKS", sum(r["forkCount"] for r in repos)),
]
for i, (label, value) in enumerate(metrics):
    x = 42 + (i % 3) * 275
    y = 125 + (i // 3) * 82
    stats += f'<text x="{x}" y="{y}" fill="#7dd3fc" font-family="monospace" font-size="13">{label}</text>'
    stats += f'<text x="{x}" y="{y+34}" fill="#fff" font-family="monospace" font-size="27" font-weight="700">{value}</text>'
stats += f'<text x="42" y="285" fill="#64748b" font-family="monospace" font-size="12">LIVE DATA • @{esc(USER)} • GITHUB ACTIONS</text></svg>'
OUT.joinpath("github-stats.svg").write_text(stats, encoding="utf-8")

langs = header("TOP LANGUAGES", 340)
total = sum(v for _, v in top_languages) or 1
palette = ["#38bdf8", "#818cf8", "#a855f7", "#22d3ee", "#f472b6", "#f59e0b"]
cursor = 42
for i, (_, size) in enumerate(top_languages):
    width = 816 * size / total
    langs += f'<rect x="{cursor:.1f}" y="112" width="{width:.1f}" height="18" fill="{palette[i % 6]}"/>'
    cursor += width

for i, (name, size) in enumerate(top_languages):
    x = 42 + (i % 2) * 405
    y = 175 + (i // 2) * 43
    pct = size / total * 100
    langs += f'<circle cx="{x}" cy="{y-5}" r="5" fill="{palette[i % 6]}"/>'
    langs += f'<text x="{x+15}" y="{y}" fill="#e5f3ff" font-family="monospace" font-size="14">{esc(name)}</text>'
    langs += f'<text x="{x+300}" y="{y}" fill="#94a3b8" font-family="monospace" font-size="13" text-anchor="end">{pct:.1f}%</text>'

langs += f'<text x="42" y="315" fill="#64748b" font-family="monospace" font-size="12">LANGUAGE BYTES • @{esc(USER)} • GITHUB ACTIONS</text></svg>'
OUT.joinpath("top-languages.svg").write_text(langs, encoding="utf-8")
