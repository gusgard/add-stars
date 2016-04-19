import github from 'octonode';
import colors from 'colors/safe';
import gh from 'github-url-to-object';

export default class GH {
  constructor (auth, delay) {
    let client = github.client({
      username: auth.username,
      password: auth.password
    });

    this.delay = delay || 100;
    this.ghme = client.me();
    this.repos = new Set();
    this.success = 0;
    this.errors = 0;
    this.total = 0;
  }

  addStar (repository) {
    return new Promise((resolve, reject) => {
      if (repository && 'url' in repository) {
        let ghObject = gh(repository.url);
        let repoName = `${ghObject.user}/${ghObject.repo}`;
        if (!this.repos.has(repoName)) {
          this.repos.add(repoName);
          setTimeout(()=> {
            this.ghme.star(repoName, error => {
              this.total++;
              if (!error) {
                this.success++;
                console.log('✅  ' + colors.yellow('Add ⭐  to ')+colors.yellow.underline(repoName));
              } else {
                this.errors++;
                // let data = { repo: repoName, message: error.message, code: error.statusCode };
                console.log(`❌  ${colors.yellow('Add ⭐  to ')} ${colors.yellow.underline(repoName)} ${colors.red(` error: ${error.message}`)}`);
              }
              resolve(this.total);
            });
          }, this.delay);
        } else {
          reject();
        }
      } else {
        reject();
      }
    });
  }

  summary () {
    console.log(colors.green('=================='));
    console.log(colors.red(`❌  Errors : ${this.errors}`));
    console.log(colors.yellow(`⭐  Added  : ${this.success}`));
  }
}
