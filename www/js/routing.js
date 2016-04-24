angular.module('MoonGrasper').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/app.html',
        controller: 'MainCtrl'
    })

    .state('app.search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'templates/search.html',
                    controller: 'SearchCtrl'

                }
            }
        })
        .state('app.found', {
            url: '/found',
            views: {
                'menuContent': {
                    templateUrl: 'templates/found.html',
                    controller: 'FoundCtrl'
                }
            },
        })


    $urlRouterProvider.otherwise('/app/search');
});
