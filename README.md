Kinvey Groups
=============
A web app for managing your Kinvey User Groups.

**[Launch](https://gravityjack.github.io/kinvey-groups/)**  

**Setup**

1. Add the [groups.js endpoint](https://github.com/GravityJack/kinvey-groups/blob/master/groups.js) to your Kinvey App.
2. [Log in](https://gravityjack.github.io/kinvey-groups/) and enjoy.

![Kinvey Groups by Gravity Jack](https://raw.githubusercontent.com/GravityJack/kinvey-groups/gh-pages/screenshot.png)

# Features

1. Create, Edit, Update, Delete
1. View/Delete All
1. JSON Editor
1. Auto refresh
1. Search/Filter

# Why?

1. Kinvey does not currently support group management via the web console.
1. They currently [suggest](https://support.kinvey.com/discussion/200921477/list-groups) creating a custom endpoint to query all groups.
1. This endpoint allows the Kinvey Groups web app to securely query your apps groups.

# Security

**HTTPS**

Both the Kinvey Groups app and Kinvey's endpoints are accessed over HTTPS, so information is safe during transit.

**Open Source**

You are currently viewing the actual code that is served.
Go ahead, take a look at what is happening.

Have questions or feature requests? Please open an issue or pull request.

# Development

1. Fork this repo
1. Run `npm start`
1. Run `gulp`
1. Create a feature branch: `feature/something-awesome`
1. Open a pull request when you're ready to merge your feature into master

**Commands**

`gulp` - makes a build and starts the watchers.  
`gulp build` - makes a build.  
`gulp watch` - starts the watchers.  
`npm start` - This will install npm and bower packages, start a live reload server, and open your browser.  
`npm run server` - Starts a live reload server and opens the app in browser.  
