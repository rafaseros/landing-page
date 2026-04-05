# Spec: SEO
**Change**: landing-page-v2
**Domain**: seo
**Status**: draft

---

## SPEC-SEO-001 — OG Image and Favicon Assets

### Requirements

- The site MUST provide an `og-image.png` file at `/public/og-image.png` with dimensions 1200×630 px.
- The site MUST provide favicon files: `favicon-32x32.png`, `favicon-16x16.png`, and `apple-touch-icon.png` (180×180 px).
- All referenced favicon files currently declared in `Layout.astro` MUST physically exist in `/public/`.
- The OG image MUST visually communicate the site owner's name, title (Tech Lead en Healthtech), and primary accent color (#DC2626).
- The OG image MUST NOT be a placeholder — it MUST be production-quality.

### Scenarios

**Scenario 1: Missing og-image.png**
- Given `og-image.png` does not exist in `/public/`
- When a social platform (LinkedIn, Twitter/X) scrapes the page URL
- Then the platform MUST display the correct OG image from the meta tag
- And the image MUST render without errors

**Scenario 2: Favicon browser tab**
- Given all favicon sizes are present in `/public/`
- When a user opens the site in Chrome, Firefox, or Safari
- Then the browser tab MUST show the SVG favicon on modern browsers
- And fallback PNG favicons MUST load on browsers that do not support SVG

**Scenario 3: Apple touch icon**
- Given `apple-touch-icon.png` is present
- When a user adds the site to their iOS home screen
- Then the 180×180 PNG MUST appear as the app icon

### Acceptance Criteria

- [ ] `/public/og-image.png` exists at 1200×630 px
- [ ] `/public/favicon-32x32.png` exists
- [ ] `/public/favicon-16x16.png` exists
- [ ] `/public/apple-touch-icon.png` exists at 180×180 px
- [ ] `<head>` references resolve to existing files (verified by HTTP 200)
- [ ] Lighthouse SEO audit passes without missing favicon warnings

---

## SPEC-SEO-002 — Sitemap and robots.txt

### Requirements

- The project MUST install and configure `@astrojs/sitemap` integration.
- `astro.config.mjs` MUST declare `site: 'https://devrafaseros.com'` for sitemap generation.
- A `sitemap-index.xml` MUST be generated at build time and accessible at `/sitemap-index.xml`.
- A `robots.txt` file MUST be provided at `/public/robots.txt`.
- `robots.txt` MUST allow all crawlers (`User-agent: *`) and declare the sitemap URL.
- Dynamic or excluded paths (if any) SHOULD be listed in `robots.txt` under `Disallow`.

### Scenarios

**Scenario 1: Sitemap generation**
- Given `@astrojs/sitemap` is configured with `site: 'https://devrafaseros.com'`
- When `astro build` completes
- Then `/sitemap-index.xml` MUST exist in the `dist/` output
- And it MUST contain at least one `<loc>` entry pointing to `https://devrafaseros.com/`

**Scenario 2: robots.txt crawlability**
- Given `/public/robots.txt` is present
- When a web crawler fetches `https://devrafaseros.com/robots.txt`
- Then the response MUST be `200 OK` with `Content-Type: text/plain`
- And the body MUST contain `Sitemap: https://devrafaseros.com/sitemap-index.xml`

**Scenario 3: No site config causes build failure**
- Given `site` is omitted from `astro.config.mjs`
- When `astro build` runs
- Then Astro MUST emit a warning that sitemap URLs cannot be generated without a site config

### Acceptance Criteria

- [ ] `@astrojs/sitemap` is listed in `package.json` dependencies
- [ ] `astro.config.mjs` includes `site: 'https://devrafaseros.com'`
- [ ] `/public/robots.txt` exists with `Allow: /` and `Sitemap:` directive
- [ ] Build output contains `/sitemap-index.xml`
- [ ] Sitemap validates against the sitemap.org protocol

---

## SPEC-SEO-003 — Structured Data (JSON-LD)

### Requirements

- The `Layout.astro` MUST include a `<script type="application/ld+json">` block in `<head>`.
- The structured data MUST use the `Person` schema from schema.org.
- Required fields: `@type`, `name`, `url`, `jobTitle`, `sameAs` (array of social profile URLs).
- SHOULD include: `description`, `address` (`PostalAddress` with `addressLocality` and `addressCountry`).
- The JSON-LD MUST be valid and parseable by Google's Rich Results Test.

### Scenarios

**Scenario 1: Person schema rendered**
- Given `Layout.astro` includes the JSON-LD block
- When the page HTML is fetched and parsed
- Then a `<script type="application/ld+json">` block MUST exist in `<head>`
- And parsing the JSON MUST yield an object with `@type: "Person"`

**Scenario 2: sameAs links**
- Given the Person schema includes `sameAs`
- When a search engine indexes the page
- Then it MUST be able to correlate the site with the owner's LinkedIn and GitHub profiles

### Acceptance Criteria

- [ ] `<script type="application/ld+json">` exists in rendered `<head>`
- [ ] JSON parses without errors
- [ ] `@type` is `"Person"`, `name` is `"Rafael Gallegos"`, `jobTitle` is present
- [ ] `sameAs` includes LinkedIn and GitHub URLs
- [ ] Google Rich Results Test returns no critical errors
