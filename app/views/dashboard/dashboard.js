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

    //
    // Controller
    function DashboardController($interval, KinveyBackend, KinveyGroupsFactory, $filter, ngToast, UtilsFactory, $window, $location) {
        var vm = this;
        vm.initialized = false;
        vm.init = function() {
            vm.isPollChecked = false;
            vm.groupSearchTerm = '';
            vm.getGroups();

            vm.codemirror = {
                options: {
                    onLoad: vm.codemirrorLoaded
                }
            };

            vm.initialized = true;
        };

        vm.changeBackend = function() {
            $location.path('/');
            $window.location.reload();
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

        vm.validateJSON = function(group) {
            try {
                JSON.parse(group.editorModel);
                group.jsonIsValid = true;
            } catch (e) {
                group.jsonIsValid = false;
            }
        };

        // Groups
        vm.createGroup = function() {
            vm.hasPendingRequest = true;

            KinveyGroupsFactory.createGroup(vm.newGroup)
                .then(function() {
                    vm.getGroups();
                    vm.newGroup = {};
                }, function(err) {
                    toast.error(UtilsFactory.parseError(err));
                })
                .finally(function() {
                    vm.hasPendingRequest = false;
                });
        };

        vm.updateGroup = function(group) {
            var groupJSON = groupAsJSON(group.editorModel);

            KinveyGroupsFactory.updateGroup(groupJSON)
                .then(function(savedGroup) {
                    toast.success('Saved "' + savedGroup._id + '"');
                    vm.getGroups();
                })
                .catch(function(err) {
                    toast.error(UtilsFactory.parseError(err));
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

        vm.toggleGroupShowJSON = function(group) {
            group.showJSON = !group.showJSON;
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
                    vm.deleteGroup(group.data._id);
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
                    toast.error(UtilsFactory.parseError(err));
                })
                .finally(function() {
                    vm.hasPendingRequest = false;
                });
        };

        vm.getGroups = function() {
            vm.hasPendingRequest = true;

            KinveyGroupsFactory.getGroups()
                .then(function(groups) {
                    vm.groups = [];

                    angular.forEach(groups.reverse(), function(group) {
                        vm.groups.push({
                            data: group,
                            showJSON: false,
                            editorModel: groupAsString(group),
                            jsonIsValid: true
                        });
                    });

                })
                .catch(function(error) {
                    toast.error(UtilsFactory.parseError(error));
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
    }

    //
    // Module
    angular
        .module('gjApp.dashboard', [])
        .config(DashboardRoute)
        .controller('DashboardController', DashboardController);

}(window.angular));
