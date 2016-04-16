angular.module('todoApp', [
  'ui.router',
  'todoApp.controllers'
])
.config(function($stateProvider, $locationProvider, $httpProvider) {

  $httpProvider.interceptors.push(function() {
    return {
      request: function(config) {
        if(localStorage.getItem('token')) {
          config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
        }
        return config;
      }
    };
  });

  $locationProvider.html5Mode(true);

  $stateProvider
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
