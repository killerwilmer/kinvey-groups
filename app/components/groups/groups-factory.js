(function KinveyGroupsFactoryClosure() {
    'use strict';

    function KinveyGroupsFactory($resource, $window, KinveyBackend, $kinvey, $q) {
        //
        // Resource
        var url = 'https://baas.kinvey.com/group/:appKey/:id',
            paramDefaults = {
                appKey: KinveyBackend.appKey,
                id: '@id'
            },
            actions = {
                get: {
                    method: 'GET',
                    headers: {
                        Authorization: 'Basic ' + $window.btoa(KinveyBackend.appKey + ':' + KinveyBackend.masterSecret)
                    }
                },
                save: {
                    method: 'POST',
                    headers: {
                        Authorization: 'Basic ' + $window.btoa(KinveyBackend.appKey + ':' + KinveyBackend.masterSecret)
                    }
                },
                delete: {
                    method: 'DELETE',
                    headers: {
                        Authorization: 'Basic ' + $window.btoa(KinveyBackend.appKey + ':' + KinveyBackend.masterSecret)
                    }
                },
            },
            options = {};

        var GroupResource = $resource(url, paramDefaults, actions, options);

        //
        // Factory
        var factory = {};

        factory.deleteGroup = function(groupId) {
            return GroupResource.delete({ id: groupId }).$promise;
        };

        factory.createGroup = function(groupData) {
            var group = new GroupResource(groupData);
            return group.$save();
        };

        factory.getGroups = function() {
            return $kinvey.execute('groups', { masterSecret: KinveyBackend.masterSecret })
        };

        return factory;
    }

    angular.module('kinvey-groups', [])
        .factory('KinveyGroupsFactory', KinveyGroupsFactory);
}());
