(function gjAppClosure(angular) {
    'use strict';

    angular.module('gjApp', [
        'ngRoute',
        'ngResource',

        'kinvey',
        'kinvey-groups',

        'gjApp.dashboard',
    ])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/dashboard'});
        }])

        .run(['$rootScope', '$kinvey', 'KinveyBackend', function($rootScope, $kinvey, KinveyBackend) {
            $rootScope.kinvey = $kinvey;
            $rootScope.kinveyBackend = KinveyBackend;
        }]);

}(window.angular));
