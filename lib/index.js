#!/usr/bin/env node

import fs from 'fs';

import Menu from './menu';
import GH from './gh';

let path = process.cwd();
let packagePath = `${path}/package.json`;
fs.stat(packagePath, (error, stats) => {
  if (stats.isFile()) {
    let metaData = require(packagePath);
    let allDep = Object.assign(metaData.dependencies, metaData.devDependencies);
    let dependencies = Object.keys(allDep);
    let authPath = `${path}/auth.json`;

    fs.stat(authPath, (error, stats) => {
      let gh = new GH(dependencies, authPath);
      if (!stats) {
        let menu = new Menu();
        menu
          .init()
          .then(() => gh.addStars());
      } else if (stats.isFile()) {
        gh.addStars();
      } else {
        console.log('nothing....');
      }
    });
  } else {
    console.log('Missing package.json');
  }
});
