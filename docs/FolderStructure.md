## Folder Structure

After creation and a successful build, your project should have the following file structure:

```
chat.susi.ai/
  README.md
  node_modules/
  package.json
  public/
    index.html
  src/
    __tests__/
    actions/
    components/
    constants/
    dispatcher/
    images/
    stores/
    utils/
    App.test.js
    ChatDataServer.js
    history.js
    index.css
    index.js
    setupTests.js
  .eslintrc
  .travis.yml
  deploy.sh
  LICENSE
```

* `public/index.html` is the page template;
* `src/index.js` is the JavaScript entry point.
* `src/__tests__/` new tests related to all the components can be created in this folder, this project follows a `jest` testing suite.
* `src/actions/` contains related action types which can be defined in this folder.
* `src/components/` any new component can be added in this folder, given that the file is reused or should be unique in some way. All static files are present in this component as well.
* `src/components/Translate/` has all the pot files required to integrate the project with [Weblate](http://weblate.org). 
* `src/constants/` contains all the action types which are being used in the Application.
* `src/dispatcher/` contains the files to call the Dispatcher Service for the Chat App.
* `src/images/` contains all the static images being used in the App.
* `src/stores/` contains all application related stores for the Dispatcher Service which can be defined in this folder.
* `src/utils/` contains all utilities are files which help us in communicating efficiently between the stores and the actions.
* `src/App.test.js/` is the entry point for all tests in the `__tests__` folder.
* `src/ChatDataServer.js/` contains all the helper functions to the calls from the actions to the store.
* `src/history.js/` registers a history for the `react-router` service in the application.
* `src/setupTests.js/` is the file containing custom scripts written for failing tests to pass due to the deprecated libraries.
* `.eslintrc` is the config file for the ESLint testing.
* `deploy.sh` handles the continuous Travis Deployment of the project on `gh-pages`.
* `.travis.yml` is the config file for Travis CI.
