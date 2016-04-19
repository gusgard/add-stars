import fs from 'fs';
import jsonfile from 'jsonfile';
import colors from 'colors/safe';
import request from 'superagent';

import Menu from './menu';
import GH from './gh';

export default class Cli {
  /**
   * constructor
   * @param {Object}  metaData  Package.json from the current location.
   * @param {Object}  auth      Authentication credencials from the GitHub user.
   */
  constructor (metaData, auth) {
    this.metaData = metaData;
    this.auth = auth;
    let allDep = Object.assign(metaData.dependencies || {}, metaData.devDependencies || {});
    this.dependencies = Object.keys(allDep);
    this.URL = 'https://registry.npmjs.org/';
    this.gh = new GH(this.auth);
  }

  /**
   * Add stars to the projects in dependencies
   */
  run () {
    for (let name of this.dependencies) {
      request.get(this.URL + name, (err, res) => {
        if (err) throw err;
        let repository = res.body.repository;
        this.gh.addStar(repository);
      });
    }
  }

  /**
   * Add stars recursive to the projects in dependencies
   */
  runRecursive () {
    let currentDirectory = process.cwd();
    let nodeModulesPath = `${currentDirectory}/node_modules`;
    // Search in all repos installed in node_modules without query to npm.
    let names = fs.readdirSync(nodeModulesPath);
    let length = names.length;
    names.forEach(name => {
        var filePath = `${nodeModulesPath}/${name}/package.json`;
        fs.stat(filePath, (error, existPackage) => {
          if (!error && existPackage) {
            let metaData = require(filePath);
            this.gh
              .addStar(metaData.repository)
              .then(total => {
                if (total === length) {
                  this.gh.summary();
                }
              })
              .catch(() => length--);
          } else {
            length --;
          }
        });
    });
  }

  /**
   * Menu
   * @param {string}  authPath  Path of auth.json.
   */
  static menu (authPath) {
    let menu = new Menu();
    menu
      .show()
      .then(answers => {
        jsonfile.writeFileSync(authPath, answers, { spaces: 2 });
        console.log(colors.yellow('GitHub account configured 😎'));
        console.log(colors.yellow('Run \"add-stars\" in a repo to ⭐  all the dependencies'));
      })
      .catch(err => console.log(colors.yellow(err)));
  }
}
