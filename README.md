<h3 align="center">Get started instantly with one command</h3>

<p align="center">

```bash
npx create-nest-pro@latest
```

</p>

---

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="80" alt="NestJS Logo" /></a>
</p>

<h1 align="center">create nest pro</h1>

<p align="center">
  The fastest way to scaffold a production ready NestJS project. One command and everything is ready.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v10-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-v20-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/npm-ready-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm" />
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nestjs,typescript,postgres,mysql,mongodb,docker" alt="Tech Stack Icons" />
</p>

---

## Overview

create nest pro works like Create React App but for NestJS. A developer runs one command with npx and gets a fully production ready NestJS project scaffolded instantly. No global install needed. No separate configuration steps. No manual wiring. Just one command and the project is ready to build on.

Every serious NestJS developer always needs TypeScript, ESLint, Prettier, environment configuration, a clean modular folder structure, and unit testing setup. These come automatically with every project because they are not optional. The CLI then asks five focused questions to handle the parts that vary from project to project.

---

## Usage

```bash
npx create-nest-pro@latest
```

No installation required. Just run the command and answer five questions.

---

## What the CLI asks

```
What is your project name?
Which package manager do you prefer? › npm or yarn
Which database will you be using? › PostgreSQL, MySQL, or MongoDB
Do you want Docker configured for this project? › Yes or No
Do you want Swagger API documentation set up? › Yes or No
```

After you answer, the CLI scaffolds the project, fetches the latest versions of all packages, installs dependencies, and tells you exactly what to run next.

---

## What every project gets automatically

| Feature | Details |
|---|---|
| TypeScript | Fully configured with tsconfig.json and tsconfig.build.json |
| ESLint | Configured with TypeScript and Prettier plugins |
| Prettier | Consistent formatting out of the box |
| Environment config | dotenv wired through @nestjs/config with .env and .env.example |
| Modular structure | Clean src layout following NestJS best practices |
| Unit testing | Jest configured with ts-jest, spec files included |
| E2E testing | Supertest wired and ready |

---

## What the five questions control

| Question | What it scaffolds |
|---|---|
| Project name | Folder name, package.json name, database name |
| Package manager | Which manager installs dependencies and which command to run after |
| PostgreSQL | TypeORM with pg driver, database module, connection via ConfigService |
| MySQL | TypeORM with mysql2 driver, database module, connection via ConfigService |
| MongoDB | Mongoose with @nestjs/mongoose, database module, URI connection |
| Docker yes | Dockerfile and docker-compose.yml pre-wired for your chosen database |
| Swagger yes | SwaggerModule configured in main.ts, available at /api |

---

## Always installs the latest versions

create nest pro fetches the latest stable version of every package from the npm registry at the moment you run the command. This means your project always starts with current versions, not versions that were pinned when the CLI was last updated.

---

## Project structure of the generated app

```
your-project/
├── src/
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.service.ts
│   ├── database.module.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── Dockerfile          (if Docker was selected)
└── docker-compose.yml  (if Docker was selected)
```

---

## After scaffolding

```bash
cd your-project
npm run start:dev
```

or if you chose yarn:

```bash
cd your-project
yarn start:dev
```

---

## Tech stack

| Tool | Purpose |
|---|---|
| Node.js | Runtime |
| Commander.js | CLI program structure |
| Inquirer.js | Interactive terminal prompts |
| Chalk | Terminal color output |
| Figlet | ASCII art banner |

---

## Author

**Peace Melodi**

[![GitHub](https://img.shields.io/badge/GitHub-PeaceMelodi-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/PeaceMelodi)

---

## License

MIT