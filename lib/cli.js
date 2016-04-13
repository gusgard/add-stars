import jsonfile from 'jsonfile';
import colors from 'colors/safe';

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
    let dependencies = Object.keys(allDep);
    this.gh = new GH(dependencies, this.auth);

  }

  /**
   * Add stars to the projects in dependencies
   */
  run () {
    this.gh.addStars();
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
