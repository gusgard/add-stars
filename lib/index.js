#!/usr/bin/env node

import fs from 'fs';
import jsonfile from 'jsonfile';
import colors from 'colors/safe';

import Menu from './menu';
import GH from './gh';

let path = process.cwd();
let packagePath = `${path}/package.json`;
fs.stat(packagePath, (error, stats) => {
  if (!stats) {
    console.log('Missing package.json');
  } else {
    let metaData = require(packagePath);
    let allDep = Object.assign(metaData.dependencies || {}, metaData.devDependencies || {});
    let dependencies = Object.keys(allDep);
    let [, appPath] = process.argv;
    appPath = appPath.replace('bin', 'lib/node_modules');
    let authPath = `${appPath}/auth.json`;
    fs.stat(authPath, (error, stats) => {
      if (!stats) {
        let menu = new Menu(authPath);
        menu
          .init()
          .then(auth => {
            let gh = new GH(dependencies, auth);
            gh.addStars();
          })
          .catch(err => console.log(colors.yellow(err)));
      } else {
        jsonfile.readFile(authPath, (err, auth) => {
          let gh = new GH(dependencies, auth);
          gh.addStars();
        });
      }
    });
  }
});
