# Eva Daniel Personal Website

Vite and React portfolio for `evadaniel.com`, deployed to GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

Vite builds every public page as a separate `.html` entry so existing links and
bookmarks continue to work. Shared navigation, page metadata, contact behavior,
and project-rail interactions are managed by React. Existing page content lives
in `src/content/`, global styles live in `src/styles.css`, and static files live
in `public/assets/`.

Pushing `main` runs `.github/workflows/deploy.yml`, which builds and publishes
the `dist/` directory to GitHub Pages. The custom domain is retained through
`public/CNAME`.
