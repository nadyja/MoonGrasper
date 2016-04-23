// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  var orientation;
  var moon= {
      compass: 0,
      tilt: 90
  }
    $ionicPlatform.ready(function() {

        updatePosition({
            tilt: 87,
            compass:3,
            lat: 0,
            lng: 0
        })

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




    function getArrowAngle(delta) {
        var dir = {
            x: false,
            y: false
        }
        if (delta.v == 0) delta.v = 1;
        if (delta.h < 0) {
            dir.y = true;
            delta.h = -delta.h;
        }
        if (delta.v < 0) {
            dir.x = true;
            delta.v = -delta.v;
        }
        var radians = Math.atan(delta.h / delta.v);
        var deg = radians * 180 / Math.PI;
        var resultDeg = 0;
        if (dir.x && dir.y) {
            resultDeg = deg;
        }
        if (dir.x && !dir.y) {
            resultDeg = deg + 90;
        }
        if (!dir.x && !dir.y) {
            resultDeg = deg + 180;
        }
        if (!dir.x && dir.y) {
            resultDeg = deg + 270;
        }
        return resultDeg;
    }

    function getDeviceAngleOfView() {
        //mock
        return { v: 20, h: 20 };
        /*
        Camera.Parameters p = camera.getParameters();
        double thetaV = Math.toRadians(p.getVerticalViewAngle());
        double thetaH = Math.toRadians(p.getHorizontalViewAngle());
        var theta = {
            v: thetaV,
            h: thetaH,
        }
        return theta;
        */
    }

    function getDeviceResolution() {
        //mock
        return { v: 320, h: 568 };
        /*
        Display display = getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        var resolution = {
            v: size.y,
            h: size.x
        }
        return resolution;
        */
    }

    function getMoonPixelPosition(delta) {
        var theta = getDeviceAngleOfView();
        var resolution = getDeviceResolution();

        var pixelsV = resolution.v * delta.v / theta.v;
        var pixelsH = resolution.h * delta.h / theta.h;

        var pixels = {
            v: pixelsV,
            h: pixelsH
        }
        debug('moon position (h, v): '+pixels.h+ "   "+pixels.v, 3);

        return pixels;
    }

    function getMoonDelta() {
        diffH = -orientation.compass + moon.compass;
        diffV = orientation.tilt - moon.tilt;
        return {
            v: diffV,
            h: diffH
        }
    }







    function  updatePosition(newOrientation) {
        orientation=newOrientation;
        doUpdate();
    }
    function doUpdate() {
        debug('orientation (compass, tilt): '+orientation.compass + '   ' + orientation.tilt, 0);
        var delta = getMoonDelta();
        
        debug('delta (h, v): '+delta.h+ "   "+delta.v, 1);
        positionArrow({v:delta.v, h:delta.h});
        //debug('moon delta1 (h, v): '+delta.h+ "   "+delta.v, 4);
        positionMoon({v:delta.v, h:delta.h});
    }


    function positionMoon(delta) {
        var pixels = getMoonPixelPosition(delta);
        
        document.getElementById("moon").style = 'transform: translate(' + pixels.h + 'px,' + pixels.v + 'px)';

    }

    function positionArrow(delta) {
        var deg = getArrowAngle(delta);
         debug('arrow angle: '+deg, 2);
        document.getElementById("arrow").style = 'transform: rotate(' + deg + 'deg) translate(0, -80px)';
    }

    function debug(txt, position) {
        document.getElementById("debug" + position).innerHTML = txt;
    }
})
