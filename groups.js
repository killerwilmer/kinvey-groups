// Groups Endpoint
// This secure endpoint allows the Kinvey Groups app to query all user groups.
// It should be named 'groups'.
//
// Help:
// http://devcenter.kinvey.com/html5/guides/business-logic#custom-endpoints

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
