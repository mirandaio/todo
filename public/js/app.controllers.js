angular.module('todoApp.controllers', [])
.controller('SignInController', ['$scope', '$http', '$state',
  function($scope, $http, $state) {
  $scope.signIn = function() {
    $http.post('/signin', $scope.user).then(function(res) {
      localStorage.setItem('token', res.data.token);
      $state.go('todo');
    });
  };
}])
.controller('SignUpController', function($scope, $http, $state) {
  $scope.user = {};
  $scope.signUp = function() {
    $http.post('/signup', $scope.user).then(function(res) {
      localStorage.setItem('token', res.data.token);
      $state.go('todo');
    });
  };
})
.controller('TodoController', ['$scope', '$http', '$state',
  function($scope, $http, $state) {
  $scope.newTodo = {};

  $http.get('/todos').then(function(res) {
    $scope.todos = res.data;
  });

  $scope.addTodo = function() {
    $scope.todos.push($scope.newTodo);
    $http.post('/todos', $scope.newTodo);
    $scope.newTodo = {};
  };

  $scope.goToDone = function() {
    $state.go('done');
  };

  $scope.completeTodo = function(index) {
    var todo = $scope.todos.splice(index, 1);
    $http.put('/todos/' + todo[0]._id, {completed: true}).then(function(res) {
      console.log(res.data);
    });
  };
}])
.controller('DoneController', ['$scope', '$http', '$state',
  function($scope, $http, $state) {

  $http.get('/dones').then(function(res) {
    $scope.doneTodos = res.data;
  });

  $scope.goToTodos = function() {
    $state.go('todo');
  };

  $scope.undo = function(index) {
    var doneTodo = $scope.doneTodos.splice(index, 1);
    $http.put('/todos/' + doneTodo[0]._id, {completed: false}).then(function(res) {
      console.log(res.data);
    });
  };
}]);
