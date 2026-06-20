import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import https from 'https';

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getTemplatesDir() {
  return path.join(
    new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'),
    '..',
    'templates'
  );
}

function getNodeMajorVersion() {
  const version = process.version;
  const major = parseInt(version.replace('v', '').split('.')[0], 10);
  return major;
}

function fetchLatestVersion(packageName) {
  return new Promise((resolve) => {
    const url = `https://registry.npmjs.org/${packageName}/latest`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(`^${json.version}`);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function resolveLatestVersions(depsObject) {
  const resolved = {};
  const entries = Object.entries(depsObject);
  await Promise.all(
    entries.map(async ([name, fallback]) => {
      const latest = await fetchLatestVersion(name);
      resolved[name] = latest ?? fallback;
    })
  );
  return resolved;
}

export async function scaffold(answers) {
  const { projectName, packageManager, database, useDocker, useSwagger } = answers;

  const templatesDir = getTemplatesDir();
  const projectDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    console.log(chalk.red(`\n✖ Folder "${projectName}" already exists. Please choose a different project name.\n`));
    process.exit(1);
  }

  console.log(chalk.cyan('\n⚙  Scaffolding your project...\n'));

  copyDir(path.join(templatesDir, 'base'), projectDir);

  fs.renameSync(
    path.join(projectDir, 'package.json.template'),
    path.join(projectDir, 'package.json')
  );

  const packageJson = readJson(path.join(projectDir, 'package.json'));
  packageJson.name = projectName;

  const dbKey = database.toLowerCase();

  const dbDeps = readJson(path.join(templatesDir, 'database', dbKey, 'dependencies.json'));
  let extraDeps = { ...dbDeps };

  if (useSwagger) {
    const swaggerDeps = readJson(path.join(templatesDir, 'swagger', 'dependencies.json'));
    extraDeps = { ...extraDeps, ...swaggerDeps };
  }

  console.log(chalk.cyan('⚙  Fetching latest package versions...\n'));

  const [latestBaseDeps, latestBaseDevDeps, latestExtraDeps] = await Promise.all([
    resolveLatestVersions(packageJson.dependencies),
    resolveLatestVersions(packageJson.devDependencies),
    resolveLatestVersions(extraDeps),
  ]);

  const nodeMajor = getNodeMajorVersion();
  latestBaseDevDeps['@types/node'] = `^${nodeMajor}`;

  packageJson.dependencies = { ...latestBaseDeps, ...latestExtraDeps };
  packageJson.devDependencies = { ...latestBaseDevDeps };

  writeFile(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  fs.copyFileSync(
    path.join(templatesDir, 'database', dbKey, 'database.module.ts'),
    path.join(projectDir, 'src', 'database.module.ts')
  );

  const appModulePath = path.join(projectDir, 'src', 'app.module.ts');
  let appModule = fs.readFileSync(appModulePath, 'utf8');
  appModule = appModule.replace(
    `import { AppController } from './app.controller';`,
    `import { AppController } from './app.controller';\nimport { DatabaseModule } from './database.module';`
  );
  appModule = appModule.replace(
    `ConfigModule.forRoot({`,
    `DatabaseModule,\n    ConfigModule.forRoot({`
  );
  fs.writeFileSync(appModulePath, appModule, 'utf8');

  const mainTsSrc = useSwagger
    ? path.join(templatesDir, 'swagger', 'main.ts')
    : path.join(templatesDir, 'no-swagger', 'main.ts');

  fs.copyFileSync(mainTsSrc, path.join(projectDir, 'src', 'main.ts'));

  const baseEnv = `NODE_ENV=development\nPORT=3000\n`;
  const dbEnvPartial = fs.readFileSync(
    path.join(templatesDir, 'database', dbKey, 'env.partial'),
    'utf8'
  ).replace(/PLACEHOLDER_PROJECT_NAME/g, projectName);

  const finalEnv = baseEnv + dbEnvPartial;
  writeFile(path.join(projectDir, '.env'), finalEnv);
  writeFile(path.join(projectDir, '.env.example'), finalEnv);

  if (useDocker) {
    fs.copyFileSync(
      path.join(templatesDir, 'docker', 'Dockerfile'),
      path.join(projectDir, 'Dockerfile')
    );
    fs.copyFileSync(
      path.join(templatesDir, 'docker', `docker-compose.yml.${dbKey}`),
      path.join(projectDir, 'docker-compose.yml')
    );
  }

  console.log(chalk.cyan(`⚙  Installing dependencies with ${packageManager}...\n`));
  execSync(`${packageManager} install`, {
    cwd: projectDir,
    stdio: 'inherit',
  });

  console.log(chalk.green('\n✔ Your project is ready.\n'));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(chalk.white(`  ${packageManager} run start:dev`));
  console.log('');
  console.log(chalk.gray('  Built with create-nest-pro by Peace Melodi'));
  console.log(chalk.gray('  github.com/PeaceMelodi'));
  console.log('');
}