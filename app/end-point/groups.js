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
