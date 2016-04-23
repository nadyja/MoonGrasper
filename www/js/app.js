// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('lunagrab', ['ionic','lunagrab.controllers'])
.run(function($ionicPlatform) {
    var orientation;
    var moon = {
        compass: 0,
        tilt: 90
    }
    $ionicPlatform.ready(function() {
        return;
       

        //mock
        return;
        ezar.initializeVideoOverlay(
            function() {
                ezar.getBackCamera().start();

                if (window.DeviceOrientationEvent) {



                    window.addEventListener('deviceorientation', function(eventData) {
                        // gamma is the left-to-right tilt in degrees, where right is positive
                        var tiltLR = Math.floor(eventData.gamma);

                        // beta is the front-to-back tilt in degrees, where front is positive
                        var tiltFB = Math.floor(eventData.beta);

                        // alpha is the compass direction the device is facing in degrees
                        var dir = Math.floor(eventData.alpha);

                        // call our orientation event handler
                        orientation.tilt = tiltFB;

                        doUpdate();
                        //debug(tiltLR, tiltFB, dir);
                    }, false);


                }



                setInterval(function() {
                    navigator.compass.getCurrentHeading(
                        function(heading) {
                            var hdng = Math.floor(heading.magneticHeading);
                            orientation.compass = hdng;
                            doUpdate();

                        },
                        function(err) {
                            console.log("Compass error", err);
                            debug(err, 0);
                            ezar.getBackCamera().start();
                        });
                }, 500);


            }

        )



        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });




})


.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/app.html',
        controller: 'AppCtrl'
    })

    .state('app.search', {
        url: '/search',
        views: {
            'menuContent': {
                templateUrl: 'templates/search.html'
            }
        }
    })

   
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/search');
});
