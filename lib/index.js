#!/usr/bin/env node

import fs from 'fs';

import Menu from './menu';
import GH from './gh';

let path = process.cwd();
let packagePath = `${path}/package.json`;
fs.stat(packagePath, (error, stats) => {
  if (!stats) {
    console.log('Missing package.json');
  } else {
    let metaData = require(packagePath);
    let allDep = Object.assign(metaData.dependencies, metaData.devDependencies);
    let dependencies = Object.keys(allDep);
    let [, authPath] = process.argv;
    // TODO change this.
    authPath = authPath.replace('bin', 'lib/node_modules') + '/auth.json';
    // console.log(authPath);

    fs.stat(authPath, (error, stats) => {
      let gh = new GH(dependencies, authPath);
      if (!stats) {
        let menu = new Menu(authPath);
        menu
          .init();
          // .then(() => {gh.addStars()});
        console.log('Setup ready, run the command again!');
      } else {
        gh.addStars();
      }
    });
  }
});
