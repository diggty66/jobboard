# backend/utils/scrape_gaijinpot.py
import requests
from bs4 import BeautifulSoup

def fetch_gaijinpot_jobs(limit=10):
    url = "https://jobs.gaijinpot.com/job/index/lang/en"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/118.0 Safari/537.36"
        )
    }

    res = requests.get(url, headers=headers, timeout=10)
    res.raise_for_status()
    soup = BeautifulSoup(res.text, "html.parser")

    jobs = []

    for idx, job_card in enumerate(soup.select("div.job-item")[:limit]):
        title_tag = job_card.select_one("h3.job-item-title a")
        title = title_tag.get_text(strip=True) if title_tag else "Unknown"
        link = (
            "https://jobs.gaijinpot.com" + title_tag["href"]
            if title_tag and title_tag.get("href")
            else ""
        )
        region_tag = job_card.select_one(".job-item-meta__location")
        region = region_tag.get_text(strip=True) if region_tag else "Japan"

        salary_tag = job_card.select_one(".job-item-meta__salary")
        salary_text = salary_tag.get_text(strip=True) if salary_tag else ""
        salary_num = (
            int("".join(ch for ch in salary_text if ch.isdigit()))
            if any(c.isdigit() for c in salary_text)
            else 0
        )

        jobs.append({
            "id": idx,
            "title": title,
            "region": region,
            "salary": salary_num,
            "currency": "JPY",
            "description": "",
            "apply_url": link,
        })

    return jobs
