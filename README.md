# thespark.ai — website

Next.js 16 (App Router) + Tailwind v4 rebuild of the SPARK website, migrated from Webflow.
Deployed on Vercel. All content is plain JSON in `content/` so it can be edited by hand or by agents.

## Structure

```
app/                 routes (App Router)
  (site)/            pages with the main nav + footer
  lp/                landing pages (minimal chrome)
  api/contact/       contact-form endpoint
components/          UI components (Nav, Footer, Blocks = case-study renderer, …)
content/
  works/<slug>.json          case studies: hero + ordered content blocks
  services/<slug>.json       service pages
  blog/<slug>.json           blog posts (bodyHtml is sanitised rich text)
  pages/*.json               home, about, contact, landing pages, 404
  works.json                 work list (thumbnails, categories, featured flags, grid order in lib/content.ts)
  work-categories.json, clients.json, testimonials.json, team.json, blog-categories.json
public/images/       all site images (self-hosted, formerly on the Webflow CDN)
lib/content.ts       typed loaders for the JSON content
tools/               one-off migration scripts (Webflow crawl → JSON)
```

### Case-study blocks (`content/works/*.json`)
`blocks` is an ordered list rendered by `components/Blocks.tsx`:

| type      | fields |
|-----------|--------|
| `image`   | `src`, `alt`, `variant` (`full` / `web` / `mobile` / `small` / `smaller`), `rounded` |
| `text`    | `html`, `centered`, `white`, `noPadding` |
| `split`   | `html` + `images[]`, `imageFirst`, `wide` (two images + text) |
| `frame`   | coloured passe-partout: `bg`, `bgImage`, `children[]` |
| `gallery` | `columns`, `children[]` |
| `video` / `wistia` / `embed` | `src` / `id` |

## Develop

```bash
npm install
npm run dev
```

## Contact form

`POST /api/contact` sends the submission by email through [Resend](https://resend.com).
Set these environment variables in Vercel (Project → Settings → Environment Variables):

- `RESEND_API_KEY` — required for delivery
- `CONTACT_TO` — recipient (default `info@thespark.ai`)
- `CONTACT_FROM` — verified sender, e.g. `SPARK Website <site@thespark.ai>`

Without `RESEND_API_KEY` submissions are only written to the server log.

## Deploy

Pushes to `main` deploy automatically through the Vercel Git integration.
