#!/usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { scaffold } from './scaffold.js';

const program = new Command();

function showBanner() {
  console.log(
    chalk.cyan(
      figlet.textSync('create nest pro', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );

  console.log(chalk.green('create-nest-pro v1.0.0'));
  console.log(chalk.gray('Built by Peace Melodi'));
  console.log(chalk.gray('github.com/PeaceMelodi'));
  console.log('');
  console.log(chalk.white('The fastest way to scaffold a production ready NestJS project.'));
  console.log('');
}

async function askQuestions() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      validate: (input) => {
        if (!input.trim()) {
          return 'Project name cannot be empty.';
        }
        if (!/^[a-z0-9-_]+$/.test(input.trim())) {
          return 'Project name can only contain lowercase letters, numbers, hyphens, and underscores.';
        }
        return true;
      },
      filter: (input) => input.trim(),
    },
    {
      type: 'select',
      name: 'packageManager',
      message: 'Which package manager do you prefer?',
      choices: ['npm', 'yarn'],
    },
    {
      type: 'select',
      name: 'database',
      message: 'Which database will you be using?',
      choices: ['PostgreSQL', 'MySQL', 'MongoDB'],
    },
    {
      type: 'confirm',
      name: 'useDocker',
      message: 'Do you want Docker configured for this project?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'useSwagger',
      message: 'Do you want Swagger API documentation set up?',
      default: true,
    },
  ]);

  return answers;
}

program
  .name('create-nest-pro')
  .description('The fastest way to scaffold a production ready NestJS project.')
  .version('1.0.0', '-v, --version', 'output the current version')
  .action(async () => {
    showBanner();
    const answers = await askQuestions();
    await scaffold(answers);
  });

program.parse(process.argv);