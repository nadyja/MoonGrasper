angular.module('MoonGrasper').controller('FoundCtrl', function($scope, $rootScope, $ionicModal, $timeout, MoonApi, DeviceApi, $state) {

        $rootScope.isCaught = true;
        $scope.phase= {
            Name: 'Wanning Gibous'
        }
    })
    .service('ScrollRender', function() {
        this.render = function(content) {
            return (function(global) {
                var globalZoom=1;


                var docStyle = document.documentElement.style;

                var engine;
                if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
                    engine = 'presto';
                } else if ('MozAppearance' in docStyle) {
                    engine = 'gecko';
                } else if ('WebkitAppearance' in docStyle) {
                    engine = 'webkit';
                } else if (typeof navigator.cpuClass === 'string') {
                    engine = 'trident';
                }

                var vendorPrefix = {
                    trident: 'ms',
                    gecko: 'Moz',
                    webkit: 'Webkit',
                    presto: 'O'
                }[engine];

                var helperElem = document.createElement("div");
                var undef;

                var perspectiveProperty = vendorPrefix + "Perspective";
                var transformProperty = vendorPrefix + "Transform";

                if (helperElem.style[perspectiveProperty] !== undef) {
                    console.log('first');

                    return function(left, top, zoom) {
                        console.log('firstzoom '+zoom);
                        content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
                    };

                } else if (helperElem.style[transformProperty] !== undef) {
                    console.log('second'+zoom);
                    return function(left, top, zoom) {
                        console.log('second zoom'+ zoom)
                        content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
                    };

                } else {
                    console.log('third');
                    return function(left, top, zoom) {
                        console.log('third zoom'+ zoom)
                        content.style.marginLeft = left ? (-left / zoom) + 'px' : '';
                        content.style.marginTop = top ? (-top / zoom) + 'px' : '';
                        content.style.zoom = zoom || '';
                    };

                }
            })(this);
        };

    })

.directive('zoomable', function(ScrollRender) {
    return {
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                // Intialize layout
                var container = document.getElementById("container");
                var content = document.getElementById("content");
                var clientWidth = 0;
                var clientHeight = 0;

                // Initialize scroller
                var scroller = new Scroller(ScrollRender.render(content), {
                    scrollingX: true,
                    scrollingY: true,
                    animating: true,
                    bouncing: true,
                    locking: true,
                    zooming: true,
                    minZoom: 0.5,
                    maxZoom: 2
                });

                // Initialize scrolling rect
                var rect = container.getBoundingClientRect();
                scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);

                var image = document.getElementById('image-scrollable');
                var contentWidth = image.width;
                var contentHeight = image.height;

                // Reflow handling
                var reflow = function() {
                    //  console.log('reflow');
                    clientWidth = container.clientWidth;
                    clientHeight = container.clientHeight;
                    scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
                };


                window.addEventListener("resize", reflow, false);
                reflow();

                if ('ontouchstart' in window) {
                    console.log('first touch start');
                    container.addEventListener("touchstart", function(e) {
                        // Don't react if initial down happens on a form element
                      /*
                        if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
                            return;
                        }
                      */
                        console.log(e.touches);
                        scroller.doTouchStart(e.touches, e.timeStamp);
                        e.preventDefault();
                    }, false);

                    document.addEventListener("touchmove", function(e) {
                        scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
                    }, false);

                    document.addEventListener("touchend", function(e) {
                        scroller.doTouchEnd(e.timeStamp);
                    }, false);

                    document.addEventListener("touchcancel", function(e) {
                        scroller.doTouchEnd(e.timeStamp);
                    }, false);

                } else {

                    var mousedown = false;

                    container.addEventListener("mousedown", function(e) {
                        if (e.target.tagName.match(/input|textarea|select/i)) {
                            return;
                        }

                        scroller.doTouchStart([{
                            pageX: e.pageX,
                            pageY: e.pageY
                        }], e.timeStamp);

                        mousedown = true;
                    }, false);

                    document.addEventListener("mousemove", function(e) {
                        if (!mousedown) {
                            return;
                        }

                        scroller.doTouchMove([{
                            pageX: e.pageX,
                            pageY: e.pageY
                        }], e.timeStamp);

                        mousedown = true;
                    }, false);

                    document.addEventListener("mouseup", function(e) {
                        if (!mousedown) {
                            return;
                        }

                        scroller.doTouchEnd(e.timeStamp);

                        mousedown = false;
                    }, false);

                    container.addEventListener(navigator.userAgent.indexOf("Firefox") > -1 ? "DOMMouseScroll" : "mousewheel", function(e) {

                        console.log('scroll');
                        scroller.doMouseZoom(e.detail ? (e.detail * -120) : e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
                    }, false);
                }
            });
        }
    };
})
