# Abigail Licata — Academic portfolio

Academic portfolio

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deployments

- **GitHub Pages:** every push to `main` runs `.github/workflows/deploy-pages.yml`.
- **Firebase Hosting:** select a Firebase project with `firebase use --add`, then run `npm run deploy:firebase`.

The GitHub Pages production base path is `/abigail-licata/`; local development and Firebase use `/`.

