let colors = require('colors/safe');
colors.setTheme({ silly: 'rainbow', input: 'grey', verbose: 'cyan',
                  prompt: 'grey',info: 'green',data: 'grey', help: 'cyan',
                  warn: 'yellow', debug: 'blue', error: 'red' });

// console.log(colors.error("this is an error"));
// console.log(colors.rainbow("Double Raindows All Day Long"))
// console.log(colors.black.bgWhite('Background color attack!'));
// console.log(colors.random('Use random styles on everything!'))

let github = require('octonode');
let auth = require('../auth.json');

let client = github.client({
  username: auth.username,
  password: auth.password
});

let ghme = client.me();

let request = require('superagent');
let dependencies = require('../package.json').dependencies;
let devDependencies = require('../package.json').devDependencies;
// ES7
let merged = {...dependencies, ...devDependencies};

let url = 'https://registry.npmjs.org/';

var gh = require('github-url-to-object')

for (let name of Object.keys(merged)) {
  request.get(url + name, (err, res) => {
    if (err) throw err;
    // console.log(res.body.name);
    let repository = res.body.repository;
    // for now only support git.
    if (repository.type === 'git') {
      let ghObject = gh(repository.url);
      let repoName = `${ghObject.user}/${ghObject.repo}`;
      // let [repo] = repository.url.split('.git');
      // let [_, repoName] = repo.split('github.com/');
      console.log(colors.error(repoName));
      ghme.star(repoName, (err, data, headers) => {
        console.log(colors.warn('star ' + repoName));
        // console.log("error: " + err);
        // console.log("data: " + data);
        // console.log("headers:" + headers);
      });
    }
    console.log(res.body.repository);
  });
}
