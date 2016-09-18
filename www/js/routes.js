angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabs', {
    url: '/tabs',
    templateUrl: 'templates/tabs.html',
    controller: 'GeneralCtrl',
    abstract:true

  })

  .state('tabs.tab-Presentacion', {
    url: '/Presentacion',
    views: {
      'Presentacion': {
        templateUrl: 'templates/tab-Presentacion.html',
        controller: 'PresentacionCtrl'
      }
    }
  })

  .state('tabs.tab-Trivia', {
    url: '/Trivia',
    views: {
      'Trivia': {
        templateUrl: 'templates/tab-Trivia.html',
        controller: 'TriviaCtrl'
      }
    }
  })

  .state('Principal', {
    url: '/Principal',
    templateUrl: 'templates/Principal.html',
    controller: 'PrincipalCtrl'
  })

  .state('tabs.tab-Estadistica', {
    url: '/Estadistica',
    views: {
      'Estadistica': {
        templateUrl: 'templates/tab-Estadistica.html',
        controller: 'EstadisticaCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/Principal')

  

});