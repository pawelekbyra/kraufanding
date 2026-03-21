from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Increase timeout for dev server to start
    page.set_default_timeout(60000)

    try:
        # Check both 3000 and 3001
        found_port = None
        for port in [3000, 3001]:
            try:
                print(f"Checking http://localhost:{port}...")
                page.goto(f"http://localhost:{port}")
                found_port = port
                break
            except:
                continue

        if not found_port:
            raise Exception("Could not connect to localhost on port 3000 or 3001")

        # Wait for some content to load
        expect(page.get_by_role("heading", name="I raise money for my secret projekt")).to_be_visible()

        # Take a full page screenshot
        page.screenshot(path="verification/verification.png", full_page=True)
        print(f"Screenshot saved to verification/verification.png on port {found_port}")

    except Exception as e:
        print(f"Error during verification: {e}")
        page.screenshot(path="verification/error.png")
    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
