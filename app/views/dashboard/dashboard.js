(function DashboardControllerClosure() {
    'use strict';

    //
    // Route
    function DashboardRoute($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'app/views/dashboard/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'dashboardCtrl',
        });
    }

    DashboardRoute.$inject = ['$routeProvider'];

    //
    // Controller
    var DashboardCtrl = ['KinveyGroupsFactory', '$kinvey', 'KinveyBackend',
        function DashboardController(KinveyGroupsFactory, $kinvey, KinveyBackend) {
            var vm = this;
            vm.initialized = false;

            vm.init = function() {
                vm.getGroups();
                vm.initialized = true;
            };

            // Auth
            vm.login = function() {
                $kinvey.User.login(vm.credentials)
                    .then(function(activeUser) {
                        vm.getGroups();
                        vm.loginError = null;
                    }, function(err) {
                        vm.loginError = err;
                    })
            };

            vm.logout = function() {
                vm.credentials = {};
                $kinvey.User.logout();
            };


            // Groups
            vm.createGroup = function() {
                vm.hasPendingRequest = true;

                KinveyGroupsFactory.createGroup(vm.newGroup)
                    .then(function() {
                        vm.getGroups();
                        vm.clearGroupError();
                        vm.newGroup = {};
                    }, function(err) {
                        vm.groupError = err.data;
                        console.error(err);
                    })
                    .finally(function() {
                        vm.hasPendingRequest = false;
                    });
            };

            vm.deleteGroup = function(groupId) {
                var message = [
                    'Permanently delete this group?:',
                    '',
                    'Group ID: ' + groupId,
                    'App: ' + KinveyBackend.appName,
                    'Environment: ' + KinveyBackend.environmentName,
                ].join('\n');

                var confirmedDelete = confirm(message);

                if (confirmedDelete) {
                    vm.hasPendingRequest = true;

                    KinveyGroupsFactory.deleteGroup(groupId)
                        .then(function() {
                            vm.getGroups();
                            vm.clearGroupError();
                        }, function(err) {
                            vm.groupError = err.data;
                            console.error(err);
                        })
                        .finally(function() {
                            vm.hasPendingRequest = false;
                        });
                }
            };

            vm.getGroups = function() {
                vm.hasPendingRequest = true;

                KinveyGroupsFactory.getGroups()
                    .then(function(groups) {
                        vm.groups = groups.reverse();
                        vm.clearGroupError()
                    }, function(err) {
                        vm.groupError = err;
                    })
                    .finally(function() {
                        vm.hasPendingRequest = false;
                    });
            };
            
            vm.clearGroupError  = function() {
                vm.groupError = null
            };

            vm.init();
        }];

    //
    // Module
    angular
        .module('gjApp.dashboard', ['ngRoute'])
        .config(DashboardRoute)
        .controller('DashboardCtrl', DashboardCtrl);
}());
