(function UtilsClosure() {
    'use strict';

    function UtilsFactory() {
        var factory = {};

        factory.parseError = function(error) {
            // 
            // String
            if (angular.isString(error)) return error;

            // 
            // Object
            if (angular.isObject(error)) {

                //
                // Kinvey error
                if (error.description) return error.description;

                if (error.debug) return error.debug;

                if (error.error) return error.error;

                // 
                // Angular http response
                if (error.data) {
                    if (error.data.description) return error.data.description;

                    if (error.data.debug) return error.data.debug;

                    if (error.data.error) return error.data.error;
                }
            }
            
            return 'Unhandled error, see the console.';
        };

        return factory;
    }


    angular.module('gjApp.utils', [])
        .factory('UtilsFactory', UtilsFactory);
}());
