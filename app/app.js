(function gjAppClosure(angular) {
    'use strict';

    angular.module('gjApp', [
        'ngAnimate',
        'ngRoute',
        'ngResource',
        'ui.codemirror',
        'ngToast',

        'kinvey',
        'kinvey-groups',

        'gjApp.utils',
        'gjApp.dashboard',
    ])
        .config(function($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/'});
        })

        .config(function ppAppConfigToast(ngToastProvider) {
            ngToastProvider.configure({
                dismissOnTimeout: true,              // Allows toast messages to be removed automatically after a specified time
                timeout: 5000,                       // Wait time for removal of created toast message
                dismissButton: false,                // Appends specified close button on toast message
                dismissButtonHtml: '&times;',        // HTML of close button to append
                dismissOnClick: true,                // Allows toasts messages to be removed on mouse click
                horizontalPosition: 'right',         // Horizontal position of toast messages: 'right', 'left' or 'center'
                verticalPosition: 'top',          // Vertical position of toast messages: 'top' or 'bottom'
                maxNumber: 0                         // Maximum number of toast messages to display. (0 = no limit)
            });
        })

        .run(function($rootScope, $kinvey, KinveyBackend, $location) {
            $rootScope.kinvey = $kinvey;
            $rootScope.kinveyBackend = KinveyBackend;
            $location.path('/dashboard');
        });

}(window.angular));
