# LIVE @ christianfarrell.dev
New and Improved Portfolio Website

## Development

```bash
npm install   # install dependencies
npm start     # dev server at http://localhost:4200
npm test      # run tests
npm run build # production build
```

**Adding a project:** open `src/app/data/projects.data.ts` and append an entry to `PROJECTS`. If it has a demo GIF, put the file in `public/projects/` and point `image` at it.

**Deploying:** pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes to GitHub Pages (Settings → Pages → Source must be "GitHub Actions"). The site is served from the custom domain root, so the base href stays `/`.

# Inspiration

- Projects are displayed nicely
- Header is simple
- Keep simple
- Off-White
- Simple Animations
- Maybe opening animation

- Small redirects to socials and a connect page
- Projects Below

- Need some work experience space, can keep it minimal
