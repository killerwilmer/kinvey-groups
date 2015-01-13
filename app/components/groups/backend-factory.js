(function KinveyBackendFactoryClosure() {
    'use strict';

    function KinveyBackendFactory($kinvey) {
        var factory = {};
        
        factory.masterSecret = angular.element('#masterSecret').val();
        factory.appKey = angular.element('#appKey').val();

        $kinvey.ping().then(function(response) {
            factory.appName = response.appName;
            factory.environmentName = response.environmentName;
        }, function(error) {
            console.log('Kinvey Ping Failed. Response: ' + error.description);
        });

        return factory;
    }

    angular.module('kinvey-groups')
        .factory('KinveyBackend', KinveyBackendFactory);
}());
