# CLAUDE.md

Rules for **node-lab**, a repo of learning projects (Node.js, Express, PostgreSQL, React). They apply to every project in it. Each project's README says how to run it.

## Language: TypeScript wherever possible

- Write all new code in TypeScript: React (`.tsx`), Node.js (`.ts`), scripts and config files (`vite.config.ts`, ...). Use plain JavaScript only when a tool cannot load TypeScript.
- `"strict": true`. No `any` (use `unknown` and narrow). No `@ts-ignore` (use `@ts-expect-error` with a reason). No `as` or `!` assertions without a clear reason; prefer a runtime check.
- Use `import type` / `export type` for type-only imports and re-exports (`verbatimModuleSyntax`).
- Named exports only. A default export is allowed only where a tool requires it (`vite.config.ts`, `eslint.config.ts`).
- Prefer string-literal unions over `enum`.
- Validate data from outside at runtime (API responses, request bodies, env vars, `JSON.parse`), e.g. with Zod. Static types do not check it.
- Naming: `UpperCamelCase` for types, interfaces, classes and components; `lowerCamelCase` for variables and functions; `CONSTANT_CASE` for global constants. No `I` prefix on interfaces. Acronyms are words (`userId`, `loadHttpUrl`).
- Node server code: Node 22.18+ runs `.ts` directly (type stripping). Use erasable syntax only (no `enum`, runtime `namespace` or parameter properties; set `erasableSyntaxOnly`), write the `.ts` extension in relative imports, and note that Node ignores tsconfig `paths`, so the `@/` alias is client-only.

## Frontend structure (React + Tailwind)

Inside `src/` of every React app:

```
src/
  types/        all exported types and interfaces
  ui-kit/       generic building blocks (Button, Input, Modal); no business logic, no data fetching
  components/   reusable presentational components built from ui-kit
  containers/   components connected to data or state (fetching, store, routing); they compose components
  hooks/ api/ utils/ pages/   add only when needed, same rules
```

- Every one of these folders has an `index.ts` that re-exports its public API. Add or rename a file there and update the `index.ts` in the same change.
- Keep barrels thin: explicit named re-exports only (`export { Button } from './Button'`, `export type { ButtonProps } from './Button'`), no logic, no side effects. `export type * from './user'` is fine in `types/`. Thin matters because barrels can hurt Vite tree-shaking and hide import cycles.
- Across folders, import through the barrel with the `@/` alias: `import { Button } from '@/ui-kit'`. Never reach into another folder's internals. Inside one folder, import siblings directly (`./Button`), never through that folder's own `index.ts`.
- Dependencies flow one way: `types` <- `ui-kit` <- `components` <- `containers` <- `pages`. A folder may import only from folders to its left, and `types` may be imported by all. No circular imports. Enforce this in ESLint (`import/no-restricted-paths`, `import/no-cycle`).
- Types and interfaces live in `types/`, one file per domain (`types/user.ts`), including component props. Small non-exported helper types may stay in their file.
- One component per file, named after the component (`UserCard.tsx`). A component that needs more files (sub-components, hooks, tests) gets its own folder with an `index.ts`.
- Containers own data and state and pass plain props down. `ui-kit` and `components` never fetch data.

## Reusable components

Generate reusable components by default.

- Everything configurable comes from props. No hard-coded text, data, URLs or colors that belong to one screen.
- Extract markup into a component the second time it appears. Generic pieces go to `ui-kit/`, domain-specific ones to `components/`.
- Accept `className` and the native element props (`ComponentPropsWithoutRef<'button'>`), spread them on the root element, and merge classes with a `cn()` helper (`clsx` + `tailwind-merge`).
- Express variants and sizes as typed unions mapped to complete class strings. Never build Tailwind class names by interpolation (`bg-${color}-600`): Tailwind scans source as plain text and will not generate them.
- Compose with `children` and slot props instead of piling up boolean flags.
- React 19: `ref` is an ordinary prop, so do not use `forwardRef` in new code. Render `<Context value={...}>`, not `<Context.Provider>`.
- Accessible by default: semantic elements, labels, keyboard support, visible focus. Use ARIA only when native elements cannot do the job.
- Keep components pure. Derive values during render instead of syncing state in effects.

## Node.js backend

- Organize by business domain, not by technical type. Inside a domain use three layers: route/controller (HTTP only: parse, validate, respond), service (business logic, no `req`/`res`), data access (queries).
- Configuration comes from environment variables, validated at startup so the app fails fast. No secrets in code or git; commit an `.env.example`.
- Use `async`/`await`. Throw `Error` subclasses, handle errors in one central place, never swallow them, catch unhandled rejections, and keep internal details out of client responses.
- Validate every incoming payload (params, query, body) against a schema, and limit payload size.
- Do not block the event loop: no synchronous `fs`, `crypto` or `child_process` calls in a server (startup scripts are fine), bound input sizes, avoid regexes that can backtrack catastrophically on user input, stream large data.
- Import built-ins with the `node:` prefix. Use ES modules, `const` over `let`, `===`. No network or database calls at module top level.
- Shut down gracefully on `SIGTERM`/`SIGINT`: stop accepting requests, then close the server and the database pool.
- PostgreSQL: parameterized queries only, never SQL built by string concatenation.
- Log with a structured logger to stdout in app code. `console.log` is fine in learning exercises.
- Tests: `node:test` for server code, Vitest + React Testing Library for client code. Test behavior, not implementation. Name tests as unit, scenario, expected result.
- Dependencies: commit the lockfile, use `npm ci` in CI, run `npm audit`, stay on an LTS Node version (see `engines`).

## Git and pull requests

- Name branches `rd/<short-kebab-topic>` (for example `rd/add-button-component`), never `claude/...`. If a session starts on a `claude/...` branch, rename it with `git branch -m`, push the new name, and delete the old remote branch before opening the PR.
- Open PRs into `main`. Never push to `main` directly. One concern per PR, kept small. The description says what changed, why, and how to test it.
- Commit messages follow Conventional Commits: `type(scope): description`, with types `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `style`. Use an imperative subject of 72 characters or less. Mark breaking changes with `!` or a `BREAKING CHANGE:` footer.
- Before committing, run lint, typecheck, tests and build. Fix problems rather than disabling rules.
- Never commit `node_modules`, `dist`, `.env` or secrets.

## Known gaps (delete each when done)

- `nodejs-docs/` is still plain JavaScript and its ESLint config covers only `.js`/`.jsx`. The first TypeScript task must also add: `tsconfig.json` files, `typescript-eslint` (strict type-checked preset), a `typecheck` script, the `@/` alias (`vite.config.ts` + tsconfig `paths`), the ESLint import-boundary rules above, and `engines.node` of `>=22.18` if server code runs `.ts` directly.
- Convert existing files to TypeScript when you touch them, or when asked.

## Sources

- Node.js, [Running TypeScript natively](https://nodejs.org/docs/latest/api/typescript.html) and [Don't block the event loop](https://nodejs.org/learn/asynchronous-work/dont-block-the-event-loop)
- [Node.js best practices](https://github.com/goldbergyoni/nodebestpractices)
- [Bulletproof React, project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [Google TypeScript style guide](https://google.github.io/styleguide/tsguide.html)
- Tailwind, [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [React 19 release notes](https://react.dev/blog/2024/12/05/react-19)
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
