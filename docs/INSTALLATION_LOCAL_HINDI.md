# स्थानीय मशीन पर इंस्टॉल करें और चलाएं

### 1.Clone chat.susi.ai रिपॉजिटरी आपके डेस्कटॉप पर है

`git क्लोन https: // github.com / fossasia / chat.susi.ai`

! [जीआईटी क्लोन] (./ img / gitclone.png)

### 2. निर्देशिका को क्लोन रिपॉज़िटरी में बदलें

`सीडी चैट.susi.ai`

[सीडी] (./ img / cd.png)

### 3. स्थापित निर्भरताएं

`एनपीएम इंस्टॉल`

! [एनपीएम इंस्टॉल] (./ img / npmistall.png)

आउटपुट: * (नमूना) *

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

### 4. परियोजना को चलाएं

`एनपीएम रन की शुरुआत`

! [रन शुरू] (./ img / run.png)
! [आरंभ करें] (./ img / run2.png)

आउटपुट: * (नमूना) *
    
    > chat.susi.ai@0.1.0 start C:\FOSSASIA\chat.susi.ai
    > react-scripts start
    
    Starting the development server...
    
    Compiled successfully!
    
    The app is running at:
    
      http://localhost:3000/
    
    Note that the development build is not optimized.
    To create a production build, use npm run build.
