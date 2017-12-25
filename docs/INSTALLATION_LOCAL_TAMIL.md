# நிறுவவும் மற்றும் உள்ளூர் மெஷினில் இயக்கவும்

###  1.உங்கள் டெஸ்க்டாப்பில் குளோன் chat.Susi.ai களஞ்சியமாக

`git clone https://github.com/fossasia/chat.susi.ai`

![git குளோன்](./img/gitclone.png)

### 2.அடைபட்ட களஞ்சியத்திற்கு கோப்பகத்தை மாற்றுங்கள்

`cd chat.susi.ai`

![cd](./img/cd.png)

### 3.சார்புகளை நிறுவுக

`npm install`

![npm install](./img/npmistall.png)

வெளியீடு: *(sample)*

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

### 4. திட்டத்தை இயக்கவும்

`npm run start`

![run start](./img/run.png)
![run start](./img/run2.png)

வெளியீடு: *(sample)*
    
    > chat.susi.ai@0.1.0 start C:\FOSSASIA\chat.susi.ai
    > react-scripts start
    
    Starting the development server...
    
    Compiled successfully!
    
    The app is running at:
    
      http://localhost:3000/
    
    வளர்ச்சி உருவாக்க உகந்ததாக இல்லை என்பதை நினைவில் கொள்க.
    உற்பத்தி உருவாக்கத்தை உருவாக்க, npm ரன் உருவாக்க பயன்படுத்தவும்.


