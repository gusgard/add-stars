import github from 'octonode';
import colors from 'colors/safe';
import gh from 'github-url-to-object';
import request from 'superagent';

let packageDep = require('../package.json').dependencies;
let packagedevDep = require('../package.json').devDependencies;

export default class GH {
  constructor () {
    let auth = require('../auth.json');
    let client = github.client({
      username: auth.username,
      password: auth.password
    });

    this.ghme = client.me();

    let dependencies = {...packageDep, ...packagedevDep}; // ES7
    this.dependencies = Object.keys(dependencies);
    this.URL = 'https://registry.npmjs.org/';
    // console.log(colors.green('Total dependencies ' + this.dependencies.length));
  }

  addStars () {
    let repos = new Set();
    for (let name of this.dependencies) {
      request.get(this.URL + name, (err, res) => {
        if (err) throw err;
        let repository = res.body.repository;
        // for now only support git.
        if (repository.type === 'git') {
          let ghObject = gh(repository.url);
          let repoName = `${ghObject.user}/${ghObject.repo}`;
          if (!repos.has(repoName)) {
            repos.add(repoName);
            this.ghme.star(repoName, error => {
              if (error) {
                let data = { repo: repoName, message: error.message, code: error.statusCode };
                console.log(colors.red(JSON.stringify(data, null, '  ')));
              } else {
                console.log(colors.yellow('Add ⭐  to ')+colors.yellow.underline(repoName));
              }
            });
          }
        }
        // console.log(res.body.repository);
      });
    }
    // console.log(colors.green(`Added ${repos.size} stars`));
  }
}
