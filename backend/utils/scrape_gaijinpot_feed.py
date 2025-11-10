# utils/scrape_gaijinpot_feed.py
import feedparser

def fetch_gaijinpot_jobs_feed(region=None, keyword=None, limit=100):
    """Fetch GaijinPot jobs from Atom feed filtered by region or keyword."""
    base_url = "https://jobs.gaijinpot.com/en/job/feed/atom"
    params = []

    if region:
        params.append(f"region={region}")
    if keyword:
        params.append(f"keywords={keyword}")

    if params:
        url = f"{base_url}?{'&'.join(params)}"
    else:
        url = base_url

    print(f"[GaijinPot] Fetching feed → {url}")
    feed = feedparser.parse(url)

    jobs = []
    for entry in feed.entries[:limit]:
        jobs.append({
            "title": entry.title,
            "company": entry.get("author", ""),
            "description": entry.get("summary", ""),
            "apply_url": entry.link,
            "country": "Japan",
            "region": region or "JP",
        })

    print(f"[GaijinPot] Retrieved {len(jobs)} job(s)")
    return jobs
