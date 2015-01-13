(function kgAppClosure(angular) {
    'use strict';

    angular.module('kgApp', [
        'ngRoute',
        'ngResource',

        'kinvey',
        'kinvey-groups',

        'kgApp.dashboard',
    ])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/dashboard'});
        }])

        .run(['$rootScope', '$kinvey', 'KinveyBackend', function($rootScope, $kinvey, KinveyBackend) {
            $rootScope.kinvey = $kinvey;
            $rootScope.kinveyBackend = KinveyBackend;
        }]);

}(window.angular));
