# Requirements:
> **Check it [Here!](https://github.com/fossasia/chat.susi.ai#requirements)**


#### Sample Screenshot:
![](https://i.imgur.com/sBXacHt.png)

# How to deploy?

## Running on localhost:

* ### Easy 3-Step Deployment Process.


*Step 1:* **Fork & clone** the **[chat.susi.ai](https://github.com/fossasia/chat.susi.ai)** repository.
> **Read [Here!!](http://gci2017fossasia.blogspot.in/2017/11/how-to-clone-biggest-repositories.html)**, if you're getting `fatal: index-pack failed` **ERROR**.

---

*Step 2:* **Goto the `master` & install the required modules:**

* `$ npm install`

#### Output: *(sample)*

    npm WARN deprecated tar.gz@0.1.1: â ï¸  WARNING â ï¸ tar.gz module has been deprecated and your application is vulnerable. Please use tar module instead: https://npmjs.com/tar
    npm WARN deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
    npm WARN deprecated node-uuid@1.4.8: Use uuid module instead
    npm WARN prefer global marked@0.3.6 should be installed with -g
    chat.susi.ai@0.1.0
    +-- axios@0.16.2
    | +-- follow-redirects@1.2.6
    | | `-- debug@3.1.0
    | |   `-- ms@2.0.0
    | `-- is-buffer@1.1.6
    +-- bootstrap@3.3.7
    +-- classnames@2.2.5
    +-- country-data@0.0.31
    | +-- currency-symbol-map@2.2.0
    | `-- underscore@1.8.3
    +-- dateformat@2.2.0
    +-- enzyme@2.9.1
    | +-- cheerio@0.22.0
    | | +-- css-select@1.2.0
    | | | +-- boolbase@1.0.0
    .
    .
    (blah)
    (blah)
    .
    .
    +-- universal-cookie@2.1.2
    | `-- cookie@0.3.1
    `-- zxcvbn@4.4.2
    
    npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.0.17 (node_modules\react-scripts\node_modules\fsevents):
    npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.0.17: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"ia32"})
    npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@^1.0.0 (node_modules\chokidar\node_modules\fsevents):
    npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"ia32"})
    npm WARN material-ui-responsive-menu@1.19.2 requires a peer of material-ui@0.19.x but none was installed.
    npm WARN material-ui-responsive-menu@1.19.2 requires a peer of react-container-dimensions@1.x but none was installed.
    npm WARN material-ui-responsive-menu@1.19.2 requires a peer of react-redux@5.x but none was installed.
    npm WARN material-ui-responsive-menu@1.19.2 requires a peer of redux@3.x but none was installed.
    npm WARN eslint-config-react-app@0.6.2 requires a peer of eslint-plugin-react@^6.4.1 but none was installed.

---

*Step 3:* **Fire up the server:**

* `$ npm run start`

#### Output: *(sample)*
    
    > chat.susi.ai@0.1.0 start C:\FOSSASIA\chat.susi.ai
    > react-scripts start
    
    Starting the development server...
    
    Compiled successfully!
    
    The app is running at:
    
      http://localhost:3000/
    
    Note that the development build is not optimized.
    To create a production build, use npm run build.

---

## For deploying with [Surge.sh](https://surge.sh/):

* ### Easy 3-Step Deployment Process.

*Step 1:* **Create a production build:**

* `npm run build`

#### Output: *(sample)*

    > chat.susi.ai@0.1.0 build C:\FOSSASIA\chat.susi.ai
    > react-scripts build
    
    Creating an optimized production build...
    Compiled successfully.
    
    File sizes after gzip:
    
      1011.99 KB  build\static\js\main.2660cfa3.js
      23.64 KB    build\static\css\main.7cf93e8b.css
    
    The project was built assuming it is hosted at the server root.
    To override this, specify the homepage in your package.json.
    For example, add this to build it for GitHub Pages:
    
      "homepage": "http://myname.github.io/myapp",
    
    The build folder is ready to be deployed.
    You may serve it with a static server:
    
      npm install -g serve
      serve -s build
      
---

*Step 2:* **Install Surge:**

* `npm install -g surge`

#### Output: *(sample)*

    npm WARN deprecated tar.gz@0.1.1: â ï¸  WARNING â ï¸ (...)
    npm WARN deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
    npm WARN deprecated node-uuid@1.4.8: Use uuid module instead
    C:\Users\*\AppData\Roaming\npm\surge -> C:\Users\*\AppData\Roaming\npm\node_modules\surge\lib\cli.js
    C:\Users\*\AppData\Roaming\npm
    `-- surge@0.19.0
      +-- du@0.1.0
      | `-- async@0.1.22
      +-- fstream-ignore@1.0.2
      | +-- fstream@1.0.11
      | | +-- graceful-fs@4.1.11
      | | +-- mkdirp@0.5.1
      | | | `-- minimist@0.0.8
      | | `-- rimraf@2.6.2
      | |   `-- glob@7.1.2
      | |     +-- fs.realpath@1.0.0
      | |     +-- inflight@1.0.6
      | |     | `-- wrappy@1.0.2
      | |     +-- minimatch@3.0.4
      | |     +-- once@1.4.0
      | |     `-- path-is-absolute@1.0.1
      | +-- inherits@2.0.3
      | `-- minimatch@2.0.10
      |   `-- brace-expansion@1.1.8
      |     +-- balanced-match@1.0.0
      |     `-- concat-map@0.0.1
      +-- is-domain@0.0.1
      +-- minimist@1.1.1
      +-- moniker@0.1.2
      +-- netrc@0.1.4
      +-- progress@1.1.8
      .
      .
      (blah)
      (blah)
      .
      .
      +-- surge-ignore@0.2.0
      +-- tar@1.0.0
      | `-- block-stream@0.0.9
      +-- tar.gz@0.1.1
      | +-- commander@1.1.1
      | | `-- keypress@0.1.0
      | +-- fstream@0.1.31
      | | `-- graceful-fs@3.0.11
      | |   `-- natives@1.1.0
      | `-- tar@0.1.20
      `-- url-parse-as-address@1.0.0

---


*Step 3:* **Configure and Deploy with Surge!:**
 
![](http://surge.sh/images/help/getting-started-with-surge.gif)

* `surge`

#### Output: *(sample)*
    
        Surge - surge.sh
    
                  email: contact@0x48piraj.co
                  token: *****************
           project path: C:\FOSSASIA\chat.susi.ai\build\
                   size: 58 files, 31.0 MB
                 domain: sophisticated-reason.surge.sh
    
    
                   plan: Free
                  users: contact@0x48piraj.co
             IP Address: 45._5._10.___
    
        Success! Project is published and running at sophisticated-reason.surge.sh

