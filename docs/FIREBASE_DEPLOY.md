![firebase hosting](https://github.com/fossasia/chat.susi.ai/blob/master/docs/img/blog_1_img.png)


## Hosting SUSI WebChat on Firebase 

### Steps :

**Install the Firebase CLI**
The Firebase CLI (Command Line Interface) requires [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.org/), which can both be installed by following the instructions on https://nodejs.org/. Installing Node.js also installs npm.

**Note :** The Firebase CLI requires Node.js version 5.10.0 or greater.
Once we have Node.js and npm installed, we can install the Firebase CLI via npm:
**$ npm install -g firebase-tools**
This installs the globally available firebase command. To update to the latest version, we simply re-run the same command.

Now login to the Firebase console using 
 $ firebase login 
>
**Initialize the app** 
 Once we've chosen the Firebase app that we would like to deploy, cd into our project directory and run the command:
 $ firebase init

Once we run this command we would be prompted to choose from the following options :
>
* Database: Deploy Firebase Realtime Database Rules
* Firestore: Deploy rules and create indexes for Firestore
* Functions: Configure and deploy Cloud Functions
* Hosting: Configure and deploy Firebase Hosting sites
* Storage: Deploy Cloud Storage security rules
>
We will choose Hosting (by using the cursor keys to move the pointer to ‘Hosting’ and then selecting it by pressing Spacebar key followed by the Enter key).
>
Now, we would be prompted to select a project from the [Firebase console](https://console.firebase.google.com/) that we would like to associate with our web chat. We can create a new project by logging into the Firebase console from a web browser and then following the steps below :
* If you don't have an existing Firebase project, click ‘Add Project’ and enter either an existing Google Cloud Platform project name or a new project name.
* If you already have apps in your project, click ‘Add Another App’ from the project overview page.
Running the $ firebase init command creates a firebase.json settings file in the root of our project directory. 


**Add a file**
When we initialize our app, we will be prompted for a directory to use as the public root (default is "public"). We can choose to give it some other name as well, say “build”. This is the directory in which the static content would be hosted. If we don't already have a valid index.html file in our public root directory, one is created for us.
**Note :** When a new index.html file is created for us, it contains the default content. We need to run the following commands to customize it according to our requirements and to display the content that we want to.
$ npm install
$ npm run build
>
If we skip running these commands, on deploying we will see a dialog box, by default, that would direct us to the Firebase Hosting Documentation.

**Test on Local Server**
Now we can run the $ firebase serve command to test our web app on a local server. Once, everything looks fine, we can proceed to the next step. 
>
**Deploy the web app on Firebase**
To deploy our web app we simply run:
$ firebase deploy
Our app will be deployed to the domain <OUR-FIREBASE-APP>.firebaseapp.com
>
**Manage and Rollback Deploys**
From the Hosting panel in the [Firebase Console](https://console.firebase.google.com/) we can see a full history of our deploys. To rollback to a previous deploy, we hover over its entry in the list, click the overflow menu icon, then click "Rollback".
>
Now our app is ready to share with the world! :)  
Check out a video, showing the above mentioned steps : [Click Here](https://youtu.be/7iVKBwR40N8)

