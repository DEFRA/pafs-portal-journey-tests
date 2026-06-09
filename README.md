pafs-portal-journey-tests

WebdriverIO end-to-end test suite for the PAFS portal (frontend + backend).

- [Local Development](#local-development)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Environment Variables](#environment-variables)
    - [Test Credentials](#test-credentials)
    - [WDIO / Browser](#wdio--browser)
    - [API Seeding](#api-seeding)
    - [BrowserStack](#browserstack)
    - [Docker Compose (GitHub CI)](#docker-compose-github-ci)
  - [Running local tests](#running-local-tests)
  - [Debugging local tests](#debugging-local-tests)
- [Production (CDP Portal)](#production-cdp-portal)
  - [Requirements](#requirements-of-cdp-environment-tests)
  - [Running the tests](#running-the-tests)
- [Running on GitHub](#running-on-github)
- [BrowserStack](#browserstack-1)
- [Licence](#licence)

---

## Local Development

### Requirements

#### Node.js

Please install [Node.js](http://nodejs.org/) `>= v22` and [npm](https://nodejs.org/) `>= v9`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
nvm use
```

### Setup

Install application dependencies:

```bash
npm install
```

---

## Environment Variables

### Test Credentials

Required for all test suites that exercise authenticated flows (auth, admin, general, account).

| Variable | Required | Description |
|---|---|---|
| `TEST_USER_EMAIL` | Yes | Email address of the regular (non-admin) test user account |
| `TEST_USER_PASSWORD` | Yes | Password for the regular test user |
| `TEST_ADMIN_EMAIL` | Yes | Email address of the admin test user account |
| `TEST_ADMIN_PASSWORD` | Yes | Password for the admin test user |
| `TEST_EA_USER_EMAIL` | No | Email of an Environment Agency user (`environment-agency.gov.uk` domain). Used for auto-approval account-request tests. Skipped when absent |
| `TEST_EA_USER_PASSWORD` | No | Password for the EA test user |

Create the accounts in the target environment before running tests. For local runs, add them to a `.env` file (never commit it):

```dotenv
TEST_USER_EMAIL=user@example.com
TEST_USER_PASSWORD=changeme
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_PASSWORD=changeme
TEST_EA_USER_EMAIL=ea-user@environment-agency.gov.uk
TEST_EA_USER_PASSWORD=changeme
```

---

### WDIO / Browser

Control which environment the browser-based tests point at and how the chromedriver is reached.

| Variable | Required | Default | Description |
|---|---|---|---|
| `ENVIRONMENT` | CDP only | — | CDP environment name (e.g. `dev`, `test`). Used to build the target URL: `https://pafs-portal-frontend.<ENVIRONMENT>.cdp-int.defra.cloud` |
| `TEST_BASE_URL` | No | Built from `ENVIRONMENT` | Override the full base URL (takes priority over `ENVIRONMENT`). Useful for pointing at a local or custom URL |
| `CHROMEDRIVER_URL` | No | `127.0.0.1` | Hostname of the remote chromedriver / Selenium grid |
| `CHROMEDRIVER_PORT` | No | `4444` | Port of the remote chromedriver / Selenium grid |
| `HTTP_PROXY` | No | — | Outbound HTTP proxy URL (e.g. `http://proxy:3128`). Required when the test runner cannot reach BrowserStack directly |
| `WDIO_GREP` | No | — | Mocha grep pattern to filter which tests run (e.g. `WDIO_GREP="login"`) |
| `DEBUG` | No | — | Set to any truthy value to run Chrome in non-headless mode and increase test timeouts (local only) |

For **local** runs the base URL is hard-coded to `http://localhost:3000` in `wdio.local.conf.js` — `TEST_BASE_URL` and `ENVIRONMENT` are not used.

---

### API Seeding

Some tests seed data (password reset tokens, invite tokens) directly via the backend API rather than through the UI.

| Variable | Required | Default | Description |
|---|---|---|---|
| `TEST_API_BASE_URL` | No | `TEST_BASE_URL` or `http://localhost:3001` | Backend API root URL. Falls back to `TEST_BASE_URL` if not set |
| `ADMIN_API_TOKEN` | No | — | Long-lived admin bearer token used to call privileged API endpoints (e.g. create/delete users). Generate once per environment and store as a CI secret. Tests that require this token are skipped when the variable is absent |

> The backend must be running in a non-production mode that returns raw tokens in API responses (`NODE_ENV=test` or equivalent). In production these tokens are emailed only.

---

### BrowserStack

Used only when running via `npm run test:browserstack` or `npm run test:github:browserstack`.

| Variable | Required | Description |
|---|---|---|
| `BROWSERSTACK_USERNAME` | Yes (BS runs) | BrowserStack account username |
| `BROWSERSTACK_KEY` | Yes (BS runs) | BrowserStack access key (also used for Test Observability) |
| `BROWSERSTACK_USER` | No | BrowserStack user for Test Observability (falls back to `BROWSERSTACK_USERNAME` if omitted) |
| `ENVIRONMENT` | Yes (BS runs) | CDP environment name — used in the BrowserStack build name tag |

Store these as GitHub Actions secrets and pass them in the workflow file.

---

### Docker Compose (GitHub CI)

When running `npm run test:github` the test suite spins up services via `compose.yml`. The containers are configured by env files in `docker/config/`.

#### `docker/config/defaults.env` — shared by all containers

| Variable | Value | Description |
|---|---|---|
| `MONGO_URI` | `mongodb://mongodb:27017/?tls=false` | MongoDB connection string inside compose network |
| `Mongo__DatabaseUri` | `mongodb://mongodb:27017/?tls=false` | .NET-style MongoDB URI alias |
| `REDIS_HOST` | `redis` | Redis service hostname |
| `USE_SINGLE_INSTANCE_CACHE` | `true` | Disables Redis cluster mode |
| `LOCALSTACK_URL` | `http://localstack:4566` | Localstack base URL |
| `SNS_ENDPOINT` | `http://localstack:4566` | SNS endpoint override |
| `SQS_ENDPOINT` | `http://localstack:4566` | SQS endpoint override |
| `S3_ENDPOINT` | `http://localstack:4566` | S3 endpoint override |
| `AWS_ACCESS_KEY_ID` | `test` | Dummy AWS key for localstack |
| `AWS_SECRET_ACCESS_KEY` | `test` | Dummy AWS secret for localstack |
| `AWS_SECRET_KEY` | `test` | Alternate AWS secret key name |
| `AWS_REGION` | `eu-west-2` | AWS region |
| `TRUSTSTORE_CDP_ROOT_CA` | *(base64 cert)* | Placeholder CDP root CA certificate in base64 |

#### `docker/config/example-backend.env` — backend service

| Variable | Value | Description |
|---|---|---|
| `S3_BUCKET` | `test-bucket` | S3 bucket name created by localstack init script |

#### `docker/config/example-frontend.env` — frontend service

| Variable | Value | Description |
|---|---|---|
| `EXAMPLE_BACKEND_URL` | `http://example-node-backend:3001` | URL the frontend uses to reach the backend container |

> When you add the PAFS services to `compose.yml`, copy these example files and rename them (e.g. `pafs-backend.env`, `pafs-frontend.env`) replacing the placeholder values with the correct service names and ports.

---

## Running local tests

Start the PAFS frontend on the URL set in `baseUrl` in [wdio.local.conf.js](wdio.local.conf.js) (default `http://localhost:3000`), then:

```bash
npm run test:local
```

Run a specific suite:

```bash
npm run test:local:auth
npm run test:local:admin
npm run test:local:account
npm run test:local:general
npm run test:local:smoke
```

## Debugging local tests

Runs Chrome in visible (non-headless) mode with an extended timeout:

```bash
npm run test:local:debug
```

---

## Production (CDP Portal)

### Requirements of CDP Environment Tests

1. Your service builds as a docker container using the `.github/workflows/publish.yml`
   The workflow tags the docker images allowing the CDP Portal to identify how the container should be run on the platform.
   It also ensures its published to the correct docker repository.

2. The Dockerfile's entrypoint script should return exit code of 0 if the test suite passes or 1/>0 if it fails.

3. Test reports should be published to S3 using the script in `./bin/publish-tests.sh`.

### Running the tests

Tests are run from the CDP Portal under the Test Suites section. Before any changes can be run, a new docker image must be built — this happens automatically when a pull request is merged into the `main` branch.
You can check the progress of the build under the Actions section of this repository. Builds typically take around 1–2 minutes.

The results of the test run are made available in the portal.

---

## Running on GitHub

Alternatively you can run the test suite as a GitHub workflow.
Test runs on GitHub are not able to connect to the CDP Test environments. Instead, they run the tests against a version of the services running in docker.
A docker compose `compose.yml` is included as a starting point, which includes the databases (mongodb, redis) and infrastructure (localstack) pre-setup.

Steps:

1. Edit `compose.yml` to include your services.
2. Modify the scripts in `docker/scripts` to pre-populate the database if required and create any localstack resources.
3. Test the setup locally with `docker compose up` and `npm run test:github`.
4. Set up the workflow trigger in `.github/workflows/journey-tests.yml`.

By default, the provided workflow will run when triggered manually from GitHub or when triggered by another workflow.

If you want to use the repository exclusively for running docker-compose based test suites, consider disabling the `publish.yml` workflow.

---

## BrowserStack

Two wdio configuration files are provided to help run the tests using BrowserStack — in both a GitHub workflow (`wdio.github.browserstack.conf.js`) and from the CDP Portal (`wdio.browserstack.conf.js`).

They can be run from npm using:

```bash
npm run test:browserstack          # via CDP portal
npm run test:github:browserstack   # via GitHub runner
```

See the CDP Documentation for more details on BrowserStack integration.

---

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
