(function DashboardControllerClosure(angular) {
    'use strict';

    //
    // Route
    function DashboardRoute($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'app/views/dashboard/dashboard.html',
            controller: 'DashboardController',
            controllerAs: 'dashboardCtrl'
        });
    }

    DashboardRoute.$inject = ['$routeProvider'];

    //
    // Controller
    var DashboardController = ['$interval', '$kinvey', 'KinveyBackend', 'KinveyGroupsFactory', '$filter', 'ngToast',
        function DashboardControllerFn($interval, $kinvey, KinveyBackend, KinveyGroupsFactory, $filter, ngToast) {
            var vm = this;
            vm.initialized = false;

            vm.init = function() {
                vm.isPollChecked = false;
                vm.groupSearchTerm = '';
                vm.getGroups();

                vm.codemirror = {
                    options: {
                        onLoad: vm.codemirrorLoaded
                    },
                    editors: []
                };

                vm.initialized = true;
            };

            vm.codemirrorLoaded = function(_editor) {
                // Editor part
                var _doc = _editor.getDoc();
                //_editor.focus();

                // Options
                _editor.setOption('mode', {name: "javascript", json: true});
                _editor.setOption('theme', 'neo');
                _editor.setOption('smartIndent', true);
                _editor.setOption('lineWrapping', true);
                _editor.setOption('lineNumbers', true);
                _editor.setOption('autoCloseBrackets', true);
                _editor.setOption('viewportMargin ', 'Infinity'); // allows auto height

                //_editor.autoFormatLineBreaks();

                _doc.markClean();

                // Events
                _editor.on("beforeChange", function() {

                });
                _editor.on("change", function() {

                });
            };

            vm.validateJSON = function(editorId) {
                try {
                    JSON.parse(vm.codemirror.editors[editorId].model);
                    vm.codemirror.editors[editorId].jsonIsValid = true;
                } catch (e) {
                    vm.codemirror.editors[editorId].jsonIsValid = false;
                }
            };

            // Auth
            vm.login = function() {
                $kinvey.User.login(vm.credentials)
                    .then(function(activeUser) {
                        vm.getGroups();
                    }, function(err) {
                        console.error(err);
                        toast.error(err.description);
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
                        vm.newGroup = {};
                    }, function(err) {
                        var errorMessage = err.data ? err.data.debug : err;
                        toast.error(errorMessage);
                        console.error(err);
                    })
                    .finally(function() {
                        vm.hasPendingRequest = false;
                    });
            };

            vm.updateGroup = function(editorID) {
                var groupJSON = groupAsJSON(vm.codemirror.editors[editorID].model);

                KinveyGroupsFactory.updateGroup(groupJSON)
                    .then(function(savedGroup) {
                        console.log(savedGroup);
                        toast.success('Saved "' + savedGroup._id + '"');
                        vm.getGroups();
                    })
                    .catch(function(err) {
                        var errorMessage = err.data ? err.data.debug : err;
                        toast.error(errorMessage);
                        console.log(err);
                    })
            };

            vm.deleteGroupClicked = function(groupId) {
                var message = [
                    'Permanently delete this group?:',
                    '',
                    'Group ID: ' + groupId,
                    'App: ' + KinveyBackend.appName,
                    'Environment: ' + KinveyBackend.environmentName,
                ].join('\n');

                var confirmedDelete = confirm(message);

                if (confirmedDelete) {
                    vm.deleteGroup(groupId);
                }
            };

            vm.toggleGroupShowJSON = function(index) {
                vm.codemirror.editors[index].showJSON = !vm.codemirror.editors[index].showJSON;
            };

            vm.deleteAllGroupsClicked = function() {
                var deleteString = "DELETE ALL";
                var message = [
                    'Type ' + deleteString + ' to irreversibly delete all user groups from:',
                    '',
                    'App: ' + KinveyBackend.appName,
                    'Environment: ' + KinveyBackend.environmentName,
                ].join('\n');

                var userInput = prompt(message);

                if (userInput === deleteString) {
                    angular.forEach(vm.groups, function(group) {
                        vm.deleteGroup(group._id);
                    });
                }
            };

            vm.deleteGroup = function(groupId) {
                vm.hasPendingRequest = true;

                KinveyGroupsFactory.deleteGroup(groupId)
                    .then(function() {
                        toast.success('Deleted "' + groupId + '"');
                        vm.getGroups();
                    }, function(err) {
                        toast.error(err.data.description + '. ' + err.data.debug);
                        console.error(err);
                    })
                    .finally(function() {
                        vm.hasPendingRequest = false;
                    });
            };

            vm.getGroups = function() {
                vm.hasPendingRequest = true;

                KinveyGroupsFactory.getGroups()
                    .then(function(groups) {
                        vm.groups = groups.reverse();

                        vm.codemirror.editors = [];
                        angular.forEach(vm.groups, function(group) {
                            vm.codemirror.editors.push({
                                model: groupAsString(group),
                                jsonIsValid: true,
                                showJSON: false
                            });
                        });

                    }, function(err) {
                        var errorMessage = err.data ? err.data.debug : err;
                        toast.error(errorMessage);
                    })
                    .finally(function() {
                        vm.hasPendingRequest = false;
                    });
            };

            // Poll for groups
            $interval(function() {
                if (vm.isPollChecked) {
                    vm.getGroups();
                }
            }, 2000);

            function groupAsString(group) {
                return $filter('json')(group);
            }

            function groupAsJSON(group) {
                return JSON.parse(group);
            }

            var toast = {
                error: function(error) {
                    ngToast.create({
                        content: error,
                        class: 'danger'
                    });
                },
                success: function(message) {
                    ngToast.create(message);
                }
            };

            vm.init();
        }];

    //
    // Module
    angular
        .module('gjApp.dashboard', ['ngRoute'])
        .config(DashboardRoute)
        .controller('DashboardController', DashboardController);

}(window.angular));
