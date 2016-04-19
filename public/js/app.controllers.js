angular.module('todoApp.controllers', [])
.controller('SignInController', ['$scope', '$http', '$state', '$localStorage',
  function($scope, $http, $state, $localStorage) {
  $scope.signIn = function() {
    $http.post('/signin', $scope.user).then(function(res) {
      $localStorage.token = res.data.token;
      $state.go('todo');
    });
  };
}])
.controller('SignUpController', ['$scope', '$http', '$state', '$localStorage',
  function($scope, $http, $state, $localStorage) {
  $scope.user = {};
  $scope.signUp = function() {
    $http.post('/signup', $scope.user).then(function(res) {
      $localStorage.token = res.data.token;
      $state.go('home');
    });
  };
}])
.controller('TodoController', ['$scope', '$http', '$localStorage', '$state',
  function($scope, $http, $localStorage, $state) {
  $scope.newTodo = {};

  $http.get('/todos').then(function(res) {
    $scope.todos = res.data;
  });

  $scope.addTodo = function(e) {
    if($scope.newTodo.content) e.preventDefault();
    $http.post('/todos', $scope.newTodo).then(function(res) {
      $scope.todos.push(res.data);
    });
    $scope.newTodo = {};
  };

  $scope.completeTodo = function(index) {
    $http.put('/todos/' + $scope.todos[index]._id, {
      completed: true,
      completedAt: new Date()
    })
    .then(function(res) {
      $scope.todos.splice(index, 1);
    });
  };

  $scope.signOut = function() {
    delete $localStorage.token;
    $state.go('signin');
  };
}])
.controller('DoneController', ['$scope', '$http', '$localStorage', '$state',
  function($scope, $http, $localStorage, $state) {

  $http.get('/dones').then(function(res) {
    $scope.doneTodos = res.data;
  });

  $scope.undo = function(index) {
    var doneTodo = $scope.doneTodos.splice(index, 1);
    $http.put('/todos/' + doneTodo[0]._id, {completed: false});
  };

  $scope.signOut = function() {
    delete $localStorage.token;
    $state.go('home');
  };
}]);
