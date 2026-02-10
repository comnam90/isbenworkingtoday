# Vitest Coverage + CI Design

## Goals
- Add Vitest as the test runner with coverage enforcement.
- Enforce **>=80%** coverage for lines, branches, functions, statements.
- Keep coverage focused on app logic (exclude entrypoints and stubs).
- Ensure CI runs lint and coverage tests on push to `main` and all PRs.

## Approach
### Testing & Coverage
- Configure Vitest inside `vite.config.ts` for a single config surface.
- Use `jsdom` environment for React Testing Library.
- Load `@testing-library/jest-dom` via `src/setupTests.ts`.
- Coverage provider: `v8` with reporters `text`, `json-summary`, `lcov`.
- Coverage scope:
  - **Include:** `src/**/*.{ts,tsx}`
  - **Exclude:** `src/main.tsx`, `src/vite-env.d.ts`, `src/setupTests.ts`, `**/*.d.ts`, `**/__tests__/**`
- Enforce thresholds: 80% for lines, branches, functions, statements.

### Tests
- Expand `src/__tests__/App.test.tsx` to cover:
  - `status.working` branch (green vs red styles)
  - confidence color thresholds (>80, >50, <=50)
  - loading state transitions on refresh
- Use `vi.spyOn(Math, 'random')` with deterministic sequences to avoid flakiness.

### Scripts
- Add scripts:
  - `test`: `vitest`
  - `test:watch`: `vitest --watch`
  - `test:coverage`: `vitest run --coverage`

### CI
- Add a GitHub Actions workflow (`.github/workflows/ci.yml`) to run `lint` and `test:coverage` on `main` push and PRs.

## Risks & Mitigations
- **Randomness flakiness:** use deterministic `Math.random` mocks.
- **Coverage misses:** add targeted UI-level assertions before changing production logic.
