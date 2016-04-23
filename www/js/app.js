// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

        ezar.initializeVideoOverlay(
            function() {
                ezar.getBackCamera().start();
                setInterval(function() {
                    navigator.compass.getCurrentHeading(
                        function(heading) {
                            var hdng = Math.floor(heading.magneticHeading);
                            debug(hdng);
                            updateArrows(hdng);
                        },
                        function(err) {
                            console.log("Compass error", err);
                            debug(err);
                                ezar.getBackCamera().start();
                        });
                }, 500);


            }
        )

  function debug(txt) {
        // Set heading value
        document.getElementById("debug")
            .innerHTML = txt;

    }

    function updateArrows(hdng) {
      diffH=hdng;
      positionArrow(0, diffH)
    }
    function positionArrow(diffV, diffH) {
      var deg=0;
      if(diffH>0 && diffH<=180) deg=90;
      else deg=270;

        document.getElementById("arrow").style = 'transform: rotate('+deg+'deg)';
    }

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
