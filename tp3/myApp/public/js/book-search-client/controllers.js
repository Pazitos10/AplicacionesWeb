angular.module('bookSearchClient', ["ngRoute"])
.controller('IndexController', IndexController)
.controller('SearchBookController', SearchBookController)
.controller('ShowBookController', ShowBookController)
.controller('SaveBookController', SaveBookController);

function IndexController($scope, $http) {
    $http.get('/books/collection')
        .success(function(data, status, headers, config) {
            $scope.books = data.books;
        });
}

function SaveBookController($scope, $http, $location) {
    $scope.form = {};
    $scope.saveBook = function () {
        $http.post('/books/save', $scope.form)
            .success(function(data) {
                $location.path('/');
            });
    };
}

function ShowBookController($scope, $http, $routeParams) {
    $http.get('/books/show/' + $routeParams.id)
        .success(function(data) {
            $scope.book = data.book;
        });
}

function SearchBookController($scope, $http, $routeParams) {
    $scope.form = {};
    $scope.sendForm = function () {
        //console.log('[SearchBookController]: ', $scope.form);
        $http.post('/books/search', $scope.form)
            .then(function(data) {
                console.log('Success: ', data);
                //$location.path('/book/search');
            }, function(){
                console.log('bookSearchClient: hubo un error');
            });
      };
}

