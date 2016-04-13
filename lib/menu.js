import inquirer from 'inquirer';
import colors from 'colors/safe';

/**
 * Menu for select the authentication to use.
 */
export default class Menu {
  constructor () {
    console.log(colors.yellow('Hi, ready to add start to all repos used in your dependencies ?'));
    this.authentication = { basic: 'basic', oauth: 'oauth', exit: 'exit'};
    this.questions = [
      {
        type: 'list',
        name: 'authentication',
        message: 'How do you want to authentication to GitHub',
        choices: [
          { name: 'Basic: User/password', value: this.authentication.basic },
          { name: 'OAuth2', value: this.authentication.oauth , disabled: 'Not implemented yet'},
          { name: 'Exit', value: this.authentication.exit}
        ],
      },
      {
        type: 'input',
        name: 'username',
        message: 'Enter your GitHub user',
        when: (answers) => answers.authentication === this.authentication.basic
      },
      {
        type: 'input',
        message: 'Enter your GitHub password',
        name: 'password',
        when: (answers) => answers.authentication === this.authentication.basic
      },
      {
        type: 'list',
        name: 'strategy',
        message: 'Using what strategy ?',
        choices: [
          { name: 'Token', value: 'token' },
          { name: 'Key/Secret', value: 'key' }
        ],
        when: (answers) => answers.authentication === this.authentication.oauth
      },
      {
        type: 'input',
        name: 'token',
        message: 'Enter your GitHub token',
        when: (answers) => answers.strategy === 'token'
      },
      {
        type: 'input',
        name: 'key',
        message: 'Enter your GitHub Key',
        when: (answers) => answers.strategy === 'key'
      },
      {
        type: 'input',
        name: 'secret',
        message: 'Enter your GitHub Secret',
        when: (answers) => answers.strategy === 'key'
      }
    ];
  }

  show () {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt(this.questions)
        .then(answers => {
          if (answers.authentication === this.authentication.exit) {
            reject('Good Bye 👋');
          } else {
            delete answers.authentication;
            resolve(answers);
          }
        });
    });
  }
}
