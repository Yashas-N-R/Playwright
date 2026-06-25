# BIT — Build It Together

Landing site for **BIT (Build It Together)** built with React + Vite + Tailwind, featuring a 3D water-ripple hero powered by react-three-fiber.

**QA by profession, developer by passion.** — Yashas Narayanaswamy

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS 3**
- **react-three-fiber** + **three.js** — custom GLSL water shader with ripple displacement
- **framer-motion** — text morph animation
- **Geist** font (matches Vercel aesthetic)

## Hero Animation

- A 3D water plane rendered with a custom vertex shader (ripple displacement) and a monochrome fragment shader (black surface, white crests).
- On page load — and every time you click **BIT** — a glowing droplet falls and impacts the water, sending out a radial ripple.
- The text morphs: **BIT** → **Build. It. Together.** → back to **BIT**.

## Deploy to Vercel

### Option 1 — Vercel Dashboard

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Framework Preset: **Vite** (auto-detected)
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**

### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

### Custom Domain

In **Project → Settings → Domains** add your domain. Vercel gives you the DNS records to add at your registrar (one A record + one CNAME for `www`). SSL is automatic.

## Local Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the built site
```

## Structure

```
src/
├── App.tsx
├── main.tsx
├── styles/globals.css
└── components/
    ├── Header.tsx
    ├── Hero.tsx           # composes WaterScene + BITText
    ├── BITText.tsx        # BIT ↔ Build. It. Together. morph
    ├── Manifesto.tsx
    ├── Docs.tsx
    ├── About.tsx
    ├── Footer.tsx
    └── water/
        ├── WaterScene.tsx # r3f Canvas, lights, scene composition
        ├── WaterPlane.tsx # high-subdivision plane with ShaderMaterial
        ├── Droplet.tsx    # falling sphere with imperative drop()
        ├── shaders.ts     # GLSL vertex + fragment
        └── types.ts       # uniforms factory & types
```

## Contact

Yashas Narayanaswamy — yashas07022002@gmail.com
