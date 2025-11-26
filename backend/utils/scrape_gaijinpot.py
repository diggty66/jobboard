# backend/utils/scrape_gaijinpot.py

from typing import List, Dict, Optional
import requests
from bs4 import BeautifulSoup

Job = Dict[str, object]


def fetch_gaijinpot_jobs(
    limit: Optional[int] = None,
    region: Optional[str] = None
) -> List[Job]:
    """
    Scrape GaijinPot job listings across multiple pages.

    - Follows pagination: /en/job, /en/job?page=2, ...
    - Selects all <div class="card gpjs-open-link"> job cards.
    - Extracts title, company, salary, location, and apply_url.
    - Optionally filters by region (substring in Location/title).
    - If limit is None → no numeric cap (scrape all pages).
    """

    BASE = "https://jobs.gaijinpot.com"
    next_path = "/en/job"

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/118.0 Safari/537.36"
        )
    }

    jobs: List[Job] = []
    region_filter = (region or "").strip().lower() or None

    while next_path and (limit is None or len(jobs) < limit):
        url = BASE + next_path
        print(f"[GaijinPot] Fetching HTML → {url}")
        res = requests.get(url, headers=headers, timeout=15)
        res.raise_for_status()

        soup = BeautifulSoup(res.text, "html.parser")

        # ✅ ALL job cards, not just spotlight
        cards = soup.select("div.card.gpjs-open-link")
        print(f"[GaijinPot] Found {len(cards)} cards on this page")

        for card in cards:
            if limit is not None and len(jobs) >= limit:
                break

            # Title + link
            title_a = card.select_one("h3.card-heading a")
            title = title_a.get_text(strip=True) if title_a else ""
            href = title_a["href"] if (title_a and title_a.has_attr("href")) else ""
            full_url = f"{BASE}{href}" if href.startswith("/") else href

            # Map dt/dd pairs from <dl> into a dict
            details: Dict[str, str] = {}
            dts = card.select("dl dt")
            dds = card.select("dl dd")
            for dt_tag, dd_tag in zip(dts, dds):
                key = dt_tag.get_text(strip=True)
                value = dd_tag.get_text(strip=True)
                details[key] = value

            company = details.get("Company", "")
            salary_text = details.get("Salary", "")
            location_text = details.get("Location", "")

            # Optional: numeric salary
            salary_num = (
                int("".join(ch for ch in salary_text if ch.isdigit()))
                if any(ch.isdigit() for ch in salary_text)
                else None
            )

            # ✅ Region filtering
            if region_filter:
                loc_low = location_text.lower()
                title_low = title.lower()
                if region_filter not in loc_low and region_filter not in title_low:
                    continue

            jobs.append(
                {
                    "id": len(jobs),  # global index
                    "title": title,
                    "company": company,
                    "description": "",
                    "apply_url": full_url,
                    "country": "Japan",
                    "region": location_text,  # raw text e.g. "Tokyo, Japan"
                    "visa_type": "Work Visa",  # placeholder
                    "salary": salary_num,
                    "currency": "JPY",
                    "source": "gaijinpot",
                }
            )

        # 🔁 Follow pagination: look for "Next" link
        next_link = soup.select_one("ul.pagination a.pagination_next[href]")
        if next_link:
            next_path = next_link["href"]
        else:
            next_path = None  # no more pages

    print(f"[GaijinPot] Scraped {len(jobs)} job(s) total after filtering")
    return jobs
