## File: backend/test_gaijinpot_api_sniff.py
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://jobs.gaijinpot.com/en/job", timeout=60000)
    page.wait_for_selector(".job-card, .job, .frame", timeout=30000)
    cards = page.query_selector_all(".frame.text-center")
    data = []
    for card in cards:
        title = card.query_selector("h3")
        company = card.query_selector("p.text-primary")
        desc = card.query_selector("p.text-color")
        data.append({
            "title": title.inner_text() if title else "",
            "company": company.inner_text() if company else "",
            "description": desc.inner_text() if desc else "",
        })
    print(data[:5])
    browser.close()
