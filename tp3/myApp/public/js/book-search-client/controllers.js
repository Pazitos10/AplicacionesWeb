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
    $scope.resultados = {};
    $scope.busqueda = false;
    $scope.sendForm = function () {
        $scope.buscando = true;
        //console.log('[SearchBookController]: ', $scope.form);
        $http.post('/books/search', $scope.form)
            .then(function(result) {
                $scope.busqueda = true;
                $scope.buscando = false;
                $scope.resultados = result.data.resultados;
            }, function(){
                $scope.buscando = false;
                console.log('SearchBookController: hubo un error');
            });
    };
    $scope.showBook = function(){
        var id = this.resultado.id;
        $http.get('/books/show/' + id)
        .then(function(result){
            console.log(result.data);
            console.log('meh', JSON.stringify(result.data.book, null, 2));
            $('#modal-info-libro .modal-title .titulo').empty().append("<em>"+result.data.book.title+"</em>");
            $('#modal-info-libro .modal-body .subtitulo').empty().append(result.data.book.subtitle);
            $('#modal-info-libro .modal-body .descripcion').empty().append("<h5>Descripción:</h5>"+result.data.book.description);
            $('#modal-info-libro').modal('show');
        }, function(error){
            console.log("error!", error.responseText);
        });
    }
}

