Kinvey Groups
=============
A web app for managing your Kinvey User Groups.


# Usage

Add the [groups.js endpoint](https://github.com/GravityJack/kinvey-groups/blob/master/groups.js) to your Kinvey App, log in to [Kinvey Groups]() and enjoy :).

```javascript
function onRequest(request, response, modules) {
    var groups = modules.collectionAccess.collection('group');
    var context = modules.backendContext;

    // Require master secret
    if (request.body.masterSecret !== context.getMasterSecret()) return response.error("Invalid master secret.");

    groups.find({}, function(error, docs) {
        if (error) return response.error(error);

        response.body = docs;
        response.complete(200);
    });
}
```

# Why?

Kinvey does not currently support group management.
They currently [suggest](https://support.kinvey.com/discussion/200921477/list-groups) creating a custom endpoint to query all groups.
This endpoint allows the Kinvey Groups web app to securely query your apps groups.

# Security

**HTTPS**
Both the Kinvey Groups app and Kinvey's endpoints are accessed over HTTPS, so information is safe during transit.

**Open Source**
You are currently viewing the actual code that is served.
Go ahead, take a look at what is happening.

Have questions or feature requests? Please open an issue or pull request.
