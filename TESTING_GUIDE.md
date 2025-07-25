# Testing Guide

This document explains how to add unit and integration tests for the project.

## Tooling

- **Vitest** (preferred) or **Jest** for running tests.
- **React Testing Library** to interact with the UI using accessibility queries.
- **Mock Service Worker (MSW)** for mocking network requests.
- **@tanstack/react-query** should be wrapped with a custom `QueryClient` per test.

## Installing dependencies

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom msw
```

Alternatively you can use Jest:

```bash
npm install -D jest ts-jest @testing-library/react @testing-library/jest-dom msw
```

## Project structure

Place test files next to the code under test using the `*.test.tsx` or `*.test.ts` extension. Tests for components live in `src/components`, hooks in `src/hooks`, and pages in `src/app`.

A `test` folder at the root can contain common utilities like `test-utils.tsx` and MSW handlers.

## Example `test-utils.tsx`

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

export function renderWithQuery(ui: ReactElement) {
  const queryClient = new QueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}
```

Use this helper in your tests instead of `render` directly so each test gets a fresh React Query client.

## MSW setup

Create request handlers under `test/msw-handlers.ts` and start the worker in a `setupTests.ts` file:

```ts
import { setupServer } from 'msw/node';
import { handlers } from './msw-handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Reference this setup file in `vitest.config.ts` or `jest.config.ts` via the `setupFiles` option.

## Writing tests

- Use `describe` and `it` blocks with clear titles.
- Prefer `getByRole`, `getByLabelText` and other accessibility queries from Testing Library.
- Cover loading, success, empty and error states for components that fetch data.
- Mock React Query hooks when needed using `vi.mock()` or `jest.mock()`.
- Keep tests isolated and avoid sharing state.

Each test block should include a JSDoc comment describing the intent:

```ts
/**
 * Should show a loading spinner while data is being fetched.
 */
it('renders loading state', async () => {
  // ...
});
```

## Asynchronous tests

Use `await screen.findBy...` or `waitFor` to assert on elements that appear after asynchronous actions:

```ts
import { waitFor, screen } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByRole('heading', { name: /result/i })).toBeInTheDocument();
});
```

## Cleaning up

Testing Library cleans up automatically after each test, but additional cleanups (such as clearing mocks) should be performed in `afterEach`.

## Run tests

Add a script to `package.json`:

```json
"scripts": {
  "test": "vitest"
}
```

Then run:

```bash
npm test
```

This guide aims to keep tests readable, DRY and scalable for future contributors.
