(function KinveyGroupsFactoryClosure() {
    'use strict';

    ////////////////////////////////////////////////////////////////
    // BACKEND

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

    ////////////////////////////////////////////////////////////////
    // GROUPS

    function KinveyGroupsFactory($resource, $window, KinveyBackend, $http, UtilsFactory, $q) {
        //
        // Resource
        var url = 'https://baas.kinvey.com/group/:appKey/:_id',

            paramDefaults = {
                appKey: KinveyBackend.appKey
            },

            actions = {
                get: {
                    method: 'GET',
                    headers: {
                        Authorization: 'Basic ' + $window.btoa(KinveyBackend.appKey + ':' + KinveyBackend.masterSecret)
                    },
                    params: {
                        _id: '@_id'
                    }
                },
                save: {
                    method: 'POST',
                    headers: {
                        Authorization: 'Basic ' + $window.btoa(KinveyBackend.appKey + ':' + KinveyBackend.masterSecret)
                    }
                },
                update: {
                    method: 'PUT',
                    headers: {
                        Authorization: 'Basic ' + $window.btoa(KinveyBackend.appKey + ':' + KinveyBackend.masterSecret)
                    },
                    params: {
                        _id: '@_id'
                    }
                },
                delete: {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Basic ' + $window.btoa(KinveyBackend.appKey + ':' + KinveyBackend.masterSecret)
                    },
                    params: {
                        _id: '@_id'
                    }
                }

            },

            options = {},

            GroupResource = $resource(url, paramDefaults, actions, options);

        //
        // Factory
        var factory = {};

        factory.deleteGroup = function(groupId) {
            return GroupResource.delete({_id: groupId}).$promise;
        };

        factory.updateGroup = function(group) {
            return GroupResource.update(group).$promise;
        };

        factory.createGroup = function(groupData) {
            var group = new GroupResource(groupData);
            console.log('Creating', groupData);
            return group.$save();
        };

        factory.getGroups = function() {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: 'https://baas.kinvey.com/rpc/' + encodeURIComponent(KinveyBackend.appKey) + '/custom/groups',
                headers: {
                    Authorization: 'Basic ' + $window.btoa(KinveyBackend.appKey + ':' + KinveyBackend.masterSecret),
                    'Content-Type': 'application/json'
                }
            })
                .success(function(response) {
                    deferred.resolve(response);
                })
                .error(function(error) {
                    deferred.resolve(UtilsFactory.parseError(error));
                });

            return deferred.promise;
        };

        return factory;
    }

    angular.module('kinvey-groups', [])
        .factory('KinveyBackend', KinveyBackendFactory)
        .factory('KinveyGroupsFactory', KinveyGroupsFactory);
}());
