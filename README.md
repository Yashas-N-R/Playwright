# BIT — Build It Together

Landing page for **BIT (Build It Together)** — practical guides on test automation, Playwright, and building confidence in your test suites.

**QA by profession, developer by passion.**

## Deploy to Vercel

### Option 1 — Vercel Dashboard (easiest)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects it as a static site — click **Deploy**
5. Add your custom domain under **Project Settings → Domains**

### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts. For production:

```bash
vercel --prod
```

### Custom Domain

1. In Vercel: **Project → Settings → Domains → Add**
2. Enter your domain (e.g. `buildittogether.com`)
3. At your domain registrar, add the DNS records Vercel shows you:
   - **A record** → `76.76.21.21` (or what Vercel provides)
   - **CNAME** for `www` → `cname.vercel-dns.com`

SSL is automatic and free.

## Local Preview

```bash
npx serve .
```

Open [http://localhost:3000](http://localhost:3000)

## Structure

```
index.html    # Landing page
styles.css    # Styles
vercel.json   # Vercel config
```

## Contact

Yashas Narayanaswamy — yashas07022002@gmail.com
