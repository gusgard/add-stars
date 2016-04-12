import inquirer from 'inquirer';
import jsonfile from 'jsonfile';
import colors from 'colors/safe';

/**
 * Menu for select the authentication to use.
 */
export default class Menu {
  constructor (filePath) {
    console.log(colors.yellow('Hi, ready to add start to all repos used in your dependencies ?'));

    this.file = filePath;
    this.questions = [
     {
        type: 'list',
        name: 'authentication',
        message: 'How do you want to authentication to GitHub',
        choices: [
          { name: 'Basic: User/password', value: 'basic' },
          { name: 'OAuth2', value: 'oauth' , disabled: 'Not implemented yet'}
        ],
      },
      {
        type: 'input',
        name: 'username',
        message: 'Enter your GitHub user',
        when: (answers) => answers.authentication === 'basic'
      },
      {
        type: 'input',
        message: 'Enter your GitHub password',
        name: 'password',
        when: (answers) => answers.authentication === 'basic'
      },
      {
        type: 'list',
        name: 'strategy',
        message: 'Using what strategy ?',
        choices: [
          { name: 'Token', value: 'token' },
          { name: 'Key/Secret', value: 'key' }
        ],
        when: (answers) => answers.authentication === 'oauth'
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
      },
    ];

  }

  init () {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt(this.questions)
        .then(answers => {
          delete answers.authentication;
          console.log(colors.green('\nCreated auth.json:'));
          console.log(colors.green(JSON.stringify(answers, null, '  ')));
          jsonfile.writeFile(this.file, answers, { spaces: 2 }, err => console.error(err))
            .then(resolve);
        });
    });
  }
}
