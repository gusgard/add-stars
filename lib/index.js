// import colors from 'colors/safe';

import Menu from './menu';
import GH from './gh';

try {
  // import auth from '../auth.json';
  const auth = require('../auth.json');
  // console.log('init' , auth);

  let gh = new GH();
  gh.addStars();
} catch (e) {
  let menu = new Menu();
  menu
    .init()
    .then(() => {
      let gh = new GH();
      gh.addStars();
    });
} finally {
}
