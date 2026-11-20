"""Playwright QA for the Aryan Lohia portfolio.

Golden Book checks: 360, 390, and 1440. No horizontal overflow, no broken
images, no console errors, every wa.me link uses 917864955155 with a
message, tel: link present, menu and enquiry form work.
"""

import asyncio
from pathlib import Path
from urllib.parse import unquote

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
URL = ROOT.joinpath("index.html").as_uri()
CHROME = "/opt/google/chrome/chrome"
OUT = Path(__file__).resolve().parent / "screenshots"
WA = "https://wa.me/917864955155?text="

OVERFLOW_JS = """
() => {
  function clipped(el) {
    let n = el.parentElement;
    while (n && n !== document.documentElement) {
      const s = getComputedStyle(n);
      const ox = s.overflowX;
      if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') return true;
      n = n.parentElement;
    }
    return false;
  }
  return [...document.querySelectorAll('body *')].filter(el => {
    const r = el.getBoundingClientRect();
    const pos = getComputedStyle(el).position;
    if (r.width === 0 || r.height === 0) return false;
    if (pos === 'fixed' || pos === 'sticky') return false;
    if (clipped(el)) return false;
    return r.right > innerWidth + 1 || r.left < -1;
  }).slice(0, 12).map(el => {
    const r = el.getBoundingClientRect();
    return (el.className && String(el.className).slice(0, 40) || el.tagName) + ' | ' + Math.round(r.left) + '..' + Math.round(r.right);
  });
}
"""


async def prep(page):
    await page.goto(URL, wait_until="networkidle")
    await page.wait_for_selector("#preloader", state="detached", timeout=7000)
    await page.evaluate(
        """() => {
          document.documentElement.style.scrollBehavior = 'auto';
          document.documentElement.classList.add('ready');
          document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
          document.querySelectorAll('img[loading=lazy]').forEach(img => { img.loading = 'eager'; });
        }"""
    )
    await page.evaluate("() => document.fonts.ready")
    await page.wait_for_timeout(500)


