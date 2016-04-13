#!/usr/bin/env node

import fs from 'fs';
import jsonfile from 'jsonfile';
import program from 'commander';
import colors from 'colors/safe';

import Cli from './cli';

let [, appPath] = process.argv;
appPath = appPath.replace('bin', 'lib/node_modules');

// Get the version of this package.
const appPackage = jsonfile.readFileSync(`${appPath}/package.json`);

program
  .version(appPackage.version, '-v, --version')
  .option('-i, --init', 'Configure authentication')
  .parse(process.argv);

let authPath = `${appPath}/auth.json`;
fs.stat(authPath, (error, existAuth) => {
  if (!existAuth || program.init) {
    Cli.menu(authPath);
  } else {
    let currentDirectory = process.cwd();
    let currentPackage = `${currentDirectory}/package.json`;
    fs.stat(currentPackage, (error, existCurrentPackage) => {
      if (!existCurrentPackage) {
        console.log(colors.error('Missing package.json'));
      } else {
        let metaData = require(currentPackage);
        let auth = jsonfile.readFileSync(authPath);
        let cli = new Cli(metaData, auth);
        cli.run();
      }
    });

  }
});
