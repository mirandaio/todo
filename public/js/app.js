angular.module('todoApp', [
  'ui.router',
  'ngStorage',
  'todoApp.controllers'
])
.config(function($stateProvider, $locationProvider, $httpProvider) {

  $httpProvider.interceptors.push(['$localStorage', function($localStorage) {
    return {
      request: function(config) {
        if($localStorage.token) {
          config.headers.Authorization = 'Bearer ' + $localStorage.token;
        }
        return config;
      }
    };
  }]);

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/',
      controller: ['$state', '$localStorage', function($state, $localStorage) {
        if($localStorage.token) {
          $state.go('todo');
        } else {
          $state.go('signin');
        }
      }]
    })
    .state('signin', {
      templateUrl: 'views/signin.html',
      controller: 'SignInController'
    })
    .state('signup', {
      url: 'signup',
      templateUrl: 'views/signup.html',
      controller: 'SignUpController'
    })
    .state('todo', {
      templateUrl: "views/todo.html",
      controller: 'TodoController'
    })
    .state('done', {
      url: "/done",
      templateUrl: "views/done.html",
      controller: 'DoneController'
    });
});
