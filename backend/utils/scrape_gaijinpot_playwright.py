# utils/scrape_gaijinpot_playwright.py
from playwright.sync_api import sync_playwright

def fetch_gaijinpot_jobs_playwright(limit=100):
    """Scrape all visible GaijinPot jobs with scrolling."""
    jobs = []
    print("[GaijinPot] Fetching live jobs via Playwright...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://jobs.gaijinpot.com/en/job", timeout=60000)

        # Wait until first job cards appear
        page.wait_for_selector(".frame.text-center", timeout=30000)

        # Auto-scroll to trigger lazy loading
        previous_height = 0
        for _ in range(15):  # scroll about 15 times
            page.mouse.wheel(0, 2000)
            page.wait_for_timeout(1500)
            new_height = page.evaluate("document.body.scrollHeight")
            if new_height == previous_height:
                break
            previous_height = new_height

        cards = page.query_selector_all(".frame.text-center")
        for card in cards[:limit]:
            title = card.query_selector("h3")
            company = card.query_selector("p.text-primary")
            desc = card.query_selector("p.text-color")
            link = card.get_attribute("href")

            jobs.append({
                "title": title.inner_text().strip() if title else "",
                "company": company.inner_text().strip() if company else "",
                "description": desc.inner_text().strip() if desc else "",
                "apply_url": f"https://jobs.gaijinpot.com{link}" if link else "",
                "country": "Japan",
                "region": "",
                "visa_type": "Work Visa",
                "salary": None,
                "currency": "JPY",
            })

        browser.close()

    print(f"[GaijinPot] Scraped {len(jobs)} jobs")
    return jobs
