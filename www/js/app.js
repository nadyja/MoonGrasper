angular.module('MoonGrasper', ['ionic'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            /*
            ezar.initializeVideoOverlay(
                function() {
                    ezar.getBackCamera().start();
                });
*/
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
