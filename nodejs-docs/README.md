# Node.js, step by step

A workspace for working through the [Node.js documentation](https://nodejs.org/learn) one step at a time, with a React + Tailwind client to build on as you go.

- `server/` is plain Node.js (ES modules, no dependencies). Your exercises go in `server/steps/`.
- `client/` is React 19 and Tailwind CSS 4, built with Vite.
- ESLint 10 lints both, with the right globals for each side.

## Setup

Requires Node.js 22.13 or newer.

```sh
npm install
npm run dev
```

- Client: http://localhost:5173
- Server: http://127.0.0.1:3000 (Vite proxies `/api/*` to it)

## Scripts

Run these from the project root.

| Command            | What it does                                        |
| ------------------ | --------------------------------------------------- |
| `npm run dev`      | Server (`node --watch`) and client (Vite) together  |
| `npm run build`    | Production build of the client into `client/dist`   |
| `npm start`        | Run the server once, without watching               |
| `npm run lint`     | Lint everything with ESLint                         |
| `npm run lint:fix` | Lint and apply automatic fixes                      |

## Working through the docs

Put each step in `server/steps/` and run it with Node:

```sh
node server/steps/01-hello.js
node --watch server/steps/01-hello.js   # re-run on every save
```

- Learn: https://nodejs.org/learn
- API reference: https://nodejs.org/docs/latest/api/

### Modules

`.js` files in `server/` are ES modules (`"type": "module"` in `server/package.json`). Use the `.cjs` extension for CommonJS examples (`require`, `module.exports`). The docs show both styles.

ESLint is set up to catch the usual mix-ups: `require` or `__dirname` inside an ES module, and browser globals such as `window` in server code (or `process` in client code).

### Adding dependencies

This is an npm workspace, so say which side a package belongs to:

```sh
npm install express -w server
npm install -D some-tool -w client
```
