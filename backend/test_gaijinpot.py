from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=200)
    page = browser.new_page()
    page.goto("https://jobs.gaijinpot.com/en/job", timeout=60000)

    # Wait a bit longer to let JS render everything
    page.wait_for_timeout(20000)

    html = page.content()
    with open("gaijinpot_dump.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("✅ Dumped HTML to gaijinpot_dump.html")

    browser.close()
