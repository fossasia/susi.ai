#Accounting in SUSI WebChat

SUSI WebChat provides the Users two option :
>- Chat Anonymously
>- Logged In

####**Chat Anonymously**
The Chat Anonymously feature is for users to try out SUSI without any hassle of registering or logging in.
The users can interact with SUSI and try out its features like changing themes and searching messages but features like initializing the app with preferred defaults aren't provided in this mode.

####**Logged In**
Users can register in the app and login to use SUSI with all its features.
Users can choose either the standard server or a personal server for SUSI.
>- Standard Server :  http://api.susi.ai/ 
>- Custom Server / Personal Server : URL of the users hosting of SUSI 

Users can modify and host their own version of [SUSI](https://github.com/fossasia/susi_server) and use that as their Personal Server.
Here is a [guide](https://github.com/fossasia/susi_server/tree/development/docs/installation) to hosting SUSI on various platforms

For all the accounting features, users can choose between standard server or their own personal server.

Let `BASE_URL` be Standard or Personal SUSI Servers URL.

**Signup**
The first step is registering with SUSI. User is asked for :
>- Email
>- Password
>- SUSI Server

Signup endpoint : `BASE_URL+'/aaa/signup.json?signup=EMAIL&password=PASSWORD;`

User is then sent a verification link to confirm the sign up. And upon verifying through mail, the sign up process is completed.

**Login**
 Once the user has registered with the server, he can directly login using :
 >- Email
 >- Password
>- SUSI Server
 
Login endpoint : `BASE_URL+'/aaa/login.json?type=access-token&login=EMAIL&password=PASSWORD';`

**Password Recovery**
Incase the user forgets his password, he can use the `Forgot Password` option to reset his password.
The Password recovery service uses :
>- Email
>- SUSI Server

Password Recovery endpoint : `BASE_URL+'/aaa/recoverpassword.json?forgotemail=EMAIL'`

A confirmation link is sent to the provided email with a link to `Reset Password` service.
Upon clicking that link, the user is redirected to a reset password service app where the user is asked for :
>- New Password

Reset password Redirect : `BASE_URL+'/apps/resetpass/index.html?token=TOKEN'`
