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
    .state('signin', {
      url: '/',
      templateUrl: 'views/signin.html'
    })
    .state('todo', {
      url: "/todo",
      templateUrl: "views/todo.html",
      controller: 'TodoController'
    })
    .state('done', {
      url: "/done",
      templateUrl: "views/done.html",
      controller: 'DoneController'
    });
});
