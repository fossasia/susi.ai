# Architecture

## High-level design

**SUSI.AI** uses [react](https://reactjs.org/tutorial/tutorial.html) local state and [redux](http://redux.js.org) for global state management and data flow.

Please read the [Redux docs](http://redux.js.org) for more information on the Redux
architecture and terminology (such as actions, reducers, and stores).

## Folder Structure

After creation and a successful build, your project should have the following file structure:

```
susi.ai/
  .github
  docs
  public
  src
    __tests__
    apis
    components
      About
      Admin
      Auth
      ChatApp
      cms
      Contact
      CookiePolicy
      Footer
      NavigationBar
      NotFound
      Settings
      shared
      smart-speaker
      Translate
    constants
    helpers
    images
    redux
      actions
      actionTypes
      middleware
      reducers
    utils
    App.js
    App.test.js
    index.css
    index.js
    MUItheme.js
    setupTests.js
    store.js
    withTracker.js
    .editorconfig
    .env
    .eslintrc
    .gitignore
    .pretteirrc
    .travis.yml
    deploy.sh
    Dockerfile
    LICENSE
    package-lock.json
    package.json
    surge_deploy.sh
```

* `docs` - instructions for setting up the project locally, deploying using Surge. It also contains information regarding Accounting, Skill language.
* `public` - static assets like images, external CSS files, HTML file
* `public/index.html` - is the page template.
* `src` - Javascript source code
* `src/__tests__/` - tests for components, follows `jest` testing suite
* `src/apis` - SUSI server API requests
* `src/components/` - react components
* * `src/components/Translate/` - has all the pot files required to integrate the project with [Weblate](http://weblate.org).
* `src/constants` - constants used
* `src/helpers` - ajax helper for data fetching request
* `src/images` - static images used
* `src/redux/` - actionTypes, actions, reducers and store configuration for Redux
* `src/utils` - common utility functions
* `src/setupTests.js/` - custom scripts written for failing tests to pass due to the deprecated libraries
* `src/App.test.js/` - entry point for all tests in the `__tests__` folder.
* `index.js` - entry point for app
* `.pretteirrc` - Pretteir config
* `.travis.yml` - Travis CI config
* `deploy.sh` - handles the continuous Travis Deployment of the project on `gh-pages`
* `surge_deploy.sh` - automatic Surge deploy script

### `/src` directory

The source directory is broken into subdirectories for separate components:
* `About` - overview, about and other static pages
* `Admin` - admin panel
* `Auth` - authentication related
* `ChatApp` - chat composing, displaying messages for SUSI
* `cms` -  skill CMS for editing, browsing skills, bots, dashboard, etc. 
* `CookiePolicy` - cookie policy
* `Footer` - footer component
* `NavigationBar` - navigation
* `NotFound` - not found
* `Settings` - accounts settings
* `shared` - common shared components for reusability
* `smart-speaker` - components specific to smart speaker

`withTracker` - HOC for tracking, scroll to top on route change
`MUItheme` - material-ui theme customization
`App.js` - top-level React component for app 
