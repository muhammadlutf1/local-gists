# Local Gists

A fully-featured local clone of the GitHub Gists API, built with Node.js, Express, and PostgreSQL. Covering API design, schema validation, database integration, and automated integration testing.

![API Docs Preview](docs.png)

---

## ✨ Features

- **RESTful API** — Full CRUD operations for gists and their files, mirroring the GitHub Gists API structure
- **OpenAPI 3.0 Spec** — Complete `spec.yaml` written by hand, serving as the single source of truth for the API contract
- **Interactive API Docs** — Rendered at `/docs` using [Scalar](https://github.com/scalar/scalar), providing a clean and explorable UI
- **Request Validation Middleware** — All incoming requests are validated against the OpenAPI schema using [`express-openapi-validator`](https://github.com/cdimascio/express-openapi-validator), rejecting malformed payloads before they hit business logic
- **Prisma ORM + PostgreSQL** — Strongly-typed database access with schema migrations managed through Prisma
- **Integration Tests** — Full coverage across every endpoint using [Supertest](https://github.com/ladjs/supertest) and [Vitest](https://github.com/vitest-dev/vitest), running against a real database

---

## 🚀 Getting Started

### Installation

```bash
git clone https://github.com/muhammadlutf1/local-gists.git
cd local-gists
```

```bash
pnpm install
```

### Environment Setup

Copy the example env files and fill in your values:

```bash
cp .env.example .env
cp .env.test.example .env.test
```

`.env` is used by the dev server, `.env.test` is used by the integration tests (point it at a separate test database to avoid clobbering your dev data).

```env
# .env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/local_gists"
PORT=3000
```

```env
# .env.test
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/local_gists_test"
```

### Database Setup

```bash
prisma migrate dev
```

### Run the Server

```bash
pnpm dev
```

API docs are available at `/docs`.

---

## 🧪 Running Tests

Integration tests run against a real PostgreSQL database. Make sure your database is running before running tests.

```bash
pnpm test
```

Tests use Supertest to fire actual HTTP requests through the full Express middleware stack, including OpenAPI validation.

---

## 📐 Design Decisions

**OpenAPI spec as the source of truth** — Writing `spec.yaml` first forced clear API design before any code was written, and enabled the validator middleware and Scalar docs to be derived from the same file with no duplication.

**express-openapi-validator as middleware** — Validation happens at the boundary of the application. Invalid requests (wrong types, missing required fields, unknown properties) are rejected with structured 400 errors before touching any route handler or database.

**Integration tests over unit tests** — Since the core value of this project is the HTTP contract, tests run against the full stack (routing, validation, ORM, database) to give confidence that the API behaves correctly end-to-end.

**No auth** — This is a local-only tool. Authentication was intentionally omitted to keep the focus on API design and infrastructure patterns.

---

## 📚 What I Learned

- Designing an OpenAPI 3.0 spec by hand and understanding how it describes request/response contracts
- Using schema validation as a middleware layer to enforce API contracts at the boundary
- Prisma schema design, migrations, and strongly-typed query building with PostgreSQL
- Writing meaningful integration tests with Supertest that cover the full request lifecycle
- Rendering interactive API documentation from an OpenAPI spec with Scalar
