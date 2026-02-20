# CLAUDE.md

## Project overview

`coons-patch` is a TypeScript library for creating Coons patches — four-sided surfaces defined by four cubic Bezier curves — and locating points on their surface. Published to npm as an ESM/CJS dual-format package.

- **Author**: Pedr Browne
- **License**: MIT
- **Node**: v22.14.0 (see `.nvmrc`)
- **Package manager**: pnpm (v10.5.1)
- **Single runtime dependency**: `fast-memoize`

## Commands

| Task | Command |
|---|---|
| Install dependencies | `pnpm install` |
| Run tests | `pnpm test` |
| Run tests (watch) | `pnpm run test-watch` |
| Run tests (coverage) | `pnpm run test-coverage` |
| Type-check | `pnpm run tsc` |
| Lint (all) | `pnpm run lint` |
| Build | `pnpm run build` |
| Generate docs | `pnpm run docs` |

## Architecture

```
src/
  index.ts                          # Public API — named export `coonsPatch` + types
  types.ts                          # All TypeScript type definitions
  errors/ValidationError.ts         # Custom error class
  interpolate/
    pointOnCurve/
      interpolatePointOnCurveEvenlySpacedFactory.ts   # LUT-based even interpolation (default)
      interpolatePointOnCurveLinearFactory.ts          # Casteljau's algorithm (fast)
    pointOnSurface/
      interpolatePointOnSurfaceBilinear.ts            # Core bilinear surface algorithm
  utils/
    functional.ts                   # times, timesReduce, mapObj
    is.ts                           # Type guards (isNumber, isArray, etc.)
    math.ts                         # distance, rounding helpers
    validation.ts                   # Input validation for curves & parameters
tests/
  setup.ts                          # jest-extended matchers
  coonsPatch.test.ts                # Main integration tests
  interpolate/...                   # Unit tests mirroring src structure
  utils/...                         # Utility tests (some .test.js for runtime type checks)
```

The main export is `coonsPatch(boundingCurves, params, config?)` which takes four bounding Bezier curves (top, bottom, left, right), interpolation parameters (u, v), and returns a Point.

## Code style

- **Formatter**: Prettier — no semicolons, single quotes, 80 char width, es5 trailing commas
- **Linter**: ESLint flat config with `typescript-eslint` (strict + stylistic), `simple-import-sort`, `unused-imports`, and Prettier integration
- **TypeScript**: Strict mode. Target ES2020, module ESNext, bundler resolution
- **Prefer backtick quotes** in source (eslint enforces `quoteProps: 'as-needed'` with backtick preference)

## Commit conventions

Commits use **Conventional Commits** enforced by commitlint. Subject must be **sentence case**.

Allowed types: `build`, `ci`, `chore`, `content`, `debug`, `deps`, `docs`, `feat`, `fix`, `hotfix`, `merge`, `perf`, `refactor`, `revert`, `style`, `test`

Examples:
- `feat: Add support for weighted interpolation`
- `fix: Correct boundary validation for degenerate curves`
- `test: Add coverage for edge cases in LUT generation`

## Pre-commit hooks

Husky runs three checks on every commit:
1. **lint-staged** — Prettier + ESLint on staged files
2. **vitest** — Full test suite
3. **tsc** — TypeScript type-check

All three must pass for a commit to succeed.

## Build

Vite builds to `dist/` in two formats:
- `index.js` (ESM)
- `index.cjs` (CommonJS)
- `index.d.ts` (consolidated type declarations via vite-plugin-dts)

Output is unminified with sourcemaps. `fast-memoize` is externalized.

## Testing

- **Framework**: Vitest with globals enabled (no need to import `describe`/`it`/`expect`)
- **Extra matchers**: jest-extended (loaded in `tests/setup.ts`)
- **Coverage**: v8 provider, includes `src/**`
- **Test file naming**: `*.test.ts` or `*.test.js`

## CI/CD

GitHub Actions workflow (`.github/workflows/release.yml`) runs: security audit → lint → test → semantic-release. Semantic-release auto-publishes to npm and creates GitHub releases on the `main` branch.
