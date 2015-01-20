(function KinveyGroupsFactoryClosure() {
    'use strict';

    function KinveyGroupsFactory($resource, $window, KinveyBackend, $kinvey, $q) {
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
            options = {};

        var GroupResource = $resource(url, paramDefaults, actions, options);

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
            return $kinvey.execute('groups', {masterSecret: KinveyBackend.masterSecret})
        };

        return factory;
    }

    angular.module('kinvey-groups', [])
        .factory('KinveyGroupsFactory', KinveyGroupsFactory);
}());
