angular.module('nodeTubeApp')
.controller('AuthController', AuthController)

function AuthController($scope, $http, $window) {
  var login_fields = {
    title: 'Login',
    subtitle: 'And start sharing your content for free!',
    action: 'Login',
    alt: 'I don\'t have an account',
    other_action: 'Create a new account',
    username: '',
    password: ''
  }
  var register_fields = {
    title: 'Register',
    subtitle: 'Create your account',
    action: 'Create',
    alt: 'I already have my account',
    other_action: 'Login',
    username: '',
    password: ''
  }

  $scope.form = {
    type: 'login',
    fields: login_fields
  };

  $scope.form.onSubmit = function(){
    var url = '/'+$scope.form.type;
    $http.post(url, $scope.form.fields)
    .success(function(data) {
      //TODO: corregir el modo en el que se arma la url
      $window.location.href = '/';
    });

  }

  $scope.form.onChangeAction = function() {
    if ($scope.form.type === 'login'){
      $scope.form.type = 'register';
      $scope.form.fields = register_fields;
    }else{
      $scope.form.type = 'login';
      $scope.form.fields = login_fields;
    }
  }
}