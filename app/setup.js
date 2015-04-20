(function SetupClosure(window, angular) {
    'use strict';

    var onLocalhost = ["localhost", "0.0.0.0", "127.0.0.1"].indexOf(window.location.hostname) !== -1;
    var isHTTPS = window.location.protocol === 'http:';

    // livereload
    if (onLocalhost) {
        document.write('<script ' + 'type="text/javascript" src="//localhost:35729/livereload.js"></' + 'script>')
    }

    // https hack
    if (!onLocalhost && !isHTTPS) {
        window.location.protocol = 'https:';
    }

    $(document).ready(function() {
        var setupPage = $('#setupPage');
        var appKey = $('#appKey');
        var masterSecret = $('#masterSecret');
        var bootstrapButton = $('#bootstrapButton');
        var addedCustomEndpoint = $('#addedCustomEndpoint');

        //
        // Init
        function init() {
            handleCheckboxChange();
        }

        init();


        //
        // Checkbox
        function handleCheckboxChange(isChecked) {
            bootstrapButton.prop("disabled", !isChecked);
        }

        addedCustomEndpoint.on('change', function() {
            handleCheckboxChange(this.checked);
        });


        //
        // Bootstrap App
        bootstrapButton.on('click', function() {
            Bootstrap();
        });

        function Bootstrap() {
            var appKeyVal = appKey.val();
            var masterSecretVal = masterSecret.val();

            if (!appKeyVal || !masterSecretVal) {
                alert('App Key and Master Secret are required.');
                return;
            }

            var $injector = angular.injector([
                'ng',
                'kinvey',
                'kinvey-groups',
            ]);

            $injector.invoke(['$kinvey', function($kinvey) {

                // Init kinvey to get activeUser
                $kinvey.init({
                    appKey: appKeyVal,
                    appSecret: masterSecretVal,
                })
                    .then(function(activeUser) {
                        console.debug('Auto signed in as:');
                        console.log(activeUser);

                        return $kinvey.ping();
                    }, function(err) {
                        alert(err);
                        console.error(err);
                    })

                    .then(function(response) {
                        // Bootstrap angular
                        angular.bootstrap(document.documentElement, ['gjApp']);

                        // Hide the setupPage
                        setupPage.hide();

                    }, function(error) {
                        alert(error.description);
                        console.error(error);
                    });

            }]);
        }
    });

}(window, window.angular));