def assert_wa(hrefs):
    assert hrefs, "expected WhatsApp links"
    for href in hrefs:
        assert href.startswith(WA), href
        text = unquote(href.split("?text=", 1)[1])
        assert "Aryan" in text and len(text) > 12, text


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    failures = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=CHROME, args=["--disable-dev-shm-usage"])
        viewports = (
            (360, 640),
            (390, 844),
            (1440, 900),
        )
        for width, height in viewports:
            errors = []
            failed = []
            page = await browser.new_page(viewport={"width": width, "height": height})
            page.on("pageerror", lambda err: errors.append(str(err)))
            page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
            page.on("requestfailed", lambda req: failed.append(req.url + " " + (req.failure or "")))
            await prep(page)
            scroll_w, inner = await page.evaluate("[document.documentElement.scrollWidth, innerWidth]")
            over = await page.evaluate(OVERFLOW_JS)
            print(f"{width}x{height} scrollWidth={scroll_w} innerWidth={inner} overflow={over}")
            if scroll_w > inner + 1 or over:
                failures.append(f"overflow {width}: scroll {scroll_w} inner {inner} {over}")
            broken = await page.evaluate(
                """() => [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.currentSrc || img.src)"""
            )
            if broken:
                failures.append(f"broken images {width}: {broken}")
            hrefs = await page.eval_on_selector_all("a[href*='wa.me']", "els => els.map(a => a.href)")
            try:
                assert_wa(hrefs)
            except AssertionError as exc:
                failures.append(f"wa {width}: {exc}")
            tel = await page.eval_on_selector_all("a[href^='tel:']", "els => els.map(a => a.href)")
            if "tel:+917864955155" not in tel:
                failures.append(f"missing tel at {width}: {tel}")
            meta = await page.evaluate(
                """() => ({
                  title: document.title,
                  theme: document.querySelector('meta[name=theme-color]')?.content,
                  og: document.querySelector('meta[property="og:image"]')?.content,
                  twitter: document.querySelector('meta[name="twitter:image"]')?.content,
                  h1: document.querySelectorAll('h1').length,
                  canon: document.querySelector('link[rel=canonical]')?.href
                })"""
            )
            if meta["h1"] != 1:
                failures.append(f"h1 count {meta['h1']} at {width}")
            if meta["theme"] != "#0D0D0D":
                failures.append(f"theme-color {meta['theme']}")
            for key in ("og", "twitter"):
                if not str(meta[key]).startswith("https://aryan-lohia.github.io/portfolio/"):
                    failures.append(f"{key} image not absolute: {meta[key]}")
            if not str(meta["canon"]).startswith("https://aryan-lohia.github.io/portfolio/"):
                failures.append(f"canonical {meta['canon']}")
            if errors:
                failures.append(f"console {width}: {errors}")
            # Ignore cancelled font requests only if the document still rendered.
            bad_net = [url for url in failed if "fonts.g" not in url and "fonts.googleapis" not in url]
            if bad_net:
                failures.append(f"failed requests {width}: {bad_net}")

            if width == 360:
                box = await page.locator(".hero .cta-row .btn").first.bounding_box()
                if not box or box["y"] + box["height"] > 640:
                    failures.append(f"hero CTA not in first screen at 360x640: {box}")

            await page.screenshot(path=str(OUT / f"{width}-hero.png"))
            await page.screenshot(path=str(OUT / f"{width}-full.png"), full_page=True)

            if width == 390:
                toggle = page.locator(".nav-toggle")
                await toggle.click()
                expanded = await toggle.get_attribute("aria-expanded")
                if expanded != "true":
                    failures.append("menu did not open")
                await page.locator("#site-nav a[href='#work']").click()
                expanded = await toggle.get_attribute("aria-expanded")
                if expanded != "false":
                    failures.append("menu did not close")
                await page.locator("#send-wa").click()
                name_err = (await page.locator("#name-error").inner_text()).strip()
                if "name" not in name_err.lower():
                    failures.append(f"empty submit did not flag the name: {name_err!r}")
                await page.locator("#name").fill("Mina")
                await page.locator("#interest").select_option("A software project")
                await page.locator("#note").fill("A short site for a tea brand.")
                href = await page.locator("#send-wa").get_attribute("href")
                decoded = unquote(href or "")
                if "Mina" not in decoded or "software project" not in decoded or "tea brand" not in decoded:
                    failures.append(f"form message not built: {decoded}")
                if not (href or "").startswith(WA):
                    failures.append(f"form href {href}")

            await page.close()

        # Reduced motion: reveals visible, shine not animated away.
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            reduced_motion="reduce",
        )
        page = await context.new_page()
        await page.goto(URL, wait_until="networkidle")
        await page.evaluate("() => document.fonts.ready")
        opacity = await page.evaluate(
            """() => {
              const el = document.querySelector('.effect .reveal');
              return el ? getComputedStyle(el).opacity : 'missing';
            }"""
        )
        if opacity != "1":
            failures.append(f"reduced motion reveal opacity {opacity}")
        await page.screenshot(path=str(OUT / "390-reduced-motion.png"), full_page=True)
        await context.close()

        # No JS: content and a real WhatsApp link are still there. No preloader.
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            java_script_enabled=False,
        )
        page = await context.new_page()
        await page.goto(URL, wait_until="networkidle")
        h1 = await page.locator("h1").inner_text()
        if "easy" not in h1.lower():
            failures.append(f"no-js h1 missing: {h1!r}")
        href = await page.locator(".hero .cta-row a.btn").first.get_attribute("href")
        if not href or not href.startswith(WA):
            failures.append(f"no-js hero link {href}")
        blocked = await page.evaluate(
            """() => {
              const pre = document.getElementById('preloader');
              if (!pre) return false;
              const s = getComputedStyle(pre);
              return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0.05;
            }"""
        )
        if blocked:
            failures.append("preloader still covering the page without JS")
        await context.close()
        await browser.close()

    if failures:
        print("FAILURES")
        for item in failures:
            print("-", item)
        raise SystemExit(1)
    print("OK")


if __name__ == "__main__":
    asyncio.run(main())
